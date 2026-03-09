import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Eye,
  BarChart3,
  AlertCircle,
  UserPlus,
  GraduationCap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// ── Types ─────────────────────────────────────────────────────────────────

interface InstructorCourse {
  id: string;
  title: string;
  status: string | null;
  price: number | null;
  category: string;
  created_at: string;
  thumbnail_url: string | null;
  enrollmentCount: number;
  completionRate: number;
}

interface InstructorStats {
  courses: {
    total: number;
    published: number;
    draft: number;
    review: number;
  };
  students: {
    total: number;
    activeThisMonth: number;
    completedCourse: number;
  };
  completion: {
    averageRate: number;
  };
  recentActivity: {
    id: string;
    type: 'enrollment' | 'course_created' | 'course_published' | 'completion';
    description: string;
    timestamp: string;
  }[];
  coursesList: InstructorCourse[];
}

// ── Component ─────────────────────────────────────────────────────────────

export default function InstructorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchInstructorStats();
    }
  }, [profile?.id]);

  const fetchInstructorStats = async () => {
    try {
      setLoading(true);
      const userId = profile?.id;
      if (!userId) return;

      // 1. Fetch instructor's courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, status, price, category, created_at, thumbnail_url')
        .eq('instructor_id', userId);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map(c => c.id) || [];

      // 2. Fetch enrollments for instructor's courses
      let enrollments: any[] = [];
      if (courseIds.length > 0) {
        const { data: enrollData, error: enrollError } = await supabase
          .from('enrollments')
          .select('id, course_id, student_id, status, progress_percentage, enrolled_at, completed_at')
          .in('course_id', courseIds);

        if (enrollError) throw enrollError;
        enrollments = enrollData || [];
      }

      // 3. Fetch payments - Removed as per request (only admins should have access to payment data)
      let payments: any[] = [];

      // ── Compute Stats ────────────────────────────────────────────────

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Course stats
      const courseStats = {
        total: courses?.length || 0,
        published: courses?.filter(c => c.status === 'published').length || 0,
        draft: courses?.filter(c => c.status === 'draft').length || 0,
        review: courses?.filter(c => c.status === 'review').length || 0,
      };

      // Student stats
      const uniqueStudentIds = new Set(enrollments.map(e => e.student_id));
      const activeThisMonth = new Set(
        enrollments
          .filter(e => new Date(e.enrolled_at) >= startOfMonth)
          .map(e => e.student_id)
      ).size;
      const completedStudents = enrollments.filter(e => e.status === 'completed').length;

      const studentStats = {
        total: uniqueStudentIds.size,
        activeThisMonth,
        completedCourse: completedStudents,
      };



      // Completion rate
      const enrolledWithProgress = enrollments.filter(
        e => e.progress_percentage !== null && e.progress_percentage !== undefined
      );
      const avgCompletion = enrolledWithProgress.length > 0
        ? Math.round(
          enrolledWithProgress.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) /
          enrolledWithProgress.length
        )
        : 0;

      // ── Build course list with per-course metrics ────────────────────

      const coursesList: InstructorCourse[] = (courses || []).map(course => {
        const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
        const coursePayments = payments.filter(p => p.course_id === course.id);
        const courseWithProgress = courseEnrollments.filter(
          e => e.progress_percentage !== null && e.progress_percentage !== undefined
        );
        const completionRate = courseWithProgress.length > 0
          ? Math.round(
            courseWithProgress.reduce((s, e) => s + (e.progress_percentage || 0), 0) /
            courseWithProgress.length
          )
          : 0;

        return {
          id: course.id,
          title: course.title,
          status: course.status,
          price: course.price,
          category: course.category,
          created_at: course.created_at,
          thumbnail_url: course.thumbnail_url,
          enrollmentCount: courseEnrollments.length,
          completionRate,
        };
      });

      // Sort: published first, then by enrollment count
      coursesList.sort((a, b) => {
        if (a.status === 'published' && b.status !== 'published') return -1;
        if (a.status !== 'published' && b.status === 'published') return 1;
        return b.enrollmentCount - a.enrollmentCount;
      });

      // ── Recent activity feed ────────────────────────────────────────

      const recentActivity: InstructorStats['recentActivity'] = [];

      // Recent enrollments
      enrollments
        .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
        .slice(0, 3)
        .forEach(e => {
          const course = courses?.find(c => c.id === e.course_id);
          recentActivity.push({
            id: e.id,
            type: 'enrollment',
            description: `New enrollment in "${course?.title || 'Unknown Course'}"`,
            timestamp: e.enrolled_at,
          });
        });

      // Recent course creations
      (courses || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2)
        .forEach(c => {
          recentActivity.push({
            id: c.id,
            type: c.status === 'published' ? 'course_published' : 'course_created',
            description: `Course "${c.title}" ${c.status === 'published' ? 'is live' : 'was created'}`,
            timestamp: c.created_at,
          });
        });

      // Recent completions
      enrollments
        .filter(e => e.status === 'completed' && e.completed_at)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 2)
        .forEach(e => {
          const course = courses?.find(c => c.id === e.course_id);
          recentActivity.push({
            id: e.id + '-complete',
            type: 'completion',
            description: `A student completed "${course?.title || 'Unknown Course'}"`,
            timestamp: e.completed_at!,
          });
        });

      // Sort all by timestamp
      recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setStats({
        courses: courseStats,
        students: studentStats,
        completion: { averageRate: avgCompletion },
        recentActivity: recentActivity.slice(0, 5),
        coursesList,
      });
    } catch (error) {
      console.error('Error fetching instructor stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Activity helpers ──────────────────────────────────────────────────

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <UserPlus className="h-4 w-4" />;
      case 'course_created': return <BookOpen className="h-4 w-4" />;
      case 'course_published': return <CheckCircle className="h-4 w-4" />;
      case 'completion': return <GraduationCap className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'text-blue-500';
      case 'course_created': return 'text-orange-500';
      case 'course_published': return 'text-green-500';
      case 'completion': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">Published</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-0">Draft</Badge>;
      case 'review':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">In Review</Badge>;
      case 'archived':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">Archived</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  // ── Render: Loading ─────────────────────────────────────────────────

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Unable to Load Dashboard</h1>
          <p className="text-muted-foreground mt-2">Failed to fetch your instructor data.</p>
          <Button className="mt-4" onClick={fetchInstructorStats}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  // ── Render: Dashboard ───────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Instructor'} 👋
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your courses and student engagement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/dashboard/courses/new')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Button>

          </div>
        </div>

        {/* ── Quick Stats Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courses.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.courses.published} published · {stats.courses.draft} draft
                {stats.courses.review > 0 && ` · ${stats.courses.review} in review`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.students.activeThisMonth > 0
                  ? `+${stats.students.activeThisMonth} this month`
                  : 'Enrolled across your courses'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completion.averageRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.students.completedCourse} students completed a course
              </p>
            </CardContent>
          </Card>


        </div>

        {/* ── Main Content Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Course List (takes 2 cols) ─────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  My Courses
                </span>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/dashboard/courses/new')}
                >
                  <Plus className="h-4 w-4" />
                  New Course
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your courses and track student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.coursesList.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses created yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start creating your first course to share your knowledge with students.
                  </p>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => navigate('/dashboard/courses/new')}
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Course
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.coursesList.map(course => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/dashboard/courses`)}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-12 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>

                      {/* Course info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{course.title}</span>
                          {getStatusBadge(course.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {course.enrollmentCount} students
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {course.completionRate}% completion
                          </span>

                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}

                  {/* View all */}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate('/dashboard/courses')}
                  >
                    View All Courses
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Right Column: Activity + Revenue ─────────────────────── */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-2 rounded-lg"
                      >
                        <div className={`mt-0.5 ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleDateString('en-NG', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No recent activity</p>
                    <p className="text-xs mt-1">
                      Activity will appear once students enroll in your courses
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Quick Actions ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/courses/new')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="h-6 w-6" />
            <span>Create Course</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/courses')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Eye className="h-6 w-6" />
            <span>Manage Courses</span>
          </Button>


        </div>
      </div>
    </DashboardLayout>
  );
}