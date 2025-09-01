import { useState, useEffect } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { useGamification } from '@/hooks/useGamification';
import { goalsApi } from '@/lib/api/goals';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { CourseProgressChart } from '@/components/dashboard/CourseProgressChart';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { BadgeDisplay } from '@/components/gamification/BadgeDisplay';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { PointsHistory } from '@/components/gamification/PointsHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Flame,
  Loader2,
  RefreshCw,
  Settings,
  Target,
  Trophy,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { SetGoalsDialog } from '@/components/goals/SetGoalsDialog';
import { ScheduleDialog } from '@/components/schedule/ScheduleDialog';

export default function ProgressPage() {
  const { user } = useAuth();
  const { isLoading, enrolledCourses, stats } = useStudentData();
  const { 
    loading: gamificationLoading, 
    userGamification, 
    userBadges, 
    allBadges, 
    pointsHistory, 
    leaderboard,
    getLevelProgress 
  } = useGamification();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [goals, setGoals] = useState({
    weeklyStudyHours: 5,
    targetCoursesCompleted: 2,
    targetWeeklyStreak: 7,
  });
  const [progress, setProgress] = useState({
    weeklyStudyHours: 0,
    completedCourses: 0,
    currentStreak: 0,
  });
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const levelProgress = getLevelProgress();

  const refreshProgress = async () => {
    try {
      setIsLoadingGoals(true);
      setError(null);
      await loadGoalsAndProgress();
      // Show success message if refresh was successful
      toast.success('Progress data refreshed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh progress. Please try again.';
      setError(errorMessage);
      console.error('Error refreshing progress:', err);
      toast.error(errorMessage);
    }
  };

  const loadGoalsAndProgress = async () => {
    try {
      setIsLoadingGoals(true);
      setError(null);
      
      // Load goals
      const goalsData = await goalsApi.getOrCreateGoals();
      setGoals({
        weeklyStudyHours: goalsData.weekly_study_hours,
        targetCoursesCompleted: goalsData.target_courses_completed,
        targetWeeklyStreak: goalsData.target_weekly_streak,
      });
      
      // Load progress
      const stats = await goalsApi.getStudyStatistics();
      setProgress({
        weeklyStudyHours: Math.min(stats.totalMinutesThisWeek / 60, goalsData.weekly_study_hours || 1),
        completedCourses: stats.completedCourses,
        currentStreak: stats.currentStreak,
      });
      
      return true; // Indicate success
    } catch (error) {
      console.error('Error loading goals and progress:', error);
      const errorMessage = error.message || 'Failed to load your progress data. Please try again later.';
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw with consistent error format
    } finally {
      setIsLoadingGoals(false);
    }
  };

  useEffect(() => {
    loadGoalsAndProgress();
  }, []);

  const handleGoalsUpdated = async () => {
    try {
      setIsLoadingGoals(true);
      const goalsData = await goalsApi.getOrCreateGoals();
      setGoals({
        weeklyStudyHours: goalsData.weekly_study_hours,
        targetCoursesCompleted: goalsData.target_courses_completed,
        targetWeeklyStreak: goalsData.target_weekly_streak,
      });
    } catch (error) {
      console.error('Error refreshing goals:', error);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
            <p className="text-muted-foreground">
              Track your learning journey and achievements
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshProgress}
              disabled={isLoadingGoals}
            >
              {isLoadingGoals ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <SetGoalsDialog onGoalsUpdated={handleGoalsUpdated}>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Set Goals
              </Button>
            </SetGoalsDialog>
            <ScheduleDialog>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </ScheduleDialog>
          </div>
        </div>

        {/* Error display with retry button */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading progress data</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={refreshProgress}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={isLoadingGoals}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingGoals ? 'animate-spin' : ''}`} />
                    {isLoadingGoals ? 'Refreshing...' : 'Try Again'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingGoals && !error && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your progress...</span>
          </div>
        )}

        {/* Progress Overview */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ${isLoadingGoals ? 'opacity-50 pointer-events-none' : ''}`}>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(progress.weeklyStudyHours * 10) / 10}h / {goals.weeklyStudyHours}h
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Weekly Goal</span>
                  <span>{Math.round((progress.weeklyStudyHours / goals.weeklyStudyHours) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((progress.weeklyStudyHours / goals.weeklyStudyHours) * 100, 100)} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.completedCourses} / {goals.targetCoursesCompleted}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Target Completed</span>
                  <span>{Math.round((progress.completedCourses / goals.targetCoursesCompleted) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((progress.completedCourses / goals.targetCoursesCompleted) * 100, 100)} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.currentStreak} day{progress.currentStreak !== 1 ? 's' : ''}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Weekly Goal</span>
                  <span>{Math.round((progress.currentStreak / goals.targetWeeklyStreak) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((progress.currentStreak / goals.targetWeeklyStreak) * 100, 100)} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Your Level & Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userGamification ? (
                <LevelProgress
                  level={userGamification.level}
                  experience={userGamification.experience_points}
                  progressData={levelProgress}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Loading your progress...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeDisplay 
                userBadges={userBadges} 
                allBadges={allBadges} 
                compact={true} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold">{userGamification?.total_points.toLocaleString() || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Level {userGamification?.level || 1}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Study Streak</p>
                  <p className="text-2xl font-bold">{userGamification?.streak_days || 0} days</p>
                  <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time This Week</p>
                  <p className="text-2xl font-bold">{Math.floor(stats.totalTimeSpent / 60)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Goal: 5h/week</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                  <p className="text-2xl font-bold">{userBadges.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Out of {allBadges.length} total</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Charts */}
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Progress Analytics</h2>
            <TabsList>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="year">This Year</TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TabsContent value={selectedPeriod} className="col-span-1 lg:col-span-2 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Study Time Progress</CardTitle>
                  <CardDescription>Your daily learning activity</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ProgressChart isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Progress across all enrolled courses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
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

            <Card>
              <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
                <CardDescription>Track your learning objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Study Time (5h/week)</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.floor(stats.totalTimeSpent / 60)}h / 5h
                    </span>
                  </div>
                  <Progress value={(stats.totalTimeSpent / 60 / 5) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Course Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.completedCourses} / 2 courses
                    </span>
                  </div>
                  <Progress value={(stats.completedCourses / 2) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Weekly Streak</span>
                    <span className="text-sm text-muted-foreground">{stats.streakDays} days</span>
                  </div>
                  <Progress value={(stats.streakDays / 7) * 100} className="h-2" />
                </div>

                <Button className="w-full mt-4">
                  <Target className="h-4 w-4 mr-2" />
                  Update Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </Tabs>

        {/* Gamification Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Badges</CardTitle>
                <CardDescription>Unlock achievements by completing courses and challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <BadgeDisplay 
                  userBadges={userBadges} 
                  allBadges={allBadges} 
                  compact={false} 
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Leaderboard 
              leaderboard={leaderboard} 
              currentUserId={user?.id} 
            />
            
            <PointsHistory history={pointsHistory} />
          </div>
        </div>

        {/* Course Progress Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Course Progress Details</CardTitle>
            <CardDescription>Detailed progress for each enrolled course</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium truncate">{course.title}</h4>
                        <Badge variant="outline">{course.progress}% complete</Badge>
                      </div>
                      <Progress value={course.progress} className="h-2 mb-2" />
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{course.timeSpent} minutes spent</span>
                        <span>•</span>
                        <span>{course.totalHours} hours total</span>
                      </div>
                    </div>
                    
                    <Button size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No enrolled courses to track progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}