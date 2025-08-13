"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, AlertTriangle, ExternalLink, Building } from "lucide-react"
import { getDistrictData } from "@/lib/district-data"
import type { District, Representative, Senator, LocalOfficial } from "@/lib/district-data"

export default function MyDistrictPage() {
  const [zipCode, setZipCode] = useState("")
  const [district, setDistrict] = useState<District | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const districtData = getDistrictData(zipCode)

      if (!districtData) {
        setError("District data not found for this zip code. Please try another zip code.")
        setDistrict(null)
        return
      }

      setDistrict(districtData)
    } catch (err) {
      setError("An error occurred while looking up your district")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Your Representatives</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Enter your zip code to see detailed information about your current representatives, their years in office,
          voting records, and contact information. This system works for any US zip code.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter your 5-digit zip code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="pl-10"
              maxLength={5}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="bg-primary hover:bg-primary/90">
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {!district && !loading && !error && (
        <div className="text-center py-12">
          <div className="bg-slate-100 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-2 text-primary">Comprehensive District Database</h3>
            <p className="mb-4 text-slate-700">
              This system provides detailed information for any US zip code, including current representatives, their
              years in office, committee memberships, voting records, and official contact information.
            </p>
          </div>
        </div>
      )}

      {district && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-primary">
              {district.state} - District {district.district}
            </h2>
            <p className="text-slate-600">Your current representatives and their information</p>
          </div>

          <Tabs defaultValue="house" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="house">House Representative</TabsTrigger>
              <TabsTrigger value="senate">Senators</TabsTrigger>
              <TabsTrigger value="local">Local Officials</TabsTrigger>
            </TabsList>

            <TabsContent value="house" className="space-y-6">
              {district.representatives.map((rep) => (
                <RepresentativeCard key={rep.id} representative={rep} />
              ))}
            </TabsContent>

            <TabsContent value="senate" className="space-y-6">
              {district.senators.map((senator) => (
                <SenatorCard key={senator.id} senator={senator} />
              ))}
            </TabsContent>

            <TabsContent value="local" className="space-y-6">
              {district.localOfficials?.map((official, index) => (
                <LocalOfficialCard key={index} official={official} />
              )) || <p className="text-slate-500 text-center">Local official data not available for this area.</p>}
            </TabsContent>
          </Tabs>

          <div className="bg-primary text-primary-foreground rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Fresh 535 Action Plan
            </h3>
            <div className="space-y-3">
              <p className="font-semibold">
                Incumbents representing you:{" "}
                {[...district.representatives, ...district.senators].filter((rep) => rep.isIncumbent).length}
              </p>
              <p>
                <strong>Primary Election:</strong> Vote for any challenger running against incumbents in your party's
                primary.
              </p>
              <p>
                <strong>General Election:</strong> If incumbents win their primaries, vote for their opponents
                regardless of party.
              </p>
              <p className="text-sm opacity-90">
                Fresh 535 focuses on systematic accountability. Every incumbent must be replaced to reset congressional
                power structures and restore representative democracy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RepresentativeCard({ representative }: { representative: Representative }) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary">{representative.name}</span>
            {representative.isIncumbent && (
              <Badge variant="outline" className="ml-2 border-slate-400 text-slate-700">
                INCUMBENT
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {representative.party}
          </Badge>
        </CardTitle>
        <CardDescription>
          {representative.office} • {representative.state}
          {representative.district && ` District ${representative.district}`}• {representative.yearsInOffice} years in
          office
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="committees">Committees</TabsTrigger>
            <TabsTrigger value="voting">Key Votes</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{representative.yearsInOffice}</div>
                <div className="text-sm text-slate-500">Years in Office</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {representative.lastElectionMargin?.toFixed(1) || "N/A"}%
                </div>
                <div className="text-sm text-slate-500">Last Election Margin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{representative.termStart.split("-")[0]}</div>
                <div className="text-sm text-slate-500">Term Started</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-700">Official Links</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={representative.officialLinks.official} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Official Site
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={representative.officialLinks.congress} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Congress.gov
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={representative.officialLinks.govtrack} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Voting Record
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={representative.officialLinks.opensecrets} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Campaign Finance
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="committees" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Committee Memberships</h4>
            {representative.committeeMemberships.length > 0 ? (
              <div className="space-y-2">
                {representative.committeeMemberships.map((committee, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-slate-50">
                    <div className="font-medium text-slate-700">{committee}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Committee information not available.</p>
            )}
          </TabsContent>

          <TabsContent value="voting" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Recent Key Votes</h4>
            {representative.keyVotes.length > 0 ? (
              <div className="space-y-3">
                {representative.keyVotes.map((vote, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-700">{vote.billTitle}</div>
                        <div className="text-sm text-slate-600 mb-1">{vote.description}</div>
                        <div className="text-xs text-slate-500">
                          {vote.date} • {vote.billNumber}
                        </div>
                      </div>
                      <Badge
                        variant={vote.vote === "yes" ? "default" : vote.vote === "no" ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        {vote.vote.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Recent voting record not available.</p>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Contact Information</h4>
            <div className="space-y-3">
              {representative.contactInfo.dcOffice && (
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="h-4 w-4 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-700">Washington, DC Office</div>
                    <div className="text-sm text-slate-600">{representative.contactInfo.dcOffice}</div>
                    {representative.contactInfo.dcPhone && (
                      <div className="text-sm text-slate-600">{representative.contactInfo.dcPhone}</div>
                    )}
                  </div>
                </div>
              )}

              {representative.contactInfo.stateOffices.map((office, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="h-4 w-4 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-700">{office.city} Office</div>
                    <div className="text-sm text-slate-600">{office.address}</div>
                    <div className="text-sm text-slate-600">{office.phone}</div>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <ExternalLink className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="font-medium text-slate-700">Official Website</div>
                  <a
                    href={representative.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {representative.contactInfo.website}
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function SenatorCard({ senator }: { senator: Senator }) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary">{senator.name}</span>
            {senator.isIncumbent && (
              <Badge variant="outline" className="ml-2 border-slate-400 text-slate-700">
                INCUMBENT
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {senator.party}
          </Badge>
        </CardTitle>
        <CardDescription>
          {senator.office} • {senator.state} • {senator.yearsInOffice} years in office • Next election:{" "}
          {senator.nextElection}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="committees">Committees</TabsTrigger>
            <TabsTrigger value="voting">Key Votes</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{senator.yearsInOffice}</div>
                <div className="text-sm text-slate-500">Years in Office</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {senator.lastElectionMargin?.toFixed(1) || "N/A"}%
                </div>
                <div className="text-sm text-slate-500">Last Election Margin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">Class {senator.senatorClass}</div>
                <div className="text-sm text-slate-500">Senate Class</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{senator.nextElection}</div>
                <div className="text-sm text-slate-500">Next Election</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-700">Official Links</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={senator.officialLinks.official} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Official Site
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={senator.officialLinks.congress} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Congress.gov
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={senator.officialLinks.govtrack} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Voting Record
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={senator.officialLinks.opensecrets} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Campaign Finance
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="committees" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Committee Memberships</h4>
            {senator.committeeMemberships.length > 0 ? (
              <div className="space-y-2">
                {senator.committeeMemberships.map((committee, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-slate-50">
                    <div className="font-medium text-slate-700">{committee}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Committee information not available.</p>
            )}
          </TabsContent>

          <TabsContent value="voting" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Recent Key Votes</h4>
            {senator.keyVotes.length > 0 ? (
              <div className="space-y-3">
                {senator.keyVotes.map((vote, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-slate-700">{vote.billTitle}</div>
                        <div className="text-sm text-slate-600 mb-1">{vote.description}</div>
                        <div className="text-xs text-slate-500">
                          {vote.date} • {vote.billNumber}
                        </div>
                      </div>
                      <Badge
                        variant={vote.vote === "yes" ? "default" : vote.vote === "no" ? "destructive" : "secondary"}
                        className="ml-2"
                      >
                        {vote.vote.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Recent voting record not available.</p>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <h4 className="font-semibold text-slate-700">Contact Information</h4>
            <div className="space-y-3">
              {senator.contactInfo.dcOffice && (
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="h-4 w-4 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-700">Washington, DC Office</div>
                    <div className="text-sm text-slate-600">{senator.contactInfo.dcOffice}</div>
                    {senator.contactInfo.dcPhone && (
                      <div className="text-sm text-slate-600">{senator.contactInfo.dcPhone}</div>
                    )}
                  </div>
                </div>
              )}

              {senator.contactInfo.stateOffices.map((office, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="h-4 w-4 mt-1 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-700">{office.city} Office</div>
                    <div className="text-sm text-slate-600">{office.address}</div>
                    <div className="text-sm text-slate-600">{office.phone}</div>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <ExternalLink className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="font-medium text-slate-700">Official Website</div>
                  <a
                    href={senator.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {senator.contactInfo.website}
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LocalOfficialCard({ official }: { official: LocalOfficial }) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary">{official.name}</span>
            {official.isIncumbent && (
              <Badge variant="outline" className="ml-2 border-slate-400 text-slate-700">
                INCUMBENT
              </Badge>
            )}
          </div>
          {official.party && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {official.party}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {official.office} • {official.yearsInOffice} years in office
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
