import { logger } from "./logger"
import { ENV } from "./env-variables"

// Mock vector database for demonstration
const vectorDb = [
  {
    id: "doc1",
    content:
      "Artificial intelligence (AI) is intelligence demonstrated by machines, unlike natural intelligence displayed by humans and animals. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
    embedding: Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    metadata: { source: "Wikipedia", category: "AI" },
  },
  {
    id: "doc2",
    content:
      "Machine learning is a field of inquiry devoted to understanding and building methods that 'learn', that is, methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence.",
    embedding: Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    metadata: { source: "Wikipedia", category: "AI" },
  },
  {
    id: "doc3",
    content:
      "Retrieval-Augmented Generation (RAG) is an AI framework that enhances large language models by retrieving relevant information from external sources before generating a response. This approach grounds the model's outputs in factual information, reducing hallucinations.",
    embedding: Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    metadata: { source: "AI Research", category: "RAG" },
  },
  {
    id: "doc4",
    content:
      "Neural networks are computing systems vaguely inspired by the biological neural networks that constitute animal brains. They are the core component of deep learning algorithms.",
    embedding: Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    metadata: { source: "Deep Learning Book", category: "Neural Networks" },
  },
  {
    id: "doc5",
    content:
      "Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data.",
    embedding: Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1),
    metadata: { source: "NLP Handbook", category: "NLP" },
  },
]

/**
 * Generate a simple embedding for a query
 * In a real implementation, this would use a proper embedding model
 */
function generateEmbedding(text: string): number[] {
  try {
    // This is a simplified mock implementation
    // In reality, you would use a proper embedding model
    const hash = text.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)

    // Generate a vector with the correct dimensions
    return Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map((_, i) => {
        const angle = ((hash + i) / ENV.VECTOR_DIMENSIONS) * Math.PI * 2
        return Math.sin(angle) * 0.5 + 0.5
      })
  } catch (error) {
    logger.error("Error generating embedding", error)
    // Return a fallback embedding
    return Array(ENV.VECTOR_DIMENSIONS)
      .fill(0)
      .map(() => Math.random() * 2 - 1)
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  try {
    if (a.length !== b.length) {
      logger.warn("Vector dimensions don't match", { a: a.length, b: b.length })
      return 0
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  } catch (error) {
    logger.error("Error calculating similarity", error)
    return 0
  }
}

/**
 * Retrieve relevant documents for a query
 */
export async function retrieveRelevantDocuments(query: string, topK: number = ENV.RAG_TOP_K): Promise<any[]> {
  try {
    logger.info("Retrieving documents for query", { query: query.substring(0, 50) })

    // Generate embedding for the query
    const queryEmbedding = generateEmbedding(query)

    // Calculate similarity scores
    const scoredDocs = vectorDb.map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))

    // Sort by similarity score and take top K
    const topDocs = scoredDocs.sort((a, b) => b.score - a.score).slice(0, topK)

    // Return only the necessary information
    return topDocs.map((doc) => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata,
      score: doc.score,
    }))
  } catch (error) {
    logger.error("Error retrieving documents", error)
    return []
  }
}

