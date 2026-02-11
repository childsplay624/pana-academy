import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useStudentData } from '@/hooks/useStudentData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  BookOpen, Award, Calendar, Clock, TrendingUp,
  AlertCircle, Info, Target, CheckCircle, ChevronRight,
  Plus, Trophy, RefreshCw, FileText, Video, FileCode,
  AlertTriangle, Download, Play, Code, Settings, User,
  BarChart3, Flame, Activity, FileType, Eye, CalendarDays, X,
  Search, Filter
} from 'lucide-react';
import { SetGoals } from '@/components/dashboard/SetGoals';
import { StudySchedule } from '@/components/dashboard/StudySchedule';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { ContinueLearning } from '@/components/ContinueLearning';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { CourseProgressChart } from '@/components/dashboard/CourseProgressChart';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { DeadlinesWidget } from '@/components/dashboard/DeadlinesWidget';
import { ProfileEdit } from '@/components/student/ProfileEdit';

// Define interfaces for our data models
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail?: string | null;
  lastAccessed?: string;
  isNew?: boolean;
  isTrending?: boolean;
  timeSpent: number;
  category: string;
  totalHours: number;
  image?: string | null;
  [key: string]: any;
}

// Type guard to check if stats has all required properties
function isCompleteStats(stats: any): stats is Stats {
  return (
    stats &&
    typeof stats.enrolledCourses === 'number' &&
    typeof stats.certificates === 'number' &&
    typeof stats.totalProgress === 'number' &&
    typeof stats.totalTimeSpent === 'number' &&
    typeof stats.weeklyGoalProgress === 'number' &&
    typeof stats.completedCourses === 'number' &&
    typeof stats.streakDays === 'number'
  );
}

interface Stats {
  enrolledCourses: number;
  certificates: number;
  totalProgress: number;
  totalTimeSpent: number;
  weeklyGoalProgress: number;
  completedCourses: number;
  streakDays: number;
}

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  tooltip?: string;
  isLoading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  tooltip,
  isLoading = false,
  className = ''
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        {title}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardTitle>
      <div className="h-4 w-4 text-muted-foreground">
        <Icon />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <div className="text-xs text-muted-foreground">
        {isLoading ? <Skeleton className="h-4 w-32 mt-1" /> : description}
      </div>
    </CardContent>
  </Card>
);

const DashboardError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="p-3 bg-red-50 rounded-full mb-4">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
    <p className="text-muted-foreground mb-6 max-w-md">
      We couldn't load your dashboard data. Please check your connection and try again.
    </p>
    <Button onClick={onRetry} variant="outline">
      Retry
    </Button>
  </div>
);

type CourseFilter = 'all' | 'in_progress' | 'completed' | 'not_started';

export default function StudentDashboard() {
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<CourseFilter>('all');
  const { profile, signOut } = useAuth();
  const {
    isLoading,
    error,
    enrolledCourses = [],
    recommendedCourses = [],
    stats: rawStats = {
      enrolledCourses: 0,
      certificates: 0,
      totalProgress: 0,
      totalTimeSpent: 0
    }
  } = useStudentData();

  // Ensure stats has all required properties with default values
  const stats: Stats = isCompleteStats(rawStats)
    ? rawStats
    : {
      ...rawStats,
      weeklyGoalProgress: 0,
      completedCourses: 0,
      streakDays: 0
    };

  const userProfile = profile as UserProfile | null;
  const [retryCount, setRetryCount] = useState(0);
  const handleRetry = () => setRetryCount(prev => prev + 1);

  // Filter enrolled courses based on search and filter
  const filteredCourses = useMemo(() => {
    let filtered = enrolledCourses;

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (courseFilter) {
      case 'in_progress':
        filtered = filtered.filter(c => c.progress > 0 && c.progress < 100);
        break;
      case 'completed':
        filtered = filtered.filter(c => c.progress === 100);
        break;
      case 'not_started':
        filtered = filtered.filter(c => c.progress === 0);
        break;
    }

    return filtered;
  }, [enrolledCourses, searchQuery, courseFilter]);

  if (error && !isLoading) {
    console.error('Dashboard error:', error);
    return (
      <DashboardLayout>
        <div className="p-8 flex items-center justify-center">
          <DashboardError onRetry={handleRetry} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <DashboardLayout>
          <div className="p-8 flex items-center justify-center">
            <DashboardError onRetry={() => window.location.reload()} />
          </div>
        </DashboardLayout>
      }
    >
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <header className="border-b pb-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back, {userProfile?.first_name || userProfile?.full_name || 'Student'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  {isLoading ? (
                    <Skeleton className="h-5 w-64 inline-block" />
                  ) : (
                    'Here\'s what\'s happening with your learning today.'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={signOut}>
                      Sign Out
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign out of your account</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <TooltipProvider>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Enrolled Courses"
                value={stats.enrolledCourses}
                description={
                  stats.enrolledCourses === 0
                    ? 'Start your learning journey'
                    : `${stats.enrolledCourses} active ${stats.enrolledCourses === 1 ? 'course' : 'courses'}`
                }
                icon={BookOpen}
                tooltip="Number of courses you're currently enrolled in"
                isLoading={isLoading}
              />

              <StatCard
                title="Certificates"
                value={stats.certificates}
                description={
                  stats.certificates === 0
                    ? 'Complete courses to earn certificates'
                    : `${stats.certificates} earned`
                }
                icon={Award}
                tooltip="Certificates earned from completed courses"
                isLoading={isLoading}
              />

              <StatCard
                title="Learning Progress"
                value={`${stats.totalProgress}%`}
                description={
                  <div className="mt-1">
                    <Progress value={stats.totalProgress} className="h-2" />
                    <span className="text-xs text-muted-foreground mt-1 block">
                      Overall completion rate
                    </span>
                  </div>
                }
                icon={TrendingUp}
                tooltip="Your overall learning progress across all courses"
                isLoading={isLoading}
              />

              <StatCard
                title="Time Spent"
                value={`${Math.floor((stats.totalTimeSpent || 0) / 60)}h ${(stats.totalTimeSpent || 0) % 60}m`}
                description={
                  (stats.totalTimeSpent || 0) === 0
                    ? 'Start learning to track time'
                    : 'Total learning time this month'
                }
                icon={Clock}
                tooltip="Total time spent learning this month"
                isLoading={isLoading}
              />
            </div>

            {/* Data Visualization - Side by Side Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Study Progress</CardTitle>
                  <CardDescription>Your learning activity over the past week</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full">
                  <ProgressChart isLoading={isLoading} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Your progress across all enrolled courses</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full">
                  <CourseProgressChart
                    data={enrolledCourses.map(course => ({
                      name: course.title,
                      value: course.progress,
                      color: '#0088FE'
                    }))}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight">Quick Actions</CardTitle>
                <CardDescription>Access frequently used features and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <ContinueLearning
                    enrolledCourses={enrolledCourses}
                    isLoading={isLoading}
                  />
                  <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      size="sm"
                      type="button"
                      onClick={() => setProfileDialogOpen(true)}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">Edit Profile</span>
                    </Button>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <ProfileEdit />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm" asChild>
                    <Link to="/dashboard/courses">
                      <Plus className="h-5 w-5" />
                      <span className="text-xs">New Course</span>
                    </Link>
                  </Button>
                  {stats.certificates > 0 ? (
                    <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm" asChild>
                      <Link to="/dashboard/certificates">
                        <Award className="h-5 w-5" />
                        <span className="text-xs">My Certificates</span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2 opacity-50 cursor-not-allowed"
                      size="sm"
                      disabled
                    >
                      <Award className="h-5 w-5" />
                      <span className="text-xs">No Certificates</span>
                    </Button>
                  )}
                  <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      size="sm"
                      type="button"
                      onClick={() => setScheduleDialogOpen(true)}
                    >
                      <CalendarDays className="h-5 w-5" />
                      <span className="text-xs">Study Schedule</span>
                    </Button>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Study Schedule</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <StudySchedule />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={goalsDialogOpen} onOpenChange={setGoalsDialogOpen}>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      size="sm"
                      type="button"
                      onClick={() => setGoalsDialogOpen(true)}
                    >
                      <Target className="h-5 w-5" />
                      <span className="text-xs">Set Goals</span>
                    </Button>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Set Learning Goals</DialogTitle>
                      </DialogHeader>
                      <div className="p-4">
                        <SetGoals />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm" asChild>
                    <Link to="/dashboard/progress">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-xs">Progress Report</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm" asChild>
                    <Link to="/student/profile">
                      <Settings className="h-5 w-5" />
                      <span className="text-xs">Profile Page</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* My Courses Section with Search & Filter */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">My Courses</CardTitle>
                    <CardDescription className="text-sm">
                      {isLoading ? (
                        <Skeleton className="h-4 w-64 inline-block" />
                      ) : (
                        `Managing ${enrolledCourses.length} ${enrolledCourses.length === 1 ? 'course' : 'courses'}`
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Filter Bar */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search your courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filter Dropdown */}
                    <Select value={courseFilter} onValueChange={(value) => setCourseFilter(value as CourseFilter)}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses ({enrolledCourses.length})</SelectItem>
                        <SelectItem value="in_progress">
                          In Progress ({enrolledCourses.filter(c => c.progress > 0 && c.progress < 100).length})
                        </SelectItem>
                        <SelectItem value="completed">
                          Completed ({enrolledCourses.filter(c => c.progress === 100).length})
                        </SelectItem>
                        <SelectItem value="not_started">
                          Not Started ({enrolledCourses.filter(c => c.progress === 0).length})
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {(searchQuery || courseFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSearchQuery('');
                          setCourseFilter('all');
                        }}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Results count */}
                  {!isLoading && (
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredCourses.length} of {enrolledCourses.length} courses
                    </p>
                  )}
                </div>

                {/* Course Display */}
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredCourses.length === 0 ? (
                  searchQuery || courseFilter !== 'all' ? (
                    <EmptyState
                      icon={Search}
                      title="No courses found"
                      description={`No courses match your current filters. Try adjusting your search or filter settings.`}
                      action={{
                        label: "Clear Filters",
                        onClick: () => {
                          setSearchQuery('');
                          setCourseFilter('all');
                        }
                      }}
                    />
                  ) : (
                    <EmptyState
                      icon={BookOpen}
                      title="Start your learning journey"
                      description="You haven't enrolled in any courses yet. Browse our course catalog to find courses that match your interests and career goals."
                      action={{
                        label: "Browse Courses",
                        onClick: () => window.location.href = '/courses'
                      }}
                    />
                  )
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        instructor={course.instructor}
                        progress={course.progress}
                        thumbnail={course.thumbnail || course.image}
                        lastAccessed={course.lastAccessed}
                        className="h-full"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deadlines Widget */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
                <CardDescription>Track your assignment and project due dates</CardDescription>
              </CardHeader>
              <CardContent>
                <DeadlinesWidget />
              </CardContent>
            </Card>

            {/* Learning Resources */}

            {/* Study Goals and Weekly Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Study Goals */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg">Study Goals</CardTitle>
                    <CardDescription>Track your learning objectives and milestones</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    New Goal
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Weekly Learning Time</span>
                      <span className="text-sm text-muted-foreground">0% of 5h</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Course Completion</span>
                      <span className="text-sm text-muted-foreground">0 of 2 courses</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
                    View All Goals <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Weekly Streak */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Streak</CardTitle>
                  <CardDescription>Keep your learning streak going!</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <Flame className="h-8 w-8 text-orange-500 mr-2" />
                    <span className="text-3xl font-bold">0</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Start a new learning streak today!
                  </p>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
                    <CardDescription>Your latest learning activities and achievements</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Calendar className="h-4 w-4 mr-1" />
                      View Calendar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity information</p>
                    <p className="text-sm text-muted-foreground">You're making progress in Introduction to Programming</p>
                    <p className="text-xs text-muted-foreground mt-1">45% complete • Last accessed 2 days ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity information</p>
                    <p className="text-sm text-muted-foreground">You're making progress in Web Development Fundamentals</p>
                    <p className="text-xs text-muted-foreground mt-1">15% complete • Last accessed 1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Recommended For You</CardTitle>
                    <CardDescription className="text-sm">
                      {isLoading ? (
                        <Skeleton className="h-4 w-64 inline-block" />
                      ) : (
                        'Courses we think you\'ll love based on your interests'
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-40 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : recommendedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recommendedCourses.slice(0, 4).map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        instructor={course.instructor}
                        progress={course.progress}
                        thumbnail={course.thumbnail || course.image}
                        lastAccessed={course.lastAccessed}
                        className="h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No recommendations yet"
                    description="Complete some courses or update your interests to get personalized recommendations."
                    action={{
                      label: "Update Interests",
                      onClick: () => window.location.href = '/dashboard/settings'
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TooltipProvider>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}