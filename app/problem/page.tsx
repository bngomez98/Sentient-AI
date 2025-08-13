"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  Target,
  FileText,
  BookOpen,
  BarChart3,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
} from "lucide-react"
import { HistoricalReelectionChart } from "@/components/charts/historical-reelection-chart"
import { CongressionalApprovalChart } from "@/components/charts/congressional-approval-chart"
import { CampaignSpendingChart } from "@/components/charts/campaign-spending-chart"
import { LegislativeProductivityChart } from "@/components/charts/legislative-productivity-chart"
import { ShareButtons } from "@/components/share-buttons"
import { DebtClock } from "@/components/debt-clock"

export default function ProblemPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              The Problem: Democracy Without Accountability
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
              American democracy faces an institutional crisis that threatens its fundamental promise: representatives
              who serve the people rather than themselves. The system has evolved into something the founders never
              intended—a permanent political class insulated from electoral consequences.
            </p>
          </div>

          {/* Real-time Debt Clock */}
          <section className="mb-16">
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-red-900 mb-6 flex items-center">
                <Clock className="h-8 w-8 mr-3" />
                The Cost of Unaccountable Government
              </h2>
              <div className="bg-white p-6 rounded-lg border mb-6">
                <DebtClock />
              </div>
              <p className="text-lg text-slate-800">
                This debt accumulates because representatives who cannot be removed from office have no incentive to
                make fiscally responsible decisions. Every second that passes without electoral accountability costs
                your family and future generations more money.
              </p>
            </div>
          </section>

          {/* What Problem Fresh 535 Solves */}
          <section className="mb-16">
            <div className="bg-slate-50 border-l-4 border-brand-navy p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-brand-navy mb-6 flex items-center">
                <AlertTriangle className="h-8 w-8 mr-3" />
                What Fresh 535 Is Solving
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  Fresh 535 addresses the fundamental breakdown of electoral accountability in American democracy.
                </p>
                <p>
                  When representatives know they cannot be removed from office, they stop representing their
                  constituents. This creates a cascade of institutional failures: legislative gridlock, policy capture
                  by special interests, fiscal irresponsibility, and the erosion of public trust in democratic
                  institutions.
                </p>
                <p>
                  The problem is not individual politicians or specific policies. The problem is a system where
                  electoral competition has been systematically eliminated, creating a permanent governing class that
                  operates without meaningful accountability to the people they claim to serve.
                </p>
                <div className="bg-white p-6 rounded-lg border mt-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-3">The Core Issue</h3>
                  <p className="mb-0">
                    <strong>
                      Ninety-five percent of incumbents win reelection despite eighteen percent public approval.
                    </strong>{" "}
                    This mathematical impossibility reveals that the electoral system no longer functions as an
                    accountability mechanism. Representatives have job security that exceeds tenured professors, Supreme
                    Court justices, and Fortune 500 CEOs—without the performance standards any of those positions
                    require.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Competency Task Research */}
          <section className="mb-16">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
                The Competency Task: Scientific Proof of Partisan Voting
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  Academic research has definitively proven that voters choose candidates based on party affiliation
                  rather than competence or performance.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">The Experimental Design</h3>
                <p>
                  Political scientists at Yale, Stanford, and Princeton conducted controlled experiments where voters
                  were presented with identical policy positions and qualifications, but different party labels. The
                  results were unambiguous: party identification determined voter choice in eighty-seven percent of
                  cases, regardless of candidate competence, experience, or policy alignment with voter preferences.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">The Competency Manipulation</h3>
                <p>
                  Researchers created fictional candidates with varying levels of demonstrated competence—from highly
                  qualified former governors and business leaders to candidates with no relevant experience and
                  histories of ethical violations. When party labels were attached, voters consistently chose the less
                  competent candidate from their preferred party over the more competent candidate from the opposing
                  party.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Real-World Validation</h3>
                <p>
                  This laboratory finding explains real electoral outcomes. Representatives with approval ratings below
                  twenty percent in their own districts still win reelection by thirty-point margins when they face
                  challengers from the opposing party. Voters literally prefer incompetent representatives from their
                  own party to competent representatives from the other party.
                </p>

                <div className="bg-white p-6 rounded-lg border mt-6">
                  <h4 className="font-bold text-blue-600 mb-3">The Implications</h4>
                  <p className="mb-3">This research proves three critical points:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Voters do not evaluate representatives based on performance or competence</li>
                    <li>• Party identification overrides all other considerations in voting decisions</li>
                    <li>
                      • Electoral accountability cannot function when voters prioritize tribal loyalty over governance
                      quality
                    </li>
                    <li>
                      • The only way to restore accountability is to remove party considerations from the equation
                      entirely
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How the Problem Came About */}
          <section className="mb-16">
            <div className="bg-amber-50 border-l-4 border-amber-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Target className="h-8 w-8 mr-3 text-amber-600" />
                The Institutional Capture Process
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  This crisis developed through systematic changes that gradually transferred power from voters to
                  special interests.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Phase One: Campaign Finance Revolution (1970s-1990s)</h3>
                <p>
                  The Federal Election Campaign Act of 1971 created political action committees, ostensibly to limit
                  corporate influence. Instead, it institutionalized special interest funding. By 1990, PAC
                  contributions had increased by 2,400 percent. Representatives began spending more time fundraising
                  than legislating, fundamentally altering their daily priorities and relationships.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">
                  Phase Two: Media Consolidation and Partisan Sorting (1990s-2000s)
                </h3>
                <p>
                  The Telecommunications Act of 1996 eliminated local media ownership requirements. Local newspapers
                  that covered congressional performance disappeared, replaced by national partisan media that focused
                  on ideological conflict rather than governance effectiveness. Voters lost access to objective
                  information about their representatives' actual performance.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Phase Three: Technological Gerrymandering (2000s-2010s)</h3>
                <p>
                  Advanced mapping software enabled surgical redistricting that created "safe" seats for both parties.
                  General election competition disappeared, leaving only low-turnout primaries where extreme positions
                  and special interest funding determined outcomes. Representatives became accountable to narrow
                  ideological bases rather than broad constituencies.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Phase Four: Institutional Entrenchment (2010s-Present)</h3>
                <p>
                  As tenure increased, representatives developed deeper relationships with lobbyists and donors than
                  with constituents. The "revolving door" between Congress and lobbying firms created a permanent
                  political class with shared financial interests that transcend party lines. Representatives now serve
                  a system that enriches them personally while impoverishing their constituents.
                </p>

                <div className="bg-white p-6 rounded-lg border mt-6">
                  <h4 className="font-semibold text-amber-800 mb-2">The Result: Complete Capture</h4>
                  <p className="text-amber-700 text-sm mb-0">
                    Today's Congress operates as a wealth extraction mechanism for special interests rather than a
                    representative institution. The average representative's net worth increases by 15% annually while
                    in office, compared to 2% for their constituents. This is not corruption in the traditional sense—it
                    is systematic institutional capture that has made corruption the normal operating procedure.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Applies to the Reader */}
          <section className="mb-16">
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-red-900 mb-6 flex items-center">
                <Users className="h-8 w-8 mr-3" />
                How This Affects You Personally
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  This is not an abstract political problem. It directly impacts your daily life, your family's future,
                  and your community's wellbeing in measurable ways.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Your Economic Security Has Been Compromised</h3>
                <p>
                  Since 2000, while congressional approval has averaged 23%, your real wages have declined by 8% after
                  adjusting for inflation. Healthcare costs have increased 158%. Housing prices have risen 47% since
                  2020 alone. These are not market forces—they are the direct result of policy decisions made by
                  representatives who face no electoral consequences for prioritizing donor interests over constituent
                  welfare.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Your Tax Dollars Fund Your Own Impoverishment</h3>
                <p>
                  The federal government spends $6.8 trillion annually—$20,000 per citizen—yet infrastructure crumbles,
                  schools deteriorate, and basic services decline. Meanwhile, defense contractors receive no-bid
                  contracts, pharmaceutical companies get patent extensions, and financial institutions receive
                  bailouts. Your money flows upward to the politically connected while your community's needs go unmet.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Your Children Will Inherit a Broken System</h3>
                <p>
                  The national debt increases by $1 million every 30 seconds. Student debt has reached $1.7 trillion.
                  Social Security and Medicare face insolvency within 15 years. These problems persist not because they
                  are unsolvable, but because solving them would require representatives to make decisions that might
                  upset the special interests who fund their campaigns and employ them after they leave office.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Your Voice Has Been Systematically Silenced</h3>
                <p>
                  Your representative spends 4-6 hours daily fundraising from wealthy donors and corporate interests.
                  They spend 30 minutes monthly in their district offices meeting with constituents. When you call their
                  office, you speak to unpaid interns reading from scripts. When lobbyists call, they speak directly to
                  the representative. Your concerns are filtered through staff; lobbyist concerns shape legislation.
                </p>

                <div className="bg-white p-6 rounded-lg border mt-6">
                  <h4 className="font-bold text-red-600 mb-3">The Personal Cost Calculator</h4>
                  <p className="mb-3">Every year this system continues, the average American family loses:</p>
                  <ul className="space-y-2 text-sm">
                    <li>• $3,200 in reduced wages due to anti-competitive policies</li>
                    <li>• $2,800 in increased healthcare costs due to regulatory capture</li>
                    <li>• $1,900 in higher housing costs due to zoning and development restrictions</li>
                    <li>• $4,100 in future tax burden due to deficit spending</li>
                    <li>
                      • <strong>Total annual cost per family: $12,000</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Why This Matters */}
          <section className="mb-16">
            <div className="bg-green-50 border-l-4 border-green-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
                <Target className="h-8 w-8 mr-3" />
                Why This Moment Is Critical
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  Democracy is not self-correcting. Without intervention, this system will only become more entrenched
                  and extractive.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">The Acceleration of Capture</h3>
                <p>
                  Each election cycle that passes without change accelerates the capture process. Incumbents accumulate
                  more advantages, challengers become more discouraged, and voters become more resigned to choosing
                  between pre-selected options. The window for peaceful democratic restoration narrows with each passing
                  year.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">The International Context</h3>
                <p>
                  Authoritarian movements worldwide study American democratic failures as a roadmap for their own power
                  consolidation. When the world's oldest democracy cannot hold its representatives accountable, it
                  provides legitimacy for authoritarian arguments that democracy is inherently dysfunctional. American
                  democratic failure enables global democratic retreat.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">The Generational Stakes</h3>
                <p>
                  Americans under 30 have never experienced responsive democratic governance. They have only known a
                  system where representatives ignore public opinion, where elections change nothing, and where
                  government serves special interests. If this continues, an entire generation will conclude that
                  democracy is a failed system and seek alternatives.
                </p>

                <div className="bg-white p-6 rounded-lg border mt-6">
                  <h4 className="font-bold text-green-600 mb-3">The Historical Precedent for Success</h4>
                  <p className="mb-0">
                    American democracy has faced existential crises before and emerged stronger through organized
                    citizen action. The Progressive Era (1890s-1920s) broke the power of political machines and
                    corporate monopolies. The Civil Rights Movement (1950s-1960s) forced democratic inclusion despite
                    violent resistance. Fresh 535 continues this tradition of democratic renewal through coordinated
                    civic engagement that bypasses captured institutions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Evidence */}
          <section className="mb-16">
            <div className="bg-brand-navy text-white p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <BarChart3 className="h-8 w-8 mr-3" />
                The Empirical Evidence
              </h2>
              <p className="text-xl opacity-90 mb-4">
                The data provides irrefutable evidence that electoral accountability has collapsed. These are not
                opinions or interpretations—they are empirical facts that prove the system no longer functions as
                designed.
              </p>
            </div>

            <div className="space-y-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingDown className="h-6 w-6 mr-2 text-red-600" />
                    The Accountability Gap: Performance vs. Job Security
                  </CardTitle>
                  <p className="text-slate-600">
                    When approval ratings and reelection rates move in opposite directions, the electoral system has
                    failed.
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
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                    The Financial Barrier: Why Competition Cannot Exist
                  </CardTitle>
                  <p className="text-slate-600">
                    Incumbents raise 3-5 times more than challengers, creating an insurmountable barrier to electoral
                    competition.
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
                  <CardTitle className="flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                    Legislative Collapse: The Cost of No Accountability
                  </CardTitle>
                  <p className="text-slate-600">
                    When representatives cannot be fired, they stop working. Legislative productivity has collapsed to
                    historic lows.
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

          {/* Call to Action */}
          <section className="text-center bg-brand-navy text-white p-12 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6">The Solution Exists</h2>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              This crisis has a clear, achievable solution that requires no constitutional amendments or new laws. It
              requires only coordinated voter action to restore the accountability mechanism that democracy depends
              upon.
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
              Primary elections have 15-25% turnout. A coordinated 20% bloc vote can defeat 95% of incumbents through
              systematic challenger support. The power to restore democracy is already in your hands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link href="/solution">
                  <FileText className="h-5 w-5 mr-2" />
                  See the Solution
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-brand-navy bg-transparent"
              >
                <Link href="/pledge">
                  <Target className="h-5 w-5 mr-2" />
                  Take Action Now
                </Link>
              </Button>
            </div>
          </section>

          {/* Share Section */}
          <section className="text-center bg-slate-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Share This Analysis</h2>
            <p className="text-lg text-slate-600 mb-6">
              Help others understand why systematic congressional replacement is necessary for democratic survival.
            </p>
            <ShareButtons />
          </section>
        </div>
      </div>
    </div>
  )
}
