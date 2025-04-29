import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that should bypass middleware processing
const PUBLIC_PATHS = ["/api/status", "/api/health", "/_next", "/favicon.ico", "/static"]

// API paths that require authentication (if you implement auth later)
const PROTECTED_API_PATHS = ["/api/admin", "/api/user"]

// JavaScript file extensions that need proper MIME types
const JS_EXTENSIONS = [".js", ".mjs", ".jsx", ".ts", ".tsx"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Add request ID for tracking
  const requestId = crypto.randomUUID()

  // Clone the headers to modify them
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-request-id", requestId)

  // Add timestamp for performance tracking
  requestHeaders.set("x-request-time", Date.now().toString())

  // For API routes, add CORS headers
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }

  // Check if the request is for a JavaScript file and set the proper MIME type
  const fileExtension = pathname.substring(pathname.lastIndexOf("."))
  if (JS_EXTENSIONS.includes(fileExtension)) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    response.headers.set("Content-Type", "application/javascript; charset=utf-8")
    return response
  }

  // For non-API routes, just pass the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure middleware to run only for specific paths
export const config = {
  matcher: [
    // Apply to all API routes
    "/api/:path*",
    // Apply to all pages except static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Apply to JavaScript files
    "/:path*\\.(js|mjs|jsx|ts|tsx)",
  ],
}
