import * as tf from "@tensorflow/tfjs"
import { logger } from "./logger"

// Define model types for better type safety
export type ModelType = "sentiment" | "toxicity" | "classification" | "embedding"

// Define prediction result interfaces
export interface SentimentPrediction {
  score: number // -1 to 1 (negative to positive)
  confidence: number // 0 to 1
}

export interface ToxicityPrediction {
  toxic: boolean
  toxicityScore: number // 0 to 1
  categories: {
    [key: string]: number // Scores for specific categories (hate, threat, etc.)
  }
}

export interface ClassificationPrediction {
  label: string
  score: number
  allLabels: Array<{
    label: string
    score: number
  }>
}

export interface EmbeddingResult {
  embedding: number[]
  dimensions: number
}

// Configuration interface
export interface TensorflowConfig {
  modelBasePath: string
  modelVersions: {
    [key in ModelType]: string
  }
  cacheModels: boolean
  useWebGL: boolean
  logTiming: boolean
}

/**
 * TensorFlow.js client service for model inference
 */
export class TensorflowClient {
  private models: Map<string, tf.GraphModel | tf.LayersModel> = new Map()
  private config: TensorflowConfig
  private initialized = false
  private modelMetadata: Map<string, any> = new Map()

  constructor(config?: Partial<TensorflowConfig>) {
    // Default configuration
    this.config = {
      modelBasePath: "/models",
      modelVersions: {
        sentiment: "v1",
        toxicity: "v1",
        classification: "v1",
        embedding: "v1",
      },
      cacheModels: true,
      useWebGL: true,
      logTiming: true,
      ...config,
    }
  }

  /**
   * Initialize TensorFlow.js and configure backend
   */
  async initialize(): Promise<boolean> {
    if (this.initialized) return true

    try {
      // Configure backend
      if (this.config.useWebGL && tf.getBackend() !== "webgl") {
        await tf.setBackend("webgl")
        await tf.ready()
        logger.info("TensorFlow.js using WebGL backend")
      } else {
        await tf.ready()
        logger.info(`TensorFlow.js using ${tf.getBackend()} backend`)
      }

      this.initialized = true
      return true
    } catch (error) {
      logger.error("Failed to initialize TensorFlow.js", error)
      return false
    }
  }

  /**
   * Load a model by type
   */
  async loadModel(modelType: ModelType): Promise<tf.GraphModel | tf.LayersModel | null> {
    if (!this.initialized) {
      await this.initialize()
    }

    const modelKey = `${modelType}-${this.config.modelVersions[modelType]}`

    // Return cached model if available
    if (this.models.has(modelKey) && this.config.cacheModels) {
      return this.models.get(modelKey) || null
    }

    try {
      const startTime = performance.now()
      const modelPath = `${this.config.modelBasePath}/${modelType}/${this.config.modelVersions[modelType]}/model.json`

      logger.info(`Loading model: ${modelPath}`)

      // Load the model
      const model = await tf.loadGraphModel(modelPath)

      // Load metadata if available
      try {
        const metadataResponse = await fetch(
          `${this.config.modelBasePath}/${modelType}/${this.config.modelVersions[modelType]}/metadata.json`,
        )
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json()
          this.modelMetadata.set(modelKey, metadata)
          logger.info(`Loaded metadata for ${modelType} model`)
        }
      } catch (metadataError) {
        logger.warn(`No metadata found for ${modelType} model`)
      }

      // Cache the model
      if (this.config.cacheModels) {
        this.models.set(modelKey, model)
      }

      const loadTime = performance.now() - startTime
      if (this.config.logTiming) {
        logger.info(`Model ${modelType} loaded in ${loadTime.toFixed(2)}ms`)
      }

      return model
    } catch (error) {
      logger.error(`Failed to load ${modelType} model`, error)
      return null
    }
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<SentimentPrediction | null> {
    try {
      const startTime = performance.now()

      // Load the model
      const model = await this.loadModel("sentiment")
      if (!model) {
        throw new Error("Sentiment model not loaded")
      }

      // Get metadata for preprocessing
      const metadata = this.modelMetadata.get(`sentiment-${this.config.modelVersions.sentiment}`)
      const sequenceLength = metadata?.sequenceLength || 64

      // Preprocess the text
      const inputTensor = await this.preprocessText(text, sequenceLength)

      // Run inference
      const predictions = (await model.predict(inputTensor)) as tf.Tensor

      // Process results
      const [scoreValue, confidenceValue] = await this.processSentimentOutput(predictions)

      // Cleanup tensors
      tf.dispose([inputTensor, predictions])

      const inferenceTime = performance.now() - startTime
      if (this.config.logTiming) {
        logger.info(`Sentiment analysis completed in ${inferenceTime.toFixed(2)}ms`)
      }

      return {
        score: scoreValue,
        confidence: confidenceValue,
      }
    } catch (error) {
      logger.error("Error analyzing sentiment", error)
      return null
    }
  }

  /**
   * Analyze text for toxicity
   */
  async analyzeToxicity(text: string): Promise<ToxicityPrediction | null> {
    try {
      const startTime = performance.now()

      // Load the model
      const model = await this.loadModel("toxicity")
      if (!model) {
        throw new Error("Toxicity model not loaded")
      }

      // Get metadata for preprocessing
      const metadata = this.modelMetadata.get(`toxicity-${this.config.modelVersions.toxicity}`)
      const sequenceLength = metadata?.sequenceLength || 64
      const categories = metadata?.categories || [
        "toxic",
        "severe_toxic",
        "obscene",
        "threat",
        "insult",
        "identity_hate",
      ]

      // Preprocess the text
      const inputTensor = await this.preprocessText(text, sequenceLength)

      // Run inference
      const predictions = (await model.predict(inputTensor)) as tf.Tensor

      // Process results
      const scores = await predictions.data()

      // Cleanup tensors
      tf.dispose([inputTensor, predictions])

      // Create category scores
      const categoryScores: { [key: string]: number } = {}
      categories.forEach((category: string, index: number) => {
        categoryScores[category] = scores[index]
      })

      const toxicityScore = categoryScores["toxic"] || 0

      const inferenceTime = performance.now() - startTime
      if (this.config.logTiming) {
        logger.info(`Toxicity analysis completed in ${inferenceTime.toFixed(2)}ms`)
      }

      return {
        toxic: toxicityScore > 0.5,
        toxicityScore,
        categories: categoryScores,
      }
    } catch (error) {
      logger.error("Error analyzing toxicity", error)
      return null
    }
  }

  /**
   * Classify text into categories
   */
  async classifyText(text: string): Promise<ClassificationPrediction | null> {
    try {
      const startTime = performance.now()

      // Load the model
      const model = await this.loadModel("classification")
      if (!model) {
        throw new Error("Classification model not loaded")
      }

      // Get metadata for preprocessing
      const metadata = this.modelMetadata.get(`classification-${this.config.modelVersions.classification}`)
      const sequenceLength = metadata?.sequenceLength || 64
      const labels = metadata?.labels || []

      // Preprocess the text
      const inputTensor = await this.preprocessText(text, sequenceLength)

      // Run inference
      const predictions = (await model.predict(inputTensor)) as tf.Tensor

      // Process results
      const scores = await predictions.data()

      // Cleanup tensors
      tf.dispose([inputTensor, predictions])

      // Create label scores
      const labelScores = Array.from(scores).map((score, index) => ({
        label: labels[index] || `class_${index}`,
        score,
      }))

      // Sort by score descending
      labelScores.sort((a, b) => b.score - a.score)

      const inferenceTime = performance.now() - startTime
      if (this.config.logTiming) {
        logger.info(`Classification completed in ${inferenceTime.toFixed(2)}ms`)
      }

      return {
        label: labelScores[0].label,
        score: labelScores[0].score,
        allLabels: labelScores,
      }
    } catch (error) {
      logger.error("Error classifying text", error)
      return null
    }
  }

  /**
   * Generate text embedding
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult | null> {
    try {
      const startTime = performance.now()

      // Load the model
      const model = await this.loadModel("embedding")
      if (!model) {
        throw new Error("Embedding model not loaded")
      }

      // Get metadata for preprocessing
      const metadata = this.modelMetadata.get(`embedding-${this.config.modelVersions.embedding}`)
      const sequenceLength = metadata?.sequenceLength || 64

      // Preprocess the text
      const inputTensor = await this.preprocessText(text, sequenceLength)

      // Run inference
      const predictions = (await model.predict(inputTensor)) as tf.Tensor

      // Process results
      const embedding = await predictions.data()

      // Cleanup tensors
      tf.dispose([inputTensor, predictions])

      const inferenceTime = performance.now() - startTime
      if (this.config.logTiming) {
        logger.info(`Embedding generation completed in ${inferenceTime.toFixed(2)}ms`)
      }

      return {
        embedding: Array.from(embedding),
        dimensions: embedding.length,
      }
    } catch (error) {
      logger.error("Error generating embedding", error)
      return null
    }
  }

  /**
   * Preprocess text for model input
   */
  private async preprocessText(text: string, sequenceLength: number): Promise<tf.Tensor> {
    // This is a simplified implementation
    // In a production environment, you would use a proper tokenizer

    // Convert text to lowercase and remove special characters
    const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, "")

    // Split into words
    const words = cleanedText.split(/\s+/).slice(0, sequenceLength)

    // Create a simple bag-of-words representation
    // This is just a placeholder - real models would use proper tokenization
    const inputArray = new Array(sequenceLength).fill(0)

    words.forEach((word, index) => {
      if (index < sequenceLength) {
        // Simple hash function for word to integer
        inputArray[index] = this.hashWord(word) % 10000
      }
    })

    // Create tensor with shape [1, sequenceLength]
    return tf.tensor2d([inputArray], [1, sequenceLength])
  }

  /**
   * Simple hash function for words
   */
  private hashWord(word: string): number {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i)
      hash |= 0 // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Process sentiment model output
   */
  private async processSentimentOutput(predictions: tf.Tensor): Promise<[number, number]> {
    const data = await predictions.data()

    // Assuming the model outputs [score, confidence]
    // Normalize score to range [-1, 1]
    const score = data[0] * 2 - 1
    const confidence = data[1]

    return [score, confidence]
  }

  /**
   * Unload models to free memory
   */
  unloadModels(): void {
    for (const model of this.models.values()) {
      model.dispose()
    }
    this.models.clear()
    this.modelMetadata.clear()
    logger.info("All TensorFlow.js models unloaded")
  }

  /**
   * Get memory info
   */
  getMemoryInfo(): tf.MemoryInfo {
    return tf.memory()
  }
}

// Export singleton instance
export const tensorflowClient = new TensorflowClient()

