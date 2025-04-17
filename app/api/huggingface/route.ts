import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"
import { getEnvValue } from "@/lib/env-variables"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

// Initialize the Hugging Face Inference client
const getClient = () => {
  const token = getEnvValue("HUGGINGFACE_API_TOKEN")
  if (!token) {
    throw new Error("HUGGINGFACE_API_TOKEN is not set")
  }
  return new InferenceClient(token)
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()

  try {
    logger.info(`HuggingFace request received`, { requestId })

    // Parse request body
    const body = await req.json()
    const { messages, model = "meta-llama/Llama-3.2-3B-Instruct", provider = "together", maxTokens = 500 } = body

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      logger.warn(`Invalid request format`, { requestId })
      return NextResponse.json(
        {
          message: {
            role: "assistant",
            content: "Invalid request: messages array is required",
          },
          error: "Invalid request: messages array is required",
        },
        { status: 400 },
      )
    }

    const client = getClient()

    logger.info(`Generating response with ${model} via ${provider}`, { requestId })

    // For non-streaming responses
    const response = await client.chatCompletion({
      provider,
      model,
      messages,
      max_tokens: maxTokens,
    })

    // Return the response
    return NextResponse.json({
      message: {
        role: "assistant",
        content: response.choices[0].message.content,
      },
      model,
      provider,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error(`Error processing HuggingFace request`, { requestId, error })

    // Ensure we return a valid JSON response even in error cases
    return NextResponse.json(
      {
        message: {
          role: "assistant",
          content:
            "I apologize, but I encountered an unexpected error while processing your request. Please try again or rephrase your question.",
        },
        model: "error-recovery",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

