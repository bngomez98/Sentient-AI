import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import { createWorker } from "tesseract.js"
import sharp from "sharp"

export async function POST(req: NextRequest) {
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
    const extractText = formData.get("extractText") === "true"

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check file type
    if (!file.type.includes("image")) {
      return new Response(JSON.stringify({ error: "File must be an image" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Process the image
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get image metadata using sharp
    const metadata = await sharp(buffer).metadata()

    // Extract text using Tesseract if requested
    let text = ""
    if (extractText) {
      // Optimize image for OCR
      const optimizedBuffer = await sharp(buffer)
        .resize(Math.min(metadata.width || 1000, 2000)) // Resize to reasonable dimensions
        .greyscale() // Convert to grayscale
        .normalize() // Normalize contrast
        .toBuffer()

      // Initialize Tesseract worker
      const worker = await createWorker("eng")

      // Perform OCR
      const result = await worker.recognize(optimizedBuffer)
      text = result.data.text

      // Terminate worker
      await worker.terminate()
    }

    // Log success
    logger.info(`Successfully processed image: ${file.name} (${metadata.width}x${metadata.height})`)

    return new Response(
      JSON.stringify({
        text: text,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          space: metadata.space,
          channels: metadata.channels,
          depth: metadata.depth,
          density: metadata.density,
          hasAlpha: metadata.hasAlpha,
          hasProfile: metadata.hasProfile,
          isProgressive: metadata.isProgressive,
          fileName: file.name,
          fileSize: file.size,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Error processing image", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process image",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

