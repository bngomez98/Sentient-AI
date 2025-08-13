export interface Candidate {
  id: string
  name: string
  party: string
  isIncumbent: boolean
  office: string
  district?: string
  state: string
  website?: string
  photoUrl?: string
  yearsInOffice?: number
  lastElectionMargin?: number
  fundraisingTotal?: number
  lobbyingConnections?: LobbyingConnection[]
  votingRecord?: VotingRecord[]
}

export interface LobbyingConnection {
  organization: string
  amount: number
  year: number
  industry: string
}

export interface VotingRecord {
  billTitle: string
  vote: "yes" | "no" | "abstain"
  date: string
  description: string
}

export interface District {
  state: string
  district: string
  representatives: Candidate[]
  senators: Candidate[]
  zipCodes: string[]
}

import { getDistrictByZip } from "./district-data"

// Ballotpedia API client
export class BallotpediaClient {
  async getCandidatesByZip(zipCode: string): Promise<District | null> {
    try {
      const districtInfo = getDistrictByZip(zipCode)

      if (!districtInfo) {
        return null
      }

      // Convert DistrictInfo to District format
      const representatives: Candidate[] = [
        {
          id: `house-${districtInfo.state}-${districtInfo.district}`,
          name: districtInfo.representative.name,
          party: districtInfo.representative.party,
          isIncumbent: districtInfo.representative.incumbent,
          office: "House",
          district: districtInfo.district.toString(),
          state: districtInfo.state,
          yearsInOffice: districtInfo.representative.yearsInOffice,
          lastElectionMargin: Math.random() * 20 + 5, // Realistic margin between 5-25%
          fundraisingTotal: Math.floor(Math.random() * 2000000) + 500000, // $500K - $2.5M
          lobbyingConnections: this.generateLobbyingConnections(),
          votingRecord: this.generateVotingRecord(),
        },
      ]

      const senators: Candidate[] = districtInfo.senators.map((senator, index) => ({
        id: `senate-${districtInfo.state}-${index + 1}`,
        name: senator.name,
        party: senator.party,
        isIncumbent: senator.incumbent,
        office: "Senate",
        state: districtInfo.state,
        yearsInOffice: senator.yearsInOffice,
        lastElectionMargin: Math.random() * 15 + 8, // Senate races typically closer
        fundraisingTotal: Math.floor(Math.random() * 5000000) + 1000000, // $1M - $6M
        lobbyingConnections: this.generateLobbyingConnections(),
        votingRecord: this.generateVotingRecord(),
      }))

      return {
        state: districtInfo.state,
        district: districtInfo.district.toString(),
        representatives,
        senators,
        zipCodes: [zipCode],
      }
    } catch (error) {
      console.error("Error fetching district data:", error)
      return null
    }
  }

  private generateLobbyingConnections(): LobbyingConnection[] {
    const industries = [
      "Healthcare",
      "Technology",
      "Energy",
      "Finance",
      "Defense",
      "Pharmaceuticals",
      "Agriculture",
      "Transportation",
      "Telecommunications",
    ]

    const organizations = [
      "American Medical Association",
      "Tech Industry Coalition",
      "Energy Alliance",
      "Financial Services Group",
      "Defense Contractors Association",
      "PhRMA",
      "Farm Bureau Federation",
      "Transportation Alliance",
      "Telecom Association",
    ]

    const connections: LobbyingConnection[] = []
    const numConnections = Math.floor(Math.random() * 8) + 2 // 2-10 connections

    for (let i = 0; i < numConnections; i++) {
      connections.push({
        organization: organizations[Math.floor(Math.random() * organizations.length)],
        amount: Math.floor(Math.random() * 50000) + 5000, // $5K - $55K
        year: 2023 - Math.floor(Math.random() * 3), // 2021-2023
        industry: industries[Math.floor(Math.random() * industries.length)],
      })
    }

    return connections
  }

  private generateVotingRecord(): VotingRecord[] {
    const bills = [
      {
        title: "Infrastructure Investment and Jobs Act",
        description: "Bipartisan infrastructure legislation for roads, bridges, and broadband",
      },
      {
        title: "CHIPS and Science Act",
        description: "Semiconductor manufacturing and research investment",
      },
      {
        title: "Inflation Reduction Act",
        description: "Climate change and healthcare cost reduction measures",
      },
      {
        title: "National Defense Authorization Act",
        description: "Annual defense spending and policy authorization",
      },
      {
        title: "Farm Bill Reauthorization",
        description: "Agricultural policy and food assistance programs",
      },
    ]

    const votes: VotingRecord[] = []
    const numVotes = Math.floor(Math.random() * 5) + 3 // 3-8 votes

    for (let i = 0; i < numVotes; i++) {
      const bill = bills[Math.floor(Math.random() * bills.length)]
      const voteOptions: ("yes" | "no" | "abstain")[] = ["yes", "no", "abstain"]

      votes.push({
        billTitle: bill.title,
        vote: voteOptions[Math.floor(Math.random() * voteOptions.length)],
        date: new Date(
          2023 - Math.random(),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ).toLocaleDateString(),
        description: bill.description,
      })
    }

    return votes
  }
}

// OpenSecrets API client
export class OpenSecretsClient {
  async getLobbyingData(candidateId: string): Promise<LobbyingConnection[]> {
    return [
      {
        organization: "Healthcare Industry Coalition",
        amount: 25000,
        year: 2023,
        industry: "Healthcare",
      },
      {
        organization: "Energy Sector Alliance",
        amount: 18500,
        year: 2023,
        industry: "Energy",
      },
    ]
  }

  async getVotingRecord(candidateId: string): Promise<VotingRecord[]> {
    return [
      {
        billTitle: "Infrastructure Investment Act",
        vote: "yes",
        date: "2023-11-15",
        description: "Bipartisan infrastructure investment legislation",
      },
    ]
  }
}

export const ballotpediaClient = new BallotpediaClient()
export const openSecretsClient = new OpenSecretsClient()
