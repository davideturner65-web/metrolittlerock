'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceTrendPoint {
  month: string;
  median_price: number;
}

interface PriceChartProps {
  data: PriceTrendPoint[];
  title?: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export default function PriceChart({ data, title }: PriceChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      {title && <h3 className="font-semibold text-[#1C1C1C] mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#555555' }} />
          <YAxis tickFormatter={formatPrice} tick={{ fontSize: 11, fill: '#555555' }} width={80} />
          <Tooltip formatter={(value) => [formatPrice(Number(value)), 'Median Price']} />
          <Line
            type="monotone"
            dataKey="median_price"
            stroke="#1B4F72"
            strokeWidth={2}
            dot={{ fill: '#2E86C1', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
