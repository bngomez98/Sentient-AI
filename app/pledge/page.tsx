"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PledgeForm } from "@/components/pledge-form"
import { PledgeCounter } from "@/components/pledge-counter"
import { ShareButtons } from "@/components/share-buttons"
import { Target, Users, Shield, TrendingUp, CheckCircle, Clock, Vote } from "lucide-react"

export default function PledgePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <div className="bg-brand-navy text-white rounded-lg p-8 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Take the Fresh 535 Pledge</h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                Join thousands of Americans in a simple, powerful act to restore a government that works for the people.
                Your pledge is a commitment to vote for complete congressional accountability.
              </p>
              <PledgeCounter />
            </div>

            <div className="bg-white border-2 border-brand-navy rounded-lg p-8 shadow-xl mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Make Your Commitment Official</h2>
              <p className="text-lg text-slate-700 text-center mb-8">
                Join the movement to restore congressional accountability. Your information helps us track momentum and
                organize effective electoral action.
              </p>
              <PledgeForm />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-lg">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">The Fresh 535 Pledge</h2>
              <div className="prose prose-lg max-w-none text-slate-800">
                <blockquote className="text-xl italic text-blue-900 border-l-4 border-blue-300 pl-6 mb-6">
                  "I pledge to vote against every incumbent member of Congress in every election until we achieve
                  complete congressional turnover. I will vote for any qualified challenger over any incumbent,
                  regardless of party affiliation, because accountability matters more than ideology."
                </blockquote>

                <p className="text-lg text-slate-700">
                  By taking this pledge, you are sending a clear message: the time for partisan excuses is over. The
                  time for accountability is now. You join a growing, cross-partisan movement of Americans who believe
                  that our representatives should serve the people, not special interests, donors, or lobbyists.
                </p>
              </div>
            </div>
          </section>

          {/* Strategy and Implementation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Strategy Behind Your Pledge</h2>

            <div className="space-y-8">
              <div className="bg-green-50 border-l-4 border-green-600 p-8 rounded-r-lg">
                <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center">
                  <Vote className="h-6 w-6 mr-3" />
                  How This Strategy Works
                </h3>
                <div className="prose prose-lg max-w-none text-slate-800">
                  <p>
                    Primary elections typically see 15-25% voter turnout. General elections in non-presidential years
                    average 40% turnout. This means that a coordinated bloc of just 20% of eligible voters can determine
                    the outcome of most congressional races.
                  </p>
                  <p>
                    When 20% of voters commit to supporting any qualified challenger over any incumbent, regardless of
                    party, it creates a mathematical certainty of incumbent defeat. This strategy bypasses the partisan
                    divisions that have protected incumbents and focuses solely on the accountability mechanism that
                    democracy requires.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-600 p-8 rounded-r-lg">
                <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
                  <Target className="h-6 w-6 mr-3" />
                  What Needs to Be Done
                </h3>
                <div className="prose prose-lg max-w-none text-slate-800">
                  <p>
                    <strong>Phase One: Reach Critical Mass (20% of voters in target districts)</strong>
                    <br />
                    We need 20% of voters in at least 100 congressional districts to take the pledge. This creates a
                    credible threat that forces incumbents to change their behavior even before elections occur.
                  </p>
                  <p>
                    <strong>Phase Two: Primary Election Targeting</strong>
                    <br />
                    Focus on primary elections where turnout is lowest and our impact is highest. Support qualified
                    challengers with grassroots organizing, volunteer recruitment, and voter education.
                  </p>
                  <p>
                    <strong>Phase Three: General Election Follow-Through</strong>
                    <br />
                    Maintain commitment in general elections, supporting challengers regardless of party affiliation.
                    This demonstrates that accountability transcends partisan loyalty.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-lg">
                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  The Specific Effects
                </h3>
                <div className="prose prose-lg max-w-none text-slate-800">
                  <p>
                    <strong>Immediate Effects (Within One Election Cycle):</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• Incumbents begin responding to constituent concerns rather than donor demands</li>
                    <li>
                      • Legislative productivity increases as representatives focus on governing rather than fundraising
                    </li>
                    <li>• Special interest influence decreases as representatives fear electoral consequences</li>
                    <li>• Media coverage shifts from partisan conflict to governance performance</li>
                  </ul>

                  <p>
                    <strong>Medium-Term Effects (2-3 Election Cycles):</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• Complete turnover of congressional leadership and committee chairs</li>
                    <li>• Elimination of the "revolving door" between Congress and lobbying</li>
                    <li>• Restoration of regular order in legislative processes</li>
                    <li>• Significant reduction in federal deficit spending</li>
                  </ul>

                  <p>
                    <strong>Long-Term Effects (5+ Years):</strong>
                  </p>
                  <ul className="space-y-2">
                    <li>• Permanent culture change where representatives expect to be held accountable</li>
                    <li>• Restoration of public trust in democratic institutions</li>
                    <li>• Increased civic engagement as voters see their actions produce results</li>
                    <li>• Model for democratic renewal that can be replicated at state and local levels</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Why This Matters */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Your Pledge Matters</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Safeguard Democratic Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    An unresponsive government creates conditions for authoritarian capture. Systematic congressional
                    replacement is the strongest defense against institutional breakdown and democratic backsliding.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Restore Voter Authority</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    This action reminds every politician that ultimate authority belongs to citizens, not donors,
                    lobbyists, or party leadership. It restores the fundamental principle of democratic governance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Force Performance-Based Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    When job security depends on performance rather than fundraising ability, representatives focus on
                    solving problems that affect constituents rather than serving special interests.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Create Urgency for Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    A coordinated 20% bloc vote creates immediate electoral pressure that forces representatives to
                    address long-ignored problems rather than continuing decades of legislative inaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What Happens Next */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Happens After You Pledge</h2>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. You Receive Comprehensive Resources</h3>
                <p className="text-slate-700">
                  Access detailed voter guides, district-specific incumbent performance data, challenger information,
                  and tools to help you make informed decisions in every election. We provide everything you need to
                  easily identify incumbents and evaluate challengers on your ballot.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. You Get Strategic Election Alerts</h3>
                <p className="text-slate-700">
                  Receive notifications about upcoming primary and general elections in your area, focusing on races
                  where your vote has maximum impact. We identify the most vulnerable incumbents and the most viable
                  challengers to maximize the effectiveness of your pledge commitment.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. You Help Build Critical Mass</h3>
                <p className="text-slate-700">
                  Your pledge contributes to our growing numbers, demonstrating to politicians, media, and other voters
                  that an organized, cross-partisan movement for accountability is building momentum. As we approach
                  critical mass in target districts, incumbents begin changing their behavior preemptively.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. You Join Local Organizing Efforts</h3>
                <p className="text-slate-700">
                  Connect with other pledge-takers in your district for coordinated voter education, challenger
                  recruitment, and grassroots organizing. Local organization multiplies the impact of individual pledges
                  and creates the sustained pressure necessary for systematic change.
                </p>
              </div>
            </div>
          </section>

          {/* Share Section */}
          <section className="text-center bg-brand-navy text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Spread the Movement</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Every person who takes the pledge brings us closer to the critical mass needed for complete congressional
              turnover. Share Fresh 535 with your friends, family, and community.
            </p>

            <ShareButtons />

            <p className="text-lg mt-8 opacity-90">
              Together, we can restore accountability to Congress and protect democracy from institutional capture.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
