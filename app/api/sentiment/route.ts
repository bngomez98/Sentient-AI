import { NextResponse } from "next/server"

// Simple sentiment analysis function
function basicSentimentAnalysis(text: string) {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "love",
    "happy",
    "best",
    "fantastic",
    "wonderful",
    "enjoy",
    "like",
    "positive",
    "beautiful",
    "perfect",
    "awesome",
    "brilliant",
    "delightful",
    "pleasant",
    "glad",
    "satisfied",
    "impressive",
    "exceptional",
    "superb",
    "outstanding",
  ]
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "horrible",
    "hate",
    "sad",
    "worst",
    "poor",
    "negative",
    "dislike",
    "disappointed",
    "unfortunate",
    "ugly",
    "boring",
    "annoying",
    "frustrating",
    "unpleasant",
    "angry",
    "upset",
    "inferior",
    "mediocre",
    "dreadful",
    "disgusting",
    "offensive",
  ]

  const words = text.toLowerCase().split(/\W+/)
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++
    if (negativeWords.includes(word)) negativeCount++
  })

  const sentiment = positiveCount >= negativeCount ? "positive" : "negative"
  const total = positiveCount + negativeCount || 1
  const confidence = sentiment === "positive" ? positiveCount / total : negativeCount / total

  return {
    text,
    sentiment,
    confidence: Math.max(0.5, confidence), // Minimum confidence of 0.5
    sentiment_score: sentiment === "positive" ? confidence : -confidence,
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Perform basic sentiment analysis
    const result = basicSentimentAnalysis(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

