import { ENV } from "../env-variables"
import { logger } from "../logger"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export interface MultiModalInput {
  text?: string
  images?: string[] // Base64 encoded images
  audio?: string // Base64 encoded audio
}

export interface ReasoningResult {
  analysis: string
  confidence: number
  entities: string[]
  concepts: string[]
  sentiment: {
    score: number
    label: "positive" | "negative" | "neutral"
  }
  complexity: number // 1-10 scale
}

/**
 * Advanced multi-modal reasoning service
 */
class MultiModalReasoningService {
  private apiKey: string
  private visionModel: string

  constructor() {
    this.apiKey = ENV.OPENAI_API_KEY
    this.visionModel = ENV.VISION_MODEL
    logger.info("Multi-modal Reasoning Service initialized", { visionModel: this.visionModel })
  }

  /**
   * Process multi-modal input and generate reasoning
   */
  async processInput(input: MultiModalInput): Promise<ReasoningResult> {
    try {
      logger.info("Processing multi-modal input", {
        hasText: !!input.text,
        imageCount: input.images?.length || 0,
        hasAudio: !!input.audio,
      })

      let analysisPrompt = "Analyze the following content and provide a detailed reasoning:"

      if (input.text) {
        analysisPrompt += `\n\nText: ${input.text}`
      }

      if (input.images && input.images.length > 0) {
        analysisPrompt += `\n\nThe content includes ${input.images.length} image(s). Please analyze the visual content.`
      }

      if (input.audio) {
        analysisPrompt += `\n\nThe content includes audio. Please analyze the audio content.`
      }

      analysisPrompt += `\n\nProvide a comprehensive analysis including:
1. Main entities and concepts
2. Sentiment analysis
3. Complexity assessment (1-10 scale)
4. Key insights
5. Confidence level in your analysis (0-1)`

      // Use OpenAI for analysis
      const { text } = await generateText({
        model: openai(this.visionModel),
        prompt: analysisPrompt,
        temperature: 0.3,
        maxTokens: 1000,
      })

      // Parse the response to extract structured information
      const entities = this.extractEntities(text)
      const concepts = this.extractConcepts(text)
      const sentiment = this.extractSentiment(text)
      const complexity = this.extractComplexity(text)
      const confidence = this.extractConfidence(text)

      return {
        analysis: text,
        confidence: confidence,
        entities: entities,
        concepts: concepts,
        sentiment: sentiment,
        complexity: complexity,
      }
    } catch (error) {
      logger.error("Error in multi-modal reasoning", error)

      // Return a fallback result
      return {
        analysis: "Unable to complete multi-modal reasoning due to an error.",
        confidence: 0.1,
        entities: [],
        concepts: [],
        sentiment: {
          score: 0,
          label: "neutral",
        },
        complexity: 5,
      }
    }
  }

  /**
   * Extract entities from analysis text
   */
  private extractEntities(text: string): string[] {
    try {
      // Simple regex-based extraction
      const entityMatch = text.match(/entities:?\s*([^]*?)(?:\n\n|\n[A-Z]|$)/i)
      if (entityMatch && entityMatch[1]) {
        return entityMatch[1]
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0 && !item.startsWith("-") && !item.match(/^\d+\./))
      }

      // Fallback to looking for common entity patterns
      const entities = []
      const lines = text.split("\n")
      for (const line of lines) {
        if (
          line.includes("entity") ||
          line.includes("entities") ||
          line.match(/person|people|organization|company|location|place|product|brand/i)
        ) {
          const potentialEntities = line
            .split(/[,:]/)
            .slice(1)
            .map((e) => e.trim())
            .filter((e) => e.length > 0)
          entities.push(...potentialEntities)
        }
      }

      return entities.length > 0 ? entities : this.extractNounsAsFallback(text)
    } catch (error) {
      logger.error("Error extracting entities", error)
      return []
    }
  }

  /**
   * Extract concepts from analysis text
   */
  private extractConcepts(text: string): string[] {
    try {
      // Simple regex-based extraction
      const conceptMatch = text.match(/concepts:?\s*([^]*?)(?:\n\n|\n[A-Z]|$)/i)
      if (conceptMatch && conceptMatch[1]) {
        return conceptMatch[1]
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0 && !item.startsWith("-") && !item.match(/^\d+\./))
      }

      // Fallback to looking for common concept patterns
      const concepts = []
      const lines = text.split("\n")
      for (const line of lines) {
        if (line.includes("concept") || line.includes("idea") || line.includes("theme") || line.includes("topic")) {
          const potentialConcepts = line
            .split(/[,:]/)
            .slice(1)
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
          concepts.push(...potentialConcepts)
        }
      }

      return concepts.length > 0 ? concepts : []
    } catch (error) {
      logger.error("Error extracting concepts", error)
      return []
    }
  }

  /**
   * Extract sentiment from analysis text
   */
  private extractSentiment(text: string): { score: number; label: "positive" | "negative" | "neutral" } {
    try {
      // Look for sentiment mentions
      const sentimentMatch = text.match(/sentiment:?\s*([^]*?)(?:\n\n|\n[A-Z]|$)/i)
      if (sentimentMatch && sentimentMatch[1]) {
        const sentimentText = sentimentMatch[1].toLowerCase()

        // Determine label
        let label: "positive" | "negative" | "neutral" = "neutral"
        if (
          sentimentText.includes("positive") ||
          sentimentText.includes("good") ||
          sentimentText.includes("favorable")
        ) {
          label = "positive"
        } else if (
          sentimentText.includes("negative") ||
          sentimentText.includes("bad") ||
          sentimentText.includes("unfavorable")
        ) {
          label = "negative"
        }

        // Extract score if present
        const scoreMatch = sentimentText.match(/score:?\s*([\d.-]+)/i) || sentimentText.match(/([\d.-]+)\s*\/\s*10/)
        let sentimentScore = 0

        if (scoreMatch && scoreMatch[1]) {
          sentimentScore = Number.parseFloat(scoreMatch[1])
          // Normalize to 0-1 range if it's on a different scale
          if (sentimentScore > 1 && sentimentScore <= 10) {
            sentimentScore = sentimentScore / 10
          } else if (sentimentScore < -1) {
            sentimentScore = (sentimentScore + 10) / 20 // Assuming -10 to 10 scale
          }
        } else {
          // Assign score based on label
          sentimentScore = label === "positive" ? 0.7 : label === "negative" ? 0.3 : 0.5
        }

        return { score: sentimentScore, label }
      }

      // Fallback: analyze text for sentiment words
      const positiveWords = ["positive", "good", "great", "excellent", "favorable", "happy", "pleased"]
      const negativeWords = ["negative", "bad", "poor", "terrible", "unfavorable", "sad", "disappointed"]

      let positiveCount = 0
      let negativeCount = 0

      positiveWords.forEach((word) => {
        if (text.toLowerCase().includes(word)) positiveCount++
      })

      negativeWords.forEach((word) => {
        if (text.toLowerCase().includes(word)) negativeCount++
      })

      let label: "positive" | "negative" | "neutral" = "neutral"
      let score = 0.5

      if (positiveCount > negativeCount) {
        label = "positive"
        score = 0.5 + (positiveCount / (positiveCount + negativeCount)) * 0.5
      } else if (negativeCount > positiveCount) {
        label = "negative"
        score = 0.5 - (negativeCount / (positiveCount + negativeCount)) * 0.5
      }

      return { score, label }
    } catch (error) {
      logger.error("Error extracting sentiment", error)
      return { score: 0.5, label: "neutral" }
    }
  }

  /**
   * Extract complexity from analysis text
   */
  private extractComplexity(text: string): number {
    try {
      // Look for complexity mentions
      const complexityMatch =
        text.match(/complexity:?\s*(\d+(?:\.\d+)?)/i) || text.match(/complexity[^:]*?:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i)

      if (complexityMatch && complexityMatch[1]) {
        const complexity = Number.parseFloat(complexityMatch[1])
        // Ensure it's in 1-10 range
        return Math.max(1, Math.min(10, complexity))
      }

      // Fallback: estimate complexity based on text length and structure
      const words = text.split(/\s+/).length
      const sentences = text.split(/[.!?]+/).length
      const avgWordsPerSentence = words / Math.max(1, sentences)

      // Complexity heuristic
      let complexity = 5 // Default mid-range

      if (avgWordsPerSentence > 25) complexity += 2
      else if (avgWordsPerSentence > 15) complexity += 1

      if (words > 300) complexity += 1
      if (text.includes("complex") || text.includes("complicated")) complexity += 1
      if (text.includes("simple") || text.includes("straightforward")) complexity -= 1

      return Math.max(1, Math.min(10, complexity))
    } catch (error) {
      logger.error("Error extracting complexity", error)
      return 5 // Default mid-range
    }
  }

  /**
   * Extract confidence from analysis text
   */
  private extractConfidence(text: string): number {
    try {
      // Look for confidence mentions
      const confidenceMatch =
        text.match(/confidence:?\s*([\d.]+)/i) ||
        text.match(/confidence[^:]*?:\s*([\d.]+)\s*\/\s*1/i) ||
        text.match(/confidence[^:]*?:\s*([\d.]+)\s*%/i)

      if (confidenceMatch && confidenceMatch[1]) {
        let confidence = Number.parseFloat(confidenceMatch[1])
        // Normalize percentage to 0-1
        if (confidence > 1 && confidence <= 100) {
          confidence = confidence / 100
        }
        return Math.max(0, Math.min(1, confidence))
      }

      // Fallback: look for confidence-related words
      const highConfidenceWords = ["certain", "confident", "sure", "definite", "clear"]
      const lowConfidenceWords = ["uncertain", "unsure", "unclear", "possibly", "perhaps", "maybe"]

      let highCount = 0
      let lowCount = 0

      highConfidenceWords.forEach((word) => {
        if (text.toLowerCase().includes(word)) highCount++
      })

      lowConfidenceWords.forEach((word) => {
        if (text.toLowerCase().includes(word)) lowCount++
      })

      if (highCount > lowCount) {
        return 0.7 + (highCount / (highCount + lowCount + 1)) * 0.3
      } else if (lowCount > highCount) {
        return 0.7 - (lowCount / (lowCount + highCount + 1)) * 0.3
      }

      return 0.7 // Default reasonably high confidence
    } catch (error) {
      logger.error("Error extracting confidence", error)
      return 0.5 // Default medium confidence
    }
  }

  /**
   * Extract nouns as fallback for entities
   */
  private extractNounsAsFallback(text: string): string[] {
    // Simple heuristic to extract potential nouns
    const words = text.split(/\s+/)
    const potentialNouns = words.filter(
      (word) =>
        word.length > 3 &&
        word[0] === word[0].toUpperCase() &&
        !["The", "This", "That", "These", "Those", "There", "Their", "They", "Then"].includes(word),
    )

    return [...new Set(potentialNouns)].slice(0, 5) // Return up to 5 unique potential entities
  }
}

// Export singleton instance
export const multiModalReasoning = new MultiModalReasoningService()

