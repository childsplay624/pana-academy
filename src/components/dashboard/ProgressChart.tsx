import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressChartProps {
  isLoading?: boolean;
}

// Mock data for the chart
const mockData = [
  { day: 'Mon', hours: 2.5, goal: 3 },
  { day: 'Tue', hours: 3.2, goal: 3 },
  { day: 'Wed', hours: 1.8, goal: 3 },
  { day: 'Thu', hours: 4.1, goal: 3 },
  { day: 'Fri', hours: 2.9, goal: 3 },
  { day: 'Sat', hours: 5.2, goal: 3 },
  { day: 'Sun', hours: 3.7, goal: 3 },
];

export function ProgressChart({ isLoading = false }: ProgressChartProps) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number, name: string) => [
              `${value}h`,
              name === 'hours' ? 'Study Time' : 'Daily Goal'
            ]}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}