import { ENV } from "../env-variables"
import { logger } from "../logger"
import { ragService, type RagResult } from "../rag/rag-service"
import { physicsService, type SimulationResult } from "../physics/physics-service"

export interface RagPhysicsResult {
  ragResult: RagResult
  physicsResult?: SimulationResult
  needsPhysicsSimulation: boolean
}

/**
 * Combined RAG and Physics service
 */
class RagPhysicsService {
  private enabled: boolean

  constructor() {
    this.enabled = ENV.ENABLE_RAG_PHYSICS
    logger.info("RAG Physics Service initialized", { enabled: this.enabled })
  }

  /**
   * Process a query with RAG and Physics
   */
  async processQuery(query: string): Promise<RagPhysicsResult> {
    try {
      if (!this.enabled) {
        throw new Error("RAG Physics service is disabled")
      }

      logger.info("Processing RAG Physics query", { query: query.substring(0, 50) })

      // Step 1: Get RAG result
      const ragResult = await ragService.query(query)

      // Step 2: Check if physics simulation is needed
      const needsPhysicsSimulation = this.queryNeedsPhysicsSimulation(query)
      let physicsResult: SimulationResult | undefined

      if (needsPhysicsSimulation) {
        // Create a simulation based on the query
        const { model, forces } = physicsService.createSimulationFromQuery(query)

        // Run the simulation
        physicsResult = physicsService.simulate(model, 3.0, forces)
        logger.info("Physics simulation completed", {
          modelId: model.id,
          duration: physicsResult.duration,
          steps: physicsResult.steps,
        })
      }

      return {
        ragResult,
        physicsResult,
        needsPhysicsSimulation,
      }
    } catch (error) {
      logger.error("Error in RAG Physics query", error)

      // Return a basic result with error information
      return {
        ragResult: {
          answer: `I encountered an error while processing your query: ${error instanceof Error ? error.message : "Unknown error"}`,
          documents: [],
          scores: [],
          model: "error",
        },
        needsPhysicsSimulation: false,
      }
    }
  }

  /**
   * Determine if a query needs physics simulation
   */
  private queryNeedsPhysicsSimulation(query: string): boolean {
    const lowerQuery = query.toLowerCase()

    // Check for physics-related keywords
    const physicsKeywords = [
      "physics",
      "simulation",
      "ragdoll",
      "rag doll",
      "movement",
      "motion",
      "animate",
      "animation",
      "fall",
      "impact",
      "collision",
      "force",
      "gravity",
      "push",
      "pull",
      "jump",
      "spin",
      "rotate",
      "punch",
      "hit",
      "kick",
      "throw",
    ]

    // Check for simulation request keywords
    const simulationKeywords = ["show me", "simulate", "demonstrate", "visualize", "create", "make", "run"]

    // Check if the query contains both physics and simulation keywords
    const hasPhysicsKeyword = physicsKeywords.some((keyword) => lowerQuery.includes(keyword))
    const hasSimulationKeyword = simulationKeywords.some((keyword) => lowerQuery.includes(keyword))

    return hasPhysicsKeyword && (hasSimulationKeyword || lowerQuery.includes("?"))
  }
}

// Export singleton instance
export const ragPhysicsService = new RagPhysicsService()

