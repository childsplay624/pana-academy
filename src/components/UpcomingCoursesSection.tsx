import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, Loader2, BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  fetchUpcomingCourses,
  Course as CourseType,
  formatCourseDate,
  isStartingSoon,
  isCoursePriceTbd
} from '@/services/courseService';
import { enrollInCourse } from '@/services/enrollmentService';
import Card3D from '@/components/ui/Card3D';

type CourseCategory = 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic' | 'oil_and_gas' | 'renewable_energy' | 'engineering' | 'safety' | 'leadership';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseCardProps {
  course: CourseType;
  onEnroll: (courseId: string) => void;
  isEnrolling?: boolean;
}

const CourseCard = ({ course, onEnroll, isEnrolling }: CourseCardProps) => {
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;

  return (
    <Link to={`/course/${course.id}`} key={course.id} className="block h-full no-underline">
      <Card3D intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.12)" className="h-full">
        <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between preserve-3d">
          {/* Card Header Media */}
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-red-950 to-zinc-950 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-red-500/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              {/* Category Pill */}
              <div className="absolute top-3 left-3 translate-z-10">
                <span className="inline-block px-3 py-1 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider rounded-md shadow-md">
                  {course.category_name || (course.category as string)?.replace('_', ' ') || 'Professional'}
                </span>
              </div>

              {/* Level Badge */}
              {course.level && (
                <div className="absolute top-3 right-3 translate-z-10">
                  <span className="inline-block px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-zinc-200 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/20">
                    {course.level}
                  </span>
                </div>
              )}

              {/* Price Tag Overlay */}
              {!hidePrices && (
                <div className="absolute bottom-3 left-3 translate-z-10">
                  {isCoursePriceTbd(course) ? (
                    <span className="inline-block px-3 py-1 bg-amber-600/95 backdrop-blur-md text-white text-xs font-black rounded-lg shadow-lg">
                      Fee TBD
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-md text-zinc-950 text-sm font-black rounded-lg shadow-lg">
                      {course.is_free || !course.price ? 'Free' : `₦${course.price.toLocaleString()}`}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 hover:text-red-600 transition-colors translate-z-10">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 translate-z-5">
                {course.description}
              </p>

              {/* Schedule Date pill */}
              {course.start_date && (
                <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-zinc-700 translate-z-5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span>Starts: {formatCourseDate(course.start_date)}</span>
                  {isStartingSoon(course.start_date) && (
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase">
                      Starting Soon
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto translate-z-10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onEnroll(course.id);
              }}
              disabled={isEnrolling}
              className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-700 bg-transparent border-none p-0 outline-none cursor-pointer group"
            >
              {isEnrolling ? (
                <span className="inline-flex items-center gap-2 text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span>Loading...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative py-0.5">
                    View Course Details
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </div>
        </div>
      </Card3D>
    </Link>
  );
};

export default function UpcomingCoursesSection() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadUpcomingCourses();
  }, []);

  const loadUpcomingCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchUpcomingCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching upcoming courses:', error);
      toast({
        title: "Error",
        description: "Failed to load upcoming courses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    // Navigate to course details page where user can view course and enroll
    window.location.href = `/course/${courseId}`;
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
              Discover our upcoming training solutions for this period
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
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
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
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage)
                .map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolling={enrollingId === course.id}
                  />
                ))}
            </div>

            {/* Pagination Controls */}
            {courses.length > coursesPerPage && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < Math.ceil(courses.length / coursesPerPage)) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={currentPage === Math.ceil(courses.length / coursesPerPage) ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Results info */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  Showing {((currentPage - 1) * coursesPerPage) + 1} - {Math.min(currentPage * coursesPerPage, courses.length)} of {courses.length} courses
                </div>
              </div>
            )}
          </>
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