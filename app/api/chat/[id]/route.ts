import { NextResponse } from "next/server"
import { chatHistoryService } from "@/lib/chat-history-service"
import { logger } from "@/lib/logger"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const chatId = params.id

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
    }

    const chatSession = await chatHistoryService.getChat(chatId)

    if (!chatSession) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    logger.info("Chat retrieved successfully", { chatId })
    return NextResponse.json(chatSession)
  } catch (error) {
    logger.error("Error retrieving chat", { error, chatId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const chatId = params.id

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID is required" }, { status: 400 })
    }

    // Get user ID from session if available (for future auth integration)
    const userId = undefined // Will be populated when auth is implemented

    const success = await chatHistoryService.deleteChat(chatId, userId)

    if (success) {
      logger.info("Chat deleted successfully", { chatId })
      return NextResponse.json({ success: true })
    } else {
      logger.error("Failed to delete chat", { chatId })
      return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 })
    }
  } catch (error) {
    logger.error("Error deleting chat", { error, chatId: params.id })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
