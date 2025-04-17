import { logger } from "./logger"
import { ENV } from "./env-variables"
import { ragRetrieval, type Document } from "./rag-retrieval"
import { physicsSimulation, type RagdollModel } from "./physics-simulation"

export interface RagAIResponse {
  content: string
  contextualDocuments?: Document[]
  physicsSimulation?: {
    modelId: string
    timeElapsed: number
  }
}

/**
 * RAG-based AI integration service
 */
class RagAIIntegration {
  private enabled: boolean

  constructor() {
    this.enabled = ENV.ENABLE_RAG_PHYSICS

    logger.info("RAG AI Integration Service initialized", {
      enabled: this.enabled,
    })
  }

  /**
   * Process a query with RAG-based AI and physics simulation
   */
  async processQuery(query: string): Promise<RagAIResponse> {
    try {
      if (!this.enabled) {
        logger.warn("RAG AI integration is disabled")
        return { content: "RAG AI integration is disabled. Enable it with ENABLE_RAG_PHYSICS=true." }
      }

      logger.info("Processing query with RAG AI", { query: query.substring(0, 50) })

      // Step 1: Retrieve relevant documents
      const retrievalResult = await ragRetrieval.queryDocuments(query, 3)

      // Step 2: Check if physics simulation is needed
      const needsPhysicsSimulation = this.queryNeedsPhysicsSimulation(query)
      let physicsResult = undefined

      if (needsPhysicsSimulation) {
        // Create a ragdoll model
        const modelId = `model_${Date.now()}`
        const model = physicsSimulation.createRagdollModel(modelId)

        // Apply initial forces based on query
        this.applyForcesBasedOnQuery(model, query)

        // Run simulation for 3 seconds
        physicsSimulation.simulate(3.0)

        physicsResult = {
          modelId: modelId,
          timeElapsed: 3.0,
        }
      }

      // Step 3: Generate response content
      const responseContent = this.generateResponseWithContext(query, retrievalResult.documents)

      return {
        content: responseContent,
        contextualDocuments: retrievalResult.documents,
        physicsSimulation: physicsResult,
      }
    } catch (error) {
      logger.error("Error processing query with RAG AI", error)
      return {
        content: "An error occurred while processing your query with RAG AI. Please try again.",
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
    ]

    return physicsKeywords.some((keyword) => lowerQuery.includes(keyword))
  }

  /**
   * Apply forces to a ragdoll model based on the query
   */
  private applyForcesBasedOnQuery(model: RagdollModel, query: string): void {
    const lowerQuery = query.toLowerCase()

    // Apply different forces based on query content
    if (lowerQuery.includes("fall") || lowerQuery.includes("gravity")) {
      // Just let gravity do its work
      logger.info("Applying gravity-based simulation")
    } else if (lowerQuery.includes("push") || lowerQuery.includes("force")) {
      // Apply a push force to the torso
      const torso = model.bodies.find((body) => body.id.includes("torso"))
      if (torso) {
        physicsSimulation.applyForce(torso.id, { x: 500 * (Math.random() - 0.5), y: 0, z: 500 * (Math.random() - 0.5) })
        logger.info("Applied push force to torso")
      }
    } else if (lowerQuery.includes("jump")) {
      // Apply upward force to legs
      const legs = model.bodies.filter((body) => body.id.includes("leg"))
      for (const leg of legs) {
        physicsSimulation.applyForce(leg.id, { x: 0, y: 1000, z: 0 })
      }
      logger.info("Applied jump forces to legs")
    } else if (lowerQuery.includes("spin") || lowerQuery.includes("rotate")) {
      // Apply rotational force to torso
      const torso = model.bodies.find((body) => body.id.includes("torso"))
      if (torso) {
        physicsSimulation.applyForce(
          torso.id,
          { x: 0, y: 0, z: 1000 },
          { x: torso.position.x + 0.5, y: torso.position.y, z: torso.position.z },
        )
        logger.info("Applied rotational force")
      }
    } else {
      // Default: apply random forces to random body parts
      const randomBodies = model.bodies.filter((body) => !body.isStatic)
      const selectedBody = randomBodies[Math.floor(Math.random() * randomBodies.length)]

      if (selectedBody) {
        physicsSimulation.applyForce(selectedBody.id, {
          x: 300 * (Math.random() - 0.5),
          y: 300 * Math.random(),
          z: 300 * (Math.random() - 0.5),
        })
        logger.info(`Applied random force to ${selectedBody.id}`)
      }
    }
  }

  /**
   * Generate a response with context from retrieved documents
   */
  private generateResponseWithContext(query: string, documents: Document[]): string {
    // In a real implementation, this would use an LLM to generate a response
    // For now, we'll create a simple response that incorporates the retrieved documents

    if (documents.length === 0) {
      return "I couldn't find any relevant information about rag doll physics. Rag doll physics is a simulation technique used in games and animations to create realistic character movements."
    }

    // Extract relevant information from documents
    const documentContents = documents.map((doc) => doc.content).join("\n\n")

    // Create a simple response
    return `Based on the information I have about rag doll physics:

${documentContents}

Rag-based Artificial Intelligence combines these physics simulations with AI to create more realistic and responsive character movements. The physics engine calculates how the character's body parts should move based on forces, collisions, and joint constraints, while the AI determines when and how to apply these forces to achieve desired behaviors.

This technology is widely used in video games, animation, and virtual reality to create more immersive experiences. The simulation quality can be adjusted based on computational resources, with higher quality simulations providing more realistic but computationally expensive results.`
  }
}

// Export singleton instance
export const ragAI = new RagAIIntegration()

