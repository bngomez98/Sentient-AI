import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 })
    }

    // Register user
    const result = await auth.register(username, email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    // Return success
    return NextResponse.json({
      message: result.message,
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    logger.error("Error in register route", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

