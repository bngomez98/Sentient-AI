"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

const data = [
  { year: 1980, rate: 91 },
  { year: 1982, rate: 90 },
  { year: 1984, rate: 95 },
  { year: 1986, rate: 98 },
  { year: 1988, rate: 98 },
  { year: 1990, rate: 96 },
  { year: 1992, rate: 88 },
  { year: 1994, rate: 90 },
  { year: 1996, rate: 94 },
  { year: 1998, rate: 98 },
  { year: 2000, rate: 98 },
  { year: 2002, rate: 96 },
  { year: 2004, rate: 98 },
  { year: 2006, rate: 94 },
  { year: 2008, rate: 94 },
  { year: 2010, rate: 85 },
  { year: 2012, rate: 90 },
  { year: 2014, rate: 95 },
  { year: 2016, rate: 97 },
  { year: 2018, rate: 91 },
  { year: 2020, rate: 96 },
  { year: 2022, rate: 94.7 },
  { year: 2024, rate: 95.3 },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-lg">
        <p className="font-bold text-sm">{`Year: ${label}`}</p>
        <p className="text-primary text-sm">{`Reelection Rate: ${payload[0].value}%`}</p>
      </div>
    )
  }
  return null
}

export function HistoricalReelectionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="year" tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(var(--primary), 0.1)" }} />
        <Bar dataKey="rate" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
