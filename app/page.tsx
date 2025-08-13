import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Target, Vote, Zap, Globe, MapPin } from 'lucide-react'
import { HistoricalReelectionChart } from "@/components/charts/historical-reelection-chart"
import { CongressionalApprovalChart } from "@/components/charts/congressional-approval-chart"

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative section-padding overflow-hidden bg-brand-navy text-brand-cream">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto container-padding relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="text-center lg:text-left mb-8">
                <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">IF THEY'RE IN, THEY'RE OUT</div>
                <div className="text-xl md:text-2xl font-semibold text-white">VOTE IN A FRESH 535</div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Your Vote Doesn't Count.
                <br />
                <span className="text-gradient-red">We're Changing That.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-prose">
                They rigged the system. 95% reelection rate with 18% approval. Your representative ignores you because
                they know they'll win anyway. Fresh 535 breaks that cycle by coordinating voters to fire every single
                incumbent in one election.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="destructive">
                  <Link href="/pledge">
                    <Target className="h-5 w-5 mr-2" />
                    Join the Movement
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-white border-slate-400 hover:bg-white hover:text-brand-navy"
                >
                  <Link href="/solution">
                    See How We Win
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000">
              <Image
                src="/brand-logo.png"
                alt="Fresh 535 Logo"
                width={400}
                height={400}
                className="w-full max-w-sm mx-auto drop-shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">Why Your Representative Ignores You</h2>
            <p className="text-lg text-slate-600">
              They know they'll win. 95% of House incumbents get reelected even with 18% approval. They've built an
              unbeatable system of name recognition, gerrymandered districts, and donor networks. Only coordinated voter
              action can break it.
            </p>
          </div>

          <div className="text-center mb-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
            >
              <Link href="/my-district">
                <MapPin className="h-5 w-5 mr-2" />
                See How Long Yours Has Been There
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl mb-4 text-center">They Don't Care What You Think</h3>
              <div className="h-80 border rounded-lg p-4 bg-white shadow-lg">
                <CongressionalApprovalChart />
              </div>
              <p className="text-sm text-slate-600 mt-2 text-center">
                18% approval but they keep getting reelected. The system is broken.
              </p>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl mb-4 text-center">They Know They Can't Lose</h3>
              <div className="h-80 border rounded-lg p-4 bg-white shadow-lg">
                <HistoricalReelectionChart />
              </div>
              <p className="text-sm text-slate-600 mt-2 text-center">
                95% reelection rate means your vote is meaningless under current system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Strategy Section */}
      <section className="section-padding bg-slate-50">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl mb-4">How We Take Back Control</h2>
            <p className="text-lg text-slate-600">
              Primary elections have 15-25% turnout. General elections 55-60%. A coordinated 20% of voters can defeat
              any incumbent. Fresh 535 coordinates that 20% to fire all 535 in one election cycle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3 p-6 bg-white border rounded-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Vote className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Primary: Vote Them Out</h3>
              <p className="text-slate-600">
                Vote for any challenger against your incumbent. Low turnout means we don't need many voters to win. Your
                vote finally counts.
              </p>
            </div>
            <div className="space-y-3 p-6 bg-white border rounded-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">General: Finish the Job</h3>
              <p className="text-slate-600">
                If they survive the primary, vote for their opponent. Party doesn't matter. Being an incumbent is the
                only disqualification we care about.
              </p>
            </div>
            <div className="space-y-3 p-6 bg-white border rounded-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Globe className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Victory: They Work for Us</h3>
              <p className="text-slate-600">
                New representatives with no seniority, no committee power, no lobbyist connections. They'll actually
                need your vote to survive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-brand-navy text-white">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-3xl md:text-4xl font-bold text-red-400 mb-6">VOTE IN A FRESH 535</div>
            <h2 className="text-2xl md:text-3xl mb-4">The Movement Is Growing. Join Before It's Too Late.</h2>
            <p className="text-lg text-slate-300 mb-8">
              Every day more voters realize their representatives don't represent them. Fresh 535 gives them a way to
              fight back. Join now and help coordinate the largest voter rebellion in American history.
            </p>
            <Button asChild size="lg" variant="destructive">
              <Link href="/pledge">
                <Users className="h-5 w-5 mr-2" />
                Take the Fresh 535 Pledge
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Privacy Notice Section */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto container-padding">
          <div className="text-center text-sm text-slate-600">
            <p className="mb-2">
              <strong>Privacy Notice:</strong> Fresh 535 respects your privacy. We collect minimal information necessary for voter coordination and never share personal data with third parties.
            </p>
            <p>
              Email addresses remain private and are used only for movement updates. Anonymous pledges are welcome and equally valuable.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
