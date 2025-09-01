import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
  Video,
  Users,
  Award,
  Target
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  thumbnail_url: string | null;
  duration_hours: number;
  level: string | null;
  category: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  lesson_type: string | null;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  progress?: {
    completed: boolean;
    time_spent_minutes: number;
  };
}

export default function CourseLearning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { awardPoints, updateStreak } = useGamification();
  const { sendEnrollmentConfirmation, sendCertificateNotification } = useEmailNotifications();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollment, setEnrollment] = useState<any>(null);

  // Fetch course data
  const fetchCourseData = async () => {
    if (!courseId || !user) return;

    try {
      setLoading(true);

      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (
            full_name
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .eq('student_id', user.id)
        .single();

      setEnrollment(enrollmentData);

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (
            id,
            title,
            content,
            video_url,
            lesson_type,
            duration_minutes,
            order_index,
            is_free
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch lesson progress
      const lessonIds = modulesData?.flatMap(m => m.lessons.map(l => l.id)) || [];
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', user.id)
        .in('lesson_id', lessonIds);

      // Combine modules with progress data
      const modulesWithProgress = modulesData?.map(module => ({
        ...module,
        lessons: module.lessons
          .sort((a, b) => a.order_index - b.order_index)
          .map(lesson => ({
            ...lesson,
            progress: progressData?.find(p => p.lesson_id === lesson.id) || {
              completed: false,
              time_spent_minutes: 0
            }
          }))
      })) || [];

      setModules(modulesWithProgress);

      // Set first lesson as current if none selected
      if (modulesWithProgress.length > 0 && modulesWithProgress[0].lessons.length > 0) {
        setCurrentLesson(modulesWithProgress[0].lessons[0]);
      }

      // Sync progress to enrollment if needed
      if (enrollmentData && modulesWithProgress.length > 0) {
        const totalLessons = modulesWithProgress.reduce((acc, module) => acc + module.lessons.length, 0);
        const completedLessons = modulesWithProgress.reduce(
          (acc, module) => acc + module.lessons.filter(l => l.progress?.completed).length,
          0
        );
        const currentProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        // Update enrollment progress if it's different
        if (currentProgress !== enrollmentData.progress_percentage) {
          await supabase
            .from('enrollments')
            .update({ progress_percentage: currentProgress })
            .eq('id', enrollmentData.id);
          
          // Update local enrollment state
          setEnrollment({ ...enrollmentData, progress_percentage: currentProgress });
        }
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Complete a lesson
  const completeLesson = async (lesson: Lesson) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          student_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
          time_spent_minutes: lesson.duration_minutes
        });

      if (error) throw error;

      // Award points and update streak
      await awardPoints(50, 'lesson_completed', `Completed: ${lesson.title}`, lesson.id);
      await updateStreak();

      // Update local state
      setModules(prevModules =>
        prevModules.map(module => ({
          ...module,
          lessons: module.lessons.map(l =>
            l.id === lesson.id
              ? { ...l, progress: { completed: true, time_spent_minutes: lesson.duration_minutes } }
              : l
          )
        }))
      );

      // Update enrollment progress
      const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
      const completedLessons = modules.reduce(
        (acc, module) => acc + module.lessons.filter(l => 
          l.progress?.completed || l.id === lesson.id
        ).length,
        0
      );
      const newProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Update enrollment progress in database
      if (enrollment?.id) {
        await supabase
          .from('enrollments')
          .update({ progress_percentage: newProgress })
          .eq('id', enrollment.id);
      }

      // If completed, generate certificate and mark enrollment as completed
      if (newProgress === 100 && enrollment?.id && user?.id && courseId && course) {
        try {
          const params = {
            _user_id: user.id,
            _course_id: courseId,
            _enrollment_id: enrollment.id,
            _title: `${course.title} Completion Certificate`,
            _course_title: course.title,
            _instructor_name: course.profiles?.full_name || 'PANA Academy Instructor',
            _course_duration_hours: course.duration_hours || 0,
            _completion_date: new Date().toISOString(),
            _score: 100, // Default score for completion
            _grade: 'A' as const // Default grade
          };

          // Use type assertion to handle the RPC call
          const { data, error } = await supabase.rpc('generate_certificate', params as any);

          if (error) {
            console.error('Error generating certificate:', error);
            toast({
              title: 'Error',
              description: 'Failed to generate certificate. Please try again.',
              variant: 'destructive' as const
            });
          } else if (data?.success) {
            // Refresh enrollment data
            const { data: refreshed, error: refreshError } = await supabase
              .from('enrollments')
              .select('*')
              .eq('id', enrollment.id)
              .maybeSingle();
            
            if (refreshed && !refreshError) {
              setEnrollment(refreshed);
              toast({
                title: 'Success',
                description: 'Certificate generated successfully!',
                variant: 'default' as const
              });
            } else if (refreshError) {
              console.error('Error refreshing enrollment:', refreshError);
              toast({
                title: 'Warning',
                description: 'Certificate generated but could not refresh enrollment data.',
                variant: 'default' as const
              });
            }
          }
        } catch (error) {
          console.error('Unexpected error during certificate generation:', error);
          toast({
            title: 'Error',
            description: 'An unexpected error occurred while generating the certificate.',
            variant: 'destructive' as const
          });
        }
      }

      toast({
        title: "Lesson Completed! 🎉",
        description: `You earned 50 points for completing "${lesson.title}"`,
      });

    } catch (error) {
      console.error('Error completing lesson:', error);
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete",
        variant: "destructive",
      });
    }
  };

  // Enroll in course
  const enrollInCourse = async () => {
    if (!user || !courseId) return;

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'enrolled'
        });

      if (error) throw error;

      // Send enrollment confirmation email
      await sendEnrollmentConfirmation(courseId, user.id);

      toast({
        title: "Enrolled Successfully! 🎉",
        description: "You can now access all course content. A confirmation email has been sent.",
      });

      // Refresh data
      await fetchCourseData();

    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/dashboard/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.progress?.completed).length,
    0
  );
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard/courses')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">
                by {course.profiles?.full_name || 'Unknown Instructor'} • {course.level || 'All Levels'} • {course.duration_hours}h
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="secondary">{progressPercentage}% Complete</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    
                    {!enrollment && (
                      <Button onClick={enrollInCourse} className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Enroll in Course
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Lessons Completed</span>
                        <span className="font-medium">{completedLessons} / {totalLessons}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.duration_hours}h total</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          <span>{course.level || 'All Levels'} level</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {currentLesson && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{currentLesson.title}</CardTitle>
                        {currentLesson.progress?.completed ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => completeLesson(currentLesson)}
                            disabled={!enrollment}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                      <CardDescription>
                        {currentLesson.duration_minutes} minutes • {currentLesson.lesson_type || 'Lesson'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentLesson.video_url && (
                        <div className="mb-6">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Video Player</p>
                              <p className="text-xs text-muted-foreground">{currentLesson.video_url}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {currentLesson.content && (
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        </div>
                      )}
                      
                      {!currentLesson.content && !currentLesson.video_url && (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No content available for this lesson yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="assignments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assignments</CardTitle>
                    <CardDescription>Complete assignments to test your knowledge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No assignments available yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <h4 className="font-medium">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                            currentLesson?.id === lesson.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setCurrentLesson(lesson)}
                        >
                          <div className="flex-shrink-0">
                            {lesson.progress?.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Play className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration_minutes} min
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {enrollment && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Take Notes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Discussion Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}