"use client";

import { ReactNode } from "react"; // ✅ Add this import
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  [key: string]: any;
}

interface ChartCardProps {
  title: ReactNode; // ✅ Changed from string to ReactNode
  type: "bar" | "line";
  data: ChartData[];
  xKey: string;
  yKey: string;
}

export default function ChartCard({
  title,
  type,
  data,
  xKey,
  yKey,
}: ChartCardProps) {
  const chart =
    type === "bar" ? (
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yKey} fill="#0070F3" />
      </BarChart>
    ) : (
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="#008060"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 ml-4">
      <h3 className="mb-4 text-gray-500">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    </div>
  );
}