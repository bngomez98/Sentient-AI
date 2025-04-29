import { type NextRequest, NextResponse } from "next/server"
import type { Message as VercelChatMessage } from "ai"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { logger } from "@/lib/logger"
import { kv } from "@vercel/kv"

export const runtime = "nodejs"

// Define the system prompt for better contextual understanding
const SYSTEM_PROMPT = `You are Sentient-1, an advanced AI assistant with enhanced reasoning capabilities.
- Maintain context throughout the conversation
- Provide detailed, accurate responses
- Use markdown formatting for better readability
- When appropriate, include code examples with proper syntax highlighting
- Be helpful, friendly, and concise
- If you don't know something, admit it rather than making up information
`

// Define the request body type
interface RequestBody {
  messages: VercelChatMessage[]
  chatId?: string
  temperature?: number
  maxTokens?: number
  model?: string
}

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now()
    const { messages, chatId, temperature = 0.7, maxTokens = 1000, model = "gpt-4o" }: RequestBody = await req.json()

    // Log the incoming request
    logger.info("Chat request received", {
      chatId,
      messageCount: messages.length,
      model,
      temperature,
      maxTokens,
      lastMessage: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 50) + "..." : "none",
    })

    // If we have a chatId, try to retrieve previous context from KV store
    let contextualMessages = [...messages]
    if (chatId) {
      try {
        const storedMessages = await kv.get<VercelChatMessage[]>(`chat:${chatId}:messages`)
        if (storedMessages && storedMessages.length > 0) {
          // Merge stored context with new messages, but limit to last 10 messages to avoid token limits
          const contextLimit = 10
          if (storedMessages.length > contextLimit) {
            contextualMessages = [
              ...storedMessages.slice(0, 1), // Keep the first system message if any
              ...storedMessages.slice(-contextLimit + 1), // Take the most recent messages
              ...messages.slice(-1), // Add the new user message
            ]
          } else {
            contextualMessages = [...storedMessages, ...messages.slice(-1)]
          }
          logger.info("Retrieved context from KV store", {
            chatId,
            storedMessageCount: storedMessages.length,
            mergedMessageCount: contextualMessages.length,
          })
        }
      } catch (kvError) {
        logger.error("Error retrieving chat context from KV", { error: kvError, chatId })
        // Continue with just the current messages if KV retrieval fails
      }
    }

    // Ensure we have a system message at the beginning
    if (contextualMessages.length === 0 || contextualMessages[0].role !== "system") {
      contextualMessages.unshift({ role: "system", content: SYSTEM_PROMPT })
    }

    // Use the AI SDK to generate a response
    try {
      const { text } = await generateText({
        model: openai(model),
        messages: contextualMessages,
        temperature: Number(temperature),
        maxTokens: Number(maxTokens),
      })

      // Store the updated conversation in KV if we have a chatId
      if (chatId) {
        try {
          // Add the assistant's response to the messages
          const updatedMessages = [...contextualMessages, { role: "assistant", content: text }]

          // Store in KV with expiration (7 days)
          await kv.set(`chat:${chatId}:messages`, updatedMessages, { ex: 60 * 60 * 24 * 7 })
          logger.info("Stored updated conversation in KV", { chatId, messageCount: updatedMessages.length })
        } catch (kvError) {
          logger.error("Error storing chat in KV", { error: kvError, chatId })
          // Continue even if KV storage fails
        }
      }

      // Log performance metrics
      const endTime = Date.now()
      logger.info("Chat response generated", {
        chatId,
        responseTime: endTime - startTime,
        responseLength: text.length,
        model,
      })

      return NextResponse.json({
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content: text,
          createdAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      logger.error("Error generating AI response:", aiError)

      // Fallback to a simple response
      return NextResponse.json({
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I apologize, but I encountered an error generating a response. Please try again later.",
          createdAt: new Date().toISOString(),
        },
        error: aiError instanceof Error ? aiError.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    logger.error("Error in chat API:", error)
    return NextResponse.json(
      {
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
          createdAt: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }, // Return 200 even for errors to avoid client-side JSON parsing issues
    )
  }
}
