import { NextResponse } from "next/server"
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

    // Get user
    const user = await auth.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user
    return NextResponse.json({ user })
  } catch (error) {
    logger.error("Error in user route", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}

