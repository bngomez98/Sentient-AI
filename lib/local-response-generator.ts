import { logger } from "./logger"
import { ENV } from "./env-variables"
import { togetherAIClient } from "./together-ai-client"

interface Message {
  role: string
  content: string
}

interface GenerationOptions {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
}

interface GenerationResponse {
  text: string
  tokens: number
  model: string
}

class LocalResponseGenerator {
  /**
   * Generates a response using the local model
   * @param query The user query
   * @param context Additional context for the model
   * @param messages Previous conversation messages
   * @param options Generation options
   * @returns The generated response
   */
  async generateResponse(
    query: string,
    context: string,
    messages: Message[],
    options: GenerationOptions,
  ): Promise<GenerationResponse> {
    try {
      logger.info("Generating response with local model", { queryLength: query.length })

      // Format the messages for the model
      const formattedMessages = this.formatMessages(messages, context)

      // Check if Together.ai API key is available
      if (ENV.TOGETHER_API_KEY) {
        try {
          // Use Together.ai for response generation
          const response = await togetherAIClient.createChatCompletion({
            messages: formattedMessages,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            top_p: options.topP,
            frequency_penalty: options.frequencyPenalty,
            presence_penalty: options.presencePenalty,
            stop: options.stop,
          })

          const generatedText = response.choices[0]?.message?.content || ""

          return {
            text: generatedText,
            tokens: response.usage?.total_tokens || 0,
            model: `together-ai/${ENV.TOGETHER_MODEL}`,
          }
        } catch (error) {
          logger.error("Error generating response with Together.ai", { error })
          // Fall back to local generation if Together.ai fails
        }
      }

      // Fallback to local generation if Together.ai is not available or fails
      return this.generateLocalResponse(query, context, formattedMessages, options)
    } catch (error) {
      logger.error("Error in response generation", { error })
      throw new Error(`Failed to generate response: ${error.message}`)
    }
  }

  /**
   * Formats messages for the model
   * @param messages Previous conversation messages
   * @param context Additional context
   * @returns Formatted messages
   */
  private formatMessages(messages: Message[], context: string): Message[] {
    // Create a copy of the messages
    const formattedMessages = [...messages]

    // Add system message with context if available
    if (context && context.trim().length > 0) {
      formattedMessages.unshift({
        role: "system",
        content: `You are Sentient-1, an advanced AI assistant. Use the following information to help answer the user's question:\n\n${context}`,
      })
    } else {
      formattedMessages.unshift({
        role: "system",
        content: "You are Sentient-1, an advanced AI assistant. Provide helpful, accurate, and concise responses.",
      })
    }

    return formattedMessages
  }

  /**
   * Generates a response using local fallback logic
   * @param query The user query
   * @param context Additional context
   * @param messages Formatted messages
   * @param options Generation options
   * @returns The generated response
   */
  private async generateLocalResponse(
    query: string,
    context: string,
    messages: Message[],
    options: GenerationOptions,
  ): Promise<GenerationResponse> {
    logger.info("Using local fallback response generation")

    // Extract key terms from the query
    const keyTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter((word) => !["what", "when", "where", "which", "who", "whom", "whose", "why", "how"].includes(word))

    // Simple response based on the query
    const response = `I understand you're asking about ${keyTerms.join(", ")}. While I'm currently operating in local fallback mode with limited capabilities, I'd be happy to assist you as best I can. Please let me know if you'd like more specific information.`

    return {
      text: response,
      tokens: response.split(/\s+/).length,
      model: "local-fallback",
    }
  }
}

// Export singleton instance
export const localResponseGenerator = new LocalResponseGenerator()

