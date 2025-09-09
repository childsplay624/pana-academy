import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { fetchAllCourses, Course as CourseType } from '@/services/courseService';
import { enrollInCourse } from '@/services/enrollmentService';

type CourseCategory = 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic' | 'oil_and_gas' | 'renewable_energy' | 'engineering' | 'safety' | 'leadership';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseCardProps {
  course: CourseType;
  onEnroll: (courseId: string) => void;
  isEnrolling?: boolean;
}

const CourseCard = ({ course, onEnroll, isEnrolling }: CourseCardProps) => {
  const getCategoryColor = (category: CourseCategory) => {
    const colors = {
      'technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'business': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      'marketing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'health': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'language': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'personal_development': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'academic': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      'oil_and_gas': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'renewable_energy': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'engineering': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'safety': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
      'leadership': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const formatDuration = (course: CourseType) => {
    // First try to use the duration string if it exists
    if (course.duration) {
      return course.duration;
    }
    // Fallback to calculating from duration_hours (assuming 4 hours per day)
    if (course.duration_hours) {
      const totalDays = Math.ceil(Number(course.duration_hours) / 4);
      return `${totalDays} day${totalDays !== 1 ? 's' : ''}`;
    }
    // Default fallback
    return 'Duration not specified';
  };

  return (
    <Link to={`/courses/${course.id}`} key={course.id} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {course.thumbnail_url && (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="h-48 w-full object-cover rounded-t-lg"
          />
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1 capitalize">{course.category?.replace('_', ' ')}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pana-gold/20 text-amber-800">
              {course.level}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{course.duration_hours} hours</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>{course.modules?.length || 0} lessons</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.students_count?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <div className="text-sm font-medium">
              {course.price ? `₦${course.price.toLocaleString()}` : 'Free'}
            </div>
            <Button 
              variant="link" 
              className="p-0"
              onClick={(e) => {
                e.preventDefault();
                onEnroll(course.id);
              }}
              disabled={isEnrolling}
            >
              <span className="text-pana-blue hover:text-red-600 transition-colors duration-200 flex items-center">
                {isEnrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    Enroll Now
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default function UpcomingCoursesSection() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingCourses();
  }, []);

  const fetchUpcomingCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    setEnrollingId(courseId);
    try {
      const { data: enrollment, error } = await enrollInCourse(courseId);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "You have been enrolled in the course!",
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-pana-navy dark:text-white mb-4">
              Upcoming Courses
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our latest professional development programs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <Skeleton className="h-2 w-full bg-gradient-to-r from-pana-navy/20 to-pana-blue/20" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pana-navy dark:text-white mb-4">
            Upcoming Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our latest professional development programs
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                isEnrolling={enrollingId === course.id}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors">
            <Link to="/courses" className="group">
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}