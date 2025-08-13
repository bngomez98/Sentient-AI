import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Lightbulb,
  Target,
  Users,
  ShieldQuestion,
  Calculator,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ShareButtons } from "@/components/share-buttons"

export default function SolutionPage() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-primary">
              The Solution: Coordinated Accountability
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              A mathematically precise strategy to restore electoral accountability through coordinated voter action. No
              constitutional amendments required. No new laws needed. Only organized civic engagement to activate the
              accountability mechanism that already exists.
            </p>
          </div>

          {/* The Mathematical Foundation */}
          <section className="mb-16">
            <div className="bg-primary text-primary-foreground p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center">
                <Calculator className="h-8 w-8 mr-3" />
                The Mathematical Foundation
              </h2>
              <p className="text-xl opacity-90 mb-4">
                Fresh 535 succeeds because it exploits the mathematical realities of low-turnout elections. The same
                structural advantages that protect incumbents become vulnerabilities when voters coordinate.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                    Primary Election Mathematics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Average Primary Turnout</span>
                      <span className="text-2xl font-bold text-blue-600">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Coordinated Bloc Needed</span>
                      <span className="text-2xl font-bold text-green-600">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Incumbent Defeat Rate</span>
                      <span className="text-2xl font-bold text-red-600">95%</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-4">
                      When 20% of voters coordinate against incumbents in 18% turnout elections, mathematical victory
                      becomes inevitable.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
                    Scaling Effect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Districts Needed for Impact</span>
                      <span className="text-2xl font-bold text-blue-600">50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Behavioral Change Threshold</span>
                      <span className="text-2xl font-bold text-green-600">10%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">System Reset Point</span>
                      <span className="text-2xl font-bold text-red-600">25%</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-4">
                      Defeating incumbents in just 50 districts changes behavior across all 535 seats. Fear of electoral
                      consequences restores accountability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">How Coordinated Accountability Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <StepCard
                icon={<Target className="h-10 w-10 text-primary" />}
                title="Step 1: Identify Incumbents"
                description="In every federal election, locate the current officeholder seeking reelection. Party affiliation is irrelevant. Incumbency is the only disqualifying factor that matters for system reset."
              />
              <StepCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Step 2: Vote for Challengers"
                description="Support any non-incumbent candidate in both primary and general elections. This is not candidate endorsement but system intervention. Quality improves when seats become competitive."
              />
              <StepCard
                icon={<Lightbulb className="h-10 w-10 text-primary" />}
                title="Step 3: Restore Accountability"
                description="Coordinated action creates representatives who understand their tenure depends entirely on voter satisfaction. Electoral fear replaces donor dependence as the primary motivating force."
              />
            </div>
          </section>

          {/* Why This Strategy Works */}
          <section className="mb-16">
            <div className="bg-green-50 border-l-4 border-green-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
                <CheckCircle className="h-8 w-8 mr-3" />
                Why This Strategy Succeeds Where Others Fail
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  Fresh 535 succeeds because it addresses the root cause rather than symptoms, uses existing mechanisms
                  rather than requiring systemic change, and leverages mathematical realities rather than hoping for
                  voluntary reform.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Exploits Low-Turnout Vulnerabilities</h3>
                <p>
                  Primary elections average 15-25% turnout, creating environments where organized minorities wield
                  disproportionate influence. Incumbents expect easy victories in these contests. A coordinated 20% bloc
                  vote becomes mathematically decisive, transforming the incumbent's greatest advantage into their
                  greatest vulnerability.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Creates Immediate Behavioral Change</h3>
                <p>
                  Representatives do not need to be defeated to modify their behavior. The credible threat of electoral
                  consequences restores responsiveness across the entire institution. When colleagues face unexpected
                  challenges or defeats, every incumbent recalculates their relationship with constituents versus
                  donors.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Requires No Institutional Permission</h3>
                <p>
                  Unlike constitutional amendments, campaign finance reform, or redistricting changes, Fresh 535
                  requires no approval from the very people who benefit from the current system. Voters possess the
                  constitutional authority to implement this solution immediately through existing electoral processes.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Scales Through Network Effects</h3>
                <p>
                  Each successful challenge demonstrates viability to other districts. Media coverage amplifies the
                  message. Potential challengers gain confidence. Donors begin supporting competitive races. The
                  movement becomes self-reinforcing as success breeds success.
                </p>
              </div>
            </div>
          </section>

          {/* Implementation Timeline */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Strategic Implementation Timeline</h2>
            <div className="space-y-8">
              <TimelinePhase
                phase="Phase 1: Foundation Building (Months 1-12)"
                title="Establishing Coordinated Infrastructure"
                icon={<Users className="h-6 w-6 text-blue-600" />}
                points={[
                  "Pledge acquisition targeting 20% voter participation in key districts",
                  "District-specific voter education campaigns explaining the accountability crisis",
                  "Primary election calendar mapping with turnout analysis and target identification",
                  "Volunteer network development for voter contact and election day operations",
                  "Media strategy implementation to shift narrative toward accountability rather than partisanship",
                ]}
              />
              <TimelinePhase
                phase="Phase 2: Tactical Execution (Months 12-24)"
                title="Coordinated Electoral Intervention"
                icon={<Target className="h-6 w-6 text-green-600" />}
                points={[
                  "Primary election targeting in 50-100 districts with highest incumbent vulnerability",
                  "Challenger recruitment and support in districts where no credible opposition exists",
                  "Voter mobilization campaigns focused on accountability messaging rather than policy positions",
                  "Real-time adjustment of tactics based on early primary results and incumbent responses",
                  "General election follow-through to complete the accountability cycle",
                ]}
              />
              <TimelinePhase
                phase="Phase 3: System Transformation (Months 24-48)"
                title="Institutional Behavioral Change"
                icon={<Zap className="h-6 w-6 text-red-600" />}
                points={[
                  "Measurement of incumbent behavioral changes in response to electoral pressure",
                  "Expansion to additional districts as success demonstrates viability",
                  "Legislative productivity monitoring to document improved congressional function",
                  "Public trust restoration as representatives become more responsive to constituent concerns",
                  "Establishment of permanent accountability infrastructure to prevent future entrenchment",
                ]}
              />
            </div>
          </section>

          {/* Expected Outcomes */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Anticipated Transformation Sequence</h2>
            <div className="space-y-6">
              <OutcomePhase
                phase="Immediate Impact (1-2 Election Cycles)"
                title="Electoral Competition Returns"
                points={[
                  "Incumbents face credible primary challenges for the first time in decades, forcing direct voter engagement",
                  "Unexpected defeats in 'safe' districts send shockwaves through the entire congressional establishment",
                  "Media narrative shifts from partisan conflict to voter empowerment and democratic accountability",
                  "Campaign fundraising patterns change as donors recognize that incumbency no longer guarantees victory",
                  "Representatives begin modifying behavior in anticipation of electoral consequences",
                ]}
              />
              <OutcomePhase
                phase="Institutional Adaptation (3-5 Election Cycles)"
                title="Congressional Behavior Modification"
                points={[
                  "Sitting representatives adopt constituent-focused approaches to avoid electoral challenges",
                  "Higher-quality candidates enter races as seats become genuinely competitive and winnable",
                  "Legislative focus shifts from partisan messaging to practical problem-solving that benefits constituents",
                  "Committee assignments and leadership positions become merit-based rather than seniority-based",
                  "Lobbying influence diminishes as representatives prioritize voter satisfaction over donor preferences",
                ]}
              />
              <OutcomePhase
                phase="Democratic Renewal (5+ Election Cycles)"
                title="Restored Representative Democracy"
                points={[
                  "Electoral competition becomes normalized, ensuring continuous responsiveness to voter preferences",
                  "Congress regains capacity for effective governance and long-term problem-solving",
                  "Public trust in democratic institutions recovers as performance improves measurably",
                  "Policy outcomes better reflect majority preferences rather than special interest priorities",
                  "American democracy serves as a renewed model for representative government worldwide",
                ]}
              />
            </div>
          </section>

          {/* Critical Success Factors */}
          <section className="mb-16">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                <Clock className="h-8 w-8 mr-3 text-blue-600" />
                Critical Success Factors
              </h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <p className="text-xl font-semibold mb-4">
                  Success requires disciplined execution of specific tactical elements that maximize impact while
                  minimizing resource requirements.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Voter Coordination Discipline</h3>
                <p>
                  Participants must vote against incumbents regardless of personal policy preferences or party loyalty.
                  This requires understanding that system accountability takes precedence over individual candidate
                  quality in the short term. Improved candidate quality emerges naturally as competition increases.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Primary Election Focus</h3>
                <p>
                  Primary elections offer the highest probability of success due to low turnout and incumbent
                  complacency. Resources must concentrate on these contests rather than dispersing across general
                  elections where turnout dilutes coordinated impact.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Message Consistency</h3>
                <p>
                  All communication must emphasize accountability and system reform rather than partisan politics or
                  specific policy positions. This maintains broad coalition appeal and prevents the movement from being
                  captured by any particular ideological faction.
                </p>

                <h3 className="text-xl font-bold mt-6 mb-3">Geographic Concentration</h3>
                <p>
                  Initial efforts must concentrate on districts where success is most achievable rather than attempting
                  nationwide implementation. Demonstrated victories in targeted areas create momentum for broader
                  expansion.
                </p>
              </div>
            </div>
          </section>

          {/* Addressing Objections */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Addressing Sophisticated Objections</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShieldQuestion className="text-primary" />
                  Responding to Legitimate Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg">
                      Doesn't this strategy risk replacing experienced legislators with unqualified amateurs?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-slate max-w-none">
                      <p>
                        This objection conflates incumbency with competence. Current congressional "experience" has
                        produced legislative paralysis, fiscal irresponsibility, and historic public disapproval. The
                        expertise incumbents possess centers on fundraising, internal party politics, and maintaining
                        power rather than effective governance.
                      </p>
                      <p>
                        New representatives bring direct accountability to recent voters, fresh perspectives uncorrupted
                        by decades of special interest relationships, and motivation to prove their competence through
                        actual performance. Historical analysis shows that periods of high congressional turnover often
                        correlate with increased legislative productivity and policy innovation.
                      </p>
                      <p>
                        Moreover, challenger quality improves dramatically when seats become competitive. Currently,
                        qualified candidates avoid challenging incumbents because defeat appears inevitable. When Fresh
                        535 demonstrates that incumbents can be defeated, higher-caliber challengers enter races.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg">
                      What if the challenger holds extremist views or lacks basic qualifications?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-slate max-w-none">
                      <p>
                        Fresh 535 provides voting instructions, not candidate endorsements. The movement's purpose is
                        system intervention, not individual candidate promotion. Challenger quality represents a
                        separate issue that resolves naturally as electoral competition increases.
                      </p>
                      <p>
                        Currently, many districts feature no meaningful challenger because qualified candidates
                        recognize the futility of opposing entrenched incumbents. When seats become winnable, mainstream
                        candidates with broader appeal enter races. Primary elections then serve their intended function
                        of selecting the most viable candidates.
                      </p>
                      <p>
                        The risk of electing suboptimal challengers must be weighed against the certainty of continued
                        institutional failure under permanent incumbency. Even a less-than-ideal challenger serves the
                        crucial function of demonstrating that electoral consequences exist, which modifies behavior
                        across the entire institution.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg">
                      Will high turnover weaken Congress relative to the executive branch and lobbyists?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-slate max-w-none">
                      <p>
                        This concern assumes that current congressional "strength" provides effective checks on
                        executive power and special interests. Evidence suggests the opposite: an entrenched,
                        unaccountable Congress has ceded authority to the executive branch while becoming increasingly
                        captured by lobbying interests.
                      </p>
                      <p>
                        Institutional knowledge resides not only in members but also in professional committee staff,
                        the Congressional Research Service, and other non-partisan support structures. These resources
                        remain available to new members who are motivated to use them effectively.
                      </p>
                      <p>
                        A responsive Congress with regular turnover actually provides stronger democratic governance
                        than a paralyzed but experienced one. Representatives who know they must face voters regularly
                        are more likely to exercise oversight responsibilities and resist executive overreach than those
                        with guaranteed tenure.
                      </p>
                      <p>
                        Regarding lobbying influence, new members without established special interest relationships are
                        less susceptible to capture than incumbents with decades of donor dependencies. Fresh 535 breaks
                        the cycle of mutual dependence between representatives and lobbying organizations.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg">
                      How does this differ from term limits, which have been tried and failed?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-slate max-w-none">
                      <p>
                        Term limits require constitutional amendments or state-level legislation that faces legal
                        challenges and political opposition from incumbents. Fresh 535 uses existing electoral
                        mechanisms that require no institutional permission or legal changes.
                      </p>
                      <p>
                        Term limits create arbitrary time restrictions regardless of performance, while Fresh 535
                        creates performance-based accountability. Representatives who truly serve their constituents
                        effectively could theoretically survive Fresh 535 challenges, though the current system makes
                        this unlikely.
                      </p>
                      <p>
                        Most importantly, Fresh 535 addresses the immediate crisis rather than waiting for long-term
                        institutional reform. It can be implemented in the next election cycle rather than requiring
                        decades of political and legal processes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-primary text-primary-foreground p-12 rounded-lg mb-16">
            <h2 className="text-3xl font-bold mb-6">The Solution Is in Your Hands</h2>
            <p className="text-xl mb-4 max-w-3xl mx-auto">
              Democracy's restoration requires no permission from those who broke it. The constitutional authority to
              implement this solution exists in every voting booth. The mathematical certainty of success exists in
              every low-turnout primary election.
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
              The only question remaining is whether enough citizens will coordinate their existing power to reclaim
              their democracy. Fresh 535 provides the strategy. You provide the votes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Link href="/pledge">
                  <Target className="h-5 w-5 mr-2" />
                  Join the Coordinated Vote
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                <Link href="/my-district">
                  <Users className="h-5 w-5 mr-2" />
                  Find Your Representatives
                </Link>
              </Button>
            </div>
          </section>

          {/* Share Section */}
          <section className="text-center bg-slate-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Share the Solution</h2>
            <p className="text-lg text-slate-600 mb-6">
              Help others understand how coordinated voter action can restore democratic accountability.
            </p>
            <ShareButtons />
          </section>
        </div>
      </div>
    </div>
  )
}

const StepCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center p-6 bg-slate-50 rounded-lg">
    {icon}
    <h3 className="text-xl font-bold my-4">{title}</h3>
    <p className="text-slate-600 text-center">{description}</p>
  </div>
)

const OutcomePhase = ({ phase, title, points }: { phase: string; title: string; points: string[] }) => (
  <div className="border-l-4 border-primary pl-6 py-4">
    <p className="text-sm font-semibold text-primary uppercase tracking-wider">{phase}</p>
    <h3 className="text-2xl font-bold mt-1 mb-3 text-primary">{title}</h3>
    <ul className="list-disc pl-5 space-y-2 text-slate-600">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
)

const TimelinePhase = ({
  phase,
  title,
  icon,
  points,
}: {
  phase: string
  title: string
  icon: React.ReactNode
  points: string[]
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{phase}</p>
          <h3 className="text-xl font-bold text-primary">{title}</h3>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="list-disc pl-5 space-y-2 text-slate-600">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
)
