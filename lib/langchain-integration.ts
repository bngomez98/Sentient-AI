import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { StructuredOutputParser } from "langchain/output_parsers"
import { config } from "./config"
import { logger } from "./logger"

// Define structured output types
export interface StructuredResponse {
  answer: string
  sources?: string[]
  confidence: number
  reasoning: string[]
}

export class LangChainService {
  private llm: OpenAI

  constructor() {
    this.llm = new OpenAI({
      openAIApiKey: config.apiKeys.openai,
      modelName: "gpt-4o",
      temperature: 0.2,
    })
  }

  async generateStructuredResponse(query: string, context?: string): Promise<StructuredResponse> {
    try {
      // Create a parser for structured output
      const parser = StructuredOutputParser.fromNamesAndDescriptions({
        answer: "The answer to the user's question",
        sources: "Sources or references used to answer the question, if any",
        confidence: "A number between 0 and 1 indicating confidence in the answer",
        reasoning: "A list of reasoning steps taken to arrive at the answer",
      })

      const formatInstructions = parser.getFormatInstructions()

      // Create a prompt template
      const prompt = new PromptTemplate({
        template: `You are an AI assistant providing helpful, accurate, and thoughtful responses.
        
        {context}
        
        User query: {query}
        
        Provide a response in the following format:
        {format_instructions}`,
        inputVariables: ["query", "context"],
        partialVariables: { format_instructions: formatInstructions },
      })

      // Create a chain
      const chain = new LLMChain({ llm: this.llm, prompt })

      // Run the chain
      const result = await chain.call({
        query,
        context: context || "No additional context provided.",
      })

      // Parse the result
      const parsedResult = parser.parse(result.text)

      logger.info("Generated structured response", {
        query,
        confidence: parsedResult.confidence,
      })

      return parsedResult
    } catch (error) {
      logger.error("Error generating structured response", error)

      // Return a fallback response
      return {
        answer: "I encountered an error while processing your request. Please try again.",
        confidence: 0,
        reasoning: ["Error in processing"],
      }
    }
  }

  async generateWithAgents(query: string): Promise<string> {
    // This would be implemented with LangChain agents
    // For now, we'll return a placeholder
    return "Agent-based response would be generated here"
  }
}

// Export singleton instance
export const langchain = new LangChainService()

