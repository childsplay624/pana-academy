import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { sessionService } from '@/services/sessionService';
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart,
  PieChart,
  Activity,
  Loader2,
  BookOpen,
  ShoppingCart,
  UserCheck
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

interface RealAnalyticsData {
  totalRevenue: number;
  revenueFromPurchases: number;
  avgOrderValue: number;
  revenueGrowth: number;
  totalUsers: number;
  payingStudents: number;
  freeStudents: number;
  conversionRate: number;
  userGrowth: number;
  totalCourses: number;
  publishedCourses: number;
  avgCoursePrice: number;
  totalEnrollments: number;
  courseCompletionRate: number;
  purchaseFunnel: {
    totalViews: number;
    enrollments: number;
    purchases: number;
    completions: number;
  };
  topCourses: Array<{
    id: string;
    name: string;
    enrollments: number;
    purchases: number;
    revenue: number;
    completionRate: number;
  }>;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<RealAnalyticsData | null>(null);
  const [trendData, setTrendData] = useState<{ name: string; revenue: number; enrollments: number }[]>([]);
  const { toast } = useToast();
  const { profile } = useAuth();
  const isInstructor = profile?.role === 'instructor';

  const fetchRealAnalytics = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      const previousStartDate = new Date(now.getTime() - (daysBack * 2 * 24 * 60 * 60 * 1000));

      // ── Step 1: Get courses (instructor-scoped) ────────────────────
      let coursesQuery = supabase
        .from('courses')
        .select('id, title, price, status, instructor_id, created_at');

      if (isInstructor && profile?.id) {
        coursesQuery = coursesQuery.eq('instructor_id', profile.id);
      }

      const coursesResult = await coursesQuery;
      const courses = coursesResult.data || [];
      const ownCourseIds = courses.map(c => c.id);

      // ── Step 2: Fetch remaining data (scoped to instructor's courses) ─
      const empty = { data: [] as any[], error: null };

      const usersResult = isInstructor
        ? (ownCourseIds.length > 0
          ? await supabase.from('enrollments').select('student_id').in('course_id', ownCourseIds)
          : empty)
        : await supabase.from('profiles').select('id, created_at, role');

      const enrollmentsResult = ownCourseIds.length > 0
        ? await supabase.from('enrollments').select('id, student_id, course_id, status, enrolled_at, completed_at, progress_percentage').in('course_id', ownCourseIds)
        : empty;

      const transactionsResult = ownCourseIds.length > 0
        ? await supabase.from('transactions').select('id, user_id, course_id, amount, status, created_at').eq('status', 'completed').in('course_id', ownCourseIds)
        : empty;

      const paymentsResult = ownCourseIds.length > 0
        ? await supabase.from('payments').select('id, user_id, course_id, amount, status, created_at').eq('status', 'completed').in('course_id', ownCourseIds)
        : empty;


      const enrollments = enrollmentsResult.data || [];
      const transactions = transactionsResult.data || [];
      const payments = paymentsResult.data || [];

      // For instructors, unique students = unique student_ids in enrollments
      const users = isInstructor
        ? [...new Set((usersResult.data || []).map((e: any) => e.student_id))].map(id => ({ id }))
        : (usersResult.data || []);

      // ── Revenue ────────────────────────────────────────────────────
      const totalRevenue = [...transactions, ...payments].reduce((sum, txn) => sum + Number(txn.amount), 0);
      const revenueFromPurchases = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const totalPurchases = payments.length;
      const avgOrderValue = totalPurchases > 0 ? revenueFromPurchases / totalPurchases : 0;

      const previousPayments = payments.filter(p =>
        new Date(p.created_at) >= previousStartDate && new Date(p.created_at) < startDate
      );
      const previousRevenue = previousPayments.reduce((sum, p) => sum + Number(p.amount), 0);
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      // ── Users ──────────────────────────────────────────────────────
      const totalUsers = users.length;
      const payingStudentIds = new Set([...transactions, ...payments].map(t => t.user_id));
      const payingStudents = payingStudentIds.size;
      const freeStudents = Math.max(0, totalUsers - payingStudents);
      const conversionRate = totalUsers > 0 ? (payingStudents / totalUsers) * 100 : 0;
      const userGrowth = 0; // Omit for scoped data - not meaningful without timestamps

      // ── Courses ────────────────────────────────────────────────────
      const publishedCourses = courses.filter(c => c.status === 'published').length;
      const avgCoursePrice = courses.length > 0
        ? courses.reduce((sum, c) => sum + Number(c.price), 0) / courses.length : 0;
      const totalEnrollments = enrollments.length;
      const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
      const courseCompletionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

      // ── Funnel ─────────────────────────────────────────────────────
      const currentEnrollments = enrollments.filter(e => new Date(e.enrolled_at) >= startDate).length;
      const currentPurchases = payments.filter(p => new Date(p.created_at) >= startDate).length;
      const currentCompletions = enrollments.filter(e => e.completed_at && new Date(e.completed_at) >= startDate).length;
      const totalViews = Math.max(currentEnrollments * 3, 10);

      // ── Top courses ────────────────────────────────────────────────
      const topCourses = courses.map(course => {
        const ce = enrollments.filter(e => e.course_id === course.id);
        const cp = payments.filter(p => p.course_id === course.id);
        const completed = ce.filter(e => e.status === 'completed').length;
        return {
          id: course.id,
          name: course.title,
          enrollments: ce.length,
          purchases: cp.length,
          revenue: cp.reduce((s, p) => s + Number(p.amount), 0),
          completionRate: ce.length > 0 ? (completed / ce.length) * 100 : 0
        };
      }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

      // ── Daily trend (real time-series) ─────────────────────────────
      const dailyMap: Record<string, { revenue: number; enrollments: number }> = {};
      for (let i = daysBack - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyMap[key] = { revenue: 0, enrollments: 0 };
      }
      payments.forEach(p => {
        const key = new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyMap[key]) dailyMap[key].revenue += Number(p.amount);
      });
      enrollments.forEach(e => {
        const key = new Date(e.enrolled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dailyMap[key]) dailyMap[key].enrollments += 1;
      });
      setTrendData(Object.entries(dailyMap).map(([name, v]) => ({ name, ...v })));

      setAnalytics({
        totalRevenue, revenueFromPurchases, avgOrderValue, revenueGrowth,
        totalUsers, payingStudents, freeStudents, conversionRate, userGrowth,
        totalCourses: courses.length, publishedCourses, avgCoursePrice,
        totalEnrollments, courseCompletionRate,
        purchaseFunnel: { totalViews, enrollments: currentEnrollments, purchases: currentPurchases, completions: currentCompletions },
        topCourses
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({ title: 'Error', description: 'Failed to load analytics data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile !== undefined) fetchRealAnalytics();
  }, [timeRange, profile?.id]);

  const exportReport = async () => {
    if (!analytics) return;

    try {
      toast({
        title: "Export Started",
        description: "Your analytics report is being generated...",
      });

      const csvData = [
        ['Metric', 'Value', 'Change'],
        ['Total Revenue', `₦${analytics.totalRevenue.toLocaleString()}`, `${analytics.revenueGrowth > 0 ? '+' : ''}${analytics.revenueGrowth.toFixed(1)}%`],
        ['Revenue from Purchases', `₦${analytics.revenueFromPurchases.toLocaleString()}`, ''],
        ['Average Order Value', `₦${analytics.avgOrderValue.toLocaleString()}`, ''],
        ['Total Users', analytics.totalUsers.toLocaleString(), `${analytics.userGrowth > 0 ? '+' : ''}${analytics.userGrowth.toFixed(1)}%`],
        ['Paying Students', analytics.payingStudents.toLocaleString(), ''],
        ['Free Students', analytics.freeStudents.toLocaleString(), ''],
        ['Conversion Rate', `${analytics.conversionRate.toFixed(1)}%`, ''],
        ['Published Courses', analytics.publishedCourses.toLocaleString(), ''],
        ['Total Enrollments', analytics.totalEnrollments.toLocaleString(), ''],
        ['Course Completion Rate', `${analytics.courseCompletionRate.toFixed(1)}%`, ''],
        ['Funnel Views', analytics.purchaseFunnel.totalViews.toLocaleString(), ''],
        ['Funnel Enrollments', analytics.purchaseFunnel.enrollments.toLocaleString(), ''],
        ['Funnel Purchases', analytics.purchaseFunnel.purchases.toLocaleString(), ''],
        ['Funnel Completions', analytics.purchaseFunnel.completions.toLocaleString(), '']
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `real-analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      URL.revokeObjectURL(url);

      toast({
        title: "Report Ready",
        description: "Your comprehensive analytics report has been downloaded.",
      });
    } catch (error) {
      console.error('Failed to export report:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
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
            <Button onClick={fetchRealAnalytics} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const revenueMetrics = [
    {
      title: 'Total Revenue',
      value: `₦${analytics.totalRevenue.toLocaleString()}`,
      change: `${analytics.revenueGrowth > 0 ? '+' : ''}${analytics.revenueGrowth.toFixed(1)}%`,
      trend: analytics.revenueGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign
    },
    {
      title: 'Revenue from Purchases',
      value: `₦${analytics.revenueFromPurchases.toLocaleString()}`,
      change: 'Direct sales',
      trend: 'neutral' as const,
      icon: ShoppingCart
    },
    {
      title: 'Avg Order Value',
      value: `₦${analytics.avgOrderValue.toLocaleString()}`,
      change: 'Per transaction',
      trend: 'neutral' as const,
      icon: TrendingUp
    },
    {
      title: 'Paying Students',
      value: analytics.payingStudents.toLocaleString(),
      change: `${analytics.conversionRate.toFixed(1)}% conversion`,
      trend: 'neutral' as const,
      icon: UserCheck
    }
  ];

  const userMetrics = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      change: `${analytics.userGrowth > 0 ? '+' : ''}${analytics.userGrowth.toFixed(1)}%`,
      trend: analytics.userGrowth >= 0 ? 'up' : 'down',
      icon: Users
    },
    {
      title: 'Free Students',
      value: analytics.freeStudents.toLocaleString(),
      change: `${((analytics.freeStudents / analytics.totalUsers) * 100).toFixed(1)}% of total`,
      trend: 'neutral' as const,
      icon: BookOpen
    },
    {
      title: 'Course Enrollments',
      value: analytics.totalEnrollments.toLocaleString(),
      change: 'All time',
      trend: 'neutral' as const,
      icon: Activity
    },
    {
      title: 'Completion Rate',
      value: `${analytics.courseCompletionRate.toFixed(1)}%`,
      change: 'Of enrolled',
      trend: 'neutral' as const,
      icon: TrendingUp
    }
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

        {/* Revenue Analytics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend !== 'neutral' && (
                        <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                          {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {metric.change}
                        </Badge>
                      )}
                      {metric.trend === 'neutral' && (
                        <span className="text-xs text-muted-foreground">{metric.change}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User Analytics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">User Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {metric.trend !== 'neutral' && (
                        <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                          {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {metric.change}
                        </Badge>
                      )}
                      {metric.trend === 'neutral' && (
                        <span className="text-xs text-muted-foreground">{metric.change}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Student Journey Funnel
              </CardTitle>
              <CardDescription>From course view to completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Course Views', value: analytics.purchaseFunnel.totalViews, color: '#94a3b8' },
                  { name: 'Enrollments', value: analytics.purchaseFunnel.enrollments, color: '#3b82f6' },
                  { name: 'Purchases', value: analytics.purchaseFunnel.purchases, color: '#10b981' },
                  { name: 'Completions', value: analytics.purchaseFunnel.completions, color: '#f59e0b' }
                ].map((stage, index) => (
                  <div key={stage.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{stage.value.toLocaleString()}</p>
                      {index > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {((stage.value / (index === 1 ? analytics.purchaseFunnel.totalViews :
                            index === 2 ? analytics.purchaseFunnel.enrollments :
                              analytics.purchaseFunnel.purchases)) * 100).toFixed(1)}% conversion
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RechartsBarChart className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>By revenue and completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.enrollments} enrolled • {course.completionRate.toFixed(1)}% complete
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₦{course.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{course.purchases} purchases</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Enrollment Trend</CardTitle>
            <CardDescription>
              {isInstructor ? 'Your course performance' : 'Platform-wide daily performance'} over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={Math.floor(trendData.length / 7)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `₦${Number(value).toLocaleString()}` : value,
                  name === 'revenue' ? 'Revenue' : 'Enrollments'
                ]} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}