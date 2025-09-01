import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  BookOpen, 
  Clock, 
  Award, 
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { LessonProgress } from './LessonProgress';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { fetchCourseById } from '@/services/courseService';
// Remove the Lesson import as we're defining it locally

// Import types from course service
import type { Course as ServiceCourse, Module as ServiceModule } from '@/services/courseService';

// Extend the service types with any additional properties we need
interface Lesson {
  id: string | number;
  title: string;
  order_in_module?: number;
  duration?: string;
  duration_seconds?: number; // Add duration_seconds property
  video_url?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

interface Module extends Omit<ServiceModule, 'id' | 'lessons'> {
  id: string | number;
  lessons: Lesson[];
  order_in_course?: number;
}

interface Course extends Omit<ServiceCourse, 'id' | 'modules'> {
  id: string;
  modules: Module[];
}

export function CoursePlayer() {
  const { courseId, moduleId: initialModuleId, lessonId: initialLessonId } = useParams<{
    courseId: string;
    moduleId?: string;
    lessonId?: string;
  }>();
  
  if (!courseId) {
    return <div>Course ID is required</div>;
  }
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    progress,
    loadProgress,
    trackProgress,
    certificate,
    isOnline,
    offlineProgressCount,
  } = useCourseProgress(courseId);

  // Load course data
  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await fetchCourseById(courseId);
        
        if (!courseData) {
          throw new Error('Course not found');
        }
        
        // Convert the course data to our local type
        const mappedCourse: Course = {
          ...courseData,
          modules: (courseData.modules || []).map(module => ({
            ...module,
            id: String(module.id),
            order_in_course: (module as any).order_in_course || 0,
            lessons: ((module as any).lessons || []).map((lesson: any) => ({
              ...lesson,
              id: String(lesson.id),
              title: lesson.title || 'Untitled Lesson',
              order_in_module: lesson.order_in_module || 0,
              duration: lesson.duration || '00:00',
              created_at: lesson.created_at || new Date().toISOString(),
              updated_at: lesson.updated_at || new Date().toISOString()
            }))
          }))
        };
        setCourse(mappedCourse);
        
        // Find the initial module and lesson
        const selectedModule = initialModuleId 
          ? mappedCourse.modules.find(m => String(m.id) === initialModuleId)
          : mappedCourse.modules[0];
          
        const selectedLesson = initialLessonId && selectedModule
          ? selectedModule.lessons.find(l => String(l.id) === initialLessonId)
          : selectedModule?.lessons[0];
        
        setCurrentModule(selectedModule || null);
        setCurrentLesson(selectedLesson || null);
        
        // Load progress data
        await loadProgress(courseId);
        
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [courseId, initialModuleId, initialLessonId]);
  
  // Handle lesson selection
  const isLessonCompleted = (moduleId: string | number, lessonId: string | number) => {
    const moduleIdStr = String(moduleId);
    const lessonIdStr = String(lessonId);
    return progress?.details.some(
      p => p.module_id === moduleIdStr && p.lesson_id === lessonIdStr && p.completed
    ) || false;
  };

  const handleSelectLesson = (module: Module, lesson: Lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
    
    // Ensure both module and lesson IDs are strings for the URL
    const moduleId = String(module.id);
    const lessonId = String(lesson.id);
    
    navigate(`/course/${courseId}/learn/${moduleId}/${lessonId}`);
    
    // Track that the user viewed this lesson
    trackProgress({
      courseId,
      moduleId,
      lessonId,
      completed: false,
      timeSpentSeconds: 0,
    });
  };
  
  // Track lesson progress when it changes
  useEffect(() => {
    if (!currentLesson || !currentModule) return;

    // Update progress every 30 seconds or when lesson changes
    const interval = setInterval(() => {
      trackProgress({
        courseId,
        moduleId: String(currentModule.id),
        lessonId: String(currentLesson.id),
        completed: false,
        timeSpentSeconds: 30,
      });
    }, 30000);

    // Cleanup interval on unmount or when lesson changes
    return () => clearInterval(interval);
  }, [currentLesson?.id, currentModule?.id, courseId, trackProgress]);

  // Navigate to next/previous lesson
  const navigateLesson = (direction: 'prev' | 'next') => {
    if (!course || !currentModule || !currentLesson) return;
    
    const currentModuleIndex = course.modules.findIndex(m => String(m.id) === String(currentModule.id));
    const currentLessonIndex = currentModule.lessons.findIndex(l => String(l.id) === String(currentLesson.id));
    
    if (direction === 'next') {
      // Try next lesson in current module
      if (currentLessonIndex < (currentModule.lessons?.length ?? 0) - 1) {
        const nextLesson = currentModule.lessons[currentLessonIndex + 1];
        if (nextLesson) {
          handleSelectLesson(currentModule, nextLesson);
          return;
        }
      }
      
      // Try first lesson in next module
      if (currentModuleIndex < (course.modules?.length ?? 0) - 1) {
        const nextModule = course.modules[currentModuleIndex + 1];
        const firstLesson = nextModule?.lessons?.[0];
        if (nextModule && firstLesson) {
          handleSelectLesson(nextModule, firstLesson);
          return;
        }
      }
      
      // Reached the end of the course
      toast({
        title: 'Course Completed!',
        description: 'Congratulations on completing the course!',
      });
      
    } else { // prev
      // Try previous lesson in current module
      if (currentLessonIndex > 0) {
        const prevLesson = currentModule.lessons?.[currentLessonIndex - 1];
        if (prevLesson) {
          handleSelectLesson(currentModule, prevLesson);
          return;
        }
      }
      
      // Try last lesson in previous module
      if (currentModuleIndex > 0) {
        const prevModule = course.modules?.[currentModuleIndex - 1];
        const lastLesson = prevModule?.lessons?.[prevModule.lessons.length - 1];
        if (prevModule && lastLesson) {
          handleSelectLesson(prevModule, lastLesson);
          return;
        }
      }
    }
  };
  
  // Handle lesson completion
  const handleLessonComplete = () => {
    if (!currentModule || !currentLesson) return;
    
    // The LessonProgress component already handles tracking completion
    // This is just for any additional actions after completion
    
    // Auto-navigate to next lesson after a short delay
    setTimeout(() => {
      navigateLesson('next');
    }, 1500);
  };
  
  // Calculate course progress percentage
  const calculateCourseProgress = () => {
    if (!course?.modules || !progress) return 0;
    
    const totalLessons = course.modules.reduce(
      (total, module) => total + (module.lessons?.length || 0), 0
    );
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = progress.details?.filter(p => p.completed).length || 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };
  
  // Format duration in seconds to HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading course content...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Error loading course</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }
  
  if (!course || !currentModule || !currentLesson) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-600" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Content Not Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The requested course content could not be loaded. Please check the URL or try again later.
        </p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/courses')}
          className="mt-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }
  
  const courseProgress = calculateCourseProgress();
  
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-full lg:w-80 border-r bg-card overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg mb-2">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{courseProgress}%</span>
            </div>
            <Progress value={courseProgress} className="h-2" />
            
            {offlineProgressCount > 0 && (
              <div className="text-xs text-amber-600 flex items-center">
                <span className="mr-1">•</span>
                {offlineProgressCount} {offlineProgressCount === 1 ? 'update' : 'updates'} pending sync
              </div>
            )}
            
            {!isOnline && (
              <div className="text-xs text-amber-600 flex items-center">
                <span className="mr-1">•</span>
                Offline mode - progress will sync when online
              </div>
            )}
            
            {certificate && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Award className="w-4 h-4 mr-2" />
                View Certificate
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {course.modules?.map((module) => (
              <div key={module.id} className="mb-4">
                <h3 className="font-medium px-2 py-2 bg-muted/50 rounded-md">
                  {module.title}
                </h3>
                <div className="mt-1 space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isCurrent = lesson.id === currentLesson.id && module.id === currentModule.id;
                    const isCompleted = progress?.details?.some(
                      p => p.lesson_id === lesson.id && p.completed
                    );
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(module, lesson)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                          isCurrent 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        ) : (
                          <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                        {lesson.duration_seconds && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            {formatDuration(lesson.duration_seconds)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video/Lesson Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
              {currentLesson.video_url ? (
                <video 
                  src={currentLesson.video_url} 
                  controls 
                  className="w-full h-full"
                />
              ) : (
                <div className="text-white">
                  <BookOpen className="w-12 h-12 mx-auto mb-2" />
                  <p>No video available for this lesson</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
                <p className="text-muted-foreground">
                  {currentModule.title} • Lesson {currentLesson.order_in_module}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateLesson('prev')}
                  disabled={!currentModule || !currentLesson}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateLesson('next')}
                  disabled={!currentModule || !currentLesson}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {currentLesson.content || (
                    <p className="text-muted-foreground">
                      No content available for this lesson.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Progress Tracking */}
            <LessonProgress
              courseId={courseId}
              moduleId={String(currentModule.id)}
              lessonId={String(currentLesson.id)}
              durationSeconds={currentLesson.duration_seconds || 0}
              onComplete={handleLessonComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
