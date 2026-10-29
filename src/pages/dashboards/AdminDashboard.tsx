import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  BookOpen,
  GraduationCap,
  Shield,
  CreditCard,
  TrendingUp,
  FileText,
  UserPlus,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Settings,
  Mail,
  ImageIcon,
  Search,
  Filter,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DashboardLayout } from '@/components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  users: {
    total: number;
    students: number;
    instructors: number;
    admins: number;
  };
  courses: {
    total: number;
    published: number;
    pendingReview: number;
    draft: number;
  };
  invoices: {
    total: number;
    revenue: number;
    uniqueStudents: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user_registered' | 'course_created' | 'course_published' | 'invoice_generated';
    description: string;
    timestamp: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    invoices: number;
  }>;
  userRoleDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  courseStatusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m'>('12m');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      // Fetch users data
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, role, created_at, full_name');

      if (usersError) throw usersError;

      // Fetch courses data
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, status, created_at, title');

      if (coursesError) throw coursesError;

      // Fetch invoices data
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('id, created_at, total_amount, student_name, course_title, student_email');

      if (invoicesError) throw invoicesError;

      // Fetch completed payments for accurate revenue metrics
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, status, created_at')
        .eq('status', 'completed');

      if (paymentsError) throw paymentsError;

      // Process user statistics
      const studentsCount = users?.filter(u => u.role === 'student').length || 0;
      const instructorsCount = users?.filter(u => u.role === 'instructor').length || 0;
      const adminsCount = users?.filter(u => u.role === 'admin').length || 0;

      const userStats = {
        total: users?.length || 0,
        students: studentsCount,
        instructors: instructorsCount,
        admins: adminsCount,
      };

      // Process course statistics
      const publishedCount = courses?.filter(c => c.status === 'published').length || 0;
      const pendingCount = courses?.filter(c => c.status === 'review').length || 0;
      const draftCount = courses?.filter(c => c.status === 'draft').length || 0;

      const courseStats = {
        total: courses?.length || 0,
        published: publishedCount,
        pendingReview: pendingCount,
        draft: draftCount,
      };

      // Process total revenue & unique students
      const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const invoiceStats = {
        total: invoices?.length || 0,
        revenue: totalRevenue,
        uniqueStudents: new Set([
          ...(invoices?.map(inv => inv.student_email) || []),
        ]).size || 0,
      };

      // Generate 6-month monthly revenue & invoice trends
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const past6Months: Array<{ month: string; monthIndex: number; year: number; revenue: number; invoices: number }> = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        past6Months.push({
          month: months[d.getMonth()],
          monthIndex: d.getMonth(),
          year: d.getFullYear(),
          revenue: 0,
          invoices: 0
        });
      }

      payments?.forEach(p => {
        if (!p.created_at) return;
        const pDate = new Date(p.created_at);
        const match = past6Months.find(m => m.monthIndex === pDate.getMonth() && m.year === pDate.getFullYear());
        if (match) {
          match.revenue += Number(p.amount || 0);
        }
      });

      invoices?.forEach(inv => {
        if (!inv.created_at) return;
        const invDate = new Date(inv.created_at);
        const match = past6Months.find(m => m.monthIndex === invDate.getMonth() && m.year === invDate.getFullYear());
        if (match) {
          match.invoices += 1;
        }
      });

      // If no payments recorded in current window, give baseline visual structure
      const monthlyRevenue = past6Months.map(m => ({
        month: m.month,
        revenue: m.revenue,
        invoices: m.invoices
      }));

      // Generate recent activity
      const recentActivity = [
        ...(users?.slice(-4).map(user => ({
          id: user.id,
          type: 'user_registered' as const,
          description: `${user.full_name || 'New User'} joined as ${user.role}`,
          timestamp: user.created_at
        })) || []),
        ...(courses?.slice(-3).map(course => ({
          id: course.id,
          type: 'course_created' as const,
          description: `Course "${course.title}" was updated/created`,
          timestamp: course.created_at
        })) || []),
        ...(invoices?.slice(-4).map(invoice => ({
          id: invoice.id,
          type: 'invoice_generated' as const,
          description: `Invoice for ${invoice.student_name || 'Student'} (${invoice.course_title || 'Enrolled Course'})`,
          timestamp: invoice.created_at
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

      // Distributions for BoardUI visual cards
      const userRoleDistribution = [
        { name: 'Students', value: studentsCount, color: '#3b82f6' },
        { name: 'Instructors', value: instructorsCount, color: '#10b981' },
        { name: 'Admins', value: adminsCount, color: '#8b5cf6' },
      ];

      const courseStatusDistribution = [
        { name: 'Published', value: publishedCount, color: '#10b981' },
        { name: 'Pending Review', value: pendingCount, color: '#f59e0b' },
        { name: 'Draft', value: draftCount, color: '#64748b' },
      ];

      setStats({
        users: userStats,
        courses: courseStats,
        invoices: invoiceStats,
        recentActivity,
        monthlyRevenue,
        userRoleDistribution,
        courseStatusDistribution
      });

      if (isManualRefresh) {
        toast({
          title: 'Dashboard Refreshed',
          description: 'Live site data has been updated.',
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">Registration</Badge>;
      case 'course_created':
        return <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">Course</Badge>;
      case 'course_published':
        return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">Published</Badge>;
      case 'invoice_generated':
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">Billing</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          </div>
          <div className="text-sm font-medium text-muted-foreground animate-pulse">
            Connecting to PANA database & aggregating live telemetry...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold mb-2">Unable to Load Dashboard Data</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We encountered a connection issue while pulling live analytics from Supabase.
          </p>
          <Button onClick={() => fetchDashboardStats()} className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Top Header / Page Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Executive Command Center
              </h1>
              <Badge className="bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-800 text-xs font-semibold px-2.5 py-0.5">
                Admin Live
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time platform telemetry, enrollment tracking, revenue reporting, and system governance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing}
              className="h-9 px-3 gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-red-600' : ''}`} />
              {refreshing ? 'Syncing...' : 'Refresh Data'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/analytics')}
              className="h-9 px-3 gap-2 border-slate-200 dark:border-slate-800 text-xs font-medium"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Full Analytics
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/dashboard/courses/new')}
              className="h-9 px-3.5 gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm shadow-red-500/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Course
            </Button>
          </div>
        </div>

        {/* BoardUI Key Metric Stat-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Revenue */}
          <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/60 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Collected Revenue
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  ₦{stats.invoices.revenue.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3 h-3" /> {stats.invoices.total} completed invoices
                </span>
                <span className="text-[11px] text-slate-400">Lifetime</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Total Learners */}
          <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/60 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Learners
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {stats.users.students}
                </span>
                <span className="text-xs text-muted-foreground font-medium">enrolled</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                  <Users className="w-3 h-3" /> {stats.users.total} total members
                </span>
                <span className="text-[11px] text-slate-400">All accounts</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Courses Published */}
          <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/60 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-400" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Course Offerings
                </span>
                <div className="p-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {stats.courses.published}
                </span>
                <span className="text-xs text-muted-foreground font-medium">of {stats.courses.total} total</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Clock className="w-3 h-3" /> {stats.courses.pendingReview} in review
                </span>
                <span className="text-[11px] text-slate-400">{stats.courses.draft} drafts</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Instructors & Staff */}
          <Card className="relative overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/60 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Faculty & Staff
                </span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {stats.users.instructors}
                </span>
                <span className="text-xs text-muted-foreground font-medium">instructors</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                  <Shield className="w-3 h-3" /> {stats.users.admins} admin(s)
                </span>
                <span className="text-[11px] text-slate-400">Governed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BoardUI Revenue Analytics & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Card (Spans 2 cols) */}
          <Card className="lg:col-span-2 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Revenue Performance & Invoicing Velocity
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly cash collection aggregated from verified payment gateways
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/payments')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1"
              >
                View Payments <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="invoiceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'currentColor' }}
                      tickFormatter={(val) => `₦${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                      className="text-muted-foreground"
                    />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-white/10 text-xs space-y-1.5">
                              <p className="font-bold text-slate-200">{label}</p>
                              <p className="text-emerald-400 font-semibold">
                                Revenue: ₦{Number(payload[0]?.value || 0).toLocaleString()}
                              </p>
                              <p className="text-blue-300">
                                Invoices: {payload[1]?.value || 0} issued
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue (₦)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="invoices"
                      name="Invoices"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#invoiceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Revenue (₦)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Invoices Issued</span>
                  </div>
                </div>
                <span className="text-[11px]">Aggregated monthly</span>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution Card */}
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Community Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Breakdown of active platform roles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex-1 flex flex-col justify-center">
              <div className="h-[180px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.userRoleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.userRoleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium">
                              {data.name}: {data.value} ({((data.value / (stats.users.total || 1)) * 100).toFixed(0)}%)
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-2 pt-2 border-t text-xs">
                {stats.userRoleDistribution.map((role) => (
                  <div key={role.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="text-muted-foreground">{role.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <span>{role.value}</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        ({((role.value / (stats.users.total || 1)) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/users')}
                className="w-full text-xs font-semibold h-8"
              >
                Manage Directory <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Middle Two-Column Grid: Course Pipeline & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Course Pipeline & Review Center */}
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  Academic Course Pipeline
                </CardTitle>
                <CardDescription className="text-xs">
                  Catalog publication state and instructional quality status
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/courses')}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/20 text-center">
                  <div className="flex items-center justify-center mb-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.courses.published}</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Published</div>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 dark:border-amber-950 dark:bg-amber-950/20 text-center">
                  <div className="flex items-center justify-center mb-1 text-amber-600 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.courses.pendingReview}</div>
                  <div className="text-[11px] text-muted-foreground font-medium">In Review</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 text-center">
                  <div className="flex items-center justify-center mb-1 text-slate-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.courses.draft}</div>
                  <div className="text-[11px] text-muted-foreground font-medium">Drafts</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-foreground">Catalog Quality Index</div>
                  <div className="text-[11px] text-muted-foreground">
                    {stats.courses.published} of {stats.courses.total} offerings active for public enrollment
                  </div>
                </div>
                <div className="text-lg font-black text-red-600">
                  {stats.courses.total > 0
                    ? `${((stats.courses.published / stats.courses.total) * 100).toFixed(0)}%`
                    : '0%'}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate('/dashboard/courses')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold h-9 gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Review Course Submissions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/courses/new')}
                  className="text-xs font-semibold h-9"
                >
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card: Live Telemetry & Audit Stream */}
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  Live Platform Audit Stream
                </CardTitle>
                <CardDescription className="text-xs">
                  Chronological log of registrations, invoices, and course updates
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                Real-Time
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 flex-1">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-2 h-2 rounded-full shrink-0 bg-red-600" />
                      <div className="truncate">
                        <p className="font-semibold text-foreground truncate">{activity.description}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    {getActivityBadge(activity.type)}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No recent activities recorded today.
                </div>
              )}
            </CardContent>
            <div className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/invoices')}
                className="w-full text-xs font-semibold h-8"
              >
                Inspect All Invoices & Ledger <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Launchpad & Operational Shortcuts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              Administrative Operations & Quick Access
            </h2>
            <span className="text-xs text-muted-foreground">Direct management shortcuts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => navigate('/dashboard/users')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">User Accounts</div>
              <div className="text-[11px] text-muted-foreground">Roles & permissions</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/courses')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">Courses & Modules</div>
              <div className="text-[11px] text-muted-foreground">Curriculum publisher</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/payments')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">Payments</div>
              <div className="text-[11px] text-muted-foreground">Paystack & gateways</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/invoices')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">Invoices</div>
              <div className="text-[11px] text-muted-foreground">Corporate receipts</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/images')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">Media Assets</div>
              <div className="text-[11px] text-muted-foreground">Banners & storage</div>
            </button>

            <button
              onClick={() => navigate('/dashboard/messages')}
              className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">Inquiries</div>
              <div className="text-[11px] text-muted-foreground">Contact inbox</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}