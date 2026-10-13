import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAllCourses } from '@/services/courseService';
import { Course, CourseType } from '@/types/course.types';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, BookOpen } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { Card3D } from '@/components/ui/Card3D';

// Extend Course type with additional properties needed for display
interface DisplayCourse extends Course {
  category: string;
  duration: number;
  students_enrolled: number;
}

// Sample course data for when no courses are available in the database
const sampleCourses: DisplayCourse[] = [
  {
    id: 'sample-1',
    title: 'HSE Management in Oil & Gas Operations',
    description: 'Comprehensive health, safety, and environmental management practices for petroleum industry professionals',
    category: 'safety',
    level: 'intermediate',
    price: 249.99,
    is_published: true,
    instructor_id: 'sample-instructor-1',
    course_type: 'online' as CourseType,
    is_free: false,
    total_lessons: 16,
    total_duration_seconds: 36000, // 10 hours
    rating: 4.9,
    students_count: 432,
    students_enrolled: 432,
    duration: 10,
    thumbnail_url: '/img/course-safety.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    learning_outcomes: ['Risk assessment', 'Safety protocols', 'Emergency response', 'Regulatory compliance'],
    modules: []
  },
  {
    id: 'sample-2',
    title: 'Flow Control Systems & Valve Technology',
    description: 'Master flow control principles, valve selection, and optimization for oil and gas facilities',
    category: 'flow_control',
    level: 'advanced',
    price: 299.99,
    is_published: true,
    instructor_id: 'sample-instructor-2',
    course_type: 'hybrid' as CourseType,
    is_free: false,
    total_lessons: 20,
    total_duration_seconds: 50400, // 14 hours
    rating: 4.8,
    students_count: 287,
    students_enrolled: 287,
    duration: 14,
    thumbnail_url: '/img/course-flow.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    learning_outcomes: ['Valve types and applications', 'Control systems', 'Process optimization', 'Troubleshooting'],
    modules: []
  },
  {
    id: 'sample-3',
    title: 'Sustainability Practices in the Energy Sector',
    description: 'Environmental stewardship and sustainable operations for modern oil and gas companies',
    category: 'sustainability',
    level: 'beginner',
    price: 149.99,
    is_published: true,
    instructor_id: 'sample-instructor-3',
    course_type: 'online' as CourseType,
    is_free: false,
    total_lessons: 10,
    total_duration_seconds: 25200, // 7 hours
    rating: 4.7,
    students_count: 568,
    students_enrolled: 568,
    duration: 7,
    thumbnail_url: '/img/course-sustainability.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    learning_outcomes: ['Carbon footprint reduction', 'Waste management', 'Green technologies', 'ESG reporting'],
    modules: []
  },
  {
    id: 'sample-4',
    title: 'Leadership & Team Management for Engineers',
    description: 'Essential soft skills and leadership competencies for technical professionals in the oil and gas industry',
    category: 'soft_skills',
    level: 'intermediate',
    price: 199.99,
    is_published: true,
    instructor_id: 'sample-instructor-4',
    course_type: 'online' as CourseType,
    is_free: false,
    total_lessons: 12,
    total_duration_seconds: 28800, // 8 hours
    rating: 4.9,
    students_count: 723,
    students_enrolled: 723,
    duration: 8,
    thumbnail_url: '/img/course-leadership.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    learning_outcomes: ['Team leadership', 'Communication skills', 'Conflict resolution', 'Project coordination'],
    modules: []
  }
];

export function TopRatedCourses() {
  const [courses, setCourses] = useState<DisplayCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;

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
        const selectedCourses = shuffled.slice(0, 4);

        // Add some default values for display
        const coursesWithDefaults = selectedCourses.map(course => ({
          ...course,
          // Required DisplayCourse properties (only display-specific additions)
          category: 'General',
          students_enrolled: course.students_count || 0,
          duration: (course as any).total_duration_seconds ? Math.round((course as any).total_duration_seconds / 3600) : 8,
          // Fix defaults for optional properties  
          thumbnail_url: course.thumbnail_url || `/img/course-${Math.floor(Math.random() * 4) + 1}.jpg`,
          rating: course.rating || 4.5,
        } as unknown as DisplayCourse));

        setCourses(coursesWithDefaults);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Using sample data instead.');
        setCourses(sampleCourses.slice(0, 4));
      } finally {
        setIsLoading(false);
      }
    };

    loadRandomCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
            Explore our trending courses and competences/skill-based programs shaping today’s workforce.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCourses.slice(0, 4).map((course) => (
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
                    <Star className="h-4 w-4 text-red-500 mr-1 fill-red-500" />
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
                      <Clock className="h-4 w-4 mr-1.5 text-red-600" />
                      {course.duration || 8} {course.duration === 1 ? 'hr' : 'hrs'}
                    </span>
                    {!hidePrices && (
                      <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {course.is_free ? 'Free' : `$${course.price || '0'}`}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'All Levels'}
                    </span>
                    <Link
                      to={`/course/${course.code || course.id}`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card3D key={course.id} intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.12)">
            <Link to={`/course/${course.code || course.id}`} className="block h-full no-underline">
              <Card className="h-full hover:shadow-3d-dark transition-all border border-gray-200/80 overflow-hidden bg-white/95 preserve-3d">
                {course.thumbnail_url ? (
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center shadow-md">
                      <Star className="h-3.5 w-3.5 text-amber-400 mr-1 fill-amber-400" />
                      {course.rating ? course.rating.toFixed(1) : '4.5'}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-zinc-600" />
                  </div>
                )}
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 min-h-[3rem] leading-snug translate-z-10">
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 font-medium translate-z-10">
                    <span className="flex items-center text-gray-500">
                      <Clock className="h-3.5 w-3.5 mr-1 text-red-600" />
                      {course.duration || 8} hrs
                    </span>
                    <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-bold">
                      {course.category || 'Technical'}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </Card3D>
        ))}
      </div>
    </div>
  );
};