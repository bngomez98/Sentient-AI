import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
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

    // Get settings from request body
    const settings = await req.json()

    // Update settings
    const success = await auth.updateUserSettings(userId, settings)
    if (!success) {
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    // Return success
    return NextResponse.json({ message: "Settings updated successfully" })
  } catch (error) {
    logger.error("Error in settings route", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
