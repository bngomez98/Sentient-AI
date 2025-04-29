import { ENV } from "../env-variables"
import { logger } from "../logger"
import { embeddingService } from "./embeddings"

export interface Document {
  id: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

export interface SearchResult {
  documents: Document[]
  scores: number[]
}

/**
 * Advanced vector store service for RAG
 */
class VectorStore {
  private provider: string
  private indexName: string
  private dimensions: number
  private apiKey: string
  private apiUrl: string

  // In-memory store for local provider
  private localStore: Document[] = []

  constructor() {
    this.provider = ENV.RAG_PROVIDER
    this.indexName = ENV.VECTOR_INDEX_NAME
    this.dimensions = ENV.VECTOR_DIMENSIONS
    this.apiKey = ENV.VECTOR_DB_API_KEY
    this.apiUrl = ENV.VECTOR_DB_URL

    // Initialize with sample data for demo purposes
    if (this.provider === "local") {
      this.initializeLocalStore()
    }

    logger.info("Vector Store initialized", {
      provider: this.provider,
      indexName: this.indexName,
      dimensions: this.dimensions,
    })
  }

  /**
   * Search for similar documents
   */
  async search(query: string, limit: number = ENV.RAG_TOP_K): Promise<SearchResult> {
    try {
      logger.info("Searching vector store", { query: query.substring(0, 50), limit })

      // Generate embedding for the query
      const { embedding } = await embeddingService.generateEmbedding(query)

      if (this.provider === "local") {
        return this.localSearch(embedding, limit)
      } else {
        // For external providers, implement API calls here
        try {
          const response = await fetch(`${this.apiUrl}/search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              vector: embedding,
              top_k: limit,
              namespace: this.indexName,
            }),
          })

          if (!response.ok) {
            throw new Error(`Vector DB API error: ${response.status}`)
          }

          const data = await response.json()

          return {
            documents: data.matches.map((match: any) => ({
              id: match.id,
              content: match.metadata.text || match.metadata.content,
              metadata: match.metadata,
            })),
            scores: data.matches.map((match: any) => match.score),
          }
        } catch (error) {
          logger.warn(`Error with external vector store: ${error}. Falling back to local search.`)
          return this.localSearch(embedding, limit)
        }
      }
    } catch (error) {
      logger.error("Error searching vector store", error)
      return { documents: [], scores: [] }
    }
  }

  /**
   * Add a document to the vector store
   */
  async addDocument(document: Document): Promise<boolean> {
    try {
      // Generate embedding if not provided
      if (!document.embedding) {
        const { embedding } = await embeddingService.generateEmbedding(document.content)
        document.embedding = embedding
      }

      if (this.provider === "local") {
        this.localStore.push(document)
        return true
      } else {
        // For external providers, implement API calls here
        try {
          const response = await fetch(`${this.apiUrl}/upsert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              vectors: [
                {
                  id: document.id,
                  values: document.embedding,
                  metadata: {
                    ...document.metadata,
                    text: document.content,
                  },
                },
              ],
              namespace: this.indexName,
            }),
          })

          if (!response.ok) {
            throw new Error(`Vector DB API error: ${response.status}`)
          }

          return true
        } catch (error) {
          logger.warn(`Error with external vector store: ${error}. Falling back to local store.`)
          this.localStore.push(document)
          return true
        }
      }
    } catch (error) {
      logger.error("Error adding document to vector store", error)
      return false
    }
  }

  /**
   * Local vector search implementation
   */
  private localSearch(queryEmbedding: number[], limit: number): SearchResult {
    if (this.localStore.length === 0) {
      return { documents: [], scores: [] }
    }

    // Calculate cosine similarity for each document
    const results = this.localStore.map((doc) => {
      const embedding = doc.embedding || []
      const similarity = this.cosineSimilarity(queryEmbedding, embedding)
      return { document: doc, score: similarity }
    })

    // Sort by similarity (descending) and take top results
    const sorted = results.sort((a, b) => b.score - a.score).slice(0, limit)

    return {
      documents: sorted.map((item) => item.document),
      scores: sorted.map((item) => item.score),
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
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
  }

  /**
   * Initialize local store with sample data
   */
  private async initializeLocalStore() {
    const sampleDocuments: Omit<Document, "embedding">[] = [
      {
        id: "doc1",
        content:
          "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence displayed by humans or other animals. AI applications include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, automated decision-making, and competing at the highest level in strategic game systems.",
        metadata: { source: "Wikipedia", category: "AI", title: "Artificial Intelligence Overview" },
      },
      {
        id: "doc2",
        content:
          "Machine learning (ML) is a field of inquiry devoted to understanding and building methods that 'learn', that is, methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as training data, in order to make predictions or decisions without being explicitly programmed to do so.",
        metadata: { source: "Wikipedia", category: "AI", title: "Machine Learning" },
      },
      {
        id: "doc3",
        content:
          "Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data. The goal is a computer capable of 'understanding' the contents of documents.",
        metadata: { source: "Wikipedia", category: "AI", title: "Natural Language Processing" },
      },
      {
        id: "doc4",
        content:
          "Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Learning can be supervised, semi-supervised or unsupervised. Deep-learning architectures such as deep neural networks, deep belief networks, deep reinforcement learning, recurrent neural networks and convolutional neural networks have been applied to fields including computer vision, speech recognition, natural language processing, machine translation, bioinformatics, drug design, medical image analysis, climate science, material inspection and board game programs, where they have produced results comparable to and in some cases surpassing human expert performance.",
        metadata: { source: "Wikipedia", category: "AI", title: "Deep Learning" },
      },
      {
        id: "doc5",
        content:
          "Reinforcement learning (RL) is an area of machine learning concerned with how intelligent agents ought to take actions in an environment in order to maximize the notion of cumulative reward. Reinforcement learning is one of three basic machine learning paradigms, alongside supervised learning and unsupervised learning.",
        metadata: { source: "Wikipedia", category: "AI", title: "Reinforcement Learning" },
      },
      {
        id: "doc6",
        content:
          "Retrieval-Augmented Generation (RAG) is an AI framework that combines the strengths of traditional information retrieval systems with generative large language models. RAG enhances LLMs by providing them with relevant external knowledge, improving factual accuracy and reducing hallucinations.",
        metadata: { source: "Google Cloud", category: "AI", title: "RAG Overview" },
      },
      {
        id: "doc7",
        content:
          "RAG operates in two main steps: retrieval, where relevant information is fetched from external sources, and generation, where this information is incorporated into the LLM's context to produce more accurate and informative responses. This approach grounds the LLM's output in factual information.",
        metadata: { source: "Google Cloud", category: "AI", title: "How RAG Works" },
      },
      {
        id: "doc8",
        content:
          "The key advantages of RAG include access to fresh information beyond the LLM's training data, improved factual grounding to reduce hallucinations, and the ability to incorporate private or domain-specific knowledge that wasn't part of the model's training.",
        metadata: { source: "Google Cloud", category: "AI", title: "RAG Benefits" },
      },
      {
        id: "doc9",
        content:
          "Vector databases are crucial for efficient RAG implementations. They store documents as embeddings in a high-dimensional space, allowing for fast and accurate retrieval based on semantic similarity. This enables the system to find the most relevant information for a given query.",
        metadata: { source: "Google Cloud", category: "AI", title: "Vector Databases in RAG" },
      },
      {
        id: "doc10",
        content:
          "Multi-modal reasoning is the ability of AI systems to process and understand information across different modalities such as text, images, audio, and video. This capability allows AI to form a more comprehensive understanding of complex scenarios by integrating information from multiple sources and types of data.",
        metadata: { source: "AI Research Journal", category: "AI", title: "Multi-modal Reasoning" },
      },
    ]

    // Add each document with its embedding
    for (const doc of sampleDocuments) {
      await this.addDocument(doc as Document)
    }

    logger.info(`Initialized local vector store with ${sampleDocuments.length} documents`)
  }
}

// Export singleton instance
export const vectorStore = new VectorStore()
