import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  change: string;
  icon: string;
  trend: "up" | "down";
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-93 border border-gray-100  ml-4 mr-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1 text-black">{value}</p>
          <p
            className={`text-sm mt-1 ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}
