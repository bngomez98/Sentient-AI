import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Database, Shield, GitBranch } from "lucide-react"

export default function MethodologyPage() {
  return (
    <div className="bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <h3 className="font-semibold text-lg mb-4">On this page</h3>
              <nav className="space-y-2 text-slate-600">
                <a href="#overview" className="block hover:text-blue-700">
                  Overview
                </a>
                <a href="#approach" className="block hover:text-blue-700">
                  Research Approach
                </a>
                <a href="#sources" className="block hover:text-blue-700">
                  Data Sources
                </a>
                <a href="#definitions" className="block hover:text-blue-700">
                  Metric Definitions
                </a>
                <a href="#collection" className="block hover:text-blue-700">
                  Collection Methods
                </a>
                <a href="#validation" className="block hover:text-blue-700">
                  Validation Process
                </a>
                <a href="#limitations" className="block hover:text-blue-700">
                  Limitations
                </a>
                <a href="#updates" className="block hover:text-blue-700">
                  Updates
                </a>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="prose prose-lg max-w-none">
              <section id="overview">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Research Methodology</h1>
                <p className="text-xl text-stone-600 mb-8">
                  Transparent, rigorous analysis of congressional data from authoritative sources with full
                  methodological disclosure.
                </p>
              </section>

              <section id="approach">
                <h2>Research Approach</h2>
                <p>
                  Our analysis employs a comprehensive, data-driven approach to examine congressional accountability and
                  electoral competition. We prioritize official government sources, established research institutions,
                  and transparent methodologies to ensure accuracy and reproducibility.
                </p>

                <h3>Core Principles</h3>
                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-700" />
                        Source Verification
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      All data points are traced to primary sources with full citation and verification of authenticity.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-700" />
                        Methodological Transparency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      All calculations, transformations, and analytical decisions are documented and reproducible.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-blue-700" />
                        Bipartisan Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Analysis avoids partisan interpretation, focusing on institutional metrics rather than policy
                      outcomes.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5 text-blue-700" />
                        Peer Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Findings are reviewed by academic experts in political science and public policy.
                    </CardContent>
                  </Card>
                </div>
              </section>

              <section id="sources">
                <h2>Data Sources</h2>
                <h3>Primary Government Sources</h3>
                <div className="space-y-4">
                  <SourceItem
                    title="Federal Election Commission (FEC)"
                    description="Official election results, candidate filings, campaign finance reports, and expenditure data"
                    url="https://www.fec.gov"
                    reliability="Primary"
                    coverage="1976-present"
                  />
                  <SourceItem
                    title="Clerk of the U.S. House of Representatives"
                    description="Historical election statistics, member biographical data, and voting records"
                    url="https://clerk.house.gov"
                    reliability="Primary"
                    coverage="1789-present"
                  />
                  <SourceItem
                    title="U.S. Senate Historical Office"
                    description="Senate election results, biographical data, and institutional records"
                    url="https://www.senate.gov/history"
                    reliability="Primary"
                    coverage="1789-present"
                  />
                  <SourceItem
                    title="Congressional Budget Office (CBO)"
                    description="Fiscal analysis, budget projections, and economic impact assessments"
                    url="https://www.cbo.gov"
                    reliability="Primary"
                    coverage="1975-present"
                  />
                </div>

                <h3>Research Organizations</h3>
                <div className="space-y-4">
                  <SourceItem
                    title="Ballotpedia"
                    description="Comprehensive election database and candidate information"
                    url="https://ballotpedia.org"
                    reliability="Secondary"
                    coverage="2007-present"
                  />
                  <SourceItem
                    title="Center for Responsive Politics (OpenSecrets)"
                    description="Campaign finance analysis and lobbying data"
                    url="https://www.opensecrets.org"
                    reliability="Secondary"
                    coverage="1990-present"
                  />
                  <SourceItem
                    title="Gallup Organization"
                    description="Public opinion polling and congressional approval ratings"
                    url="https://www.gallup.com"
                    reliability="Secondary"
                    coverage="1974-present"
                  />
                  <SourceItem
                    title="Pew Research Center"
                    description="Political attitudes research and demographic analysis"
                    url="https://www.pewresearch.org"
                    reliability="Secondary"
                    coverage="2004-present"
                  />
                </div>
              </section>

              <section id="definitions">
                <h2>Key Metrics Definitions</h2>

                <div className="space-y-6">
                  <MetricDefinition
                    name="Incumbent Reelection Rate"
                    definition="Percentage of incumbents seeking reelection who successfully win their race"
                    formula="(Incumbents Reelected ÷ Incumbents Seeking Reelection) × 100"
                    notes="Calculated separately for House and Senate; excludes members who retire or seek other office"
                    methodology="Based on general election results; primary defeats count as reelection failures"
                  />

                  <MetricDefinition
                    name="Split-Ticket Voting"
                    definition="Percentage of possible mixed-party election outcomes in presidential election years"
                    formula="Districts/States with different party control between presidential and congressional races"
                    notes="Measured only in presidential election years; indicates cross-pressured electorates"
                    methodology="Compares presidential winner by district/state to congressional delegation party control"
                  />

                  <MetricDefinition
                    name="Congressional Approval Rating"
                    definition="Percentage of Americans who approve of the job Congress is doing"
                    formula="Monthly polling averages aggregated to annual figures"
                    notes="Based on Gallup polling with margin of error ±3-4 percentage points"
                    methodology="Random sampling of U.S. adults via telephone and online interviews"
                  />

                  <MetricDefinition
                    name="Campaign Spending Differential"
                    definition="Ratio of incumbent to challenger average campaign receipts"
                    formula="Average Incumbent Receipts ÷ Average Challenger Receipts"
                    notes="Based on FEC reports; includes all receipts through election day"
                    methodology="Calculated per election cycle; excludes unopposed races"
                  />

                  <MetricDefinition
                    name="Legislative Productivity"
                    definition="Number of substantive laws enacted per Congress"
                    formula="Count of public laws excluding ceremonial and administrative measures"
                    notes="Based on Congressional Research Service categorization of 'substantive' legislation"
                    methodology="Manual review of each law to exclude commemorative resolutions and routine reauthorizations"
                  />
                </div>
              </section>

              <section id="collection">
                <h2>Data Collection Methods</h2>

                <h3>Automated Collection</h3>
                <p>
                  Where possible, we use automated systems to collect data from official APIs and structured databases.
                  This includes:
                </p>
                <ul>
                  <li>FEC campaign finance data via their REST API</li>
                  <li>Congressional voting records from Congress.gov</li>
                  <li>Election results from state election offices</li>
                </ul>

                <h3>Manual Verification</h3>
                <p>All automated collection is supplemented by manual verification:</p>
                <ul>
                  <li>Cross-referencing against multiple sources</li>
                  <li>Spot-checking random samples for accuracy</li>
                  <li>Reviewing edge cases and anomalies</li>
                  <li>Validating calculations against published totals</li>
                </ul>

                <h3>Historical Data Reconstruction</h3>
                <p>For historical periods predating digital records, we rely on:</p>
                <ul>
                  <li>Official government publications and archives</li>
                  <li>Academic datasets with established provenance</li>
                  <li>Newspaper archives for election results verification</li>
                  <li>Multiple source triangulation for contested figures</li>
                </ul>
              </section>

              <section id="validation">
                <h2>Quality Assurance Process</h2>

                <h3>Multi-Stage Validation</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Source Authentication:</strong> Verify all data comes from authoritative, official sources
                  </li>
                  <li>
                    <strong>Cross-Reference Check:</strong> Compare data across multiple independent sources when
                    available
                  </li>
                  <li>
                    <strong>Calculation Review:</strong> Independent verification of all mathematical operations and
                    formulas
                  </li>
                  <li>
                    <strong>Temporal Consistency:</strong> Ensure data series are consistent across time periods and
                    methodology changes
                  </li>
                  <li>
                    <strong>Expert Review:</strong> Academic and policy expert review of methodology and findings
                  </li>
                  <li>
                    <strong>Public Disclosure:</strong> Full methodology publication for external scrutiny and
                    replication
                  </li>
                </ol>

                <h3>Error Detection and Correction</h3>
                <p>We maintain rigorous error detection protocols:</p>
                <ul>
                  <li>Automated range checks for statistical outliers</li>
                  <li>Trend analysis to identify potential data breaks</li>
                  <li>Regular audits of calculation accuracy</li>
                  <li>Public correction process for identified errors</li>
                </ul>
              </section>

              <section id="limitations">
                <h2>Limitations and Caveats</h2>

                <h3>Data Limitations</h3>
                <ul>
                  <li>
                    <strong>Historical Completeness:</strong> Some early data may be incomplete or estimated based on
                    available records
                  </li>
                  <li>
                    <strong>Definitional Evolution:</strong> Some metrics have evolved over time as reporting standards
                    changed
                  </li>
                  <li>
                    <strong>Sampling Variation:</strong> Opinion polling data subject to sampling error and
                    methodological differences
                  </li>
                  <li>
                    <strong>Reporting Delays:</strong> Most recent data may be preliminary pending final official
                    reports
                  </li>
                </ul>

                <h3>Analytical Limitations</h3>
                <ul>
                  <li>
                    <strong>Correlation vs. Causation:</strong> Statistical relationships do not necessarily imply
                    causal relationships
                  </li>
                  <li>
                    <strong>Predictive Limitations:</strong> Historical trends may not predict future outcomes
                  </li>
                  <li>
                    <strong>Context Dependency:</strong> Metrics may be influenced by external factors not captured in
                    the analysis
                  </li>
                  <li>
                    <strong>Aggregation Effects:</strong> National averages may obscure important regional or
                    demographic variations
                  </li>
                </ul>

                <h3>Scope Limitations</h3>
                <ul>
                  <li>
                    <strong>Federal Focus:</strong> Analysis limited to federal elections and institutions
                  </li>
                  <li>
                    <strong>Quantitative Emphasis:</strong> Prioritizes measurable indicators over qualitative
                    assessments
                  </li>
                  <li>
                    <strong>Institutional Perspective:</strong> Focuses on systemic rather than individual-level factors
                  </li>
                </ul>
              </section>

              <section id="updates">
                <h2>Updates and Revisions</h2>

                <h3>Update Schedule</h3>
                <p>Data and analysis are updated on a regular schedule:</p>
                <ul>
                  <li>
                    <strong>Quarterly:</strong> Routine data updates and minor corrections
                  </li>
                  <li>
                    <strong>Post-Election:</strong> Major updates following federal elections
                  </li>
                  <li>
                    <strong>Annual:</strong> Comprehensive methodology review and validation
                  </li>
                  <li>
                    <strong>Ad-hoc:</strong> Corrections for identified errors or significant new data availability
                  </li>
                </ul>

                <h3>Version Control</h3>
                <p>All updates are tracked using semantic versioning:</p>
                <ul>
                  <li>
                    <strong>Major versions:</strong> Significant methodology changes or new data series
                  </li>
                  <li>
                    <strong>Minor versions:</strong> Data additions or minor methodology refinements
                  </li>
                  <li>
                    <strong>Patch versions:</strong> Error corrections and clarifications
                  </li>
                </ul>

                <h3>Change Documentation</h3>
                <p>All changes are fully documented with:</p>
                <ul>
                  <li>Detailed changelog with rationale for modifications</li>
                  <li>Impact assessment on existing analyses</li>
                  <li>Backward compatibility notes where applicable</li>
                  <li>Public notification of significant changes</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SourceItem = ({
  title,
  description,
  url,
  reliability,
  coverage,
}: {
  title: string
  description: string
  url: string
  reliability: string
  coverage: string
}) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">{title}</CardTitle>
        <span
          className={`text-xs px-2 py-1 rounded ${
            reliability === "Primary" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {reliability}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-slate-600 mb-2">{description}</p>
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>Coverage: {coverage}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-700">
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </CardContent>
  </Card>
)

const MetricDefinition = ({
  name,
  definition,
  formula,
  notes,
  methodology,
}: {
  name: string
  definition: string
  formula: string
  notes: string
  methodology: string
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">{name}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div>
        <h4 className="font-semibold text-sm text-slate-700">Definition</h4>
        <p className="text-sm">{definition}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-slate-700">Formula</h4>
        <p className="text-sm font-mono bg-slate-50 p-2 rounded">{formula}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-slate-700">Methodology</h4>
        <p className="text-sm">{methodology}</p>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-slate-700">Notes</h4>
        <p className="text-sm text-slate-600">{notes}</p>
      </div>
    </CardContent>
  </Card>
)
