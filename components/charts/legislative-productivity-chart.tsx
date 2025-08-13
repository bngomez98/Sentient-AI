"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { congress: "93rd (1973-74)", year: 1974, bills: 649 },
  { congress: "94th (1975-76)", year: 1976, bills: 588 },
  { congress: "95th (1977-78)", year: 1978, bills: 633 },
  { congress: "96th (1979-80)", year: 1980, bills: 613 },
  { congress: "97th (1981-82)", year: 1982, bills: 473 },
  { congress: "98th (1983-84)", year: 1984, bills: 623 },
  { congress: "99th (1985-86)", year: 1986, bills: 664 },
  { congress: "100th (1987-88)", year: 1988, bills: 713 },
  { congress: "101st (1989-90)", year: 1990, bills: 650 },
  { congress: "102nd (1991-92)", year: 1992, bills: 589 },
  { congress: "103rd (1993-94)", year: 1994, bills: 465 },
  { congress: "104th (1995-96)", year: 1996, bills: 333 },
  { congress: "105th (1997-98)", year: 1998, bills: 394 },
  { congress: "106th (1999-00)", year: 2000, bills: 580 },
  { congress: "107th (2001-02)", year: 2002, bills: 377 },
  { congress: "108th (2003-04)", year: 2004, bills: 498 },
  { congress: "109th (2005-06)", year: 2006, bills: 482 },
  { congress: "110th (2007-08)", year: 2008, bills: 460 },
  { congress: "111th (2009-10)", year: 2010, bills: 383 },
  { congress: "112th (2011-12)", year: 2012, bills: 283 },
  { congress: "113th (2013-14)", year: 2014, bills: 296 },
  { congress: "114th (2015-16)", year: 2016, bills: 329 },
  { congress: "115th (2017-18)", year: 2018, bills: 442 },
  { congress: "116th (2019-20)", year: 2020, bills: 344 },
  { congress: "117th (2021-22)", year: 2022, bills: 362 },
]

export function LegislativeProductivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 12 }} label={{ value: "Bills Enacted", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value, name) => [value, "Bills Enacted"]}
          labelFormatter={(label) => {
            const item = data.find((d) => d.year === label)
            return item ? item.congress : label
          }}
        />
        <Line
          type="monotone"
          dataKey="bills"
          stroke="#1d4ed8"
          strokeWidth={2}
          dot={{ fill: "#1d4ed8", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
