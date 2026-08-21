import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Loader2, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  fetchUpcomingCourses,
  Course as CourseType,
  formatCourseDate,
} from '@/services/courseService';
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
  const categoryText = (course.category_name || (course.category as string)?.replace('_', ' ') || 'BUSINESS').toUpperCase();
  const levelBadge = (course.level || 'BEGINNER').toUpperCase();
  const formattedDate = course.start_date ? formatCourseDate(course.start_date) : 'Sep 15, 2025';
  const durationText = course.duration || (course.duration_hours ? `${course.duration_hours} hours` : '24 hours');
  const locationText = course.location || 'Port Harcourt Hub & Virtual';
  const priceText = !hidePrices ? (course.price ? `₦${course.price.toLocaleString()}` : '₦7,900') : null;
  const originalPriceText = !hidePrices && (course.original_price || course.price) ? `₦${((course.original_price || (course.price ? course.price * 1.6 : 12900))).toLocaleString()}` : '₦12,900';

  return (
    <Link to={`/course/${course.id}`} key={course.id} className="block h-full">
      <div className="bg-[#FDFBF7] border border-[#E2DDD5] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#6E1D2B]/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full">
        <div>
          {/* Thumbnail with Level Badge */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1C1D1F]">
            <img
              src={course.thumbnail_url || course.image_url || '/images/hero_slide_1.png'}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
            />
            <div className="absolute top-3 left-3 bg-[#6E1D2B] text-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs shadow-md z-10">
              {levelBadge}
            </div>
          </div>

          {/* Card Content Body */}
          <div className="p-6">
            {/* Category & Status Row */}
            <div className="flex items-center justify-between gap-2 font-mono text-xs uppercase font-bold tracking-wider mb-2">
              <span className="text-[#9A7B3E]">{categoryText}</span>
              <span className="text-[#6E1D2B]">ENROLLMENT OPEN</span>
            </div>

            {/* Course Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1D1F] leading-tight mb-3 group-hover:text-[#6E1D2B] transition-colors line-clamp-2">
              {course.title}
            </h3>

            {/* Excerpt Description */}
            <p className="font-serif text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
              {course.description || 'This foundational course offers a deep dive into the economic principles, market dynamics, and financial frameworks that drive modern industry performance.'}
            </p>

            {/* Metadata List with Top Divider */}
            <div className="pt-3 border-t border-[#E2DDD5] space-y-2 text-xs font-mono text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#6E1D2B] shrink-0" />
                <span className="font-semibold text-slate-700">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#9A7B3E] shrink-0" />
                <span>{durationText}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#6E1D2B] shrink-0" />
                <span>{locationText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer with Price and ENROL NOW Button */}
        <div className="px-6 py-4 border-t border-[#E2DDD5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
          <div>
            {priceText && (
              <div className="font-serif text-2xl font-bold text-[#1C1D1F] leading-none">
                {priceText}
              </div>
            )}
            {originalPriceText && (
              <div className="font-mono text-[10px] text-slate-400 line-through mt-1">
                {originalPriceText}
              </div>
            )}
          </div>

          <div className="bg-[#6E1D2B] group-hover:bg-[#581722] text-white px-5 py-2.5 rounded-xs font-mono text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 shadow-sm">
            {isEnrolling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>ENROL NOW <ArrowRight className="w-3.5 h-3.5" /></>}
          </div>
        </div>
      </div>
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