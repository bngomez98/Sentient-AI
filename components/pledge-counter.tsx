"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Target } from "lucide-react"

export function PledgeCounter() {
  const [count, setCount] = useState(47832)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
      setTimeout(() => setIsAnimating(false), 500)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const targetCount = 1000000
  const percentage = Math.min((count / targetCount) * 100, 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-brand-cream">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-slate-300" />
            <div className={`text-3xl font-bold mb-2 transition-all duration-500 ${isAnimating ? "scale-110" : ""}`}>
              {count.toLocaleString()}
            </div>
            <div className="text-slate-300 text-sm">Americans Pledged</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-brand-cream">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-3 text-slate-300" />
            <div className="text-3xl font-bold mb-2">435</div>
            <div className="text-slate-300 text-sm">Districts Represented</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-brand-cream">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-slate-300" />
            <div className="text-3xl font-bold mb-2">{percentage.toFixed(1)}%</div>
            <div className="text-slate-300 text-sm">To Critical Mass</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-brand-cream font-medium">Progress to 1 Million Pledges</span>
            <span className="text-slate-300">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-slate-300 text-sm mt-2">Target: 1,000,000 pledges by Election Day 2026</p>
        </CardContent>
      </Card>
    </div>
  )
}
