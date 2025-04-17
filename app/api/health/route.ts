import { NextResponse } from "next/server"
import { checkAvailability } from "@/lib/together-ai-client"
import { ENV } from "@/lib/env-variables"

export const runtime = "edge" // Use edge runtime for better performance

export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID()

  try {
    console.log(`Health check requested: ${requestId}`)

    // Check Together.ai availability
    let togetherStatus = "not-configured"
    if (ENV.TOGETHER_API_KEY) {
      try {
        const available = await checkAvailability()
        togetherStatus = available ? "ok" : "error"
      } catch (error) {
        togetherStatus = "error"
      }
    }

    // Build health response
    const health = {
      status: togetherStatus === "ok" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        togetherAI: { status: togetherStatus },
      },
      environment: {
        nodeEnv: ENV.NODE_ENV,
      },
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error(`Health check failed: ${error.message}`)

    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

