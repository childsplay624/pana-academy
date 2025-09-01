import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Shield, 
  GraduationCap, 
  User,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  BarChart3,
  UserPlus,
  FileText
} from 'lucide-react';
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
  recentActivity: Array<{
    id: string;
    type: 'user_registered' | 'course_created' | 'course_published';
    description: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
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

      // Process user statistics
      const userStats = {
        total: users?.length || 0,
        students: users?.filter(u => u.role === 'student').length || 0,
        instructors: users?.filter(u => u.role === 'instructor').length || 0,
        admins: users?.filter(u => u.role === 'admin').length || 0,
      };

      // Process course statistics
      const courseStats = {
        total: courses?.length || 0,
        published: courses?.filter(c => c.status === 'published').length || 0,
        pendingReview: courses?.filter(c => c.status === 'review').length || 0,
        draft: courses?.filter(c => c.status === 'draft').length || 0,
      };

      // Generate recent activity (mock data for now)
      const recentActivity = [
        ...(users?.slice(-3).map(user => ({
          id: user.id,
          type: 'user_registered' as const,
          description: `${user.full_name || 'Unknown User'} registered as ${user.role}`,
          timestamp: user.created_at
        })) || []),
        ...(courses?.slice(-3).map(course => ({
          id: course.id,
          type: 'course_created' as const,
          description: `Course "${course.title}" was created`,
          timestamp: course.created_at
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

      setStats({
        users: userStats,
        courses: courseStats,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return <UserPlus className="h-4 w-4" />;
      case 'course_created': return <BookOpen className="h-4 w-4" />;
      case 'course_published': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registered': return 'text-blue-500';
      case 'course_created': return 'text-green-500';
      case 'course_published': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

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
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Unable to Load Dashboard</h1>
            <p className="text-muted-foreground">Failed to fetch dashboard data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform and monitor activity</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/analytics')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard/settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.users.students}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <GraduationCap className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.users.instructors}</div>
                  <div className="text-sm text-muted-foreground">Instructors</div>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.users.admins}</div>
                  <div className="text-sm text-muted-foreground">Admins</div>
                </div>
              </div>

              {/* Total Users */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">Total Users</div>
                  <div className="text-sm text-muted-foreground">All registered users</div>
                </div>
                <div className="text-2xl font-bold">{stats.users.total}</div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => navigate('/dashboard/users')}
                className="w-full flex items-center justify-center gap-2"
              >
                Manage Users
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Course Management Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Management
              </CardTitle>
              <CardDescription>Review and approve courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.courses.published}</div>
                  <div className="text-sm text-muted-foreground">Published</div>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.courses.pendingReview}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="text-center p-3 rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-2xl font-bold">{stats.courses.draft}</div>
                  <div className="text-sm text-muted-foreground">Draft</div>
                </div>
              </div>

              {/* Total Courses */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">Total Courses</div>
                  <div className="text-sm text-muted-foreground">All courses in system</div>
                </div>
                <div className="text-2xl font-bold">{stats.courses.total}</div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => navigate('/dashboard/courses')}
                className="w-full flex items-center justify-center gap-2"
              >
                Review Courses
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className={`${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/users')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <UserPlus className="h-6 w-6" />
            <span>Add User</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/courses')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Eye className="h-6 w-6" />
            <span>Review Courses</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/analytics')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <BarChart3 className="h-6 w-6" />
            <span>View Analytics</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/settings')}
            className="h-20 flex flex-col items-center justify-center gap-2"
          >
            <Settings className="h-6 w-6" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}