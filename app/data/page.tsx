import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Users, AlertTriangle, Target, BarChart3, DollarSign } from "lucide-react"

export default function DataPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Congressional Failure: Complete Documentation
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed">
              18% approval rating. 95% reelection rate. $34.5 trillion debt. 27 bills passed in 2023. Mathematical proof
              that Congress has failed and must be completely replaced.
            </p>
          </div>

          {/* Key Statistics Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">System Failure Metrics</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="text-center border-2 border-red-100 bg-red-50">
                <CardHeader>
                  <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-red-600">18%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">Congressional Approval Rating</p>
                  <p className="text-sm text-slate-500">Gallup, January 2024</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-orange-100 bg-orange-50">
                <CardHeader>
                  <Target className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-orange-600">95%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">House Reelection Rate</p>
                  <p className="text-sm text-slate-500">2022 Midterm Elections</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-purple-100 bg-purple-50">
                <CardHeader>
                  <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-2xl font-bold text-purple-600">$34.5T</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">National Debt</p>
                  <p className="text-sm text-slate-500">+$7.8T under current Congress</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-blue-100 bg-blue-50">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-blue-600">27</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">Bills Passed in 2023</p>
                  <p className="text-sm text-slate-500">Lowest since 1995</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Downloadable Resources */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Complete Documentation Package</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-blue-100">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Complete White Paper (47 pages)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Mathematical analysis of congressional failure. Statistical proof of incumbency protection. Fresh
                    535 execution strategy with electoral mathematics.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/api/download?resource=white-paper" target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF (2.3 MB)
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-green-600" />
                    Congressional Data Analysis (89 pages)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    District-by-district incumbent performance data. Voting records, donor lists, approval ratings,
                    reelection margins, legislative productivity metrics.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/api/download?resource=data-packet" target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF (8.7 MB)
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="h-6 w-6 mr-2 text-purple-600" />
                    Organizing Toolkit (12 files)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Printable flyers, social media graphics, presentation slides, talking points, legal compliance
                    guides, voter registration materials.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/api/download?resource=organizing-toolkit" target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP (15.2 MB)
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-100">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Target className="h-6 w-6 mr-2 text-red-600" />
                    Voter Execution Guide (23 pages)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Step-by-step instructions for primary and general election voting. State-specific requirements,
                    timeline, legal compliance, tactical considerations.
                  </p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/api/download?resource=voter-guide" target="_blank">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF (1.8 MB)
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Movement Progress */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Fresh 535 Movement Progress</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center border-2 border-green-100">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-green-600">47,832</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">Americans Pledged</p>
                  <p className="text-sm text-slate-500">Target: 47.3 million (20% of registered voters)</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-blue-100">
                <CardHeader>
                  <Target className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-blue-600">435</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">Districts with Pledgers</p>
                  <p className="text-sm text-slate-500">All 435 House districts represented</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-purple-100">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-3xl font-bold text-purple-600">0.1%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 font-semibold">Progress to Target</p>
                  <p className="text-sm text-slate-500">47,832 of 47.3 million needed</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-slate-900 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">The Data is Clear: Complete Replacement Required</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              18% approval proves they failed. 95% reelection proves the system protects failure. $34.5 trillion debt
              proves the cost of inaction. Replace all 535.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link href="/pledge">
                  <Target className="h-5 w-5 mr-2" />
                  Join 47,832 Who Pledged
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-slate-900 bg-transparent"
              >
                <Link href="/api/download?resource=white-paper">
                  <FileText className="h-5 w-5 mr-2" />
                  Download Complete Analysis
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
