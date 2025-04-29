import { logger } from "./logger"
import { embeddingService } from "./embedding-service"

interface Document {
  id: string
  content: string
  metadata?: any
}

interface SearchResult {
  documents: Document[]
  scores: number[]
}

/**
 * Vector store for similarity search
 */
class VectorStore {
  private documents: Document[] = []
  private embeddings: Map<string, number[]> = new Map()
  private initialized = false

  constructor() {
    this.initialize()
  }

  /**
   * Initialize the vector store
   */
  private async initialize(): Promise<void> {
    try {
      logger.info("Initializing vector store")

      // Add some sample documents
      await this.addSampleDocuments()

      this.initialized = true
      logger.info("Vector store initialized successfully", { documentCount: this.documents.length })
    } catch (error) {
      logger.error("Failed to initialize vector store", error)
      this.initialized = false
    }
  }

  /**
   * Add a document to the vector store
   */
  async addDocument(document: Document): Promise<void> {
    try {
      // Generate embedding for the document
      const embedding = await embeddingService.embedText(document.content)

      // Store the document and its embedding
      this.documents.push(document)
      this.embeddings.set(document.id, embedding)

      logger.info("Document added to vector store", { id: document.id })
    } catch (error) {
      logger.error("Error adding document to vector store", error)
      throw error
    }
  }

  /**
   * Search for similar documents
   */
  async search(query: string, queryEmbedding?: number[]): Promise<SearchResult> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.initialized) {
        throw new Error("Vector store not initialized")
      }

      logger.info("Searching vector store", { query: query.substring(0, 50) })

      // Generate embedding for the query if not provided
      const embedding = queryEmbedding || (await embeddingService.embedText(query))

      // Calculate similarity scores for all documents
      const results = this.documents.map((doc) => {
        const docEmbedding = this.embeddings.get(doc.id)
        if (!docEmbedding) {
          return { doc, score: 0 }
        }

        const score = embeddingService.cosineSimilarity(embedding, docEmbedding)
        return { doc, score }
      })

      // Sort by score and take top results
      const topResults = results.sort((a, b) => b.score - a.score).slice(0, 5)

      return {
        documents: topResults.map((result) => result.doc),
        scores: topResults.map((result) => result.score),
      }
    } catch (error) {
      logger.error("Error searching vector store", error)
      return { documents: [], scores: [] }
    }
  }

  /**
   * Add sample documents to the vector store
   */
  private async addSampleDocuments(): Promise<void> {
    const sampleDocuments: Document[] = [
      {
        id: "doc1",
        content:
          "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.",
        metadata: {
          source: "AI Knowledge Base",
          date: "2023-01-15",
          category: "Technology",
        },
      },
      {
        id: "doc2",
        content:
          "Machine Learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. It focuses on the development of computer programs that can access data and use it to learn for themselves.",
        metadata: {
          source: "AI Knowledge Base",
          date: "2023-01-15",
          category: "Technology",
        },
      },
      {
        id: "doc3",
        content:
          "Neural Networks are computing systems inspired by the biological neural networks that constitute animal brains. Such systems learn to perform tasks by considering examples, generally without being programmed with task-specific rules.",
        metadata: {
          source: "AI Knowledge Base",
          date: "2023-01-15",
          category: "Technology",
        },
      },
      {
        id: "doc4",
        content:
          "Deep Learning is a subset of machine learning that uses neural networks with many layers (hence 'deep') to analyze various factors of data. It is capable of learning unsupervised from data that is unstructured or unlabeled.",
        metadata: {
          source: "AI Knowledge Base",
          date: "2023-01-15",
          category: "Technology",
        },
      },
      {
        id: "doc5",
        content:
          "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics.",
        metadata: {
          source: "AI Knowledge Base",
          date: "2023-01-15",
          category: "Technology",
        },
      },
    ]

    // Add each document to the vector store
    for (const doc of sampleDocuments) {
      await this.addDocument(doc)
    }
  }
}

// Export singleton instance
export const vectorStore = new VectorStore()
