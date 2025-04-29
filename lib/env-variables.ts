// Simple environment variables module optimized for serverless functions

// Helper function to get environment variable with fallback
export function getEnvValue(key: string, fallback = ""): string {
  return process.env[key] || fallback
}

// Helper function to get boolean environment variable
export function getBoolEnv(key: string, fallback = "false"): boolean {
  const value = getEnvValue(key, fallback).toLowerCase()
  return value === "true" || value === "1" || value === "yes"
}

// Helper function to get numeric environment variable
export function getNumEnv(key: string, fallback = 0): number {
  const value = getEnvValue(key, String(fallback))
  const num = Number.parseFloat(value)
  return isNaN(num) ? fallback : num
}

// Helper function to get array environment variable
export function getArrayEnv(key: string, fallback: string[] = []): string[] {
  const value = getEnvValue(key)
  try {
    return JSON.parse(value)
  } catch (error) {
    return fallback
  }
}

// Export ENV object
export const ENV = {
  OPENAI_API_KEY: getEnvValue("OPENAI_API_KEY"),
  PPLX_API_KEY: getEnvValue("PPLX_API_KEY"),
  HUGGINGFACE_API_TOKEN: getEnvValue("HUGGINGFACE_API_TOKEN"),
  ENABLE_ETHICAL_FILTERING: getBoolEnv("ENABLE_ETHICAL_FILTERING"),
  ENABLE_CONTINUOUS_LEARNING: getBoolEnv("ENABLE_CONTINUOUS_LEARNING"),
  ENABLE_AUTONOMOUS_DEBUGGING: getBoolEnv("ENABLE_AUTONOMOUS_DEBUGGING"),
  ENABLE_CLIENT_ML: getBoolEnv("ENABLE_CLIENT_ML"),
  ENABLE_ADVANCED_OCR: getBoolEnv("ENABLE_ADVANCED_OCR"),
  ENABLE_AUDIO_TRANSCRIPTION: getBoolEnv("ENABLE_AUDIO_TRANSCRIPTION"),
  ENABLE_RAG_PHYSICS: getBoolEnv("ENABLE_RAG_PHYSICS"),
  ENABLE_VISION: getBoolEnv("ENABLE_VISION"),
  ENABLE_AUDIO: getBoolEnv("ENABLE_AUDIO"),
  ENABLE_LOGGING: getBoolEnv("ENABLE_LOGGING"),
  RAG_PROVIDER: getEnvValue("RAG_PROVIDER", "local"),
  RAG_EMBEDDING_MODEL: getEnvValue("RAG_EMBEDDING_MODEL", "openai:text-embedding-3-large"),
  RAG_CHUNK_SIZE: getNumEnv("RAG_CHUNK_SIZE", 1000),
  RAG_CHUNK_OVERLAP: getNumEnv("RAG_CHUNK_OVERLAP", 200),
  RAG_TOP_K: getNumEnv("RAG_TOP_K", 5),
  VECTOR_DB_URL: getEnvValue("VECTOR_DB_URL"),
  VECTOR_DB_API_KEY: getEnvValue("VECTOR_DB_API_KEY"),
  VECTOR_DIMENSIONS: getNumEnv("VECTOR_DIMENSIONS", 1536),
  VECTOR_INDEX_NAME: getEnvValue("VECTOR_INDEX_NAME", "sentient-knowledge"),
  DIALOGUE_VAE_ENDPOINT: getEnvValue("DIALOGUE_VAE_ENDPOINT"),
  CONTEXT_MEMORY_SIZE: getNumEnv("CONTEXT_MEMORY_SIZE", 100),
  MAX_TOKENS: getNumEnv("MAX_TOKENS", 4000),
  MAX_FILE_SIZE_MB: getNumEnv("MAX_FILE_SIZE_MB", 50),
  FILE_PROCESSING_TIMEOUT: getNumEnv("FILE_PROCESSING_TIMEOUT", 30000),
  FILE_PROCESSING_RETRIES: getNumEnv("FILE_PROCESSING_RETRIES", 2),
  LOG_LEVEL: getEnvValue("LOG_LEVEL", "info"),
  TEMPERATURE: getEnvValue("TEMPERATURE", "0.7"),
  TOP_P: getEnvValue("TOP_P", "0.9"),
  TOP_K: getNumEnv("TOP_K", 40),
  FREQUENCY_PENALTY: getNumEnv("FREQUENCY_PENALTY", 0.7),
  PRESENCE_PENALTY: getNumEnv("PRESENCE_PENALTY", 0.0),
  OPENAI_MODEL: getEnvValue("OPENAI_MODEL", "gpt-4o"),
  PPLX_MODEL: getEnvValue("PPLX_MODEL", "sonar"),
  VISION_MODEL: getEnvValue("VISION_MODEL", "gpt-4o"),
  AUDIO_MODEL: getEnvValue("AUDIO_MODEL", "whisper-large-v3"),
  NODE_ENV: getEnvValue("NODE_ENV", "development"),
  TOGETHER_API_KEY: getEnvValue("TOGETHER_API_KEY"),
  TOGETHER_MODEL: getEnvValue("TOGETHER_MODEL", "together/Llama-2-7b-chat-hf"),
}

// Helper function to format the model name
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
