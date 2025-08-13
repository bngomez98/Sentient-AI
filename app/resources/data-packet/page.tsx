"use client"

import { HistoricalReelectionChart } from "@/components/charts/historical-reelection-chart"
import { CongressionalApprovalChart } from "@/components/charts/congressional-approval-chart"
import { CampaignSpendingChart } from "@/components/charts/campaign-spending-chart"
import Image from "next/image"

export default function DataPacketPage() {
  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto font-sans">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
          .chart-container {
            page-break-inside: avoid;
          }
        }
      `}</style>
      <header className="text-center border-b-2 border-black pb-4 mb-8">
        <Image src="/brand-logo.png" alt="Fresh 535 Logo" width={80} height={80} className="mx-auto mb-2" />
        <h1 className="text-4xl font-bold">Fresh 535: Data Packet</h1>
        <p className="text-xl mt-1">The Evidence for Congressional Accountability</p>
      </header>

      <main className="space-y-12">
        <section className="chart-container">
          <h2 className="text-2xl font-bold mb-4">The Great Disconnect: Approval vs. Reelection</h2>
          <p className="mb-4 text-lg">
            The core of the problem lies in the disconnect between public sentiment and electoral outcomes. Americans
            overwhelmingly disapprove of Congress's performance, yet incumbents are almost never defeated.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-center mb-2">Congressional Approval Rating (%)</h3>
              <div className="h-64 border p-2">
                <CongressionalApprovalChart />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-center mb-2">Incumbent Reelection Rate (%)</h3>
              <div className="h-64 border p-2">
                <HistoricalReelectionChart />
              </div>
            </div>
          </div>
        </section>

        <section className="chart-container">
          <h2 className="text-2xl font-bold mb-4">The Financial Barrier: Incumbent Spending Advantage</h2>
          <p className="mb-4 text-lg">
            A primary driver of the incumbency advantage is a massive, systemic fundraising gap. Challengers face an
            almost insurmountable financial wall, making true competition nearly impossible.
          </p>
          <div className="h-80 border p-2">
            <CampaignSpendingChart />
          </div>
          <p className="text-center mt-2 text-sm">
            Data shows incumbents consistently out-raising and out-spending challengers by millions of dollars.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Key Statistics: The Accountability Deficit</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-4xl font-bold text-red-700">18%</div>
              <div className="font-semibold">Average Congressional Approval</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-4xl font-bold text-red-700">95%</div>
              <div className="font-semibold">Average Incumbent Reelection Rate</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-4xl font-bold text-red-700">11,000+</div>
              <div className="font-semibold">Registered Lobbyists in D.C.</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-4xl font-bold text-red-700">20%</div>
              <div className="font-semibold">Voter bloc needed to force turnover</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center mt-12 border-t-2 border-black pt-4">
        <p className="text-lg">
          The data is clear: the system is not self-correcting. Change must come from the voters.
        </p>
        <p className="text-lg font-bold mt-2">
          Learn more and take the pledge at <strong className="text-red-700">www.fresh535.org</strong>
        </p>
      </footer>
      <div className="no-print text-center mt-8">
        <button onClick={() => window.print()} className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg">
          Print this Data Packet
        </button>
      </div>
    </div>
  )
}
