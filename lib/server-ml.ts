import { config } from "./config"
import { logger } from "./logger"

export interface ModelPrediction {
  result: any
  confidence: number
  processingTime: number
}

export interface ModelTrainingResult {
  success: boolean
  accuracy: number
  loss: number
  epochs: number
  trainingTime: number
}

export class ServerMLService {
  async predict(modelName: string, input: any): Promise<ModelPrediction | null> {
    try {
      const startTime = Date.now()

      // Determine which endpoint to use based on model name
      const endpoint = modelName.includes("tensorflow") ? config.endpoints.tensorflow : config.endpoints.pytorch

      // Make prediction request
      const response = await fetch(`${endpoint}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          input,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Prediction failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      logger.info(`Prediction completed in ${processingTime}ms`, {
        model: modelName,
        processingTime,
      })

      return {
        result: data.result,
        confidence: data.confidence,
        processingTime,
      }
    } catch (error) {
      logger.error(`Error making prediction with model ${modelName}`, error)
      return null
    }
  }

  async trainModel(
    modelName: string,
    trainingData: any[],
    validationData: any[],
    hyperparams: Record<string, any> = {},
  ): Promise<ModelTrainingResult | null> {
    try {
      // Determine which endpoint to use based on model name
      const endpoint = modelName.includes("tensorflow") ? config.endpoints.tensorflow : config.endpoints.pytorch

      // Make training request
      const response = await fetch(`${endpoint}/train`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          trainingData,
          validationData,
          hyperparams,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Training failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()

      logger.info(`Model training completed`, {
        model: modelName,
        accuracy: result.accuracy,
        epochs: result.epochs,
        trainingTime: result.trainingTime,
      })

      return result
    } catch (error) {
      logger.error(`Error training model ${modelName}`, error)
      return null
    }
  }

  async getModelInfo(modelName: string): Promise<any | null> {
    try {
      // Determine which endpoint to use based on model name
      const endpoint = modelName.includes("tensorflow") ? config.endpoints.tensorflow : config.endpoints.pytorch

      // Make info request
      const response = await fetch(`${endpoint}/info/${modelName}`)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get model info: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      logger.error(`Error getting info for model ${modelName}`, error)
      return null
    }
  }
}

// Export singleton instance
export const serverML = new ServerMLService()

