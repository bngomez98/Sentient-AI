import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login user
    const result = await auth.login(email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    // Return success
    return NextResponse.json({
      message: result.message,
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    logger.error("Error in login route", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
