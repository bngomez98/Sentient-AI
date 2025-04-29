import { logger } from "./logger"
import { ENV } from "./env-variables"

export interface Document {
  id: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

export interface QueryResult {
  documents: Document[]
  relevanceScores: number[]
}

/**
 * RAG (Retrieval Augmented Generation) service for knowledge retrieval
 */
class RagRetrievalService {
  private vectorDbUrl: string
  private vectorDbApiKey: string
  private indexName: string
  private dimensions: number

  constructor() {
    this.vectorDbUrl = ENV.VECTOR_DB_URL
    this.vectorDbApiKey = ENV.VECTOR_DB_API_KEY
    this.indexName = ENV.VECTOR_INDEX_NAME
    this.dimensions = ENV.VECTOR_DIMENSIONS

    logger.info("RAG Retrieval Service initialized", {
      vectorDbConfigured: !!this.vectorDbApiKey,
      indexName: this.indexName,
      dimensions: this.dimensions,
    })
  }

  /**
   * Query the vector database for relevant documents
   */
  async queryDocuments(query: string, limit = 5): Promise<QueryResult> {
    try {
      logger.info("Querying vector database", { query: query.substring(0, 50), limit })

      if (!this.vectorDbApiKey) {
        logger.warn("Vector database API key not configured, using mock results")
        return this.getMockResults(query, limit)
      }

      // Generate query embedding (in a real implementation, this would use an embedding model)
      const queryEmbedding = await this.generateEmbedding(query)

      // Query the vector database
      const response = await fetch(`${this.vectorDbUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.vectorDbApiKey}`,
        },
        body: JSON.stringify({
          index_name: this.indexName,
          query_embedding: queryEmbedding,
          limit: limit,
          include_metadata: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Vector database query failed: ${response.status}`)
      }

      const data = await response.json()

      return {
        documents: data.matches.map((match: any) => ({
          id: match.id,
          content: match.document,
          metadata: match.metadata,
        })),
        relevanceScores: data.matches.map((match: any) => match.score),
      }
    } catch (error) {
      logger.error("Error querying vector database", error)
      return this.getMockResults(query, limit)
    }
  }

  /**
   * Generate embedding for a text (simplified mock implementation)
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    // In a real implementation, this would call an embedding model API
    // For now, we'll generate a random embedding of the correct dimension
    return Array(this.dimensions)
      .fill(0)
      .map(() => Math.random() * 2 - 1)
  }

  /**
   * Get mock results when vector database is not available
   */
  private getMockResults(query: string, limit: number): QueryResult {
    const mockDocuments: Document[] = [
      {
        id: "doc1",
        content:
          "Rag doll physics is a type of procedural animation that is often used in video games and computer graphics to simulate the realistic movement of a character or object.",
        metadata: { source: "Wikipedia", category: "Physics" },
      },
      {
        id: "doc2",
        content:
          "In video game physics, ragdoll physics is a type of procedural animation that replaces traditional static death animations. The character's movement is determined by the game's physics engine.",
        metadata: { source: "Game Development Guide", category: "Animation" },
      },
      {
        id: "doc3",
        content:
          "Ragdoll physics uses a collection of rigid bodies connected by joints to simulate the movement of a character. This allows for more realistic interactions with the environment.",
        metadata: { source: "Physics Simulation Handbook", category: "Simulation" },
      },
      {
        id: "doc4",
        content:
          "The term 'ragdoll' comes from the characteristic limp appearance of the simulated character, similar to a cloth doll with movable joints.",
        metadata: { source: "Computer Graphics Dictionary", category: "Terminology" },
      },
      {
        id: "doc5",
        content:
          "Modern ragdoll physics implementations often combine procedural animation with inverse kinematics to create more controlled and realistic character movements.",
        metadata: { source: "Advanced Animation Techniques", category: "Technology" },
      },
    ]

    // Simple relevance scoring based on word matching
    const queryWords = query
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
    const scores = mockDocuments.map((doc) => {
      const docWords = doc.content.toLowerCase().split(/\W+/)
      const matchCount = queryWords.reduce((count, word) => {
        return count + (docWords.includes(word) ? 1 : 0)
      }, 0)
      return matchCount / queryWords.length || 0.1
    })

    // Sort by relevance and take the top 'limit' results
    const sortedIndices = scores
      .map((score, i) => ({ score, index: i }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.index)

    return {
      documents: sortedIndices.map((i) => mockDocuments[i]),
      relevanceScores: sortedIndices.map((i) => scores[i]),
    }
  }
}

// Export singleton instance
export const ragRetrieval = new RagRetrievalService()
