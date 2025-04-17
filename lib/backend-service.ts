import { logger } from "./logger"
import { ENV } from "./env-variables"
import { togetherAIClient } from "./together-ai-client"

interface Message {
  role: string
  content: string
}

interface ChatResponse {
  message: Message
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * Backend service for handling AI model interactions
 */
export class BackendService {
  private static instance: BackendService

  private constructor() {
    logger.info("Backend service initialized")
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): BackendService {
    if (!BackendService.instance) {
      BackendService.instance = new BackendService()
    }
    return BackendService.instance
  }

  /**
   * Process a chat message using the appropriate AI model
   */
  async processChat(messages: Message[]): Promise<ChatResponse> {
    try {
      logger.info("Processing chat request", { messageCount: messages.length })

      // Use Together.ai if available
      if (ENV.TOGETHER_API_KEY) {
        return await this.processWithTogetherAI(messages)
      }

      // Fallback to local processing
      return await this.processLocally(messages)
    } catch (error) {
      logger.error("Error processing chat", { error })
      throw new Error(`Failed to process chat: ${error.message}`)
    }
  }

  /**
   * Process messages with Together.ai
   */
  private async processWithTogetherAI(messages: Message[]): Promise<ChatResponse> {
    try {
      logger.info("Using Together.ai for processing")

      const response = await togetherAIClient.createChatCompletion({
        messages,
        temperature: ENV.TEMPERATURE,
        max_tokens: ENV.MAX_TOKENS,
        top_p: ENV.TOP_P,
        frequency_penalty: ENV.FREQUENCY_PENALTY,
        presence_penalty: ENV.PRESENCE_PENALTY,
      })

      return {
        message: response.choices[0].message,
        model: ENV.TOGETHER_MODEL,
        usage: response.usage,
      }
    } catch (error) {
      logger.error("Together.ai processing failed, falling back to local", { error })
      return this.processLocally(messages)
    }
  }

  /**
   * Process messages locally (fallback)
   */
  private async processLocally(messages: Message[]): Promise<ChatResponse> {
    logger.info("Using local processing")

    // Simple echo response for testing
    const lastMessage = messages[messages.length - 1]

    return {
      message: {
        role: "assistant",
        content: `[Local fallback] I received your message: "${lastMessage.content.substring(0, 50)}..."`,
      },
      model: "local-fallback",
    }
  }

  /**
   * Check the health of backend services
   */
  async checkHealth(): Promise<Record<string, any>> {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {},
    }

    // Check Together.ai
    if (ENV.TOGETHER_API_KEY) {
      try {
        const available = await togetherAIClient.checkAvailability()
        health.services.togetherAI = { status: available ? "ok" : "error" }
      } catch (error) {
        health.services.togetherAI = { status: "error", message: error.message }
      }
    } else {
      health.services.togetherAI = { status: "not-configured" }
    }

    // Add more service checks here

    // Overall status is error if any service is in error state
    const hasErrors = Object.values(health.services).some((service: any) => service.status === "error")

    if (hasErrors) {
      health.status = "degraded"
    }

    return health
  }
}

// Export singleton instance
export const backendService = BackendService.getInstance()

