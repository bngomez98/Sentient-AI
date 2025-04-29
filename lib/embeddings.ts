import { logger } from "./logger"
import { ENV } from "./env-variables"

export interface EmbeddingResult {
  embedding: number[]
  model: string
}

/**
 * Service for generating text embeddings
 */
class EmbeddingService {
  private model: string
  private apiKey: string
  private dimensions: number
  private maxRetries = 3
  private embeddingCache = new Map<string, EmbeddingResult>()

  constructor() {
    this.model = ENV.RAG_EMBEDDING_MODEL
    this.apiKey = ENV.OPENAI_API_KEY
    this.dimensions = ENV.VECTOR_DIMENSIONS
    logger.info("Embedding Service initialized", { model: this.model, dimensions: this.dimensions })
  }

  /**
   * Generate embeddings for a text with retry logic and caching
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error("Empty text provided for embedding")
      }

      // Check cache first (simple in-memory cache)
      const cacheKey = this.getCacheKey(text)
      if (this.embeddingCache.has(cacheKey)) {
        const cachedResult = this.embeddingCache.get(cacheKey)
        logger.debug("Using cached embedding", { cacheKey })
        return cachedResult!
      }

      // Truncate text if too long (most embedding models have token limits)
      const truncatedText = text.length > 8000 ? text.substring(0, 8000) : text

      if (this.model.startsWith("openai:") && this.apiKey) {
        const modelName = this.model.replace("openai:", "")

        // Try with retries and exponential backoff
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              // Exponential backoff: 1s, 2s, 4s, 8s, etc.
              const backoffTime = Math.pow(2, attempt) * 1000
              logger.info(
                `Retrying OpenAI embedding (attempt ${attempt + 1}/${this.maxRetries}) after ${backoffTime}ms`,
              )
              await new Promise((resolve) => setTimeout(resolve, backoffTime))
            }

            const response = await fetch("https://api.openai.com/v1/embeddings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
              },
              body: JSON.stringify({
                model: modelName,
                input: truncatedText,
              }),
            })

            if (response.status === 429) {
              logger.warn("OpenAI API rate limit exceeded", { attempt })
              // Continue to retry
              continue
            }

            if (!response.ok) {
              throw new Error(`OpenAI API error: ${response.status}`)
            }

            const data = await response.json()
            const result = {
              embedding: data.data[0].embedding,
              model: modelName,
            }

            // Cache the result
            this.embeddingCache.set(cacheKey, result)

            return result
          } catch (error) {
            if (attempt === this.maxRetries - 1) {
              // Last attempt failed, throw the error to be caught by outer try-catch
              throw error
            }
            // Otherwise continue to the next retry
          }
        }
      }

      // If we get here, either the model isn't OpenAI or all retries failed
      // Fall back to deterministic embedding
      logger.warn("Falling back to deterministic embedding", { model: this.model })
      const result = this.generateDeterministicEmbedding(text)

      // Cache the fallback result too
      this.embeddingCache.set(cacheKey, result)

      return result
    } catch (error) {
      logger.error("Error generating embedding", error)
      const result = this.generateDeterministicEmbedding(text)
      return result
    }
  }

  /**
   * Generate a cache key for a text
   */
  private getCacheKey(text: string): string {
    // Simple hash function for text
    const hash = text.split("").reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0)
    }, 0)
    return `${this.model}_${hash}`
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
