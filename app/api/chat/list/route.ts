import { NextResponse } from "next/server"
import { chatHistoryService } from "@/lib/chat-history-service"
import { logger } from "@/lib/logger"

export async function GET(req: Request) {
  try {
    // Get user ID from session if available (for future auth integration)
    const userId = undefined // Will be populated when auth is implemented

    // For now, we'll use a default user ID for testing
    const testUserId = "anonymous-user"

    const chats = await chatHistoryService.listUserChats(userId || testUserId)

    logger.info("Chats retrieved successfully", {
      count: chats.length,
      userId: userId || testUserId,
    })

    return NextResponse.json({ chats })
  } catch (error) {
    logger.error("Error listing chats", { error })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
