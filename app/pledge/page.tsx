import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PledgeForm } from "@/components/pledge-form"
import { PledgeCounter } from "@/components/pledge-counter"
import { ShareButtons } from "@/components/share-buttons"
import { Target, Users, Shield, TrendingUp } from "lucide-react"

export default function PledgePage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="bg-brand-navy text-brand-cream rounded-lg p-8 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Pledge to Reset the System</h1>
              <p className="text-xl text-slate-300 leading-relaxed mb-8">
                Join thousands of Americans in a simple, powerful act to restore a government that works for the people.
                Your pledge is a commitment to vote for a complete reset of Congress.
              </p>
              <PledgeCounter />
            </div>
          </div>

          {/* The Pledge */}
          <section className="mb-16">
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

          {/* Why This Matters */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why Your Pledge Matters</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-red-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Safeguard Our Democracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    An unresponsive government creates a vacuum for extremism. A system reset is the strongest defense
                    of our democratic principles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Empower the Voter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    This action reminds every politician that the ultimate authority belongs to the citizens they are
                    supposed to serve.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Force a Focus on Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    When job security is tied to performance, representatives are incentivized to solve problems that
                    affect the American people.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-center">Achieve Critical Mass</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-center">
                    It only takes a coordinated 20% of voters to achieve a full reset. Your pledge helps us reach that
                    goal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Pledge Form */}
          <section className="mb-16" id="pledge-form">
            <div className="bg-white border-2 border-blue-200 rounded-lg p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Make Your Commitment Official</h2>
              <p className="text-lg text-slate-700 text-center mb-8">
                Join the movement to restore congressional accountability. Your information helps us track momentum and
                organize effective electoral action.
              </p>
              <PledgeForm />
            </div>
          </section>

          {/* What Happens Next */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Happens After You Pledge</h2>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. You'll Receive Resources</h3>
                <p className="text-slate-700">
                  Get access to voter guides, district-specific information, and tools to help you make informed
                  decisions in every election. We'll help you easily identify incumbents on your ballot.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. You'll Get Election Reminders</h3>
                <p className="text-slate-700">
                  We'll notify you about upcoming primary and general elections in your area, where your vote has
                  maximum impact. You'll never miss an opportunity to hold incumbents accountable.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. You'll Help Build the Movement</h3>
                <p className="text-slate-700">
                  Your pledge adds to our growing numbers, showing politicians and the media that an organized,
                  cross-partisan opposition is building. As our movement grows, incumbents will start to take notice and
                  change their behavior.
                </p>
              </div>
            </div>
          </section>

          {/* Share Section */}
          <section className="text-center bg-blue-600 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Spread the Movement</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Every person who takes the pledge brings us closer to the critical mass needed for complete congressional
              turnover. Share Fresh 535 with your friends, family, and community.
            </p>

            <ShareButtons />

            <p className="text-lg mt-8 opacity-90">
              Together, we can restore accountability to Congress and protect democracy from authoritarian capture.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
