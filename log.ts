export function log(level: "info" | "error" | "warn", message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "")
}

