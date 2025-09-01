import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CourseLayout } from '@/components/CourseLayout';
import { BookOpen, Clock, Users, Star, CheckCircle, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  price: number;
  duration_hours: number;
  level: string;
  thumbnail_url: string;
  learning_outcomes: string[];
  requirements: string[];
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: {
    id: string;
    title: string;
    duration_minutes: number;
    is_free: boolean;
  }[];
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
      checkEnrollment();
    }
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    try {
      // Fetch course details with instructor info
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (full_name)
        `)
        .eq('id', courseId)
        .eq('status', 'published')
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (
            id,
            title,
            duration_minutes,
            is_free
          )
        `)
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;
      setModules(modulesData || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('student_id', user.id)
        .eq('course_id', courseId)
        .single();

      setIsEnrolled(!!data);
    } catch (error) {
      // Not enrolled or error - either way, not enrolled
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!user || !course) return;

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: course.id,
          status: 'enrolled'
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
      
      // Navigate to course learning page
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const startCourse = () => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <CourseLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </CourseLayout>
    );
  }

  if (!course) {
    return (
      <CourseLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p className="text-muted-foreground mt-2">The course you're looking for doesn't exist or isn't published yet.</p>
        </div>
      </CourseLayout>
    );
  }

  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalDuration = modules.reduce(
    (total, module) => total + module.lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0),
    0
  );

  return (
    <CourseLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Course Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant="outline">{course.level}</Badge>
          </div>
          
          <h1 className="text-4xl font-bold">{course.title}</h1>
          
          <p className="text-xl text-muted-foreground">{course.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>By {course.profiles?.full_name || 'Unknown Instructor'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration_hours} hours</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>

          {/* Enrollment Actions */}
          <div className="flex gap-4">
            {profile?.role === 'student' && (
              <>
                {!isEnrolled ? (
                  <Button onClick={handleEnroll} disabled={enrolling} size="lg">
                    {enrolling ? 'Enrolling...' : course.price > 0 ? `Enroll - $${course.price}` : 'Enroll for Free'}
                  </Button>
                ) : (
                  <Button onClick={startCourse} size="lg">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                )}
              </>
            )}
            {(profile?.role === 'instructor' || profile?.role === 'admin') && (
              <Button onClick={startCourse} size="lg" variant="outline">
                <PlayCircle className="w-4 h-4 mr-2" />
                Preview Course
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Outcomes */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    What you'll learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {modules.length} modules • {totalLessons} lessons • {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total length
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {index + 1}. {module.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {module.lessons.length} lessons
                      </Badge>
                    </div>
                    
                    {/* Module Lessons */}
                    <div className="mt-3 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            <span>{lesson.title}</span>
                            {lesson.is_free && <Badge variant="secondary" className="text-xs">Free</Badge>}
                          </div>
                          <span className="text-muted-foreground">
                            {lesson.duration_minutes}min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{course.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lessons:</span>
                  <span>{totalLessons}</span>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{course.profiles?.full_name || 'Unknown Instructor'}</h4>
                    <p className="text-sm text-muted-foreground">Course Instructor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CourseLayout>
  );
}