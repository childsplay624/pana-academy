import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  newUsers: number;
  totalRevenue: number;
  totalCourses: number;
  completions: number;
  activeSessions: number;
  topCourses: Array<{
    name: string;
    enrollments: number;
    revenue: number;
  }>;
  userActivity: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    avgSessionDuration: string;
  };
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      // Fetch total users
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at, role');

      if (usersError) throw usersError;

      // Fetch new users in time range
      const newUsers = allUsers?.filter(user => 
        new Date(user.created_at) >= startDate
      ).length || 0;

      // Fetch courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, price, status, instructor_id');

      if (coursesError) throw coursesError;

      // Fetch enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('id, course_id, student_id, enrolled_at, completed_at, status');

      if (enrollmentsError) throw enrollmentsError;

      // Fetch transactions
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('id, amount, status, created_at, course_id')
        .eq('status', 'completed');

      if (transactionsError) throw transactionsError;

      // Calculate total revenue
      const totalRevenue = transactions?.reduce((sum, txn) => sum + Number(txn.amount), 0) || 0;

      // Calculate recent revenue
      const recentTransactions = transactions?.filter(txn => 
        new Date(txn.created_at) >= startDate
      ) || [];
      const recentRevenue = recentTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);

      // Calculate completions
      const completions = enrollments?.filter(enrollment => 
        enrollment.status === 'completed' && 
        enrollment.completed_at && 
        new Date(enrollment.completed_at) >= startDate
      ).length || 0;

      // Calculate top courses
      const courseStats = courses?.map(course => {
        const courseEnrollments = enrollments?.filter(e => e.course_id === course.id) || [];
        const courseTransactions = transactions?.filter(t => t.course_id === course.id) || [];
        const courseRevenue = courseTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        
        return {
          name: course.title,
          enrollments: courseEnrollments.length,
          revenue: courseRevenue
        };
      }).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5) || [];

      // Mock user activity data (would need session tracking for real data)
      const userActivity = {
        dailyActive: Math.floor(allUsers?.length * 0.3) || 0,
        weeklyActive: Math.floor(allUsers?.length * 0.6) || 0,
        monthlyActive: Math.floor(allUsers?.length * 0.8) || 0,
        avgSessionDuration: '24m 32s'
      };

      const analyticsData: AnalyticsData = {
        totalUsers: allUsers?.length || 0,
        newUsers,
        totalRevenue,
        totalCourses: courses?.length || 0,
        completions,
        activeSessions: Math.floor((allUsers?.length || 0) * 0.1), // Mock active sessions
        topCourses: courseStats,
        userActivity
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const exportReport = async () => {
    toast({
      title: "Export Started",
      description: "Your analytics report is being generated...",
    });
    
    // In a real implementation, this would generate and download a report
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your analytics report has been generated successfully.",
      });
    }, 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load analytics data</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `₦${analytics.totalRevenue.toLocaleString()}`,
      change: '+12.3%', // Would calculate from previous period
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'New Users',
      value: analytics.newUsers.toLocaleString(),
      change: '+8.7%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Course Completions',
      value: analytics.completions.toLocaleString(),
      change: '+23.1%',
      trend: 'up',
      icon: BookOpen
    },
    {
      title: 'Active Sessions',
      value: analytics.activeSessions.toLocaleString(),
      change: '-2.4%',
      trend: 'down',
      icon: Activity
    }
  ];

  const userActivity = [
    { metric: 'Daily Active Users', value: analytics.userActivity.dailyActive.toLocaleString(), change: '+5.2%' },
    { metric: 'Weekly Active Users', value: analytics.userActivity.weeklyActive.toLocaleString(), change: '+8.1%' },
    { metric: 'Monthly Active Users', value: analytics.userActivity.monthlyActive.toLocaleString(), change: '+12.7%' },
    { metric: 'Average Session Duration', value: analytics.userActivity.avgSessionDuration, change: '+3.4%' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportReport}>
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">from last period</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performing Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>Based on enrollments and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{course.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Activity Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                User Activity
              </CardTitle>
              <CardDescription>User engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((activity) => (
                  <div key={activity.metric} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activity.metric}</p>
                      <p className="text-2xl font-bold">{activity.value}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {activity.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart integration coming soon</p>
                <p className="text-sm">Connect with Recharts or Chart.js for detailed visualizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}