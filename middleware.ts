import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Enhanced logging function
function log(level: "info" | "error" | "warn", message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data || "")
}

export function middleware(request: NextRequest) {
  const requestTime = Date.now()
  const url = request.nextUrl.pathname

  // Log the request
  log("info", `Request: ${request.method} ${url}`)

  // Continue to the next middleware or route handler
  const response = NextResponse.next()

  // Add response time header
  response.headers.set("X-Response-Time", `${Date.now() - requestTime}ms`)

  return response
}

export const config = {
  matcher: ["/api/:path*"],
}

