import type { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import fs from "fs"
import os from "os"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null
  let audioFilePath: string | null = null

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
    const extractAudio = formData.get("extractAudio") === "true"

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check file type
    if (!file.type.includes("video")) {
      return new Response(JSON.stringify({ error: "File must be a video file" }), {
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
      `video-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${path.extname(file.name)}`,
    )
    fs.writeFileSync(tempFilePath, buffer)

    // Extract video metadata using ffprobe
    const { stdout: metadataOutput } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${tempFilePath}"`,
    )
    const videoMetadata = JSON.parse(metadataOutput)

    let transcription = ""

    // Extract audio if requested
    if (extractAudio) {
      // Extract audio from video
      audioFilePath = path.join(tempDir, `audio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.mp3`)
      await execAsync(`ffmpeg -i "${tempFilePath}" -q:a 0 -map a "${audioFilePath}"`)

      // Read the audio file
      const audioBuffer = fs.readFileSync(audioFilePath)

      // Use OpenAI's Whisper model for transcription
      const formData2 = new FormData()
      formData2.append("file", new Blob([audioBuffer]), "audio.mp3")
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
      transcription = transcriptionResult.text
    }

    // Generate content analysis if we have a transcription
    let contentAnalysis = ""
    if (transcription) {
      const { text: analysis } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Analyze this video transcription and provide a brief summary of its content, potential speakers, and main topics discussed:
        
        ${transcription.substring(0, 1000)}${transcription.length > 1000 ? "..." : ""}`,
      })
      contentAnalysis = analysis
    }

    // Log success
    logger.info(`Successfully processed video: ${file.name} (${buffer.length} bytes)`)

    // Clean up temporary files
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }
    if (audioFilePath && fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath)
    }

    return new Response(
      JSON.stringify({
        text: transcription,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          duration: videoMetadata.format?.duration,
          width: videoMetadata.streams?.find((s: any) => s.codec_type === "video")?.width,
          height: videoMetadata.streams?.find((s: any) => s.codec_type === "video")?.height,
          codec: videoMetadata.streams?.find((s: any) => s.codec_type === "video")?.codec_name,
          bitrate: videoMetadata.format?.bit_rate,
          frameRate: videoMetadata.streams?.find((s: any) => s.codec_type === "video")?.r_frame_rate,
          analysis: contentAnalysis,
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
    logger.error("Error processing video", error)

    // Clean up temporary files
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }
    if (audioFilePath && fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath)
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process video",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

