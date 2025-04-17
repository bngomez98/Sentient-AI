import * as tf from "@tensorflow/tfjs"
import { logger } from "./logger"

// Model metadata interface
export interface ModelMetadata {
  name: string
  version: string
  description: string
  inputShape: number[]
  outputShape: number[]
  labels?: string[]
  dateCreated: string
  framework: "tensorflow" | "pytorch"
  preprocessor?: string
  accuracy?: number
  size?: number
}

/**
 * Manages TensorFlow.js models with caching and versioning
 */
export class ModelManager {
  private models: Map<string, tf.GraphModel | tf.LayersModel> = new Map()
  private metadata: Map<string, ModelMetadata> = new Map()
  private modelBasePath: string
  private modelLoadPromises: Map<string, Promise<tf.GraphModel | tf.LayersModel>> = new Map()

  constructor(modelBasePath = "/models") {
    this.modelBasePath = modelBasePath
  }

  /**
   * Load a model with caching
   */
  async loadModel(modelName: string, version = "latest"): Promise<tf.GraphModel | tf.LayersModel> {
    const modelKey = `${modelName}-${version}`

    // Return cached model if available
    if (this.models.has(modelKey)) {
      return this.models.get(modelKey)!
    }

    // Return existing load promise if model is currently loading
    if (this.modelLoadPromises.has(modelKey)) {
      return this.modelLoadPromises.get(modelKey)!
    }

    // Create and store the load promise
    const loadPromise = this.loadModelInternal(modelName, version)
    this.modelLoadPromises.set(modelKey, loadPromise)

    try {
      const model = await loadPromise
      this.models.set(modelKey, model)
      return model
    } finally {
      // Clean up the promise reference
      this.modelLoadPromises.delete(modelKey)
    }
  }

  /**
   * Internal model loading logic
   */
  private async loadModelInternal(modelName: string, version: string): Promise<tf.GraphModel | tf.LayersModel> {
    const startTime = performance.now()
    const modelPath = `${this.modelBasePath}/${modelName}/${version}`

    logger.info(`Loading model: ${modelName} (version: ${version})`)

    try {
      // Try to load as GraphModel first
      const model = await tf.loadGraphModel(`${modelPath}/model.json`)
      logger.info(`Loaded GraphModel: ${modelName} (version: ${version})`)

      // Load metadata if available
      await this.loadModelMetadata(modelName, version)

      const loadTime = performance.now() - startTime
      logger.info(`Model ${modelName} loaded in ${loadTime.toFixed(2)}ms`)

      return model
    } catch (graphModelError) {
      // If GraphModel fails, try loading as LayersModel
      try {
        logger.warn(`Failed to load as GraphModel, trying LayersModel: ${graphModelError.message}`)
        const model = await tf.loadLayersModel(`${modelPath}/model.json`)
        logger.info(`Loaded LayersModel: ${modelName} (version: ${version})`)

        // Load metadata if available
        await this.loadModelMetadata(modelName, version)

        const loadTimeLayers = performance.now() - startTime
        logger.info(`Model ${modelName} loaded in ${loadTimeLayers.toFixed(2)}ms`)

        return model
      } catch (layersModelError) {
        logger.error(`Failed to load model ${modelName}`, layersModelError)
        throw new Error(`Failed to load model ${modelName}: ${layersModelError.message}`)
      }
    }
  }

  /**
   * Load model metadata
   */
  private async loadModelMetadata(modelName: string, version: string): Promise<ModelMetadata | null> {
    const modelKey = `${modelName}-${version}`

    // Return cached metadata if available
    if (this.metadata.has(modelKey)) {
      return this.metadata.get(modelKey)!
    }

    try {
      const metadataPath = `${this.modelBasePath}/${modelName}/${version}/metadata.json`
      const response = await fetch(metadataPath)

      if (!response.ok) {
        logger.warn(`No metadata found for model ${modelName} (version: ${version})`)
        return null
      }

      const metadata = await response.json()
      this.metadata.set(modelKey, metadata)
      logger.info(`Loaded metadata for model ${modelName} (version: ${version})`)

      return metadata
    } catch (error) {
      logger.warn(`Failed to load metadata for model ${modelName}`, error)
      return null
    }
  }

  /**
   * Get model metadata
   */
  getModelMetadata(modelName: string, version = "latest"): ModelMetadata | null {
    const modelKey = `${modelName}-${version}`
    return this.metadata.get(modelKey) || null
  }

  /**
   * Check if model is loaded
   */
  isModelLoaded(modelName: string, version = "latest"): boolean {
    const modelKey = `${modelName}-${version}`
    return this.models.has(modelKey)
  }

  /**
   * Unload a specific model to free memory
   */
  unloadModel(modelName: string, version = "latest"): void {
    const modelKey = `${modelName}-${version}`
    const model = this.models.get(modelKey)

    if (model) {
      model.dispose()
      this.models.delete(modelKey)
      logger.info(`Unloaded model: ${modelName} (version: ${version})`)
    }
  }

  /**
   * Unload all models to free memory
   */
  unloadAllModels(): void {
    for (const [key, model] of this.models.entries()) {
      model.dispose()
      logger.info(`Unloaded model: ${key}`)
    }

    this.models.clear()
    logger.info("All models unloaded")
  }

  /**
   * Get memory info
   */
  getMemoryInfo(): tf.MemoryInfo {
    return tf.memory()
  }
}

// Export singleton instance
export const modelManager = new ModelManager()

