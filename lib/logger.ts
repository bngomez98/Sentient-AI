import fs from "fs"
import path from "path"

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private logLevel: LogLevel
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 100
  private logToConsole = true
  private logToFile = false
  private logFilePath: string | undefined

  constructor(options?: { logToConsole?: boolean; maxBufferSize?: number; logToFile?: boolean; logFilePath?: string }) {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || "info"
    if (options) {
      this.logToConsole = options.logToConsole ?? true
      this.maxBufferSize = options.maxBufferSize ?? 100
      this.logToFile = options.logToFile ?? false
      this.logFilePath = options.logFilePath
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }

    return levels[level] >= levels[this.logLevel]
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog("debug")) {
      this.log("debug", message, data)
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog("info")) {
      this.log("info", message, data)
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog("warn")) {
      this.log("warn", message, data)
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog("error")) {
      this.log("error", message, data)
    }
  }

  log(level: LogLevel, message: string, data?: any) {
    try {
      const timestamp = new Date().toISOString()

      // Format error objects
      let formattedData = data
      if (data instanceof Error) {
        formattedData = {
          name: data.name,
          message: data.message,
          stack: data.stack,
        }
      }

      const entry: LogEntry = {
        timestamp,
        level,
        message,
        ...(formattedData !== undefined && { data: formattedData }),
      }

      // Add to buffer
      this.logBuffer.push(entry)
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer.shift()
      }

      // Log to console if enabled
      if (this.logToConsole && typeof console !== "undefined") {
        const consoleMethod =
          level === "debug"
            ? console.debug
            : level === "info"
              ? console.info
              : level === "warn"
                ? console.warn
                : console.error

        consoleMethod(`[${timestamp}] [${level.toUpperCase()}] ${message}`, formattedData || "")
      }

      // Log to file if enabled
      if (this.logToFile && this.logFilePath) {
        this.writeToFile(
          `[${timestamp}] [${level.toUpperCase()}] ${message} ${formattedData ? JSON.stringify(formattedData) : ""}`,
        )
      }
    } catch (error) {
      // Fallback logging if something goes wrong
      if (typeof console !== "undefined") {
        console.error("Logger error:", error)
        console.error("Original log:", { level, message, data })
      }
    }
  }

  private writeToFile(message: string): void {
    if (!this.logFilePath) {
      console.warn("Log file path is not defined.")
      return
    }

    try {
      const logDirectory = path.dirname(this.logFilePath)
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true })
      }

      fs.appendFileSync(this.logFilePath, `${message}\n`)
    } catch (error) {
      console.error(`Failed to write to log file: ${error}`)
      // Consider adding fallback logging here
      this.log("error", `Failed to write to log file: ${error}`)
    }
  }

  getRecentLogs(count = 10): LogEntry[] {
    return this.logBuffer.slice(-Math.min(count, this.logBuffer.length))
  }

  clearLogs() {
    this.logBuffer = []
  }

  rotateLogsIfNeeded(maxSizeMB = 10): void {
    if (!this.logFilePath) {
      console.warn("Log file path is not defined.")
      return
    }

    try {
      if (!fs.existsSync(this.logFilePath)) return

      const stats = fs.statSync(this.logFilePath)
      const fileSizeInMB = stats.size / (1024 * 1024)

      if (fileSizeInMB > maxSizeMB) {
        const timestamp = new Date().toISOString().replace(/:/g, "-")
        fs.renameSync(this.logFilePath, `${this.logFilePath}.${timestamp}`)
        this.log("info", "Log file rotated")
      }
    } catch (error) {
      console.error(`Failed to rotate logs: ${error}`)
      this.log("error", `Failed to rotate logs: ${error}`)
    }
  }
}

// Create a singleton instance
export const logger = new Logger()

// Export the log function directly
export function log(level: LogLevel, message: string, data?: any) {
  logger.log(level, message, data)
}

