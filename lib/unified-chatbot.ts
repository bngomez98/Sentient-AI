import { logger } from "./logger"
import { ENV } from "./env-variables"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { vectorStore } from "../rag/vector-store"
import { multiModalReasoning } from "../reasoning/multi-modal-reasoning"
import { pretrainingService } from "../pretraining/pretraining-service"

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  images?: string[] // Base64 encoded images
  audio?: string // Base64 encoded audio
}

export interface ChatbotResponse {
  message: ChatMessage
  documents?: any[]
  reasoning?: any
  model: string
}

/**
 * Unified chatbot service with advanced capabilities
 */
class UnifiedChatbot {
  private openaiApiKey: string
  private pplxApiKey: string
  private huggingfaceToken: string
  private temperature: number
  private topP: number
  private topK: number
  private frequencyPenalty: number
  private presencePenalty: number
  private maxTokens: number
  private openaiModel: string
  private pplxModel: string

  constructor() {
    this.openaiApiKey = ENV.OPENAI_API_KEY
    this.pplxApiKey = ENV.PPLX_API_KEY
    this.huggingfaceToken = ENV.HUGGINGFACE_API_TOKEN
    this.temperature = Number(ENV.TEMPERATURE)
    this.topP = Number(ENV.TOP_P)
    this.topK = Number(ENV.TOP_K)
    this.frequencyPenalty = Number(ENV.FREQUENCY_PENALTY)
    this.presencePenalty = Number(ENV.PRESENCE_PENALTY)
    this.maxTokens = Number(ENV.MAX_TOKENS)
    this.openaiModel = ENV.OPENAI_MODEL
    this.pplxModel = ENV.PPLX_MODEL

    logger.info("Unified Chatbot initialized", {
      hasOpenAI: !!this.openaiApiKey,
      hasPPLX: !!this.pplxApiKey,
      hasHuggingFace: !!this.huggingfaceToken,
      temperature: this.temperature,
      openaiModel: this.openaiModel,
      pplxModel: this.pplxModel,
    })
  }

  /**
   * Process a user message and generate a response
   */
  async processMessage(messages: ChatMessage[]): Promise<ChatbotResponse> {
    try {
      // Get the latest user message
      const latestUserMessage = [...messages].reverse().find((m) => m.role === "user")

      if (!latestUserMessage) {
        throw new Error("No user message found")
      }

      const query = latestUserMessage.content
      logger.info("Processing query", { query: query.substring(0, 50) })

      // Step 1: Apply multi-modal reasoning if images or audio are present
      let reasoningResult
      if (latestUserMessage.images?.length || latestUserMessage.audio) {
        reasoningResult = await multiModalReasoning.processInput({
          text: query,
          images: latestUserMessage.images,
          audio: latestUserMessage.audio,
        })

        logger.info("Multi-modal reasoning completed", {
          confidence: reasoningResult.confidence,
          complexity: reasoningResult.complexity,
        })
      }

      // Step 2: Retrieve relevant documents
      const { documents, scores } = await vectorStore.search(query)

      logger.info("Retrieved relevant documents", {
        documentCount: documents.length,
        topScore: documents.length > 0 ? scores[0] : 0,
      })

      // Step 3: Apply pretraining enhancement
      const enhancedMessages = await pretrainingService.enhanceWithPretraining(messages, query)

      logger.info("Applied pretraining enhancement", {
        exampleCount: enhancedMessages.length,
      })

      // Step 4: Generate response using LLM with fallback mechanisms
      let responseContent: string
      let model: string

      // Try OpenAI if available
      if (this.openaiApiKey) {
        try {
          logger.info("Attempting to use OpenAI API")
          const { text } = await generateText({
            model: openai(this.openaiModel),
            messages: enhancedMessages.map((m) => ({ role: m.role, content: m.content })),
            temperature: this.temperature,
            maxTokens: this.maxTokens,
          })
          responseContent = text
          model = this.openaiModel
          logger.info("Successfully used OpenAI API", { model })
        } catch (error) {
          logger.error("OpenAI API failed, falling back to local processing", {
            error: error instanceof Error ? error.message : "Unknown error",
          })
          responseContent = `I encountered an error with OpenAI: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Using local processing.`
          model = "local-fallback"
        }
      }
      // If no OpenAI API key, use local processing
      else {
        logger.warn("No OpenAI API key available, using local processing")
        responseContent = "I'm operating in local mode due to missing API keys."
        model = "local-fallback"
      }

      return {
        message: {
          role: "assistant",
          content: responseContent,
        },
        documents: documents.length > 0 ? documents : undefined,
        reasoning: reasoningResult,
        model,
      }
    } catch (error) {
      logger.error("Error in chatbot processing", error instanceof Error ? error.message : "Unknown error")
      return {
        message: {
          role: "assistant",
          content: `I encountered an error while processing your message. Please try again.`,
        },
        model: "error",
      }
    }
  }
}

// Export singleton instance
export const unifiedChatbot = new UnifiedChatbot()
