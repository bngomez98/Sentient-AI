"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fileProcessor, type ProcessedFile } from "@/lib/file-processor"
import {
  File,
  FileText,
  Image,
  Video,
  Music,
  FileSpreadsheet,
  FileCode,
  FileIcon as FilePdf,
  AlertCircle,
  X,
  Upload,
  Check,
} from "lucide-react"

interface FileUploadProps {
  onFilesProcessed: (files: ProcessedFile[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedFileTypes?: string[]
}

export function FileUpload({ onFilesProcessed, maxFiles = 5, maxSizeMB = 50, acceptedFileTypes }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check if we're already processing files
      if (processing) return

      // Check if we're exceeding the max number of files
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files at a time.`)
        return
      }

      // Check file sizes
      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSizeMB * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        setError(
          `Some files exceed the maximum size of ${maxSizeMB}MB: ${oversizedFiles.map((f) => f.name).join(", ")}`,
        )
        return
      }

      // Add files to state
      setFiles((prev) => [...prev, ...acceptedFiles])
    },
    [files, maxFiles, maxSizeMB, processing],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    accept: acceptedFileTypes ? Object.fromEntries(acceptedFileTypes.map((type) => [type, []])) : undefined,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const processFiles = async () => {
    if (files.length === 0 || processing) return

    setProcessing(true)
    setProgress(0)
    setError(null)

    try {
      // Process files one by one to show progress
      const processedFiles: ProcessedFile[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const processed = await fileProcessor.processFile(file)
        processedFiles.push(processed)
        setProgress(((i + 1) / files.length) * 100)
      }

      // Call the callback with processed files
      onFilesProcessed(processedFiles)

      // Clear the files
      setFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing files")
    } finally {
      setProcessing(false)
    }
  }

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase()
    const extension = file.name.split(".").pop()?.toLowerCase() || ""

    if (type.includes("pdf") || extension === "pdf") return <FilePdf className="h-6 w-6 text-red-500" />
    if (type.includes("image")) return <Image className="h-6 w-6 text-blue-500" />
    if (type.includes("video")) return <Video className="h-6 w-6 text-purple-500" />
    if (type.includes("audio")) return <Music className="h-6 w-6 text-green-500" />
    if (type.includes("spreadsheet") || ["xls", "xlsx", "csv"].includes(extension))
      return <FileSpreadsheet className="h-6 w-6 text-green-700" />
    if (type.includes("code") || ["js", "ts", "py", "java", "c", "cpp", "html", "css"].includes(extension))
      return <FileCode className="h-6 w-6 text-yellow-600" />
    if (type.includes("text")) return <FileText className="h-6 w-6 text-gray-600" />

    return <File className="h-6 w-6 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive ? "Drop the files here" : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-sm text-muted-foreground">
            Upload up to {maxFiles} files (max {maxSizeMB}MB each)
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      disabled={processing}
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Processing progress */}
      {processing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processing files...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Process button */}
      {files.length > 0 && (
        <Button className="w-full" onClick={processFiles} disabled={processing || files.length === 0}>
          {processing ? (
            <span className="flex items-center">
              Processing... <span className="ml-2">{Math.round(progress)}%</span>
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" /> Process {files.length} file{files.length !== 1 ? "s" : ""}
            </span>
          )}
        </Button>
      )}
    </div>
  )
}
