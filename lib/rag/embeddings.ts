import { ENV } from "../env-variables"
import { logger } from "../logger"
import { openai } from "@ai-sdk/openai"
import { generateEmbedding } from "ai"

export interface EmbeddingResult {
  embedding: number[]
  model: string
}

/**
 * Advanced embedding service for generating text embeddings
 */
class EmbeddingService {
  private model: string
  private apiKey: string
  private dimensions: number

  constructor() {
    this.model = ENV.RAG_EMBEDDING_MODEL
    this.apiKey = ENV.OPENAI_API_KEY
    this.dimensions = ENV.VECTOR_DIMENSIONS
    logger.info("Embedding Service initialized", { model: this.model, dimensions: this.dimensions })
  }

  /**
   * Generate embeddings for a text
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error("Empty text provided for embedding")
      }

      // Truncate text if too long (most embedding models have token limits)
      const truncatedText = text.length > 8000 ? text.substring(0, 8000) : text

      if (this.model.startsWith("openai:")) {
        const modelName = this.model.replace("openai:", "")

        const result = await generateEmbedding({
          model: openai(modelName),
          input: truncatedText,
        })

        return {
          embedding: result.embedding,
          model: modelName,
        }
      } else {
        // Fallback to OpenAI's text-embedding-3-large
        const result = await generateEmbedding({
          model: openai("text-embedding-3-large"),
          input: truncatedText,
        })

        return {
          embedding: result.embedding,
          model: "text-embedding-3-large",
        }
      }
    } catch (error) {
      logger.error("Error generating embedding", error)

      // Generate a deterministic embedding as fallback
      return this.generateDeterministicEmbedding(text)
    }
  }

  /**
   * Generate a deterministic embedding (for fallback)
   */
  private generateDeterministicEmbedding(text: string): EmbeddingResult {
    // Create a deterministic embedding based on the text
    const seed = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const random = (n: number) => {
      const x = Math.sin(n + seed) * 10000
      return x - Math.floor(x)
    }

    const dimensions = this.dimensions
    const embedding = Array(dimensions)
      .fill(0)
      .map((_, i) => random(i) * 2 - 1)

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    const normalizedEmbedding = embedding.map((val) => val / magnitude)

    return {
      embedding: normalizedEmbedding,
      model: "deterministic-fallback",
    }
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService()
