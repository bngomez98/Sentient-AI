import { logger } from "./logger"
import { pretrainedData } from "./pretraining-data"

interface SearchResult {
  id: string
  title: string
  content: string
  score: number
  metadata?: {
    source: string
    date?: string
    relevance: number
  }
}

class LocalKnowledgeRetrieval {
  private initialized = false

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    try {
      logger.info("Initializing local knowledge retrieval")

      // Simulate initialization
      await new Promise((resolve) => setTimeout(resolve, 100))

      this.initialized = true
      logger.info("Local knowledge retrieval initialized successfully")
    } catch (error) {
      logger.error("Failed to initialize local knowledge retrieval", error)
      this.initialized = false
    }
  }

  async search(query: string): Promise<SearchResult[]> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.initialized) {
        throw new Error("Local knowledge retrieval not initialized")
      }

      logger.info("Searching local knowledge", { query: query.substring(0, 50) })

      // Tokenize the query
      const queryTokens = this.tokenize(query.toLowerCase())

      // Score each document based on relevance to the query
      const scoredDocuments = pretrainedData.map((doc) => {
        const titleTokens = this.tokenize(doc.title.toLowerCase())
        const contentTokens = this.tokenize(doc.content.toLowerCase())
        const keywordTokens = doc.keywords ? doc.keywords.flatMap((kw) => this.tokenize(kw.toLowerCase())) : []

        // Calculate scores based on token matches
        const titleScore = this.calculateMatchScore(queryTokens, titleTokens) * 3 // Title matches are more important
        const contentScore = this.calculateMatchScore(queryTokens, contentTokens)
        const keywordScore = this.calculateMatchScore(queryTokens, keywordTokens) * 2 // Keyword matches are important

        // Calculate final score (0-1)
        const score = Math.min(1, (titleScore + contentScore + keywordScore) / 6)

        return {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          score,
          metadata: {
            source: `Local Knowledge Base - ${doc.category || "General"}`,
            date: doc.date,
            relevance: score,
          },
        }
      })

      // Sort by score and filter out low-scoring documents
      const results = scoredDocuments
        .filter((doc) => doc.score > 0.1) // Only include somewhat relevant documents
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // Return top 3 results

      logger.info("Local knowledge search completed", { resultCount: results.length })

      return results
    } catch (error) {
      logger.error("Error searching local knowledge", error)
      return []
    }
  }

  private tokenize(text: string): string[] {
    // Simple tokenization by splitting on non-alphanumeric characters and filtering out short tokens
    return text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2)
  }

  private calculateMatchScore(queryTokens: string[], docTokens: string[]): number {
    if (queryTokens.length === 0 || docTokens.length === 0) {
      return 0
    }

    // Count matching tokens
    let matchCount = 0
    for (const queryToken of queryTokens) {
      if (docTokens.includes(queryToken)) {
        matchCount++
      }
    }

    // Calculate score based on proportion of query tokens that match
    return matchCount / queryTokens.length
  }
}

export const localKnowledgeRetrieval = new LocalKnowledgeRetrieval()

