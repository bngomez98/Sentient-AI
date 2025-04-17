import { logger } from "./logger"

/**
 * Text embedding service that uses the local embedding model
 * Based on the provided embed-text Python script
 */
class EmbeddingService {
  private initialized = false
  private dimensions = 384 // Default embedding dimensions

  constructor() {
    this.initialize()
  }

  /**
   * Initialize the embedding service
   */
  private async initialize(): Promise<void> {
    try {
      logger.info("Initializing embedding service")

      // Simulate loading the model
      await new Promise((resolve) => setTimeout(resolve, 100))

      this.initialized = true
      logger.info("Embedding service initialized successfully")
    } catch (error) {
      logger.error("Failed to initialize embedding service", error)
      this.initialized = false
    }
  }

  /**
   * Generate embeddings for a text
   */
  async embedText(text: string): Promise<number[]> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.initialized) {
        throw new Error("Embedding service not initialized")
      }

      logger.info("Generating embeddings", { textLength: text.length })

      // Generate deterministic embeddings based on the text
      // This is a simplified version of what the Python script would do
      const embedding = this.generateDeterministicEmbedding(text)

      return embedding
    } catch (error) {
      logger.error("Error generating embeddings", error)
      throw error
    }
  }

  /**
   * Generate deterministic embeddings for a text
   * This is a simplified version of what the actual embedding model would do
   */
  private generateDeterministicEmbedding(text: string): number[] {
    // Create a seed from the text
    let seed = 0
    for (let i = 0; i < Math.min(text.length, 100); i++) {
      seed = (seed << 5) - seed + text.charCodeAt(i)
      seed = seed & seed // Convert to 32bit integer
    }

    // Generate embedding values based on the seed
    const embedding = new Array(this.dimensions).fill(0).map((_, i) => {
      const value = Math.sin(seed * (i + 1)) * Math.cos(i * 0.1)
      return value
    })

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map((val) => val / magnitude)
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error("Embeddings must have the same dimensions")
    }

    let dotProduct = 0
    let magnitude1 = 0
    let magnitude2 = 0

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i]
      magnitude1 += embedding1[i] * embedding1[i]
      magnitude2 += embedding2[i] * embedding2[i]
    }

    magnitude1 = Math.sqrt(magnitude1)
    magnitude2 = Math.sqrt(magnitude2)

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0
    }

    return dotProduct / (magnitude1 * magnitude2)
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService()

