"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

const data = [
  { year: 2000, approval: 47 },
  { year: 2001, approval: 56 },
  { year: 2002, approval: 50 },
  { year: 2003, approval: 50 },
  { year: 2004, approval: 37 },
  { year: 2005, approval: 33 },
  { year: 2006, approval: 25 },
  { year: 2007, approval: 25 },
  { year: 2008, approval: 19 },
  { year: 2009, approval: 25 },
  { year: 2010, approval: 21 },
  { year: 2011, approval: 17 },
  { year: 2012, approval: 15 },
  { year: 2013, approval: 14 },
  { year: 2014, approval: 15 },
  { year: 2015, approval: 15 },
  { year: 2016, approval: 16 },
  { year: 2017, approval: 18 },
  { year: 2018, approval: 19 },
  { year: 2019, approval: 18 },
  { year: 2020, approval: 20 },
  { year: 2021, approval: 27 },
  { year: 2022, approval: 21 },
  { year: 2023, approval: 19 },
  { year: 2024, approval: 18 },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-lg shadow-lg">
        <p className="font-bold text-sm">{`Year: ${label}`}</p>
        <p className="text-accent text-sm">{`Approval: ${payload[0].value}%`}</p>
      </div>
    )
  }
  return null
}

export function CongressionalApprovalChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="year" tick={{ fill: "#475569", fontSize: 12 }} />
        <YAxis domain={[0, 60]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#475569", fontSize: 12 }} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Line
          type="monotone"
          dataKey="approval"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--accent))", strokeWidth: 1, r: 3 }}
          activeDot={{ r: 5, stroke: "hsl(var(--accent))", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
