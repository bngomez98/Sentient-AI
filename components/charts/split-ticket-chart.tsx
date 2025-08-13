"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

const data = [
  { year: 1972, percentage: 51.8 },
  { year: 1976, percentage: 33.9 },
  { year: 1980, percentage: 44.9 },
  { year: 1984, percentage: 58.4 },
  { year: 1988, percentage: 50.3 },
  { year: 1992, percentage: 30.2 },
  { year: 1996, percentage: 31.0 },
  { year: 2000, percentage: 30.2 },
  { year: 2004, percentage: 25.6 },
  { year: 2008, percentage: 15.6 },
  { year: 2012, percentage: 16.7 },
  { year: 2016, percentage: 5.3 },
  { year: 2020, percentage: 9.0 },
  { year: 2024, percentage: 5.4 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        <p className="text-red-700">{`Split-Ticket Voting: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export function SplitTicketChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis domain={[0, 65]} tickFormatter={(value) => `${value}%`} tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="percentage" 
          stroke="#B91C1C" 
          strokeWidth={3}
          dot={{ fill: '#B91C1C', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#B91C1C', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
