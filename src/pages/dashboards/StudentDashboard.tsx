import { useState } from 'react';
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
  AlertTriangle, Download, Play, Code, Settings, 
  BarChart3, Flame, Activity, FileType, Eye, CalendarDays, X
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

export default function StudentDashboard() {
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
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
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
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
            <div className="mb-8">
              <h2 className="text-xl font-bold tracking-tight mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <ContinueLearning 
                  enrolledCourses={enrolledCourses} 
                  isLoading={isLoading}
                />
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
              </div>
            </div>


            {/* Learning Resources */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Learning Resources</h2>
                  <p className="text-muted-foreground text-sm">
                    Recommended resources to enhance your learning
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileType className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">PDF</Badge>
                        <h3 className="font-medium text-sm mb-1">Complete Guide to React Hooks</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          Master React Hooks with this comprehensive guide covering all the essential hooks and patterns.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">2.4 MB</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Video className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">Video</Badge>
                        <h3 className="font-medium text-sm mb-1">TypeScript Crash Course</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          Learn TypeScript fundamentals and advanced patterns in this comprehensive video tutorial.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">45 min</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Play className="h-3 w-3 mr-1" />
                            Watch Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Code className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">Code</Badge>
                        <h3 className="font-medium text-sm mb-1">React Performance Optimization</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          Code examples and patterns for optimizing React application performance.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">12 files</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="mb-2 text-xs">Article</Badge>
                        <h3 className="font-medium text-sm mb-1">State Management in 2023</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          Comparing different state management solutions for modern React applications.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">8 min read</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

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
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
                  <p className="text-muted-foreground text-sm">
                    Your recent learning activities and progress
                  </p>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities and achievements</CardDescription>
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
            </div>

            {/* Recommended Courses */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
                  <p className="text-muted-foreground text-sm">
                    {isLoading ? (
                      <Skeleton className="h-4 w-64 inline-block" />
                    ) : (
                      'Courses we think you\'ll love based on your interests'
                    )}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

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
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md px-4">
                    Complete some courses or update your interests to get personalized recommendations.
                  </p>
                  <Button>Update Interests</Button>
                </div>
              )}
            </div>
          </TooltipProvider>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}