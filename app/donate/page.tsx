import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Heart, TrendingUp, Users, Megaphone } from "lucide-react"

export default function DonatePage() {
  return (
    <div className="bg-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Fuel the Movement</h1>
            <p className="text-xl text-slate-600">
              Your contribution directly funds our mission to restore congressional accountability. We are a 100%
              grassroots-funded organization and do not accept corporate or PAC money.
            </p>
          </div>

          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Make a One-Time Donation</CardTitle>
              <CardDescription>Choose an amount or enter your own.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Button variant="outline" size="lg" className="h-20 text-xl bg-transparent">
                  $10
                </Button>
                <Button variant="outline" size="lg" className="h-20 text-xl bg-blue-100 border-blue-700 text-blue-700">
                  $25
                </Button>
                <Button variant="outline" size="lg" className="h-20 text-xl bg-transparent">
                  $50
                </Button>
                <Button variant="outline" size="lg" className="h-20 text-xl bg-transparent">
                  $100
                </Button>
              </div>
              <Button size="lg" className="w-full text-lg">
                <Heart className="mr-2 h-5 w-5" /> Donate Now
              </Button>
              <p className="text-xs text-slate-500 text-center mt-4">
                Donations are processed securely. Fresh 535 is a registered 501(c)(4) organization. Contributions are
                not tax-deductible.
              </p>
            </CardContent>
          </Card>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Where Your Donation Goes</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <ImpactCard
                icon={<Megaphone className="h-8 w-8 text-blue-700" />}
                title="Voter Education"
                description="Funding for data-driven digital ad campaigns in key districts to inform citizens about incumbent performance and the accountability deficit."
              />
              <ImpactCard
                icon={<TrendingUp className="h-8 w-8 text-blue-700" />}
                title="Data & Research"
                description="Maintaining and expanding our public database on congressional performance, voting records, and electoral competition."
              />
              <ImpactCard
                icon={<Users className="h-8 w-8 text-blue-700" />}
                title="Grassroots Tools"
                description="Developing tools and resources, like district-specific scorecards and printable materials, for volunteers to organize locally."
              />
            </div>
          </div>

          <div className="mt-16 text-center bg-white p-8 rounded-lg border">
            <h2 className="text-3xl font-bold mb-4">Financial Transparency</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We are committed to the highest standard of transparency. All of our organizational financial records,
              including revenues and expenditures, will be published in a public, quarterly report available for
              download on this website. We believe that any organization demanding accountability must be fully
              accountable itself.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ImpactCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg border">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
)
