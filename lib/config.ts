import { ENV } from "./env-variables"

export const config = {
  apiKeys: {
    openai: ENV.OPENAI_API_KEY || "",
    perplexity: ENV.PPLX_API_KEY || "",
    huggingface: ENV.HUGGINGFACE_API_TOKEN || "",
  },
  models: {
    openai: ENV.OPENAI_MODEL || "gpt-4o",
    perplexity: ENV.PPLX_MODEL || "sonar",
  },
  memory: {
    contextSize: Number.parseInt(ENV.CONTEXT_MEMORY_SIZE || "10", 10),
    maxTokens: Number.parseInt(ENV.MAX_TOKENS || "4000", 10),
  },
  features: {
    enableContinuousLearning: ENV.ENABLE_CONTINUOUS_LEARNING === "true",
    enableAutonomousDebugging: ENV.ENABLE_AUTONOMOUS_DEBUGGING === "true",
    enableClientML: ENV.ENABLE_CLIENT_ML === "true",
  },
  endpoints: {
    dialogueVAE: ENV.DIALOGUE_VAE_ENDPOINT || "",
  },
  temperature: 0.7,
  top_p: 0.9,
  frequency_penalty: 0.5,
  presence_penalty: 0.5,
}

