import { logger } from "./logger"
import { processWithAdvancedReasoning } from "./advanced-reasoning"
import { localKnowledgeRetrieval } from "./local-knowledge-retrieval"
import { localResponseGenerator } from "./local-response-generator"
import { ENV } from "./env-variables"

// Add this utility function at the top of the file, after imports
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 30000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

interface Message {
  role: string
  content: string
  [key: string]: any
}

interface ChatbotResponse {
  message: {
    role: string
    content: string
  }
  reasoning?: any
  documents?: any[]
  model: string
}

class UnifiedChatbot {
  // Configuration parameters from environment variables
  private config = {
    temperature: ENV.TEMPERATURE,
    maxTokens: ENV.MAX_TOKENS,
    topP: ENV.TOP_P,
    frequencyPenalty: ENV.FREQUENCY_PENALTY,
    presencePenalty: ENV.PRESENCE_PENALTY,
    model: "sentient-1-local",
  }

  async processMessage(messages: Message[], maxTokens?: number): Promise<ChatbotResponse> {
    try {
      // Get the latest user message
      const userMessage = [...messages].reverse().find((m) => m.role === "user")
      if (!userMessage) {
        return this.createErrorResponse("No user message found in the conversation history")
      }

      const query = userMessage.content
      logger.info("Processing query", { query: query.substring(0, 50) })

      // Step 1: Process with advanced reasoning
      let reasoningResult
      try {
        reasoningResult = await processWithAdvancedReasoning(query, messages)
        logger.info("Advanced reasoning completed", { steps: reasoningResult.steps.length })
      } catch (error) {
        logger.warn("Advanced reasoning failed, continuing with fallback reasoning", error)
        reasoningResult = this.createFallbackReasoning(query)
      }

      // Step 2: Retrieve relevant knowledge from local store
      let documents = []
      try {
        documents = await localKnowledgeRetrieval.search(query)
        logger.info("Retrieved relevant documents", { count: documents.length })
      } catch (error) {
        logger.warn("Knowledge retrieval failed, continuing without documents", error)
        // Continue without documents
      }

      // Step 3: Prepare context for response generation
      const context = this.prepareContext(documents, reasoningResult)

      // Step 4: Generate response using local model
      const tokensToUse = maxTokens || this.config.maxTokens

      try {
        // Generate response with local model
        const response = await localResponseGenerator.generateResponse(query, context, messages, {
          temperature: this.config.temperature,
          maxTokens: tokensToUse,
          topP: this.config.topP,
          frequencyPenalty: this.config.frequencyPenalty,
          presencePenalty: this.config.presencePenalty,
        })

        return {
          message: {
            role: "assistant",
            content: response.text,
          },
          reasoning: reasoningResult,
          documents: documents.length > 0 ? documents : undefined,
          model: this.config.model,
        }
      } catch (error) {
        logger.error("Error generating response with local model", error)

        // Create a fallback response based on the context and reasoning
        const fallbackResponse = this.generateFallbackResponse(query, context, reasoningResult)

        return {
          message: {
            role: "assistant",
            content: fallbackResponse,
          },
          reasoning: reasoningResult,
          documents: documents.length > 0 ? documents : undefined,
          model: "sentient-1-fallback",
        }
      }
    } catch (error) {
      logger.error("Critical error in chatbot processing", error)
      return this.createErrorResponse(
        "I encountered an unexpected issue while processing your request. Please try again.",
      )
    }
  }

  private prepareContext(documents: any[], reasoning: any): string {
    let context = ""

    // Add reasoning steps if available
    if (reasoning && reasoning.steps && reasoning.steps.length > 0) {
      context += "Reasoning Analysis:\n"
      reasoning.steps.forEach((step: any, index: number) => {
        context += `${index + 1}. ${step.description}: ${step.result}\n`
      })
      context += `Final Assessment: ${reasoning.finalThought || "Analysis complete."}\n\n`
    }

    // Add relevant documents if available
    if (documents && documents.length > 0) {
      context += "Relevant Information:\n"
      documents.forEach((doc, i) => {
        // Extract and format the document content
        const content = doc.content || "No content available"
        const truncatedContent = content.length > 500 ? content.substring(0, 500) + "... [content truncated]" : content

        context += `[${i + 1}] ${truncatedContent}\n`

        // Add metadata if available
        if (doc.metadata) {
          const source = doc.metadata.source || "Unknown source"
          const relevance = doc.metadata.relevance || doc.score || "Unknown"
          const date = doc.metadata.date || "Unknown date"

          context += `   Source: ${source}\n`
          context += `   Relevance: ${typeof relevance === "number" ? (relevance * 100).toFixed(1) + "%" : relevance}\n`
          context += `   Date: ${date}\n`
        }
        context += "\n"
      })
    }

    return context
  }

  private createErrorResponse(message: string): ChatbotResponse {
    return {
      message: {
        role: "assistant",
        content: message,
      },
      model: "error-recovery",
    }
  }

  private createFallbackReasoning(query: string): any {
    return {
      steps: [
        {
          description: "Query analysis",
          result: `Analyzing the query: "${query.substring(0, 100)}${query.length > 100 ? "..." : ""}"`,
        },
        {
          description: "Topic identification",
          result: "Identifying the main topics and intent of the query",
        },
      ],
      finalThought: "Basic analysis completed using fallback reasoning",
    }
  }

  private generateFallbackResponse(query: string, context: string, reasoning: any): string {
    // Extract key terms from the query
    const keyTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            "what",
            "when",
            "where",
            "which",
            "who",
            "whom",
            "whose",
            "why",
            "how",
            "this",
            "that",
            "these",
            "those",
            "there",
            "their",
            "about",
          ].includes(word),
      )

    // Look for relevant information in the context
    let relevantInfo = ""
    if (context) {
      const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)

      // Find sentences containing key terms
      const relevantSentences = sentences
        .filter((sentence) => {
          const sentenceLower = sentence.toLowerCase()
          return keyTerms.some((term) => sentenceLower.includes(term))
        })
        .slice(0, 3)

      if (relevantSentences.length > 0) {
        relevantInfo = relevantSentences.join(". ") + "."
      }
    }

    // Create a response based on available information
    if (relevantInfo) {
      return `Based on the information I have: ${relevantInfo}\n\nI hope this helps answer your question. If you need more specific information, please let me know.`
    } else {
      return `I understand you're asking about ${keyTerms.slice(0, 3).join(", ")}. While I don't have specific information on this topic, I'd be happy to help if you could provide more details or ask a different question.`
    }
  }

  async generateResponse(query: string, context: string, messages: Message[], config: any): Promise<{ text: string }> {
    try {
      // Your existing code...
      const apiEndpoint = ENV.RESPONSE_GENERATOR_URL

      // Replace any fetch calls with fetchWithTimeout
      const response = await fetchWithTimeout(
        apiEndpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, context, messages, config }),
        },
        60000, // 60 second timeout
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { text: data.response }

      // Rest of your code...
    } catch (error) {
      logger.error("Error generating response", { error })
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

// Export singleton instance
export const unifiedChatbot = new UnifiedChatbot()

