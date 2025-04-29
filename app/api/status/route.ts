import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { ENV } from "@/lib/env-variables"
import { togetherAIClient } from "@/lib/together-ai-client"

export async function GET() {
  try {
    // Check if critical services are available
    const togetherAvailable = ENV.TOGETHER_API_KEY ? await togetherAIClient.checkAvailability() : "not configured"

    const services = {
      api: true,
      togetherAI: togetherAvailable,
      clientML: ENV.ENABLE_CLIENT_ML,
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services,
      environment: ENV.NODE_ENV,
    })
  } catch (error) {
    logger.error("Status check failed", { error })
    return NextResponse.json({ status: "error", message: "Service health check failed" }, { status: 500 })
  }
}
