import { NextResponse } from "next/server"
import { chatHistoryService } from "@/lib/chat-history-service"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const chatSession = await req.json()

    if (!chatSession || !chatSession.id || !chatSession.messages) {
      return NextResponse.json({ error: "Invalid chat session data" }, { status: 400 })
    }

    // Get user ID from session if available (for future auth integration)
    const userId = undefined // Will be populated when auth is implemented

    const success = await chatHistoryService.saveChat(chatSession.id, chatSession.messages, userId)

    if (success) {
      logger.info("Chat saved successfully", { chatId: chatSession.id })
      return NextResponse.json({ success: true })
    } else {
      logger.error("Failed to save chat", { chatId: chatSession.id })
      return NextResponse.json({ error: "Failed to save chat" }, { status: 500 })
    }
  } catch (error) {
    logger.error("Error in save chat API", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
