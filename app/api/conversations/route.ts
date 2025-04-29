import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function GET(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const { valid, userId } = auth.verifyToken(token)

    if (!valid || !userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(url.searchParams.get("offset") || "0", 10)

    // Get conversations for user
    const conversations = await db.listConversations(limit, offset, userId)

    // Return conversations
    return NextResponse.json({
      conversations: conversations.map((conv) => ({
        id: conv.sessionId,
        createdAt: conv.metadata.createdAt,
        updatedAt: conv.metadata.updatedAt,
        messageCount: conv.messages.length,
        lastMessage:
          conv.messages.length > 0
            ? {
                content:
                  conv.messages[conv.messages.length - 1].content.substring(0, 100) +
                  (conv.messages[conv.messages.length - 1].content.length > 100 ? "..." : ""),
                timestamp: conv.messages[conv.messages.length - 1].timestamp,
              }
            : null,
      })),
      total: conversations.length,
      limit,
      offset,
    })
  } catch (error) {
    logger.error("Error in conversations route", error)
    return NextResponse.json({ error: "Failed to get conversations" }, { status: 500 })
  }
}
