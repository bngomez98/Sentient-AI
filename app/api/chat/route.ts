import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Simple fallback response if OpenAI API key is not available
    if (!process.env.OPENAI_API_KEY) {
      logger.warn("OpenAI API key not found, using fallback response")
      return NextResponse.json({
        message: {
          role: "assistant",
          content:
            "I am a fallback response because the OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.",
        },
      })
    }

    // Use the AI SDK to generate a response
    try {
      const { text } = await generateText({
        model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
        messages,
        temperature: Number.parseFloat(process.env.TEMPERATURE || "0.7"),
        maxTokens: Number.parseInt(process.env.MAX_TOKENS || "1000"),
      })

      return NextResponse.json({
        message: {
          role: "assistant",
          content: text,
        },
      })
    } catch (aiError) {
      logger.error("Error generating AI response:", aiError)

      // Fallback to a simple response
      return NextResponse.json({
        message: {
          role: "assistant",
          content: "I apologize, but I encountered an error generating a response. Please try again later.",
        },
      })
    }
  } catch (error) {
    logger.error("Error in chat API:", error)
    return NextResponse.json(
      {
        message: {
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        },
      },
      { status: 200 }, // Return 200 even for errors to avoid client-side JSON parsing issues
    )
  }
}

