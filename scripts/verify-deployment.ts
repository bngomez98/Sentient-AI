import { config } from "../lib/config"
import { logger } from "../lib/logger"

/**
 * Verifies that the deployment environment is properly configured
 */
async function verifyDeployment() {
  logger.info("Starting deployment verification")

  // Check API keys
  const apiKeyStatus = {
    perplexity: !!config.apiKeys.perplexity,
    openai: !!config.apiKeys.openai,
    huggingface: !!config.apiKeys.huggingface,
  }

  if (!apiKeyStatus.perplexity && !apiKeyStatus.openai) {
    logger.error("No LLM API keys configured", {
      message: "Either Perplexity or OpenAI API key must be configured",
    })
    process.exit(1)
  }

  // Check feature flags
  const featureFlags = {
    ethicalFiltering: config.features.ethicalFiltering,
    continuousLearning: config.features.continuousLearning,
    autonomousDebugging: config.features.autonomousDebugging,
    clientMl: config.clientMl.enabled,
  }

  logger.info("Feature flags configuration", featureFlags)

  // Check endpoints
  if (config.endpoints.dialogueVae) {
    logger.info("Dialogue VAE endpoint configured", {
      endpoint: config.endpoints.dialogueVae,
    })
  } else {
    logger.warn("Dialogue VAE endpoint not configured", {
      message: "Contextual understanding features will use fallback mode",
    })
  }

  // Verify API connectivity
  try {
    // Test health endpoint
    const response = await fetch("http://localhost:3000/api/health")
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`)
    }

    const healthData = await response.json()
    logger.info("Health check successful", healthData)

    // Verify API connectivity
    const apiConnectivity = {
      perplexity: healthData.apis.perplexity?.available || false,
      openai: healthData.apis.openai?.available || false,
      huggingface: healthData.apis.huggingface?.available || false,
      dialogueVae: healthData.apis.dialogueVae?.available || false,
    }

    logger.info("API connectivity status", apiConnectivity)

    // Check if at least one LLM API is available
    if (!apiConnectivity.perplexity && !apiConnectivity.openai) {
      logger.error("No LLM API is accessible", {
        message: "Check API keys and network connectivity",
      })
    } else {
      logger.info("Deployment verification successful", {
        message: "Application is properly configured and ready for use",
      })
    }
  } catch (error) {
    logger.error("Deployment verification failed", error)
    process.exit(1)
  }
}

// Run verification if executed directly
if (require.main === module) {
  verifyDeployment().catch((error) => {
    console.error("Verification failed:", error)
    process.exit(1)
  })
}

export { verifyDeployment }

