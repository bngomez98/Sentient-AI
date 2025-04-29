import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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

    // Get conversation
    const conversation = await db.getConversation(id)

    // Check if conversation exists and belongs to user
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conversation.userId && conversation.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Return conversation
    return NextResponse.json({ conversation })
  } catch (error) {
    logger.error("Error in conversation route", error)
    return NextResponse.json({ error: "Failed to get conversation" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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

    // Get conversation
    const conversation = await db.getConversation(id)

    // Check if conversation exists and belongs to user
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conversation.userId && conversation.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete conversation
    const success = await db.deleteConversation(id)
    if (!success) {
      return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
    }

    // Return success
    return NextResponse.json({ message: "Conversation deleted successfully" })
  } catch (error) {
    logger.error("Error in conversation delete route", error)
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 })
  }
}
