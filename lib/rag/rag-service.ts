import { ENV } from "../env-variables"
import { logger } from "../logger"
import { vectorStore, type Document } from "./vector-store"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export interface RagResult {
  answer: string
  documents: Document[]
  scores: number[]
  model: string
}

/**
 * RAG (Retrieval Augmented Generation) service
 */
class RagService {
  private enabled: boolean

  constructor() {
    this.enabled = ENV.ENABLE_RAG_PHYSICS
    logger.info("RAG Service initialized", { enabled: this.enabled })
  }

  /**
   * Process a query with RAG
   */
  async query(query: string): Promise<RagResult> {
    try {
      if (!this.enabled) {
        throw new Error("RAG service is disabled")
      }

      logger.info("Processing RAG query", { query: query.substring(0, 50) })

      // Step 1: Retrieve relevant documents
      const { documents, scores } = await vectorStore.search(query)

      if (documents.length === 0) {
        return {
          answer: "I couldn't find any relevant information to answer your query about rag doll physics.",
          documents: [],
          scores: [],
          model: "fallback",
        }
      }

      // Step 2: Format documents for the LLM
      const formattedDocs = documents
        .map(
          (doc, i) =>
            `[Document ${i + 1}] ${doc.metadata.title || "Untitled"}\n${doc.content}\nSource: ${doc.metadata.source || "Unknown"}\n`,
        )
        .join("\n")

      // Step 3: Generate answer using LLM
      const prompt = `
You are an expert in physics simulation and artificial intelligence. Answer the following question based ONLY on the provided documents.

Question: ${query}

Documents:
${formattedDocs}

Instructions:
1. Answer the question based solely on the information in the documents.
2. If the documents don't contain relevant information, say "I don't have enough information to answer this question."
3. Cite the document numbers in your answer, e.g., "According to [Document 1]..."
4. Be concise but thorough.
5. Format your answer in markdown for readability.
`

      let answer: string
      let model: string

      if (ENV.OPENAI_API_KEY) {
        // Use OpenAI if available
        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: prompt,
          temperature: 0.3,
          maxTokens: 1000,
        })

        answer = text
        model = "gpt-4o"
      } else if (ENV.PPLX_API_KEY) {
        // Use Perplexity if available
        const response = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ENV.PPLX_API_KEY}`,
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        })

        if (!response.ok) {
          throw new Error(`Perplexity API error: ${response.status}`)
        }

        const data = await response.json()
        answer = data.choices[0].message.content
        model = "sonar"
      } else {
        // Fallback to a simple answer
        answer =
          "I'm unable to generate a detailed response due to missing API keys. Please configure either OPENAI_API_KEY or PPLX_API_KEY."
        model = "fallback"
      }

      return {
        answer,
        documents,
        scores,
        model,
      }
    } catch (error) {
      logger.error("Error in RAG query", error)
      return {
        answer: `I encountered an error while processing your query: ${error instanceof Error ? error.message : "Unknown error"}`,
        documents: [],
        scores: [],
        model: "error",
      }
    }
  }
}

// Export singleton instance
export const ragService = new RagService()

