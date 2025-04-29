import { logger } from "@/lib/logger"
import { ENV } from "@/lib/env-variables"

interface SentimentResult {
  score: number
  confidence: number
}

class ClientML {
  private isEnabled: boolean
  private modelLoaded = false
  private loadingPromise: Promise<void> | null = null

  constructor() {
    this.isEnabled = ENV.ENABLE_CLIENT_ML === "true"
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    if (!this.isEnabled) {
      logger.info("Client ML is disabled")
      return { score: 0, confidence: 0 }
    }

    try {
      // Simple rule-based sentiment analysis as fallback
      const positiveWords = [
        "good",
        "great",
        "excellent",
        "amazing",
        "wonderful",
        "fantastic",
        "happy",
        "love",
        "like",
        "best",
        "positive",
        "awesome",
        "perfect",
        "nice",
      ]
      const negativeWords = [
        "bad",
        "terrible",
        "awful",
        "horrible",
        "poor",
        "worst",
        "hate",
        "dislike",
        "negative",
        "disappointed",
        "disappointing",
        "failure",
        "wrong",
        "problem",
      ]

      const words = text.toLowerCase().match(/\b(\w+)\b/g) || []

      let positiveCount = 0
      let negativeCount = 0

      words.forEach((word) => {
        if (positiveWords.includes(word)) positiveCount++
        if (negativeWords.includes(word)) negativeCount++
      })

      const totalWords = words.length
      const positiveScore = positiveCount / Math.max(totalWords, 1)
      const negativeScore = negativeCount / Math.max(totalWords, 1)

      const score = positiveScore - negativeScore
      const confidence = Math.min(((positiveCount + negativeCount) / Math.max(totalWords, 1)) * 2, 1)

      return {
        score: Number.parseFloat(score.toFixed(2)),
        confidence: Number.parseFloat(confidence.toFixed(2)),
      }
    } catch (error) {
      logger.error("Error in sentiment analysis", error)
      return { score: 0, confidence: 0 }
    }
  }
}

export const clientML = new ClientML()
