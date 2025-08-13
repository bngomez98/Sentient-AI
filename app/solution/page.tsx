import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Target, Users, ShieldQuestion } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SolutionPage() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">The Strategy for Accountability</h1>
            <p className="text-xl text-stone-600">
              A detailed guide to the Fresh 535 movement's theory of change and practical application.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works: A Three-Step Process</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <StepCard
                icon={<Target className="h-10 w-10 text-blue-700" />}
                title="Step 1: Identify"
                description="In any federal election (House or Senate), find the incumbent on your ballot. They are the current officeholder running for reelection."
              />
              <StepCard
                icon={<Users className="h-10 w-10 text-blue-700" />}
                title="Step 2: Replace"
                description="Vote for any non-incumbent challenger. The goal is turnover, not endorsement. This applies to both primary and general elections."
              />
              <StepCard
                icon={<Lightbulb className="h-10 w-10 text-blue-700" />}
                title="Step 3: Reset"
                description="This action, when coordinated, creates a legislature of representatives who know they serve at the pleasure of the voters, not the party."
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              The Theory of Change: The Power of a Coordinated Minority
            </h2>
            <div className="prose prose-lg max-w-none">
              <p>
                The Fresh 535 strategy is effective because it leverages core democratic principles in a system that has
                become unresponsive. It does not require a majority of voters to succeed.
              </p>
              <ul>
                <li>
                  <strong>Leveraging Primary Elections:</strong> Congressional primaries often have very low turnout. In
                  this environment, a small, organized bloc of voters can have an outsized impact, replacing an
                  incumbent who expects an easy victory. This is a key area of focus.
                </li>
                <li>
                  <strong>Influencing General Elections:</strong> While many districts are considered "safe" for one
                  party, the overall balance of power in Congress often depends on a few dozen competitive races. A
                  coordinated vote against incumbents in these races can shift the institutional dynamics.
                </li>
                <li>
                  <strong>Restoring Responsiveness:</strong> The true power is not just in replacing members, but in
                  changing the behavior of the entire institution. A representative who won a surprisingly close race,
                  or who saw their colleagues unexpectedly defeated, is far more likely to be responsive to constituent
                  concerns. They will govern with the knowledge that their position is temporary and depends entirely on
                  the will of the voters.
                </li>
              </ul>
              <p>
                The objective is not to influence any single policy outcome, but to reset the electoral incentives for
                all members of Congress.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Anticipated Outcomes & Strategic Trajectory</h2>
            <div className="space-y-6">
              <OutcomePhase
                phase="Phase 1: Short-Term (1-2 Election Cycles)"
                title="A More Responsive Dialogue"
                points={[
                  "Incumbents in safe districts face credible primary challenges, forcing them to engage with voters.",
                  "A small number of unexpected defeats sends a clear signal that no seat is guaranteed.",
                  "Media narrative shifts to focus on voter empowerment and the demand for a more responsive government.",
                ]}
              />
              <OutcomePhase
                phase="Phase 2: Medium-Term (3-5 Election Cycles)"
                title="A Focus on Problem-Solving"
                points={[
                  "Sitting representatives adopt more moderate, consensus-oriented approaches to avoid electoral challenges.",
                  "More qualified, non-traditional candidates are attracted to run as more seats become genuinely competitive.",
                  "Legislative focus begins to shift from partisan messaging to addressing key national issues.",
                ]}
              />
              <OutcomePhase
                phase="Phase 3: Long-Term (5+ Election Cycles)"
                title="A System Aligned with the People"
                points={[
                  "A 'new normal' is established where every seat is considered contestable, ensuring constant responsiveness.",
                  "Congress becomes a more dynamic and effective institution capable of tackling long-term challenges.",
                  "Public trust in the legislative branch begins to recover as its performance improves the lives of Americans.",
                ]}
              />
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Implementation Plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Phase A: Mobilize</h3>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>Pledge capture and reminder workflow</li>
                  <li>District-focused share kits</li>
                  <li>Volunteer onboarding</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Phase B: Target</h3>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>Primary calendar map and turnout goals</li>
                  <li>Incumbent risk score (beta)</li>
                  <li>Localized messaging</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Phase C: Execute</h3>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>Vote reminders and early-vote prompts</li>
                  <li>Field reports and rapid adjustments</li>
                  <li>Post-election analysis and debrief</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8">
              <a
                href="/pledge"
                className="inline-flex items-center px-6 py-3 rounded-md bg-blue-700 text-white font-semibold"
              >
                Join the Coordinated Vote
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center mb-8">Addressing Sophisticated Objections</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ShieldQuestion className="text-blue-700" /> Answering Your Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg">
                      Doesn't this strategy risk replacing experienced legislators with unqualified amateurs?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-stone max-w-none">
                      This objection equates incumbency with valuable expertise. However, the data shows that the
                      "experience" of the current Congress has produced legislative paralysis and record-low public
                      trust. The expertise acquired is often in navigating the D.C. fundraising system and internal
                      party politics, not in effective governance. New members bring fresh perspectives and, most
                      importantly, a direct connection to the voters who just elected them, rather than decades of
                      allegiance to a broken system.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg">
                      What if the challenger is an extremist or holds dangerous views?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-stone max-w-none">
                      The Fresh 535 movement is an instruction to vote against the incumbent, not an endorsement of the
                      challenger. The quality of challengers is a separate issue that will improve over time as
                      districts become more competitive. When a seat is seen as "winnable," more qualified, mainstream
                      candidates are incentivized to run. In the short term, even a less-than-ideal challenger serves
                      the primary purpose: to break the cycle of incumbency and prove that no seat is safe. The risk of
                      electing a poor challenger is outweighed by the certainty of continued institutional failure under
                      the status quo.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg">
                      Will this cause a loss of "institutional memory" and weaken Congress relative to the executive
                      branch?
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-stone max-w-none">
                      This is a valid concern. However, institutional knowledge resides not just in members, but also in
                      professional committee staff, the Congressional Research Service, and other non-partisan bodies.
                      High turnover may initially create challenges, but it also breaks up entrenched power structures
                      and committee fiefdoms that contribute to gridlock. A more responsive, dynamic Congress, even if
                      less tenured, is arguably a stronger check on executive power than a paralyzed but experienced
                      one.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

const StepCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center">
    {icon}
    <h3 className="text-xl font-bold my-4">{title}</h3>
    <p className="text-stone-600">{description}</p>
  </div>
)

const OutcomePhase = ({ phase, title, points }: { phase: string; title: string; points: string[] }) => (
  <div className="border-l-4 border-blue-700 pl-6 py-4">
    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider">{phase}</p>
    <h3 className="text-2xl font-bold mt-1 mb-3">{title}</h3>
    <ul className="list-disc pl-5 space-y-1 text-slate-600">
      {points.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
)
