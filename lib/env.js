// Expose environment variables to the client
export const clientEnv = {
  ENABLE_ETHICAL_FILTERING: process.env.ENABLE_ETHICAL_FILTERING === "false" ? false : true,
  ENABLE_CONTINUOUS_LEARNING: process.env.ENABLE_CONTINUOUS_LEARNING === "true",
  ENABLE_AUTONOMOUS_DEBUGGING: process.env.ENABLE_AUTONOMOUS_DEBUGGING === "true",
  ENABLE_CLIENT_ML: process.env.ENABLE_CLIENT_ML === "true",
  CONTEXT_MEMORY_SIZE: Number.parseInt(process.env.CONTEXT_MEMORY_SIZE || "50", 10),
  MAX_TOKENS: Number.parseInt(process.env.MAX_TOKENS || "4000", 10),
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ENABLE_LOGGING: process.env.ENABLE_LOGGING !== "false",
}

