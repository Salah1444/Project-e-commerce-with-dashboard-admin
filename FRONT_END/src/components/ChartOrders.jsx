import { Area, AreaChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function ChartOrders({ data }) {
  const chartConfig = {
    orders: {
      label: "Orders",
      color: "#f59e0b",
    },
  };

  return (
    <ChartContainer className="w-full h-72" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
         <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />

          <Area type="monotone" dataKey="orders" stroke="#f59e0b" fillOpacity={1} fill="url(#colorOrders)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}