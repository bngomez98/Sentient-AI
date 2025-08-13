"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { District, Candidate } from "@/lib/api-clients"

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
      const response = await fetch(`/api/district?zip=${zipCode}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch district data")
      }

      if (!data || (!data.representatives.length && !data.senators.length)) {
        setError(
          "District data not found for this zip code. Try a major city zip code like 10001 (NYC), 90210 (LA), or 60601 (Chicago).",
        )
        setDistrict(null)
        return
      }

      setDistrict(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getIncumbencyBadge = (candidate: Candidate) => {
    if (candidate.isIncumbent) {
      return (
        <Badge variant="destructive" className="ml-2">
          INCUMBENT - VOTE OUT
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
        CHALLENGER
      </Badge>
    )
  }

  const getMarginColor = (margin: number) => {
    if (margin < 5) return "text-red-600"
    if (margin < 10) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Find Your Representatives</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Enter your zip code to see detailed information about your current representatives, their voting records,
          lobbying connections, and challenger information for the upcoming election.
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
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {!district && !loading && !error && (
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Built-in District Database</h3>
            <p className="text-blue-700 mb-4">
              This system uses a comprehensive built-in database of congressional districts and representatives. Try zip
              codes like:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="bg-white rounded px-3 py-2">10001 - NYC</div>
              <div className="bg-white rounded px-3 py-2">90210 - LA</div>
              <div className="bg-white rounded px-3 py-2">60601 - Chicago</div>
              <div className="bg-white rounded px-3 py-2">75201 - Dallas</div>
              <div className="bg-white rounded px-3 py-2">98101 - Seattle</div>
              <div className="bg-white rounded px-3 py-2">22201 - DC Area</div>
            </div>
          </div>
        </div>
      )}

      {district && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              {district.state} - District {district.district}
            </h2>
            <p className="text-slate-600">Your representatives in Congress and their accountability records</p>
          </div>

          <Tabs defaultValue="house" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="house">House Representative</TabsTrigger>
              <TabsTrigger value="senate">Senate Representatives</TabsTrigger>
            </TabsList>

            <TabsContent value="house" className="space-y-6">
              {district.representatives.map((rep) => (
                <CandidateCard key={rep.id} candidate={rep} />
              ))}
            </TabsContent>

            <TabsContent value="senate" className="space-y-6">
              {district.senators.map((senator) => (
                <CandidateCard key={senator.id} candidate={senator} />
              ))}
            </TabsContent>
          </Tabs>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Fresh 535 Action Plan
            </h3>
            <div className="space-y-3 text-red-700">
              <p className="font-semibold">
                Incumbents in your district:{" "}
                {[...district.representatives, ...district.senators].filter((c) => c.isIncumbent).length}
              </p>
              <p>
                <strong>Primary Election:</strong> Vote for any challenger running against the incumbent in your party's
                primary.
              </p>
              <p>
                <strong>General Election:</strong> If the incumbent wins the primary, vote for their opponent regardless
                of party.
              </p>
              <p className="text-sm">
                Remember: This is about system accountability, not individual performance. Every incumbent must go to
                reset the system.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getIncumbencyBadge = (candidate: Candidate) => {
    if (candidate.isIncumbent) {
      return (
        <Badge variant="destructive" className="ml-2">
          INCUMBENT - VOTE OUT
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
        CHALLENGER
      </Badge>
    )
  }

  const getMarginColor = (margin: number) => {
    if (margin < 5) return "text-red-600"
    if (margin < 10) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className={`${candidate.isIncumbent ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span>{candidate.name}</span>
            {getIncumbencyBadge(candidate)}
          </div>
          <Badge variant="outline">{candidate.party}</Badge>
        </CardTitle>
        <CardDescription>
          {candidate.office} • {candidate.state}
          {candidate.district && ` District ${candidate.district}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="voting">Voting Record</TabsTrigger>
            <TabsTrigger value="lobbying">Lobbying</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{candidate.yearsInOffice}</div>
                <div className="text-sm text-slate-500">Years in Office</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getMarginColor(candidate.lastElectionMargin || 0)}`}>
                  {candidate.lastElectionMargin?.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-500">Last Election Margin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">
                  {formatCurrency(candidate.fundraisingTotal || 0)}
                </div>
                <div className="text-sm text-slate-500">Total Fundraising</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">{candidate.lobbyingConnections?.length || 0}</div>
                <div className="text-sm text-slate-500">Lobbying Connections</div>
              </div>
            </div>

            {candidate.isIncumbent && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">Fresh 535 Recommendation</h4>
                <p className="text-red-700 text-sm">
                  This representative is an incumbent and should be voted out in both primary and general elections as
                  part of the system reset. Look for challenger candidates in the upcoming election.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="voting" className="space-y-4">
            <h4 className="font-semibold">Recent Voting Record</h4>
            {candidate.votingRecord?.map((vote, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{vote.billTitle}</div>
                  <div className="text-sm text-slate-600">{vote.description}</div>
                  <div className="text-xs text-slate-500">{vote.date}</div>
                </div>
                <div className="flex items-center">
                  {vote.vote === "yes" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {vote.vote === "no" && <XCircle className="h-5 w-5 text-red-600" />}
                  {vote.vote === "abstain" && <div className="h-5 w-5 rounded-full bg-gray-400" />}
                  <span className="ml-2 text-sm font-medium capitalize">{vote.vote}</span>
                </div>
              </div>
            )) || <p className="text-slate-500">No recent voting record available.</p>}
          </TabsContent>

          <TabsContent value="lobbying" className="space-y-4">
            <h4 className="font-semibold">Lobbying Connections</h4>
            {candidate.lobbyingConnections?.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{connection.organization}</div>
                  <div className="text-sm text-slate-600">{connection.industry}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(connection.amount)}</div>
                  <div className="text-sm text-slate-500">{connection.year}</div>
                </div>
              </div>
            )) || <p className="text-slate-500">No lobbying connections found.</p>}
          </TabsContent>

          <TabsContent value="funding" className="space-y-4">
            <h4 className="font-semibold">Campaign Funding Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Raised</span>
                <span className="font-bold">{formatCurrency(candidate.fundraisingTotal || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lobbying-Connected Funding</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(candidate.lobbyingConnections?.reduce((sum, conn) => sum + conn.amount, 0) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Funding from Special Interests</span>
                <span className="font-bold">
                  {(
                    ((candidate.lobbyingConnections?.reduce((sum, conn) => sum + conn.amount, 0) || 0) /
                      (candidate.fundraisingTotal || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            {candidate.isIncumbent && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-semibold text-yellow-800 mb-2">Incumbent Advantage</h5>
                <p className="text-yellow-700 text-sm">
                  Incumbents typically raise 3-5x more than challengers due to name recognition and established donor
                  networks. This funding advantage is one reason why Fresh 535 advocates for systematic replacement.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
