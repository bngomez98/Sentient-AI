"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
  Legend,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

const data = [
  { year: 2010, incumbent: 1.1, challenger: 0.4 },
  { year: 2012, incumbent: 1.2, challenger: 0.4 },
  { year: 2014, incumbent: 1.3, challenger: 0.4 },
  { year: 2016, incumbent: 1.4, challenger: 0.5 },
  { year: 2018, incumbent: 1.6, challenger: 0.5 },
  { year: 2020, incumbent: 1.8, challenger: 0.6 },
  { year: 2022, incumbent: 1.9, challenger: 0.6 },
  { year: 2024, incumbent: 2.1, challenger: 0.7 },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-lg">
        <p className="font-bold text-sm">{`Year: ${label}`}</p>
        <p className="text-primary text-sm">{`Incumbent Avg: $${payload[0].value}M`}</p>
        <p className="text-accent text-sm">{`Challenger Avg: $${payload[1].value}M`}</p>
      </div>
    )
  }
  return null
}

export function CampaignSpendingChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="year" tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `$${value}M`} tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(var(--primary), 0.1)" }} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="incumbent" fill="hsl(var(--primary))" name="Incumbent Average" />
        <Bar dataKey="challenger" fill="hsl(var(--accent))" name="Challenger Average" />
      </BarChart>
    </ResponsiveContainer>
  )
}
