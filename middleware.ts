import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that should bypass middleware processing
const PUBLIC_PATHS = ["/api/status", "/api/health", "/_next", "/favicon.ico", "/static"]

// API paths that require authentication
const PROTECTED_API_PATHS = ["/api/admin", "/api/user"]

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

  // Check authentication for protected API paths
  if (PROTECTED_API_PATHS.some((path) => pathname.startsWith(path))) {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    }

    // Here you would validate the token
    // For now, we'll just check if it exists
    const token = authHeader.split(" ")[1]
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    }

    // Add user info to headers if token is valid
    requestHeaders.set("x-user-id", "authenticated-user")
  }

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
  ],
}

