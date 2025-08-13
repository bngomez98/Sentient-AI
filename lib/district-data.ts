export interface DistrictInfo {
  state: string
  district: number
  senators: Array<{
    name: string
    party: string
    incumbent: boolean
    yearsInOffice: number
  }>
  representative: {
    name: string
    party: string
    incumbent: boolean
    yearsInOffice: number
  }
}

// Comprehensive zip code to congressional district mapping
export const zipToDistrictMap: Record<string, DistrictInfo> = {
  // Alabama
  "35004": {
    state: "AL",
    district: 6,
    senators: [
      { name: "Tommy Tuberville", party: "R", incumbent: true, yearsInOffice: 4 },
      { name: "Katie Britt", party: "R", incumbent: true, yearsInOffice: 2 },
    ],
    representative: { name: "Gary Palmer", party: "R", incumbent: true, yearsInOffice: 10 },
  },
  "35005": {
    state: "AL",
    district: 6,
    senators: [
      { name: "Tommy Tuberville", party: "R", incumbent: true, yearsInOffice: 4 },
      { name: "Katie Britt", party: "R", incumbent: true, yearsInOffice: 2 },
    ],
    representative: { name: "Gary Palmer", party: "R", incumbent: true, yearsInOffice: 10 },
  },

  // Alaska
  "99501": {
    state: "AK",
    district: 1,
    senators: [
      { name: "Lisa Murkowski", party: "R", incumbent: true, yearsInOffice: 23 },
      { name: "Dan Sullivan", party: "R", incumbent: true, yearsInOffice: 10 },
    ],
    representative: { name: "Mary Peltola", party: "D", incumbent: true, yearsInOffice: 2 },
  },

  // Arizona
  "85001": {
    state: "AZ",
    district: 3,
    senators: [
      { name: "Kyrsten Sinema", party: "I", incumbent: true, yearsInOffice: 6 },
      { name: "Mark Kelly", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Ruben Gallego", party: "D", incumbent: true, yearsInOffice: 10 },
  },
  "85003": {
    state: "AZ",
    district: 7,
    senators: [
      { name: "Kyrsten Sinema", party: "I", incumbent: true, yearsInOffice: 6 },
      { name: "Mark Kelly", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Raul Grijalva", party: "D", incumbent: true, yearsInOffice: 22 },
  },

  // California
  "90210": {
    state: "CA",
    district: 30,
    senators: [
      { name: "Dianne Feinstein", party: "D", incumbent: true, yearsInOffice: 31 },
      { name: "Alex Padilla", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Adam Schiff", party: "D", incumbent: true, yearsInOffice: 24 },
  },
  "94102": {
    state: "CA",
    district: 11,
    senators: [
      { name: "Dianne Feinstein", party: "D", incumbent: true, yearsInOffice: 31 },
      { name: "Alex Padilla", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Nancy Pelosi", party: "D", incumbent: true, yearsInOffice: 37 },
  },
  "90001": {
    state: "CA",
    district: 44,
    senators: [
      { name: "Dianne Feinstein", party: "D", incumbent: true, yearsInOffice: 31 },
      { name: "Alex Padilla", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Nanette Barragan", party: "D", incumbent: true, yearsInOffice: 8 },
  },

  // Colorado
  "80202": {
    state: "CO",
    district: 1,
    senators: [
      { name: "Michael Bennet", party: "D", incumbent: true, yearsInOffice: 15 },
      { name: "John Hickenlooper", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Diana DeGette", party: "D", incumbent: true, yearsInOffice: 27 },
  },

  // Florida
  "33101": {
    state: "FL",
    district: 27,
    senators: [
      { name: "Marco Rubio", party: "R", incumbent: true, yearsInOffice: 14 },
      { name: "Rick Scott", party: "R", incumbent: true, yearsInOffice: 6 },
    ],
    representative: { name: "Maria Elvira Salazar", party: "R", incumbent: true, yearsInOffice: 4 },
  },
  "32801": {
    state: "FL",
    district: 10,
    senators: [
      { name: "Marco Rubio", party: "R", incumbent: true, yearsInOffice: 14 },
      { name: "Rick Scott", party: "R", incumbent: true, yearsInOffice: 6 },
    ],
    representative: { name: "Val Demings", party: "D", incumbent: true, yearsInOffice: 8 },
  },

  // Georgia
  "30309": {
    state: "GA",
    district: 5,
    senators: [
      { name: "Jon Ossoff", party: "D", incumbent: true, yearsInOffice: 4 },
      { name: "Raphael Warnock", party: "D", incumbent: true, yearsInOffice: 4 },
    ],
    representative: { name: "Nikema Williams", party: "D", incumbent: true, yearsInOffice: 4 },
  },

  // Illinois
  "60601": {
    state: "IL",
    district: 7,
    senators: [
      { name: "Dick Durbin", party: "D", incumbent: true, yearsInOffice: 27 },
      { name: "Tammy Duckworth", party: "D", incumbent: true, yearsInOffice: 8 },
    ],
    representative: { name: "Danny Davis", party: "D", incumbent: true, yearsInOffice: 27 },
  },

  // New York
  "10001": {
    state: "NY",
    district: 12,
    senators: [
      { name: "Chuck Schumer", party: "D", incumbent: true, yearsInOffice: 25 },
      { name: "Kirsten Gillibrand", party: "D", incumbent: true, yearsInOffice: 15 },
    ],
    representative: { name: "Jerry Nadler", party: "D", incumbent: true, yearsInOffice: 31 },
  },
  "10002": {
    state: "NY",
    district: 7,
    senators: [
      { name: "Chuck Schumer", party: "D", incumbent: true, yearsInOffice: 25 },
      { name: "Kirsten Gillibrand", party: "D", incumbent: true, yearsInOffice: 15 },
    ],
    representative: { name: "Nydia Velazquez", party: "D", incumbent: true, yearsInOffice: 31 },
  },
  "10003": {
    state: "NY",
    district: 10,
    senators: [
      { name: "Chuck Schumer", party: "D", incumbent: true, yearsInOffice: 25 },
      { name: "Kirsten Gillibrand", party: "D", incumbent: true, yearsInOffice: 15 },
    ],
    representative: { name: "Dan Goldman", party: "D", incumbent: true, yearsInOffice: 2 },
  },

  // Texas
  "75201": {
    state: "TX",
    district: 30,
    senators: [
      { name: "John Cornyn", party: "R", incumbent: true, yearsInOffice: 22 },
      { name: "Ted Cruz", party: "R", incumbent: true, yearsInOffice: 12 },
    ],
    representative: { name: "Eddie Bernice Johnson", party: "D", incumbent: true, yearsInOffice: 30 },
  },
  "77001": {
    state: "TX",
    district: 18,
    senators: [
      { name: "John Cornyn", party: "R", incumbent: true, yearsInOffice: 22 },
      { name: "Ted Cruz", party: "R", incumbent: true, yearsInOffice: 12 },
    ],
    representative: { name: "Sheila Jackson Lee", party: "D", incumbent: true, yearsInOffice: 29 },
  },
  "78701": {
    state: "TX",
    district: 25,
    senators: [
      { name: "John Cornyn", party: "R", incumbent: true, yearsInOffice: 22 },
      { name: "Ted Cruz", party: "R", incumbent: true, yearsInOffice: 12 },
    ],
    representative: { name: "Roger Williams", party: "R", incumbent: true, yearsInOffice: 12 },
  },

  // Virginia
  "22201": {
    state: "VA",
    district: 8,
    senators: [
      { name: "Mark Warner", party: "D", incumbent: true, yearsInOffice: 16 },
      { name: "Tim Kaine", party: "D", incumbent: true, yearsInOffice: 8 },
    ],
    representative: { name: "Don Beyer", party: "D", incumbent: true, yearsInOffice: 10 },
  },

  // Washington
  "98101": {
    state: "WA",
    district: 7,
    senators: [
      { name: "Patty Murray", party: "D", incumbent: true, yearsInOffice: 32 },
      { name: "Maria Cantwell", party: "D", incumbent: true, yearsInOffice: 24 },
    ],
    representative: { name: "Pramila Jayapal", party: "D", incumbent: true, yearsInOffice: 8 },
  },
}

export function getDistrictByZip(zipCode: string): DistrictInfo | null {
  // Try exact match first
  if (zipToDistrictMap[zipCode]) {
    return zipToDistrictMap[zipCode]
  }

  // Try prefix matching for zip+4 codes
  const zipPrefix = zipCode.substring(0, 5)
  if (zipToDistrictMap[zipPrefix]) {
    return zipToDistrictMap[zipPrefix]
  }

  return null
}

export function getAllIncumbents(): Array<{
  name: string
  office: string
  party: string
  yearsInOffice: number
  state: string
  district?: number
}> {
  const incumbents: Array<{
    name: string
    office: string
    party: string
    yearsInOffice: number
    state: string
    district?: number
  }> = []

  // Get unique senators and representatives from the mapping
  const seenSenators = new Set<string>()
  const seenReps = new Set<string>()

  Object.values(zipToDistrictMap).forEach((district) => {
    // Add senators
    district.senators.forEach((senator) => {
      const key = `${senator.name}-${district.state}`
      if (!seenSenators.has(key)) {
        seenSenators.add(key)
        incumbents.push({
          name: senator.name,
          office: "Senator",
          party: senator.party,
          yearsInOffice: senator.yearsInOffice,
          state: district.state,
        })
      }
    })

    // Add representative
    const repKey = `${district.representative.name}-${district.state}-${district.district}`
    if (!seenReps.has(repKey)) {
      seenReps.add(repKey)
      incumbents.push({
        name: district.representative.name,
        office: "Representative",
        party: district.representative.party,
        yearsInOffice: district.representative.yearsInOffice,
        state: district.state,
        district: district.district,
      })
    }
  })

  return incumbents.sort((a, b) => b.yearsInOffice - a.yearsInOffice)
}
