import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopRatedCourses } from '@/services/ratingService';
import { Course } from '@/types/course.types';
import { Link } from 'react-router-dom';

export const TopRatedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopRatedCourses = async () => {
      try {
        setLoading(true);
        const data = await getTopRatedCourses(5);
        setCourses(data);
      } catch (err) {
        console.error('Error loading top rated courses:', err);
        setError('Failed to load top rated courses');
      } finally {
        setLoading(false);
      }
    };

    loadTopRatedCourses();
  }, []);

  if (loading) {
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

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-gray-400 mb-4">
          <svg 
            className="mx-auto h-16 w-16" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Top Rated Courses Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Be the first to rate a course! Top rated courses will appear here once they receive ratings from our community.
        </p>
        
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