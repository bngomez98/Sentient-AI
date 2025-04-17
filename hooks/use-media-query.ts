"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook for responsive design with media queries
 * @param query CSS media query string
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Define listener function
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener("change", handleChange)

    // Clean up on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query]) // Re-run effect if query changes

  return matches
}

