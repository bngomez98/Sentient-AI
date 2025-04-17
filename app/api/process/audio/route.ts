import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
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

    // Check file type
    if (!file.type.includes("audio")) {
      return new Response(JSON.stringify({ error: "File must be an audio file" }), {
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
      `audio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${path.extname(file.name)}`,
    )
    fs.writeFileSync(tempFilePath, buffer)

    // Use OpenAI's Whisper model for transcription
    const formData2 = new FormData()
    formData2.append("file", new Blob([buffer]), file.name)
    formData2.append("model", "whisper-1")

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData2,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const transcriptionResult = await response.json()
    const transcription = transcriptionResult.text

    // Generate metadata about the audio
    const { text: audioAnalysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this audio transcription and provide a brief summary of its content, potential speakers, and main topics discussed:
      
      ${transcription.substring(0, 1000)}${transcription.length > 1000 ? "..." : ""}`,
    })

    // Log success
    logger.info(`Successfully transcribed audio: ${file.name} (${buffer.length} bytes)`)

    // Clean up the temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }

    return new Response(
      JSON.stringify({
        text: transcription,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          analysis: audioAnalysis,
          transcriptionLength: transcription.length,
          wordCount: transcription.split(/\s+/).filter(Boolean).length,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    logger.error("Error processing audio", error)

    // Clean up the temporary file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process audio",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

