import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  level: string;
  thumbnail_url: string;
  instructor_name: string;
  enrolled_count: number;
  profiles?: {
    full_name: string;
  };
}

export default function UpcomingCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingCourses();
  }, []);

  const fetchUpcomingCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          category,
          duration_hours,
          level,
          thumbnail_url,
          profiles!courses_instructor_id_fkey(full_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      const coursesWithInstructor = data?.map(course => ({
        ...course,
        instructor_name: course.profiles?.full_name || 'Instructor',
        enrolled_count: Math.floor(Math.random() * 150) + 20 // Placeholder enrollment count
      })) || [];

      setCourses(coursesWithInstructor);
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

  const formatDuration = (hours: number) => {
    const weeks = Math.ceil(hours / 4); // Assuming 4 hours per week
    return `${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'enrolled',
          progress_percentage: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been enrolled in the course!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'oil_and_gas': 'bg-primary/10 text-primary',
      'renewable_energy': 'bg-green-500/10 text-green-600',
      'engineering': 'bg-blue-500/10 text-blue-600',
      'safety': 'bg-red-500/10 text-red-600',
      'technology': 'bg-purple-500/10 text-purple-600',
      'leadership': 'bg-orange-500/10 text-orange-600',
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
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
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-pana-navy to-pana-blue"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" disabled>
                      Loading...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" className="border-pana-navy text-pana-navy hover:bg-pana-navy hover:text-white">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
            Discover our latest professional development programs designed by industry experts
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-2 bg-gradient-to-r from-pana-navy to-pana-blue"></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-pana-navy bg-pana-light-gray rounded-full mb-2">
                        {course.category}
                      </span>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-pana-gold/10 text-pana-gold rounded">
                      {course.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.duration_hours)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolled_count}+</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => user ? handleEnroll(course.id) : window.location.href = '/auth'}
                    >
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming courses available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/courses">
            <Button variant="outline" size="lg" className="border-pana-navy text-pana-navy hover:bg-pana-navy hover:text-white group">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}