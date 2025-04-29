import { logger } from "@/lib/logger"
import type { FileWithPath } from "react-dropzone"
import { createHash } from "crypto"
import { config } from "@/lib/config"

// File types we support
export type SupportedFileType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "code"
  | "unknown"

export interface ProcessedFile {
  id: string
  name: string
  type: SupportedFileType
  size: number
  content: string
  metadata: Record<string, any>
  error?: string
  processingTime?: number
}

export interface FileProcessorOptions {
  maxFileSizeMB?: number
  extractMetadata?: boolean
  extractText?: boolean
  extractImages?: boolean
  extractAudio?: boolean
  timeout?: number
  retries?: number
  concurrentProcessing?: boolean
  maxConcurrent?: number
}

const DEFAULT_OPTIONS: FileProcessorOptions = {
  maxFileSizeMB: 50,
  extractMetadata: true,
  extractText: true,
  extractImages: false,
  extractAudio: false,
  timeout: 30000, // 30 seconds
  retries: 2,
  concurrentProcessing: true,
  maxConcurrent: 3,
}

/**
 * Determines the file type based on extension and MIME type
 */
export function determineFileType(file: File | FileWithPath): SupportedFileType {
  const extension = file.name.split(".").pop()?.toLowerCase() || ""
  const mimeType = file.type.toLowerCase()

  // Image types
  if (
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "tiff", "ico"].includes(extension)
  ) {
    return "image"
  }

  // PDF
  if (mimeType === "application/pdf" || extension === "pdf") {
    return "pdf"
  }

  // Video types
  if (
    mimeType.startsWith("video/") ||
    ["mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv", "m4v"].includes(extension)
  ) {
    return "video"
  }

  // Audio types
  if (mimeType.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a", "flac", "aac", "wma"].includes(extension)) {
    return "audio"
  }

  // Text files
  if (
    mimeType.startsWith("text/") ||
    ["txt", "md", "markdown", "csv", "json", "xml", "html", "htm", "css", "js", "ts"].includes(extension)
  ) {
    return "text"
  }

  // Document files
  if (
    mimeType.includes("document") ||
    mimeType.includes("msword") ||
    ["doc", "docx", "rtf", "odt"].includes(extension)
  ) {
    return "document"
  }

  // Spreadsheet files
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    ["xls", "xlsx", "ods", "csv"].includes(extension)
  ) {
    return "spreadsheet"
  }

  // Presentation files
  if (
    mimeType.includes("presentation") ||
    mimeType.includes("powerpoint") ||
    ["ppt", "pptx", "odp"].includes(extension)
  ) {
    return "presentation"
  }

  // Code files
  if (
    ["js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "cs", "go", "rb", "php", "swift", "kt", "rs"].includes(
      extension,
    )
  ) {
    return "code"
  }

  return "unknown"
}

/**
 * Generates a unique ID for a file based on content hash and timestamp
 */
export function generateFileId(file: File | FileWithPath): string {
  try {
    // Create a hash of the file name and last modified date for uniqueness
    const hashInput = `${file.name}-${file.lastModified}-${Date.now()}`
    const hash = createHash("sha256").update(hashInput).digest("hex").substring(0, 12)
    return `file-${hash}`
  } catch (error) {
    // Fallback if crypto is not available
    return `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
}

/**
 * Main file processor class with enhanced error handling and retries
 */
export class FileProcessor {
  private options: FileProcessorOptions
  private processingQueue: Array<() => Promise<ProcessedFile>> = []
  private activeProcessing = 0
  private abortControllers: Map<string, AbortController> = new Map()

  constructor(options: FileProcessorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Process a file and extract its content with retry logic
   */
  async processFile(file: File | FileWithPath): Promise<ProcessedFile> {
    const fileId = generateFileId(file)
    const fileType = determineFileType(file)
    const startTime = Date.now()

    try {
      // Check file size
      if (file.size > (this.options.maxFileSizeMB || 50) * 1024 * 1024) {
        throw new Error(`File size exceeds the maximum allowed size of ${this.options.maxFileSizeMB}MB`)
      }

      logger.info(`Processing file: ${file.name} (${fileType}, ${file.size} bytes)`)

      // Create abort controller for this file
      const abortController = new AbortController()
      this.abortControllers.set(fileId, abortController)

      // Process with retries
      let content = ""
      let metadata: Record<string, any> = {}
      let retryCount = 0
      let lastError: Error | null = null

      while (retryCount <= (this.options.retries || 0)) {
        try {
          // Process based on file type
          switch (fileType) {
            case "pdf":
              const pdfResult = await this.processPdf(file, abortController.signal)
              content = pdfResult.content
              metadata = pdfResult.metadata
              break

            case "image":
              const imageResult = await this.processImage(file, abortController.signal)
              content = imageResult.content
              metadata = imageResult.metadata
              break

            case "video":
              const videoResult = await this.processVideo(file, abortController.signal)
              content = videoResult.content
              metadata = videoResult.metadata
              break

            case "audio":
              const audioResult = await this.processAudio(file, abortController.signal)
              content = audioResult.content
              metadata = audioResult.metadata
              break

            case "text":
            case "code":
              const textResult = await this.processText(file)
              content = textResult.content
              metadata = textResult.metadata
              break

            case "document":
            case "spreadsheet":
            case "presentation":
              const docResult = await this.processDocument(file, abortController.signal)
              content = docResult.content
              metadata = docResult.metadata
              break

            default:
              content = `File type not fully supported for detailed extraction: ${file.name}`
              metadata = {
                name: file.name,
                size: file.size,
                type: file.type,
              }
          }

          // If we got here, processing succeeded
          break
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          retryCount++

          if (retryCount <= (this.options.retries || 0)) {
            logger.warn(`Retry ${retryCount}/${this.options.retries} for file: ${file.name}`, error)
            // Wait before retrying (exponential backoff)
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
          } else {
            // All retries failed
            throw lastError
          }
        }
      }

      const processingTime = Date.now() - startTime
      logger.info(`Successfully processed file: ${file.name} in ${processingTime}ms`)

      return {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        content,
        metadata,
        processingTime,
      }
    } catch (error) {
      const processingTime = Date.now() - startTime
      logger.error(`Error processing file: ${file.name}`, error)

      return {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        content: "",
        metadata: {
          error: error instanceof Error ? error.message : "Unknown error",
          processingAttempts: (this.options.retries || 0) + 1,
        },
        error: error instanceof Error ? error.message : "Unknown error processing file",
        processingTime,
      }
    } finally {
      // Clean up abort controller
      this.abortControllers.delete(fileId)
    }
  }

  /**
   * Process multiple files with concurrency control
   */
  async processFiles(files: Array<File | FileWithPath>): Promise<ProcessedFile[]> {
    try {
      // Reset processing queue
      this.processingQueue = []
      this.activeProcessing = 0

      // Create processing functions for each file
      const processingFunctions = files.map((file) => () => this.processFile(file))

      // Add to queue
      this.processingQueue.push(...processingFunctions)

      // Process queue with concurrency
      const results: ProcessedFile[] = []
      const maxConcurrent = this.options.concurrentProcessing ? this.options.maxConcurrent || 3 : 1

      // Start initial batch of processing
      const initialBatch = Math.min(maxConcurrent, this.processingQueue.length)
      const processingPromises: Promise<void>[] = []

      for (let i = 0; i < initialBatch; i++) {
        processingPromises.push(this.processNext(results))
      }

      // Wait for all processing to complete
      await Promise.all(processingPromises)

      return results
    } catch (error) {
      logger.error("Error processing multiple files", error)
      throw error
    }
  }

  /**
   * Process next file in queue
   */
  private async processNext(results: ProcessedFile[]): Promise<void> {
    if (this.processingQueue.length === 0) return

    this.activeProcessing++
    try {
      const processingFunction = this.processingQueue.shift()!
      const result = await processingFunction()
      results.push(result)
    } finally {
      this.activeProcessing--
      // Continue processing if there are more files in the queue
      if (this.processingQueue.length > 0) {
        await this.processNext(results)
      }
    }
  }

  /**
   * Cancel processing of a specific file
   */
  cancelProcessing(fileId: string): boolean {
    const controller = this.abortControllers.get(fileId)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(fileId)
      return true
    }
    return false
  }

  /**
   * Cancel all ongoing processing
   */
  cancelAllProcessing(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort()
    }
    this.abortControllers.clear()
    this.processingQueue = []
  }

  /**
   * Process PDF files with enhanced error handling
   */
  private async processPdf(
    file: File | FileWithPath,
    signal?: AbortSignal,
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      // Use the PDF processing API
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/process/pdf", {
        method: "POST",
        body: formData,
        signal: signal || AbortSignal.timeout(this.options.timeout || 30000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `${response.status} ${response.statusText}` }))
        throw new Error(`PDF processing failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        content: result.text || "PDF content could not be extracted",
        metadata: result.metadata || {},
      }
    } catch (error) {
      logger.error("Error processing PDF", error)

      // Check if the error is due to abort
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("PDF processing was cancelled")
      }

      throw new Error(
        `Error extracting PDF content: ${
          error instanceof Error ? error.message : "The file might be encrypted, damaged, or in an unsupported format."
        }`,
      )
    }
  }

  /**
   * Process image files with enhanced error handling
   */
  private async processImage(
    file: File | FileWithPath,
    signal?: AbortSignal,
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      // Use the image processing API
      const formData = new FormData()
      formData.append("file", file)
      formData.append("extractText", String(this.options.extractText))

      const response = await fetch("/api/process/image", {
        method: "POST",
        body: formData,
        signal: signal || AbortSignal.timeout(this.options.timeout || 30000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `${response.status} ${response.statusText}` }))
        throw new Error(`Image processing failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        content: result.text || "Image content could not be extracted",
        metadata: result.metadata || {},
      }
    } catch (error) {
      logger.error("Error processing image", error)

      // Check if the error is due to abort
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Image processing was cancelled")
      }

      throw new Error(
        `Error extracting image content: ${
          error instanceof Error
            ? error.message
            : "The image might be in an unsupported format or too complex to analyze."
        }`,
      )
    }
  }

  /**
   * Process video files with enhanced error handling
   */
  private async processVideo(
    file: File | FileWithPath,
    signal?: AbortSignal,
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      // Use the video processing API
      const formData = new FormData()
      formData.append("file", file)
      formData.append("extractAudio", String(this.options.extractAudio))

      const response = await fetch("/api/process/video", {
        method: "POST",
        body: formData,
        signal: signal || AbortSignal.timeout(this.options.timeout || 60000), // Longer timeout for videos
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `${response.status} ${response.statusText}` }))
        throw new Error(`Video processing failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        content: result.text || "Video content could not be extracted",
        metadata: result.metadata || {},
      }
    } catch (error) {
      logger.error("Error processing video", error)

      // Check if the error is due to abort
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Video processing was cancelled")
      }

      throw new Error(
        `Error extracting video content: ${
          error instanceof Error
            ? error.message
            : "The video might be in an unsupported format or too large to process."
        }`,
      )
    }
  }

  /**
   * Process audio files with enhanced error handling
   */
  private async processAudio(
    file: File | FileWithPath,
    signal?: AbortSignal,
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      // Use the audio processing API
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/process/audio", {
        method: "POST",
        body: formData,
        signal: signal || AbortSignal.timeout(this.options.timeout || 45000), // Longer timeout for audio transcription
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `${response.status} ${response.statusText}` }))
        throw new Error(`Audio processing failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        content: result.text || "Audio content could not be extracted",
        metadata: result.metadata || {},
      }
    } catch (error) {
      logger.error("Error processing audio", error)

      // Check if the error is due to abort
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Audio processing was cancelled")
      }

      throw new Error(
        `Error extracting audio content: ${
          error instanceof Error
            ? error.message
            : "The audio might be in an unsupported format or too noisy to transcribe."
        }`,
      )
    }
  }

  /**
   * Process text files with enhanced error handling
   */
  private async processText(file: File | FileWithPath): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      const text = await file.text()

      // Basic text analysis
      const lines = text.split("\n")
      const words = text.split(/\s+/).filter(Boolean)

      return {
        content: text,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lineCount: lines.length,
          wordCount: words.length,
          charCount: text.length,
          averageLineLength: lines.length > 0 ? text.length / lines.length : 0,
          averageWordLength: words.length > 0 ? text.length / words.length : 0,
        },
      }
    } catch (error) {
      logger.error("Error processing text file", error)
      throw new Error(
        `Error extracting text content: ${
          error instanceof Error ? error.message : "The file might be in an unsupported encoding."
        }`,
      )
    }
  }

  /**
   * Process document files (DOCX, etc.) with enhanced error handling
   */
  private async processDocument(
    file: File | FileWithPath,
    signal?: AbortSignal,
  ): Promise<{ content: string; metadata: Record<string, any> }> {
    try {
      // Use the document processing API
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/process/document", {
        method: "POST",
        body: formData,
        signal: signal || AbortSignal.timeout(this.options.timeout || 30000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `${response.status} ${response.statusText}` }))
        throw new Error(`Document processing failed: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      return {
        content: result.text || "Document content could not be extracted",
        metadata: result.metadata || {},
      }
    } catch (error) {
      logger.error("Error processing document", error)

      // Check if the error is due to abort
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Document processing was cancelled")
      }

      throw new Error(
        `Error extracting document content: ${
          error instanceof Error ? error.message : "The file might be in an unsupported format or encrypted."
        }`,
      )
    }
  }
}

// Export a singleton instance with default options
export const fileProcessor = new FileProcessor({
  maxFileSizeMB: config.fileProcessing?.maxFileSizeMB || 50,
  extractText: config.fileProcessing?.enableOCR || true,
  extractAudio: config.fileProcessing?.enableAudioTranscription || true,
  timeout: config.fileProcessing?.timeout || 30000,
  retries: config.fileProcessing?.retries || 2,
  concurrentProcessing: true,
  maxConcurrent: 3,
})
