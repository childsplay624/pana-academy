import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAllCourses } from '@/services/courseService';
import { Course } from '@/types/course.types';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

// Extend Course type with additional properties needed for display
interface DisplayCourse extends Omit<Course, 'modules'> {
  category: string;
  duration: number;
  students_enrolled: number;
  learning_outcomes: string[];
  modules: any[];
  // Add any other required properties from Course that might be missing
  is_published: boolean;
  course_type: string;
  is_free: boolean;
  total_lessons?: number;
  total_duration_seconds?: number;
}

// Sample course data for when no courses are available in the database
const sampleCourses: DisplayCourse[] = [
  {
    id: 'sample-1',
    title: 'Advanced Data Analysis',
    description: 'Master data analysis techniques with real-world applications',
    category: 'Data Science',
    level: 'intermediate',
    price: 99.99,
    is_published: true,
    instructor_id: 'sample-instructor-1',
    course_type: 'self_paced',
    is_free: false,
    total_lessons: 12,
    total_duration_seconds: 28800, // 8 hours
    rating: 4.8,
    students_count: 1245,
    students_enrolled: 1245,
    duration: 8,
    thumbnail_url: '/img/course-data.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: []
  },
  {
    id: 'sample-2',
    title: 'Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch',
    category: 'Web Development',
    level: 'beginner',
    price: 149.99,
    is_published: true,
    instructor_id: 'sample-instructor-2',
    course_type: 'self_paced',
    is_free: false,
    total_lessons: 24,
    total_duration_seconds: 43200, // 12 hours
    rating: 4.7,
    students_count: 2893,
    students_enrolled: 2893,
    duration: 12,
    thumbnail_url: '/img/course-webdev.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: []
  },
  {
    id: 'sample-3',
    title: 'Digital Marketing Fundamentals',
    description: 'Essential digital marketing strategies for business growth',
    category: 'Marketing',
    level: 'beginner',
    price: 79.99,
    is_published: true,
    instructor_id: 'sample-instructor-3',
    course_type: 'self_paced',
    is_free: true,
    total_lessons: 8,
    total_duration_seconds: 21600, // 6 hours
    rating: 4.6,
    students_count: 1872,
    students_enrolled: 1872,
    duration: 6,
    thumbnail_url: '/img/course-marketing.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: []
  },
  {
    id: 'sample-4',
    title: 'Project Management Professional',
    description: 'Master project management methodologies and tools',
    category: 'Business',
    level: 'advanced',
    price: 199.99,
    is_published: true,
    instructor_id: 'sample-instructor-4',
    course_type: 'live',
    is_free: false,
    total_lessons: 20,
    total_duration_seconds: 36000, // 10 hours
    rating: 4.9,
    students_count: 956,
    students_enrolled: 956,
    duration: 10,
    thumbnail_url: '/img/course-pm.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules: []
  }
];

export function TopRatedCourses() {
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRandomCourses = async () => {
      try {
        setIsLoading(true);
        const allCourses = await fetchAllCourses();
        
        // If no courses in database, use sample data
        if (allCourses.length === 0) {
          setCourses(sampleCourses);
          return;
        }

        // Shuffle and pick first 4 courses
        const shuffled = [...allCourses].sort(() => 0.5 - Math.random());
        const selectedCourses = shuffled.slice(0, 5);
        
        // Add some default values for display
        const coursesWithDefaults = selectedCourses.map(course => ({
          ...course,
          // Required DisplayCourse properties
          category: course.category || 'General',
          students_enrolled: course.students_count || 0,
          duration: course.duration_hours || 8,
          learning_outcomes: course.learning_outcomes || [],
          modules: course.modules || [],
          is_published: course.is_published ?? true,
          course_type: course.course_type || 'self_paced',
          is_free: course.is_free ?? false,
          total_lessons: course.total_lessons || 0,
          total_duration_seconds: course.total_duration_seconds || 0,
          // Other defaults
          students_count: course.students_count || 0,
          rating: course.rating || 4.5,
          thumbnail_url: course.thumbnail_url || `/img/course-${Math.floor(Math.random() * 4) + 1}.jpg`,
          // Ensure all required Course properties are included
          created_at: course.created_at || new Date().toISOString(),
          updated_at: course.updated_at || new Date().toISOString()
        } as DisplayCourse));
        
        setCourses(coursesWithDefaults);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Using sample data instead.');
        setCourses(sampleCourses);
      } finally {
        setIsLoading(false);
      }
    };

    loadRandomCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="h-full">
            <Skeleton className="w-full h-32 rounded-t-lg" />
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error loading courses: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (courses.length === 0 && !isLoading) {
    // Show sample courses when no courses are available
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Rated Courses</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular courses based on student ratings and feedback.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {sampleCourses.map((course) => (
            <div key={course.id} className="h-full transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-blue-300" />
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800 flex items-center shadow-sm">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                    {course.rating?.toFixed(1) || '4.5'}
                  </div>
                </div>
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-lg font-semibold line-clamp-2 h-14">{course.title}</CardTitle>
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full whitespace-nowrap ml-2 text-sm">
                      {course.category || 'General'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2 h-12 text-sm">{course.description}</p>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 space-x-2">
                    <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4 mr-1.5" />
                      {course.students_count?.toLocaleString() || '0'}
                    </span>
                    <span className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-1.5" />
                      {course.duration || 8} {course.duration === 1 ? 'hr' : 'hrs'}
                    </span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {course.is_free ? 'Free' : `$${course.price || '0'}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'All Levels'}
                    </span>
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {courses.map((course) => (
          <Link to={`/courses/${course.id}`} key={course.id} className="block h-full">
            <Card className="h-full hover:shadow-md transition-shadow">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-32 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg" />
              )}
              <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold line-clamp-2 h-12">
                  {course.title}
                </CardTitle>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${(course.rating || 0) >= star ? 'text-amber-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {course.rating ? course.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {course.students_count || 0} students
                  </span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};