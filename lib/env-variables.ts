/**
 * Safely get an environment variable as a boolean
 */
export function getBoolEnv(key: string, fallback = false): boolean {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return fallback
  }

  const value = process.env[key]
  if (value === undefined) {
    return fallback
  }

  return value === "true" || value === "1"
}

/**
 * Safely get an environment variable with a fallback value
 */
export function getEnvValue(key: string, fallback = ""): string {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return fallback
  }

  const value = process.env[key]
  return value !== undefined ? value : fallback
}

/**
 * Format the model name for display
 */
export function formatModelName(modelName: string | undefined): string {
  if (!modelName) return "AI Assistant"

  // Remove vendor prefixes if present
  const cleanName = (modelName || "").replace("openai/", "").replace("anthropic/", "").replace("google/", "")

  // Capitalize and clean up
  return cleanName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  PPLX_API_KEY: process.env.PPLX_API_KEY || "",
  HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN || "",
  VERCEL_API_KEY: process.env.VERCEL_API_KEY || "",
  ENABLE_ETHICAL_FILTERING: process.env.ENABLE_ETHICAL_FILTERING === "true",
  ENABLE_CONTINUOUS_LEARNING: process.env.ENABLE_CONTINUOUS_LEARNING === "true",
  ENABLE_AUTONOMOUS_DEBUGGING: process.env.ENABLE_AUTONOMOUS_DEBUGGING === "true",
  ENABLE_CLIENT_ML: process.env.ENABLE_CLIENT_ML === "true",
  ENABLE_ADVANCED_OCR: process.env.ENABLE_ADVANCED_OCR === "true",
  ENABLE_AUDIO_TRANSCRIPTION: process.env.ENABLE_AUDIO_TRANSCRIPTION === "true",
  ENABLE_RAG_PHYSICS: process.env.ENABLE_RAG_PHYSICS === "true",
  ENABLE_VISION: process.env.ENABLE_VISION === "true",
  ENABLE_AUDIO: process.env.ENABLE_AUDIO === "true",
  ENABLE_LOGGING: process.env.ENABLE_LOGGING === "true",
  RAG_PROVIDER: process.env.RAG_PROVIDER || "local",
  RAG_EMBEDDING_MODEL: process.env.RAG_EMBEDDING_MODEL || "openai:text-embedding-3-large",
  RAG_CHUNK_SIZE: process.env.RAG_CHUNK_SIZE || "1000",
  RAG_CHUNK_OVERLAP: process.env.RAG_CHUNK_OVERLAP || "200",
  RAG_TOP_K: Number(process.env.RAG_TOP_K || "5"),
  VECTOR_DB_URL: process.env.VECTOR_DB_URL || "http://localhost:8000",
  VECTOR_DB_API_KEY: process.env.VECTOR_DB_API_KEY || "",
  VECTOR_DIMENSIONS: Number(process.env.VECTOR_DIMENSIONS || "1536"),
  VECTOR_INDEX_NAME: process.env.VECTOR_INDEX_NAME || "sentient-knowledge",
  DIALOGUE_VAE_ENDPOINT:
    process.env.DIALOGUE_VAE_ENDPOINT || "https://api-inference.huggingface.co/models/sentient-labs/dialogue-vae",
  CONTEXT_MEMORY_SIZE: Number(process.env.CONTEXT_MEMORY_SIZE || "100"),
  MAX_TOKENS: Number(process.env.MAX_TOKENS || "4000"),
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB || "50"),
  FILE_PROCESSING_TIMEOUT: Number(process.env.FILE_PROCESSING_TIMEOUT || "30000"),
  FILE_PROCESSING_RETRIES: Number(process.env.FILE_PROCESSING_RETRIES || "2"),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  TEMPERATURE: Number(process.env.TEMPERATURE || "0.7"),
  TOP_P: Number(process.env.TOP_P || "0.9"),
  TOP_K: Number(process.env.TOP_K || "40"),
  FREQUENCY_PENALTY: Number(process.env.FREQUENCY_PENALTY || "0.7"),
  PRESENCE_PENALTY: Number(process.env.PRESENCE_PENALTY || "0.0"),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o",
  PPLX_MODEL: process.env.PPLX_MODEL || "sonar",
  VISION_MODEL: process.env.VISION_MODEL || "gpt-4o",
  AUDIO_MODEL: process.env.AUDIO_MODEL || "whisper-large-v3",
  PHYSICS_GRAVITY: Number(process.env.PHYSICS_GRAVITY || "9.8"),
  PHYSICS_TIMESTEP: Number(process.env.PHYSICS_TIMESTEP || "0.01666"),
  PHYSICS_ITERATIONS: Number(process.env.PHYSICS_ITERATIONS || "10"),
  PHYSICS_DAMPING: Number(process.env.PHYSICS_DAMPING || "0.1"),
  PHYSICS_SIMULATION_QUALITY: process.env.PHYSICS_SIMULATION_QUALITY || "medium",
  NODE_ENV: process.env.NODE_ENV || "development",
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY || "",
  TOGETHER_MODEL: process.env.TOGETHER_MODEL || "mistralai/Mixtral-8x7B-Instruct-v0.1",
}

