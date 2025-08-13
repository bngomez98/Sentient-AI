"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_path: pathname,
      })
    }

    // Custom analytics for movement tracking
    if (typeof window !== "undefined") {
      // Track page views
      const trackPageView = () => {
        fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "page_view",
            path: pathname,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        }).catch(() => {
          // Silently fail if analytics endpoint is not available
        })
      }

      trackPageView()
    }
  }, [pathname])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
