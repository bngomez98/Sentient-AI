import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Target, FileText, BookOpen, BarChart3 } from "lucide-react"
import { HistoricalReelectionChart } from "@/components/charts/historical-reelection-chart"
import { CongressionalApprovalChart } from "@/components/charts/congressional-approval-chart"
import { CampaignSpendingChart } from "@/components/charts/campaign-spending-chart"
import { LegislativeProductivityChart } from "@/components/charts/legislative-productivity-chart"
import { ShareButtons } from "@/components/share-buttons"
import { redirect } from "next/navigation"

export default function AnalysisPage() {
  redirect("/problem")
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              The Problem: Why Congress Doesn't Work
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
              Academic research and current data prove that incumbency advantage has systematically destroyed electoral
              accountability, creating an unresponsive system that requires complete replacement to restore democratic
              function.
            </p>
          </div>

          {/* Data & Evidence Section */}
          <section className="mb-16">
            <div className="bg-brand-navy text-brand-cream p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3" />
                Data & Evidence
              </h2>
              <p className="text-xl opacity-90 mb-4">
                The numbers don't lie. Congressional approval sits at historic lows while reelection rates remain near
                historic highs. This mathematical impossibility proves the system is broken.
              </p>
            </div>

            <div className="space-y-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>The Accountability Gap: Performance vs. Job Security</CardTitle>
                  <p className="text-slate-600">
                    When approval ratings and reelection rates move in opposite directions, democracy has failed.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-center mb-2">Congressional Approval: 18%</h4>
                      <div className="h-80 border rounded-lg p-4 bg-white">
                        <CongressionalApprovalChart />
                      </div>
                      <p className="text-sm text-slate-600 mt-2 text-center">Source: Gallup Historical Trends</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-center mb-2">Incumbent Reelection: 95%</h4>
                      <div className="h-80 border rounded-lg p-4 bg-white">
                        <HistoricalReelectionChart />
                      </div>
                      <p className="text-sm text-slate-600 mt-2 text-center">
                        Source: Center for Responsive Politics, Ballotpedia
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>The Money Advantage: Why Challengers Can't Win</CardTitle>
                  <p className="text-slate-600">
                    Incumbents raise 3-5x more than challengers, creating an insurmountable barrier to competition.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-96 border rounded-lg p-4 bg-white">
                    <CampaignSpendingChart />
                  </div>
                  <p className="text-sm text-slate-600 mt-2 text-center">
                    Source: Federal Election Commission, Center for Responsive Politics
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Legislative Collapse: Getting Nothing Done</CardTitle>
                  <p className="text-slate-600">
                    When representatives can't be fired, they stop working. Legislative productivity has plummeted.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-96 border rounded-lg p-4 bg-white">
                    <LegislativeProductivityChart />
                  </div>
                  <p className="text-sm text-slate-600 mt-2 text-center">
                    Source: Pew Research Center analysis of Congressional data
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Academic Foundation */}
          <section className="mb-16">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                Academic Research
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="font-semibold mb-4">
                  "Systemic Consequences of Incumbency Advantage in U.S. House Elections"
                  <br />
                  <span className="font-normal text-slate-600">
                    Gary King (Harvard) & Andrew Gelman (UC Berkeley), American Journal of Political Science, 1991
                  </span>
                </p>
                <p>
                  This landmark study analyzed 40 years of congressional election data and documented the systematic
                  destruction of electoral accountability. Key findings:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>1,000% increase in incumbency advantage:</strong> Rose from 1% (1946-48) to 11% (1984-86)
                  </li>
                  <li>
                    <strong>43% decline in electoral responsiveness:</strong> Dropped from 2.3 to 1.3 over 40 years
                  </li>
                  <li>
                    <strong>System became mathematically unresponsive</strong> to voter preferences
                  </li>
                </ul>
                <p className="font-semibold">
                  The research proves that high incumbency retention rates are not due to voter satisfaction, but to
                  structural advantages that have created a permanently unaccountable political class.
                </p>
              </div>
            </div>
          </section>

          {/* Current Crisis */}
          <section className="mb-16">
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-red-900 mb-6 flex items-center">
                <AlertTriangle className="h-8 w-8 mr-3" />
                The Current Crisis
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p>
                  The academic research predicted exactly what we see today: a Congress completely disconnected from
                  public will. Current metrics confirm the complete breakdown of electoral accountability:
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-bold text-red-600">Performance Metrics</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Congressional approval: 18% (Gallup 2024)</li>
                      <li>• Bills passed 2023: 27 (lowest since 1995)</li>
                      <li>• National debt: $34.5 trillion</li>
                      <li>• Healthcare costs: +158% since 2000</li>
                      <li>• Housing prices: +47% since 2020</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-bold text-green-600">Job Security Metrics</h4>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• House incumbent reelection: 95% (2022)</li>
                      <li>• Senate incumbent reelection: 84% (2022)</li>
                      <li>• Primary challenge success: &lt;5%</li>
                      <li>• Average tenure: 9.7 years House, 11.2 years Senate</li>
                      <li>• Fundraising advantage: 3:1 over challengers</li>
                    </ul>
                  </div>
                </div>
                <p className="font-semibold">
                  When representatives have near-guaranteed job security despite historic disapproval, the electoral
                  system has ceased to function as an accountability mechanism.
                </p>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="text-center bg-brand-navy text-white p-12 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6">The Mathematical Solution</h2>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              Academic research proves that removing incumbency advantage restores electoral responsiveness. Complete
              replacement is the only method that eliminates structural advantages simultaneously.
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
              Primary turnout: 15-25%. Coordinated 20% bloc vote defeats 95% of incumbents mathematically. No
              constitutional amendment required. Immediate restoration of electoral accountability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link href="/pledge">
                  <Target className="h-5 w-5 mr-2" />
                  Take the Pledge
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <Link href="/solution">
                  <FileText className="h-5 w-5 mr-2" />
                  Read the Strategy
                </Link>
              </Button>
            </div>
          </section>

          {/* Share Section */}
          <section className="text-center bg-slate-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Share This Analysis</h2>
            <p className="text-lg text-slate-600 mb-6">
              Help others understand why congressional replacement is necessary for democracy.
            </p>
            <ShareButtons />
          </section>
        </div>
      </div>
    </div>
  )
}
