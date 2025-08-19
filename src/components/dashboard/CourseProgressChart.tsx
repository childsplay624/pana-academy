import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseProgressData {
  name: string;
  value: number;
  color?: string;
}

interface CourseProgressChartProps {
  data: CourseProgressData[];
  isLoading?: boolean;
}

// Default colors for courses
const defaultColors = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(220, 70%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(340, 70%, 50%)',
  'hsl(40, 70%, 50%)',
];

export function CourseProgressChart({ data, isLoading = false }: CourseProgressChartProps) {
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

  // If no data, show placeholder
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-sm">No courses enrolled yet</div>
          <div className="text-xs text-muted-foreground">
            Start learning to see your progress here
          </div>
        </div>
      </div>
    );
  }

  // Prepare data with colors
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name"
            className="text-xs"
            tick={{ fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{ 
              value: 'Progress (%)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fontSize: 12 } 
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value}%`, 'Progress']}
            labelStyle={{ fontSize: '12px', fontWeight: 'medium' }}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}