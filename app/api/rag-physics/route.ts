import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { ragPhysicsService } from "@/lib/rag-physics/rag-physics-service"
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

    logger.info("RAG Physics query received", { query: query.substring(0, 50) })

    // Check if RAG Physics is enabled
    if (!ENV.ENABLE_RAG_PHYSICS) {
      return new Response(
        JSON.stringify({
          error: "RAG Physics is disabled. Enable it with ENABLE_RAG_PHYSICS=true.",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Process the query with RAG Physics
    const result = await ragPhysicsService.processQuery(query)

    // Return the response
    return NextResponse.json({
      answer: result.ragResult.answer,
      documents: result.ragResult.documents,
      model: result.ragResult.model,
      needsPhysicsSimulation: result.needsPhysicsSimulation,
      physicsSimulation: result.physicsResult
        ? {
            initialState: result.physicsResult.initialState,
            finalState: result.physicsResult.finalState,
            duration: result.physicsResult.duration,
            steps: result.physicsResult.steps,
          }
        : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Error in RAG Physics route", error)

    // Return a graceful error response
    return new Response(
      JSON.stringify({
        error: "Something went wrong processing your RAG Physics request. Please try again.",
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

