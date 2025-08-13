import { type NextRequest, NextResponse } from "next/server"
import { ballotpediaClient, openSecretsClient } from "@/lib/api-clients"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zipCode = searchParams.get("zip")

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json({ error: "Valid 5-digit zip code required" }, { status: 400 })
  }

  try {
    const district = await ballotpediaClient.getCandidatesByZip(zipCode)

    if (!district) {
      return NextResponse.json({ error: "District not found" }, { status: 404 })
    }

    // Enhance with lobbying data
    const allCandidates = [...district.representatives, ...district.senators]
    for (const candidate of allCandidates) {
      candidate.lobbyingConnections = await openSecretsClient.getLobbyingData(candidate.id)
      candidate.votingRecord = await openSecretsClient.getVotingRecord(candidate.id)
    }

    return NextResponse.json(district)
  } catch (error) {
    console.error("Error fetching district data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
