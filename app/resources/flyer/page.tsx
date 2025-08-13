"use client"

import Image from "next/image"

export default function FlyerPage() {
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
        }
      `}</style>
      <header className="text-center border-b-4 border-black pb-4 mb-8">
        <Image src="/brand-logo.png" alt="Fresh 535 Logo" width={100} height={100} className="mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-red-700">If They're In, They're Out.</h1>
        <p className="text-2xl mt-2">A Movement to Replace Every Member of Congress.</p>
      </header>

      <main className="grid grid-cols-2 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <h2 className="text-3xl font-bold">The Problem: Congress is Broken</h2>
          <p className="text-lg">
            Public trust in Congress is at an all-time low, yet over 90% of incumbents get reelected. This isn't a
            democracy that's working for the people. It's a system captured by special interests, donors, and party
            politics.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-2">The Accountability Deficit:</h3>
            <ul className="list-disc list-inside space-y-1 text-lg">
              <li>
                <strong>18%</strong> Congressional Approval
              </li>
              <li>
                <strong>95%</strong> Incumbent Reelection Rate
              </li>
              <li>
                <strong>$17M</strong> Average Incumbent Spending Advantage
              </li>
            </ul>
          </div>
          <p className="text-lg">
            This failure has created a power vacuum, allowing extremist plans like Project 2025 to threaten our
            democratic institutions.
          </p>
        </div>

        <div className="col-span-2 md:col-span-1 space-y-6">
          <h2 className="text-3xl font-bold">The Solution: A Simple, Radical Idea</h2>
          <p className="text-lg">
            We don't need to reform the system. We need to replace the people who broke it. The Fresh 535 movement is a
            simple voter instruction:
          </p>
          <div className="border-4 border-red-700 p-6 text-center">
            <h3 className="text-2xl font-bold">Vote Against Every Incumbent.</h3>
            <p className="text-lg mt-2">In every election. Regardless of party.</p>
          </div>
          <h3 className="text-2xl font-bold">How it Works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            <li>
              <strong>Identify the Incumbent:</strong> Find the current officeholder on your ballot.
            </li>
            <li>
              <strong>Vote for a Challenger:</strong> Choose any other candidate.
            </li>
            <li>
              <strong>Reset Congress:</strong> Create a legislature that fears the voter, not the donor.
            </li>
          </ol>
        </div>
      </main>

      <footer className="text-center mt-12 border-t-4 border-black pt-4">
        <h2 className="text-3xl font-bold">Join the Movement</h2>
        <p className="text-xl mt-2">
          Take the pledge and learn more at: <strong className="text-red-700">www.fresh535.org</strong>
        </p>
        <p className="mt-4 text-lg">#Fresh535 #IfTheyreInTheyreOut</p>
      </footer>
      <div className="no-print text-center mt-8">
        <button onClick={() => window.print()} className="bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-lg">
          Print this Flyer
        </button>
      </div>
    </div>
  )
}
