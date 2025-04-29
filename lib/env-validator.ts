import { logger } from "./logger"

/**
 * Validates environment variables and logs their status
 */
export function validateEnvironmentVariables() {
  const requiredVariables = [
    { name: "PPLX_API_KEY", value: process.env.PPLX_API_KEY, required: false },
    { name: "OPENAI_API_KEY", value: process.env.OPENAI_API_KEY, required: false },
    { name: "HUGGINGFACE_API_TOKEN", value: process.env.HUGGINGFACE_API_TOKEN, required: false },
  ]

  // At least one of these API keys must be present
  const apiKeyPresent = requiredVariables.some(
    (v) => (v.name === "PPLX_API_KEY" || v.name === "OPENAI_API_KEY") && !!v.value,
  )

  if (!apiKeyPresent) {
    logger.error("Missing required API keys", {
      message: "Either PPLX_API_KEY or OPENAI_API_KEY must be provided",
    })
  }

  // Log the status of all environment variables
  const featureFlags = [
    { name: "ENABLE_ETHICAL_FILTERING", value: process.env.ENABLE_ETHICAL_FILTERING, default: "true" },
    { name: "ENABLE_CONTINUOUS_LEARNING", value: process.env.ENABLE_CONTINUOUS_LEARNING, default: "false" },
    { name: "ENABLE_AUTONOMOUS_DEBUGGING", value: process.env.ENABLE_AUTONOMOUS_DEBUGGING, default: "false" },
    { name: "ENABLE_CLIENT_ML", value: process.env.ENABLE_CLIENT_ML, default: "false" },
    { name: "ENABLE_LOGGING", value: process.env.ENABLE_LOGGING, default: "true" },
  ]

  const configValues = [
    {
      name: "DIALOGUE_VAE_ENDPOINT",
      value: process.env.DIALOGUE_VAE_ENDPOINT,
      default: "https://api-inference.huggingface.co/models/sentient-labs/dialogue-vae",
    },
    { name: "CONTEXT_MEMORY_SIZE", value: process.env.CONTEXT_MEMORY_SIZE, default: "50" },
    { name: "MAX_TOKENS", value: process.env.MAX_TOKENS, default: "4000" },
    { name: "LOG_LEVEL", value: process.env.LOG_LEVEL, default: "info" },
  ]

  // Log API key status (presence only, not the actual values)
  logger.info("API key configuration", {
    perplexityConfigured: !!process.env.PPLX_API_KEY,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    huggingfaceConfigured: !!process.env.HUGGINGFACE_API_TOKEN,
  })

  // Log feature flag status
  logger.info(
    "Feature flag configuration",
    Object.fromEntries(featureFlags.map((flag) => [flag.name, flag.value === undefined ? flag.default : flag.value])),
  )

  // Log other configuration values
  logger.info(
    "Configuration values",
    Object.fromEntries(
      configValues.map((config) => [config.name, config.value === undefined ? config.default : config.value]),
    ),
  )

  return apiKeyPresent
}
