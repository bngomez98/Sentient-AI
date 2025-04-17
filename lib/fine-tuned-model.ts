import { logger } from "./logger"
import { embeddingService } from "./embedding-service"
import { pretrainedData } from "./pretraining-data"

interface InferenceOptions {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

interface InferenceResult {
  text: string
  tokens: number
  modelUsed: string
}

/**
 * Fine-tuned model service for local inference
 */
class FineTunedModel {
  private initialized = false
  private modelName = "sentient-1-local"

  constructor() {
    this.initialize()
  }

  /**
   * Initialize the model
   */
  private async initialize(): Promise<void> {
    try {
      logger.info("Initializing fine-tuned model")

      // Simulate loading the model
      await new Promise((resolve) => setTimeout(resolve, 200))

      this.initialized = true
      logger.info("Fine-tuned model initialized successfully")
    } catch (error) {
      logger.error("Failed to initialize fine-tuned model", error)
      this.initialized = false
    }
  }

  /**
   * Generate text using the fine-tuned model
   */
  async generateText(prompt: string, context = "", options: Partial<InferenceOptions> = {}): Promise<InferenceResult> {
    try {
      if (!this.initialized) {
        await this.initialize()
      }

      if (!this.initialized) {
        throw new Error("Fine-tuned model not initialized")
      }

      logger.info("Generating text with fine-tuned model", {
        promptLength: prompt.length,
        contextLength: context.length,
      })

      // Default options
      const inferenceOptions: InferenceOptions = {
        temperature: options.temperature ?? 0.7,
        maxTokens: options.maxTokens ?? 1024,
        topP: options.topP ?? 0.9,
        frequencyPenalty: options.frequencyPenalty ?? 0.5,
        presencePenalty: options.presencePenalty ?? 0.5,
      }

      // Generate embeddings for the prompt
      const promptEmbedding = await embeddingService.embedText(prompt)

      // Find relevant knowledge from pretraining data
      const relevantKnowledge = await this.retrieveRelevantKnowledge(prompt, promptEmbedding)

      // Generate response
      const response = this.generateResponse(prompt, context, relevantKnowledge, inferenceOptions)

      return {
        text: response.text,
        tokens: response.tokens,
        modelUsed: this.modelName,
      }
    } catch (error) {
      logger.error("Error generating text with fine-tuned model", error)
      throw error
    }
  }

  /**
   * Retrieve relevant knowledge from pretraining data
   */
  private async retrieveRelevantKnowledge(prompt: string, promptEmbedding: number[]): Promise<string> {
    // Score each pretraining data entry for relevance
    const scoredData = await Promise.all(
      pretrainedData.map(async (data) => {
        // Generate embedding for the content if not already cached
        const contentEmbedding = await embeddingService.embedText(data.content)

        // Calculate similarity score
        const similarityScore = embeddingService.cosineSimilarity(promptEmbedding, contentEmbedding)

        // Add keyword matching score
        let keywordScore = 0
        if (data.keywords) {
          data.keywords.forEach((keyword) => {
            if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
              keywordScore += 0.1
            }
          })
        }

        // Total score is a combination of embedding similarity and keyword matching
        const totalScore = similarityScore + keywordScore

        return { data, score: totalScore }
      }),
    )

    // Sort by score and take top entries
    const topEntries = scoredData.sort((a, b) => b.score - a.score).slice(0, 3)

    // Combine the content from top entries
    return topEntries.map((entry) => entry.data.content).join("\n\n")
  }

  /**
   * Generate a response based on prompt, context, and knowledge
   */
  private generateResponse(
    prompt: string,
    context: string,
    knowledge: string,
    options: InferenceOptions,
  ): { text: string; tokens: number } {
    // Analyze the prompt to determine the appropriate response style
    const promptAnalysis = this.analyzePrompt(prompt)

    // Combine knowledge and context
    const combinedContext = `${knowledge}\n\n${context}`.trim()

    // Generate response based on prompt analysis, context, and knowledge
    let response = ""

    // Add appropriate introduction based on prompt type
    if (promptAnalysis.isQuestion) {
      if (promptAnalysis.isTechnical) {
        response = "Based on my technical analysis and training data, "
      } else if (promptAnalysis.isConceptual) {
        response = "From a conceptual perspective, drawing on my training, "
      } else if (promptAnalysis.isFactual) {
        response = "According to my knowledge base and training, "
      } else if (promptAnalysis.isCreative) {
        response = "Drawing on creative patterns from my training data: "
      } else {
        response = "After analyzing your question and consulting my training data, "
      }
    } else {
      response = "Based on my training and fine-tuning, "
    }

    // Generate main content based on prompt complexity
    if (promptAnalysis.complexity === "high") {
      response += this.generateDetailedResponse(prompt, combinedContext, promptAnalysis)
    } else if (promptAnalysis.complexity === "medium") {
      response += this.generateStandardResponse(prompt, combinedContext, promptAnalysis)
    } else {
      response += this.generateConciseResponse(prompt, combinedContext, promptAnalysis)
    }

    // Estimate token count
    const tokens = Math.ceil(response.length / 4)

    // Ensure we don't exceed max tokens
    if (tokens > options.maxTokens) {
      // Truncate response to fit within max tokens
      const maxChars = options.maxTokens * 4
      response = response.substring(0, maxChars) + "..."
    }

    return {
      text: response,
      tokens: Math.min(tokens, options.maxTokens),
    }
  }

  /**
   * Analyze the prompt to determine the best response approach
   */
  private analyzePrompt(prompt: string): any {
    // Determine if prompt is a question
    const isQuestion = prompt.includes("?")

    // Determine complexity
    const complexity = prompt.length > 200 ? "high" : prompt.length > 100 ? "medium" : "low"

    // Determine if technical
    const isTechnical =
      /\b(code|programming|algorithm|function|api|technical|software|hardware|computer|technology)\b/i.test(prompt)

    // Determine if conceptual
    const isConceptual = /\b(concept|theory|philosophy|idea|explain|understand|meaning|definition)\b/i.test(prompt)

    // Determine if factual
    const isFactual = /\b(what is|who is|when did|where is|how many|fact|history|information about)\b/i.test(prompt)

    // Determine if creative
    const isCreative = /\b(create|generate|write|design|imagine|story|creative|fiction)\b/i.test(prompt)

    // Determine primary category
    let category = "general"
    if (isTechnical) category = "technical"
    else if (isConceptual) category = "conceptual"
    else if (isFactual) category = "factual"
    else if (isCreative) category = "creative"

    return {
      isQuestion,
      complexity,
      isTechnical,
      isConceptual,
      isFactual,
      isCreative,
      category,
    }
  }

  /**
   * Generate a detailed response for complex prompts
   */
  private generateDetailedResponse(prompt: string, context: string, promptAnalysis: any): string {
    // Extract key concepts from the prompt
    const concepts = this.extractKeyConcepts(prompt)

    // Structure a detailed response
    let response = "I'll provide a comprehensive analysis based on my training data.\n\n"

    // Add introduction to the topic
    response += this.generateIntroduction(concepts, context)

    // Add main explanation with multiple perspectives
    response += this.generateMainExplanation(concepts, context, promptAnalysis)

    // Add examples or applications
    response += this.generateExamplesOrApplications(concepts, context)

    // Add conclusion
    response += this.generateConclusion(concepts, context)

    return response
  }

  /**
   * Generate a standard response for medium complexity prompts
   */
  private generateStandardResponse(prompt: string, context: string, promptAnalysis: any): string {
    // Extract key concepts from the prompt
    const concepts = this.extractKeyConcepts(prompt)

    // Structure a standard response
    let response = ""

    // Add brief introduction
    response += this.generateBriefIntroduction(concepts, context)

    // Add main explanation
    response += this.generateCoreExplanation(concepts, context, promptAnalysis)

    // Add a brief example if relevant
    if (Math.random() > 0.5) {
      // Randomly decide whether to include an example
      response += this.generateBriefExample(concepts, context)
    }

    return response
  }

  /**
   * Generate a concise response for simple prompts
   */
  private generateConciseResponse(prompt: string, context: string, promptAnalysis: any): string {
    // Extract the most important concept
    const mainConcept = this.extractKeyConcepts(prompt)[0] || ""

    // Generate a direct, concise answer
    let response = ""

    // Find the most relevant sentence in the context
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)
    const mostRelevantSentence = this.findMostRelevantSentence(sentences, prompt)

    if (mostRelevantSentence) {
      response = mostRelevantSentence + ". "
    }

    // Add a brief explanation
    response += this.generateBriefExplanation(mainConcept, context, promptAnalysis)

    return response
  }

  /**
   * Extract key concepts from a prompt
   */
  private extractKeyConcepts(prompt: string): string[] {
    // Remove common words and extract key terms
    const commonWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "about",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "can",
      "could",
      "will",
      "would",
      "shall",
      "should",
      "may",
      "might",
      "must",
    ]

    const words = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3 && !commonWords.includes(word))

    // Count word frequency
    const wordCounts = new Map<string, number>()
    words.forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    })

    // Sort by frequency and return top concepts
    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry) => entry[0])
  }

  /**
   * Find the most relevant sentence in a list of sentences
   */
  private findMostRelevantSentence(sentences: string[], prompt: string): string {
    if (sentences.length === 0) return ""

    const promptWords = prompt
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3)

    // Score each sentence
    const scoredSentences = sentences.map((sentence) => {
      let score = 0
      promptWords.forEach((word) => {
        if (sentence.toLowerCase().includes(word)) {
          score += 1
        }
      })
      return { sentence, score }
    })

    // Return the highest scoring sentence
    const topSentence = scoredSentences.sort((a, b) => b.score - a.score)[0]
    return topSentence ? topSentence.sentence : sentences[0]
  }

  /**
   * Generate an introduction paragraph
   */
  private generateIntroduction(concepts: string[], context: string): string {
    // Extract relevant sentences from context
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)

    // Find sentences that contain the key concepts
    const relevantSentences = sentences
      .filter((sentence) => {
        return concepts.some((concept) => sentence.toLowerCase().includes(concept))
      })
      .slice(0, 3)

    // Combine into an introduction
    if (relevantSentences.length > 0) {
      return relevantSentences.join(". ") + ".\n\n"
    }

    // Fallback introduction if no relevant sentences found
    return `Let's explore ${concepts.slice(0, 3).join(", ")} in detail based on my training data.\n\n`
  }

  /**
   * Generate a brief introduction
   */
  private generateBriefIntroduction(concepts: string[], context: string): string {
    // Find the most relevant sentence
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)
    const relevantSentence = this.findMostRelevantSentence(sentences, concepts.join(" "))

    if (relevantSentence) {
      return relevantSentence + ".\n\n"
    }

    // Fallback
    return `Regarding ${concepts.slice(0, 2).join(" and ")}:\n\n`
  }

  /**
   * Generate the main explanation with multiple perspectives
   */
  private generateMainExplanation(concepts: string[], context: string, promptAnalysis: any): string {
    let explanation = ""

    // Add information from context
    const paragraphs = context.split("\n\n").filter((p) => p.trim().length > 0)

    if (paragraphs.length > 0) {
      // Score paragraphs by relevance to concepts
      const scoredParagraphs = paragraphs.map((paragraph) => {
        let score = 0
        concepts.forEach((concept) => {
          const regex = new RegExp(`\\b${concept}\\b`, "gi")
          const matches = paragraph.match(regex)
          if (matches) {
            score += matches.length
          }
        })
        return { paragraph, score }
      })

      // Take top 2-3 paragraphs
      const topParagraphs = scoredParagraphs
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(3, paragraphs.length))
        .map((item) => item.paragraph)

      explanation += topParagraphs.join("\n\n") + "\n\n"
    } else {
      // Fallback if no paragraphs found
      explanation += `The concepts of ${concepts.join(", ")} are interconnected and can be understood from multiple perspectives based on my training data.\n\n`
    }

    return explanation
  }

  /**
   * Generate a core explanation for standard responses
   */
  private generateCoreExplanation(concepts: string[], context: string, promptAnalysis: any): string {
    // Extract the most relevant paragraph
    const paragraphs = context.split("\n\n").filter((p) => p.trim().length > 0)

    if (paragraphs.length > 0) {
      // Find the most relevant paragraph
      const scoredParagraphs = paragraphs.map((paragraph) => {
        let score = 0
        concepts.forEach((concept) => {
          if (paragraph.toLowerCase().includes(concept)) {
            score += 1
          }
        })
        return { paragraph, score }
      })

      const topParagraph = scoredParagraphs.sort((a, b) => b.score - a.score)[0]

      if (topParagraph && topParagraph.score > 0) {
        return topParagraph.paragraph + "\n\n"
      }
    }

    // Fallback
    return `The key aspects to understand about ${concepts.slice(0, 2).join(" and ")} are their fundamental properties and relationships, as reflected in my training data.\n\n`
  }

  /**
   * Generate examples or applications
   */
  private generateExamplesOrApplications(concepts: string[], context: string): string {
    // Look for examples in the context
    const exampleMatch = context.match(/Examples?:?\s*([\s\S]*?)(?=\n\n|$)/)

    if (exampleMatch && exampleMatch[1]) {
      return "Here are some examples from my training data:\n" + exampleMatch[1] + "\n\n"
    }

    // Look for sentences containing "for example", "such as", etc.
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)
    const exampleSentences = sentences
      .filter((sentence) => {
        return /\b(for example|such as|instance|illustrated by|demonstrated by|exemplified by)\b/i.test(sentence)
      })
      .slice(0, 2)

    if (exampleSentences.length > 0) {
      return "To illustrate based on my training:\n" + exampleSentences.join(". ") + ".\n\n"
    }

    // Fallback
    return `This can be applied in various contexts related to ${concepts[0] || "this topic"}, as suggested by patterns in my training data.\n\n`
  }

  /**
   * Generate a brief example
   */
  private generateBriefExample(concepts: string[], context: string): string {
    // Look for example sentences
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)
    const exampleSentence = sentences.find((sentence) => {
      return /\b(for example|such as|instance|illustrated by|e\.g\.)\b/i.test(sentence)
    })

    if (exampleSentence) {
      return "For example, based on my training: " + exampleSentence + ".\n\n"
    }

    return ""
  }

  /**
   * Generate a conclusion
   */
  private generateConclusion(concepts: string[], context: string): string {
    // Look for concluding sentences with words like "therefore", "in conclusion", etc.
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)
    const concludingSentences = sentences
      .filter((sentence) => {
        return /\b(therefore|thus|in conclusion|to summarize|in summary|overall|ultimately|in essence)\b/i.test(
          sentence,
        )
      })
      .slice(0, 2)

    if (concludingSentences.length > 0) {
      return "In conclusion, drawing from my training: " + concludingSentences.join(". ") + "."
    }

    // Fallback
    return `In summary, understanding ${concepts.slice(0, 3).join(", ")} provides valuable insights into this domain and its applications, as reflected in my training data.`
  }

  /**
   * Generate a brief explanation
   */
  private generateBriefExplanation(concept: string, context: string, promptAnalysis: any): string {
    // Extract a couple of relevant sentences
    const sentences = context.split(/[.!?]/).filter((s) => s.trim().length > 0)

    // Find sentences containing the concept
    const relevantSentences = sentences
      .filter((sentence) => {
        return sentence.toLowerCase().includes(concept)
      })
      .slice(0, 2)

    if (relevantSentences.length > 0) {
      return relevantSentences.join(". ") + "."
    }

    // Fallback
    return `This relates to fundamental principles in this domain, as reflected in my training data.`
  }
}

// Export singleton instance
export const fineTunedModel = new FineTunedModel()

