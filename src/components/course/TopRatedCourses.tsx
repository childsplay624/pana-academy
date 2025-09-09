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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
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
                  <div className="flex items-center text-amber-400">
                    <span className="text-sm font-medium mr-1">{course.rating?.toFixed(1)}</span>
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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