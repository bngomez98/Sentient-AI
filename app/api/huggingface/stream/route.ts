import { type NextRequest, NextResponse } from "next/server"
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

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    logger.info(`HuggingFace streaming request received`, { requestId })

    // Parse request body
    const body = await req.json()
    const { messages, model = "meta-llama/Llama-3.2-3B-Instruct", provider = "together", maxTokens = 500 } = body

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      logger.warn(`Invalid request format`, { requestId })
      return NextResponse.json(
        {
          error: "Invalid request: messages array is required",
        },
        { status: 400 },
      )
    }

    const client = getClient()

    logger.info(`Generating streaming response with ${model} via ${provider}`, { requestId })

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const stream = await client.chatCompletionStream({
            provider,
            model,
            messages,
            max_tokens: maxTokens,
          })

          for await (const chunk of stream) {
            if (chunk.choices && chunk.choices.length > 0) {
              const newContent = chunk.choices[0].delta.content
              if (newContent) {
                // Encode the content as a JSON event
                const data = JSON.stringify({ content: newContent })
                controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
              }
            }
          }

          // End the stream
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          logger.error(`Error in stream generation`, { requestId, error })
          const errorMessage = error instanceof Error ? error.message : "Unknown error"
          const data = JSON.stringify({ error: errorMessage })
          controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
          controller.close()
        }
      },
    })

    // Return the stream response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    logger.error(`Error processing HuggingFace streaming request`, { requestId, error })

    // Return an error response
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

