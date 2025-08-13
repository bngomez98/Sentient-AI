"use client"

import { useState, useEffect } from "react"
import { DollarSign } from "lucide-react"

export function DebtClock() {
  const [debt, setDebt] = useState(34500000000000) // Starting at $34.5 trillion
  const [perCitizen, setPerCitizen] = useState(103000) // Starting at ~$103k per citizen

  useEffect(() => {
    const interval = setInterval(() => {
      // Debt increases by approximately $1 million every 30 seconds
      // This is based on the current rate of federal deficit spending
      setDebt((prev) => prev + 33333) // $1M / 30 seconds = $33,333 per second
      setPerCitizen((prev) => prev + 0.1) // Approximately 10 cents per citizen per second
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1e12) {
      return `$${(amount / 1e12).toFixed(2)} Trillion`
    } else if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(2)} Billion`
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(2)} Million`
    } else {
      return `$${amount.toLocaleString()}`
    }
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center justify-center">
        <DollarSign className="h-8 w-8 mr-3" />
        U.S. National Debt (Real-Time)
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
          <h4 className="text-lg font-semibold text-red-800 mb-2">Total National Debt</h4>
          <div className="text-3xl font-bold text-red-900 font-mono">{formatCurrency(debt)}</div>
          <p className="text-sm text-red-700 mt-2">Increasing by $1M every 30 seconds</p>
        </div>

        <div className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
          <h4 className="text-lg font-semibold text-red-800 mb-2">Debt Per Citizen</h4>
          <div className="text-3xl font-bold text-red-900 font-mono">${Math.round(perCitizen).toLocaleString()}</div>
          <p className="text-sm text-red-700 mt-2">Your share of the national debt</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-800">
          <strong>Why this matters:</strong> Representatives who cannot be voted out have no incentive to control
          spending. This debt accumulates because Congress faces no electoral consequences for fiscal irresponsibility.
        </p>
      </div>
    </div>
  )
}
