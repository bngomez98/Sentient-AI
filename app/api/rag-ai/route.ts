import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { ragAI } from "@/lib/rag-ai-integration"
import { ENV } from "@/lib/env-variables"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { query } = await req.json()

    // Validate query
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Invalid query format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    logger.info("RAG AI query received", { query: query.substring(0, 50) })

    // Process the query with RAG AI
    const response = await ragAI.processQuery(query)

    // Return the response
    return NextResponse.json({
      content: response.content,
      contextualDocuments: response.contextualDocuments,
      physicsSimulation: response.physicsSimulation,
      ragEnabled: ENV.ENABLE_RAG_PHYSICS,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error in RAG AI route", error)

    // Return a graceful error response
    return new Response(
      JSON.stringify({
        error: "Something went wrong processing your RAG AI request. Please try again.",
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

