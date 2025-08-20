import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllCourses } from "@/services/courseService";
import type { Course } from "@/services/courseService";

const CoursesSection = ({ showAll = false }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchAllCourses();
        setCourses(data);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const displayCourses = showAll ? courses : courses.slice(0, 4);

  return (
    <section className={`py-12 ${!showAll ? 'bg-gray-50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our most popular professional development programs
            </p>
          </div>
        )}

{loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pana-blue" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id} className="block h-full">
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="h-48 w-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-r from-pana-blue to-pana-navy rounded-t-lg"></div>
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
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mt-auto">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.students_count || 0} students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {course.price ? `₦${course.price.toLocaleString()}` : 'Free'}
                      </div>
                      <Button variant="link" className="text-pana-blue hover:text-pana-navy p-0">
                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!showAll && (
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" className="border-pana-navy text-pana-navy hover:bg-pana-navy hover:text-white">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
