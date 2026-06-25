import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function UsersChart({ data }) {
  return (
    <ChartContainer
      config={{
        users: {
          label: "Users",
          color: "#10b981", 
        },
      }}
      className="h-[300px] w-full"
    >
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis dataKey="ville" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value.slice(0, 2)} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}