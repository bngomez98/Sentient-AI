import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingDown, TrendingUp } from "lucide-react"

export function ResearchData() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-500" />
            Incumbency Advantage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600 mb-2">1,000%</div>
          <p className="text-sm text-slate-600">
            Increase from 1% (1946) to 11% (1986). Current data suggests 15%+ advantage.
          </p>
          <p className="text-xs text-slate-500 mt-2">Source: King & Gelman, Harvard/UC Berkeley</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingDown className="h-5 w-5 mr-2 text-blue-500" />
            Electoral Responsiveness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 mb-2">43%</div>
          <p className="text-sm text-slate-600">
            Decline from 2.3 to 1.3 over 40 years. System mathematically unresponsive.
          </p>
          <p className="text-xs text-slate-500 mt-2">Source: King & Gelman, Harvard/UC Berkeley</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-green-500" />
            Partisan Bias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <p className="text-sm text-slate-600">
            Incumbency advantage explains virtually all partisan bias trends since 1940s.
          </p>
          <p className="text-xs text-slate-500 mt-2">Source: King & Gelman, Harvard/UC Berkeley</p>
        </CardContent>
      </Card>
    </div>
  )
}
