import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import * as pdfjs from "pdfjs-dist"
import { createWorker } from "tesseract.js"
import { config } from "@/lib/config"
import { db } from "@/lib/database"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"
import fs from "fs"
import os from "os"
import path from "path"

// Initialize PDF.js worker
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs")
if (typeof window === "undefined" && !globalThis.pdfjsWorker) {
  globalThis.pdfjsWorker = pdfjsWorker
}

// Configure OCR settings
const OCR_ENABLED = config.fileProcessing?.enableOCR !== false
const OCR_CONFIDENCE_THRESHOLD = 70 // Minimum confidence score (0-100)
const MAX_OCR_PAGES = 20 // Maximum pages to OCR to prevent timeouts

export async function POST(req: NextRequest) {
  const processingId = uuidv4()
  const startTime = Date.now()
  let tempDir: string | null = null
  let tempFilePath: string | null = null
  const tempImagePaths: string[] = []

  try {
    // Check if the request is multipart/form-data
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Request must be multipart/form-data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const enableOcr = formData.get("enableOcr") === "true" || OCR_ENABLED
    const ocrLanguage = (formData.get("ocrLanguage") as string) || "eng"

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      return new Response(JSON.stringify({ error: "File must be a PDF" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Log processing start
    logger.info(`Starting PDF processing: ${file.name} (${file.size} bytes) [${processingId}]`)

    // Create temp directory for processing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-processing-"))
    tempFilePath = path.join(tempDir, `${processingId}.pdf`)

    // Save the file to disk
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(tempFilePath, buffer)

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ url: tempFilePath })
    const pdf = await loadingTask.promise

    // Extract metadata
    const metadata = await pdf.getMetadata().catch(() => ({}))

    // Extract text from all pages
    let fullText = ""
    const maxPages = Math.min(pdf.numPages, 100) // Limit to 100 pages for performance
    const pageTexts: string[] = []

    // First pass: Extract text using PDF.js
    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        pageTexts.push(pageText)
        fullText += pageText + "\n\n"
      } catch (pageError) {
        logger.warn(`Error extracting text from page ${i}`, pageError)
        pageTexts.push("") // Add empty placeholder for failed page
      }
    }

    // Check if OCR is needed (if text extraction yielded little content)
    let ocrApplied = false
    if (enableOcr && fullText.trim().length < 100 * maxPages) {
      ocrApplied = true
      logger.info(`PDF has little text content, applying OCR: ${file.name} [${processingId}]`)

      // Initialize Tesseract worker
      const worker = await createWorker(ocrLanguage)

      // Second pass: Apply OCR to pages with little text
      const pagesToOcr = Math.min(maxPages, MAX_OCR_PAGES)
      for (let i = 1; i <= pagesToOcr; i++) {
        // Skip pages that already have sufficient text
        if (pageTexts[i - 1].length > 100) continue

        try {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR

          // Render page to canvas
          const canvasFactory = new pdfjs.DOMCanvasFactory()
          const canvas = canvasFactory.create(viewport.width, viewport.height)
          const renderContext = {
            canvasContext: canvas.context,
            viewport,
          }

          await page.render(renderContext).promise

          // Convert canvas to image
          const imageData = canvas.context.getImageData(0, 0, viewport.width, viewport.height)
          const tempImagePath = path.join(tempDir, `page-${i}.png`)
          tempImagePaths.push(tempImagePath)

          // Use sharp to save the image data
          const sharpImage = sharp(Buffer.from(imageData.data), {
            raw: {
              width: viewport.width,
              height: viewport.height,
              channels: 4,
            },
          })

          await sharpImage.removeAlpha().sharpen().normalise().toFile(tempImagePath)

          // Perform OCR on the image
          const { data } = await worker.recognize(tempImagePath)

          // Only use OCR text if confidence is above threshold
          if (data.confidence > OCR_CONFIDENCE_THRESHOLD) {
            pageTexts[i - 1] = data.text
          }

          // Clean up canvas
          canvasFactory.destroy(canvas)
        } catch (ocrError) {
          logger.warn(`OCR failed for page ${i}`, ocrError)
        }
      }

      // Terminate worker
      await worker.terminate()

      // Rebuild full text with OCR results
      fullText = pageTexts.join("\n\n")
    }

    // Store processing record in database if enabled
    if (config.features.continuousLearning && db) {
      try {
        await db.saveFileProcessingRecord({
          fileId: processingId,
          fileName: file.name,
          fileType: "pdf",
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          success: true,
          ocrApplied,
          pageCount: pdf.numPages,
          processedPages: maxPages,
          metadata: metadata.info || {},
        })
      } catch (dbError) {
        logger.error("Failed to save file processing record", dbError)
      }
    }

    // Log success
    const processingTime = Date.now() - startTime
    logger.info(
      `Successfully processed PDF: ${file.name} (${pdf.numPages} pages, ${ocrApplied ? "with" : "without"} OCR) in ${processingTime}ms [${processingId}]`,
    )

    return new Response(
      JSON.stringify({
        text: fullText,
        metadata: {
          ...metadata.info,
          pageCount: pdf.numPages,
          processedPages: maxPages,
          fileName: file.name,
          fileSize: file.size,
          processingTime,
          ocrApplied,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error(`Error processing PDF [${processingId}]`, error)

    // Store error record in database if enabled
    if (config.features.continuousLearning && db) {
      try {
        await db.saveFileProcessingRecord({
          fileId: processingId,
          fileName: "unknown.pdf",
          fileType: "pdf",
          fileSize: 0,
          processingTime: Date.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      } catch (dbError) {
        logger.error("Failed to save file processing error record", dbError)
      }
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        processingId,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  } finally {
    // Clean up temporary files
    try {
      if (tempImagePaths.length > 0) {
        for (const imagePath of tempImagePaths) {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
          }
        }
      }

      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
      }

      if (tempDir && fs.existsSync(tempDir)) {
        fs.rmdirSync(tempDir, { recursive: true })
      }
    } catch (cleanupError) {
      logger.warn(`Error cleaning up temporary files [${processingId}]`, cleanupError)
    }
  }
}
