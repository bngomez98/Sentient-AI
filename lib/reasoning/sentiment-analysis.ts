import { logger } from "../logger"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface SentimentResult {
  score: number
  label: "positive" | "negative" | "neutral"
  confidence: number
}

/**
 * Sentiment analysis service for understanding emotional context
 */
class SentimentAnalysisService {
  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      logger.info("Analyzing sentiment", { textLength: text.length })

      const prompt = `
Analyze the sentiment of the following text. Consider emotional tone, word choice, and context.

Text: "${text}"

Provide a sentiment analysis with:
1. A sentiment score from -1.0 (very negative) to 1.0 (very positive), with 0.0 being neutral
2. A sentiment label (positive, negative, or neutral)
3. A confidence score from 0.0 to 1.0 indicating how confident you are in this assessment

Format your response as:
Score: [score]
Label: [label]
Confidence: [confidence]
Explanation: [brief explanation of your assessment]
`

      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.1,
        maxTokens: 200,
      })

      // Parse the result
      const scoreMatch = result.match(/Score:\s*([-\d.]+)/i)
      const labelMatch = result.match(/Label:\s*(\w+)/i)
      const confidenceMatch = result.match(/Confidence:\s*([\d.]+)/i)

      const score = scoreMatch ? Number.parseFloat(scoreMatch[1]) : 0
      let label = labelMatch ? labelMatch[1].toLowerCase() : "neutral"
      const confidence = confidenceMatch ? Number.parseFloat(confidenceMatch[1]) : 0.5

      // Normalize score to range from -1 to 1
      const normalizedScore = Math.max(-1, Math.min(1, score))

      // Ensure label is one of the expected values
      if (label !== "positive" && label !== "negative" && label !== "neutral") {
        label = normalizedScore > 0.2 ? "positive" : normalizedScore < -0.2 ? "negative" : "neutral"
      }

      return {
        score: normalizedScore,
        label: label as "positive" | "negative" | "neutral",
        confidence,
      }
    } catch (error) {
      logger.error("Error analyzing sentiment", error)

      // Return neutral sentiment as fallback
      return {
        score: 0,
        label: "neutral",
        confidence: 0.5,
      }
    }
  }

  /**
   * Detect emotional tone in text
   */
  async detectEmotionalTone(text: string): Promise<string[]> {
    try {
      logger.info("Detecting emotional tone", { textLength: text.length })

      const prompt = `
Analyze the emotional tone of the following text. Consider the emotions expressed or implied.

Text: "${text}"

List the top 3 emotions present in this text, in order of prominence.
Format your response as a comma-separated list of emotions (e.g., "curiosity, excitement, concern").
`

      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.2,
        maxTokens: 50,
      })

      // Parse the result
      const emotions = result
        .split(/[,;]/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0)

      return emotions
    } catch (error) {
      logger.error("Error detecting emotional tone", error)
      return ["neutral"]
    }
  }

  /**
   * Analyze subjectivity vs objectivity
   */
  async analyzeSubjectivity(text: string): Promise<number> {
    try {
      logger.info("Analyzing subjectivity", { textLength: text.length })

      const prompt = `
Analyze the following text for subjectivity vs objectivity.

Text: "${text}"

Rate this text on a scale from 0.0 (completely objective) to 1.0 (completely subjective).
Provide only the numerical score.
`

      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        temperature: 0.1,
        maxTokens: 10,
      })

      // Parse the result
      const score = Number.parseFloat(result.trim())

      // Ensure score is in valid range
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score))
    } catch (error) {
      logger.error("Error analyzing subjectivity", error)
      return 0.5 // Default to middle of the range
    }
  }
}

// Export singleton instance
export const sentimentAnalysis = new SentimentAnalysisService()

