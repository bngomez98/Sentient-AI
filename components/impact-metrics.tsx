"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, TrendingUp, DollarSign, Users, Building, AlertTriangle } from "lucide-react"

const metrics = [
  {
    icon: TrendingDown,
    value: "18%",
    label: "Congressional Approval",
    description: "Historic low - Americans have lost faith in Congress",
    color: "text-brand-red",
    bgColor: "bg-brand-red/10",
    borderColor: "border-brand-red/20",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Incumbent Reelection Rate",
    description: "Despite low approval, incumbents almost never lose",
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
    borderColor: "border-brand-blue/20",
  },
  {
    icon: DollarSign,
    value: "$17M",
    label: "Incumbent Spending Advantage",
    description: "Average amount incumbents outspend challengers",
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
    borderColor: "border-brand-blue/20",
  },
  {
    icon: Building,
    value: "11,000",
    label: "Registered Lobbyists",
    description: "20 lobbyists for every member of Congress",
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
    borderColor: "border-brand-blue/20",
  },
  {
    icon: Users,
    value: "20%",
    label: "Voters Needed",
    description: "Coordinated action by just 20% can replace everyone",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: AlertTriangle,
    value: "900+",
    label: "Pages of Project 2025",
    description: "Authoritarian blueprint being implemented now",
    color: "text-brand-red",
    bgColor: "bg-brand-red/10",
    borderColor: "border-brand-red/20",
  },
]

export function ImpactMetrics() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("impact-metrics")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <div id="impact-metrics" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={metric.label}
          className={`${metric.borderColor} border-2 hover:shadow-lg transition-all duration-300 ${
            isVisible ? "animate-in slide-in-from-bottom-4" : "opacity-0"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className={`p-6 ${metric.bgColor}`}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-white border ${metric.borderColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div className="flex-1">
                <div className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
                <div className="font-semibold text-slate-900 mb-2">{metric.label}</div>
                <p className="text-sm text-slate-600">{metric.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
