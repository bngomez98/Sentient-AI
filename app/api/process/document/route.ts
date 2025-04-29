import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import mammoth from "mammoth"
import xlsx from "xlsx"
import fs from "fs"
import os from "os"
import path from "path"

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null

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

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Save the file to a temporary location
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a temporary file
    const tempDir = os.tmpdir()
    tempFilePath = path.join(
      tempDir,
      `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${path.extname(file.name)}`,
    )
    fs.writeFileSync(tempFilePath, buffer)

    // Process based on file extension
    const extension = path.extname(file.name).toLowerCase()
    let text = ""
    let metadata: Record<string, any> = {}

    if (extension === ".docx" || extension === ".doc") {
      // Process Word document
      const result = await mammoth.extractRawText({ path: tempFilePath })
      text = result.value
      metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        warnings: result.messages,
      }
    } else if (extension === ".xlsx" || extension === ".xls") {
      // Process Excel spreadsheet
      const workbook = xlsx.readFile(tempFilePath)
      const sheetNames = workbook.SheetNames

      // Extract text from all sheets
      let allText = ""
      const sheetData: Record<string, any[]> = {}

      for (const sheetName of sheetNames) {
        const sheet = workbook.Sheets[sheetName]
        const jsonData = xlsx.utils.sheet_to_json(sheet)
        sheetData[sheetName] = jsonData

        // Convert sheet to text
        allText += `Sheet: ${sheetName}\n\n`
        allText += jsonData
          .map((row) =>
            Object.entries(row)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", "),
          )
          .join("\n")
        allText += "\n\n"
      }

      text = allText
      metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        sheets: sheetNames,
        rowCounts: Object.fromEntries(Object.entries(sheetData).map(([name, data]) => [name, data.length])),
      }
    } else if (extension === ".pptx" || extension === ".ppt") {
      // For PowerPoint, we'd need a specialized library
      // This is a simplified approach
      text = "PowerPoint content extraction is limited. Please convert to PDF for better results."
      metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }
    } else {
      text = "Unsupported document format. Please convert to PDF, DOCX, or XLSX for better results."
      metadata = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      }
    }

    // Log success
    logger.info(`Successfully processed document: ${file.name} (${buffer.length} bytes)`)

    // Clean up the temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }

    return new Response(
      JSON.stringify({
        text,
        metadata,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Error processing document", error)

    // Clean up the temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process document",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
