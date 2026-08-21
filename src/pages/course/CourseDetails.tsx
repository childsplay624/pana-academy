import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  FileText,
  Clock,
  Smartphone,
  Award,
  User,
  BarChart,
  Lock,
  Users,
  AlertCircle,
  Calendar,
  DollarSign,
  PlayCircle,
  MapPin,
  ChevronRight,
  Star
} from 'lucide-react';
import { fetchCourseById, formatCourseDate, isStartingSoon, type Course } from '@/services/courseService';
import { ModuleManager } from '@/components/course-management/ModuleManager';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { useAuth } from '@/hooks/useAuth';
import { checkEnrollment } from '@/services/enrollmentService';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Module {
  id: number;
  title: string;
  duration: string;
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;
  const isInstructor = user?.id === course?.instructor_id;

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load course data for all users
        const courseData = await fetchCourseById(id);

        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        // Set course data first to ensure it's available to all users
        setCourse({
          ...courseData,
          students_count: courseData.students_count || 0,
          price: courseData.price || 0,
          learning_outcomes: courseData.learning_outcomes || [],
          modules: courseData.modules || []
        });

        // Only check enrollment for logged-in users
        if (user?.id) {
          try {
            const { isEnrolled: enrolled } = await checkEnrollment(id);
            setIsEnrolled(enrolled);
          } catch (enrollError) {
            console.error('Error checking enrollment:', enrollError);
            // Continue with course loading even if enrollment check fails
          }
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id, user]);



  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Course</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-4">The requested course could not be found.</p>
            <Button onClick={() => navigate('/courses')}>
              Browse All Courses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedStudents = course.students_count?.toLocaleString() || '0';
  const instructorName = course.instructor_name || 'Instructor';
  const duration = course.duration || `${course.duration_hours} hours`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 w-full bg-paper">
        {/* Dark Executive Header (Udemy Masterclass Style) */}
        <div className="w-full bg-[#1C1D1F] text-white pt-32 md:pt-36 pb-16 border-b border-zinc-800 relative z-10">
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Details Info */}
              <div className="lg:col-span-8 space-y-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-mono text-brass uppercase tracking-wider mb-2">
                  <button onClick={() => navigate('/courses')} className="hover:underline text-zinc-300">Competency</button>
                  <ChevronRight className="w-3 h-3 text-zinc-500" />
                  <span className="text-brass font-semibold">
                    {course.category_name || (course.category as string)?.replace('_', ' ')}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-base sm:text-lg text-zinc-300 font-serif max-w-3xl leading-relaxed">
                  {course.description}
                </p>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Badge className="bg-brass text-ink font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1">
                    Bestseller
                  </Badge>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-300 font-mono text-[10px] uppercase font-semibold">
                    {course.level} Level
                  </Badge>
                  {course.course_type && (
                    <Badge
                      variant="outline"
                      className={course.course_type === 'online'
                        ? 'border-green-500/40 text-green-400 font-mono text-[10px]'
                        : course.course_type === 'onsite'
                          ? 'border-blue-500/40 text-blue-400 font-mono text-[10px]'
                          : 'border-purple-500/40 text-purple-400 font-mono text-[10px]'
                      }
                    >
                      {course.course_type === 'online' ? '💻 Online' : course.course_type === 'onsite' ? '🏢 On-Site' : '🌓 Hybrid'}
                    </Badge>
                  )}
                  {(course.course_type === 'onsite' || course.course_type === 'hybrid') && course.start_date && isStartingSoon(course.start_date) && (
                    <Badge variant="outline" className="border-oxblood text-red-400 font-mono text-[10px] animate-pulse">
                      🔥 Starting Soon
                    </Badge>
                  )}
                </div>

                {/* Created By & Rating Bar */}
                <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-6 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-brass" />
                    <span>Created by <span className="text-white underline font-semibold cursor-pointer">{instructorName}</span></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-white">{course.rating ? course.rating.toFixed(1) : "4.8"}</span>
                    <span className="text-zinc-400">({formattedStudents} learners)</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4 text-brass" />
                    <span>{duration}</span>
                  </div>
                </div>

                {/* Onsite / Hybrid Date Banner */}
                {(course.course_type === 'onsite' || course.course_type === 'hybrid') && course.start_date && (
                  <div className="mt-4 bg-zinc-900/90 border border-brass/30 rounded-xs p-4 flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-brass shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[10px] text-brass uppercase font-semibold block mb-0.5">ACCREDITED SCHEDULE & VENUE</span>
                      <p className="text-xs text-zinc-200 font-mono">
                        <span className="font-semibold text-white">Start Date:</span> {formatCourseDate(course.start_date)}
                        {course.end_date && <> · <span className="font-semibold text-white">End Date:</span> {formatCourseDate(course.end_date)}</>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout with Floating Udemy Sidebar */}
        <div className="max-w-[1320px] mx-auto px-7 py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: What You'll Learn & Content */}
            <div className="lg:col-span-8 space-y-10">
              {/* What You'll Learn Card */}
              <div className="bg-paper-soft border border-line rounded-xs p-8 shadow-xs">
                <h2 className="font-serif text-2xl font-medium text-ink mb-6">What You'll Learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning_outcomes?.length > 0 ? (
                    course.learning_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start text-sm text-ink-soft font-serif leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-oxblood mr-3 mt-0.5 shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start text-sm text-ink-soft font-serif leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-oxblood mr-3 mt-0.5 shrink-0" />
                        <span>Master practical industry workflows and ISO compliance standards.</span>
                      </li>
                      <li className="flex items-start text-sm text-ink-soft font-serif leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-oxblood mr-3 mt-0.5 shrink-0" />
                        <span>Execute real-world technical tasks in simulated laboratory environments.</span>
                      </li>
                      <li className="flex items-start text-sm text-ink-soft font-serif leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-oxblood mr-3 mt-0.5 shrink-0" />
                        <span>Build verifiable competencies verified by certified PANA assessors.</span>
                      </li>
                      <li className="flex items-start text-sm text-ink-soft font-serif leading-relaxed">
                        <CheckCircle className="h-5 w-5 text-oxblood mr-3 mt-0.5 shrink-0" />
                        <span>Receive verifiable PANA Institute Certificate of Competency upon completion.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {/* Course Content / Modules Accordion */}
              <div className="bg-paper-soft border border-line rounded-xs p-8 shadow-xs">
                <h2 className="font-serif text-2xl font-medium text-ink mb-6">Course Content</h2>
                {isInstructor && id ? (
                  <ModuleManager courseId={id} canEdit={true} />
                ) : (
                  <div className="space-y-4">
                    {course.modules?.length > 0 ? (
                      course.modules.map((module) => (
                        <div key={module.id} className="border border-line rounded-xs overflow-hidden bg-paper hover:border-oxblood/40 transition-colors">
                          <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-oxblood/10 rounded-xs text-oxblood">
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="font-serif text-base font-medium text-ink">{module.title}</h3>
                                <p className="font-mono text-xs text-muted-foreground">{module.duration}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-paper rounded-xs border border-line">
                        <BookOpen className="h-10 w-10 text-oxblood/40 mx-auto mb-3" />
                        <p className="font-serif text-sm text-muted-foreground">Detailed module breakdown available upon enrolment.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Instructor Profile Card */}
              <div className="bg-paper-soft border border-line rounded-xs p-8 shadow-xs">
                <span className="font-mono text-[10px] text-oxblood uppercase font-semibold block mb-2">COURSE INSTRUCTOR</span>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-oxblood text-white font-serif text-2xl font-bold flex items-center justify-center shrink-0 border-2 border-brass/40 shadow-md">
                    {instructorName[0] || 'P'}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-ink">{instructorName}</h3>
                    <p className="font-mono text-xs text-brass uppercase font-semibold">Certified Competency Assessor · PANA Institute</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Udemy Executive Media & Pricing Card */}
            <div className="lg:col-span-4 lg:-mt-52 relative z-30">
              <div className="bg-paper border border-line rounded-xs shadow-2xl overflow-hidden sticky top-28">
                {/* Media Thumbnail with Play Overlay */}
                <div className="relative group cursor-pointer aspect-video bg-ink overflow-hidden">
                  <img
                    src={course.thumbnail_url || "/images/hero_slide_1.png"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/20 transition-colors flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-paper/90 backdrop-blur-xs flex items-center justify-center text-oxblood shadow-2xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-10 h-10 fill-oxblood text-paper" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-paper uppercase tracking-wider mt-3 shadow-sm">
                      Preview this course
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Pricing Box */}
                <div className="p-7 space-y-6">
                  {/* Price Box */}
                  {!hidePrices && (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-3xl font-bold text-ink">
                          {course.is_free || course.price === 0 ? (
                            <span className="text-green-700">Free</span>
                          ) : (
                            <span>₦{course.price.toLocaleString()}</span>
                          )}
                        </span>
                        {course.price > 0 && (
                          <>
                            <span className="text-sm text-zinc-400 line-through font-mono">
                              ₦{(course.price * 1.35).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-xs text-brass font-mono font-semibold">26% off</span>
                          </>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-oxblood uppercase font-semibold">
                        ⚡ Limited seats available for next intake
                      </p>
                    </div>
                  )}

                  {/* Primary CTA Action Button */}
                  <div className="space-y-3">
                    {user && isInstructor ? (
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest py-6 rounded-xs shadow-lg font-semibold"
                          onClick={() => navigate(`/course/${id}/edit`)}
                        >
                          Edit Course Syllabus
                        </Button>
                      </div>
                    ) : user && isEnrolled ? (
                      <Button
                        className="w-full bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest py-6 rounded-xs shadow-lg font-semibold"
                        onClick={() => {
                          if (course.course_type === 'online') {
                            navigate(`/course/${id}/learn`);
                          } else {
                            setIsScheduleDialogOpen(true);
                          }
                        }}
                      >
                        {course.course_type === 'online' ? (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Continue Learning
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 mr-2" />
                            View My Schedule
                          </>
                        )}
                      </Button>
                    ) : user ? (
                      <PaymentButton
                        courseId={course.id}
                        amount={course.price || 0}
                        courseTitle={course.title}
                      />
                    ) : (
                      <Button
                        className="w-full bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest py-6 rounded-xs shadow-lg font-semibold"
                        onClick={() => navigate('/auth', { state: { from: window.location.pathname } })}
                      >
                        Sign In to Enroll
                      </Button>
                    )}
                  </div>

                  {/* Guarantee List */}
                  <div className="pt-6 border-t border-line space-y-3 font-mono text-xs text-ink-soft">
                    <span className="text-[10px] text-oxblood uppercase font-semibold tracking-wider block mb-1">
                      THIS ACCREDITED COURSE INCLUDES:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-oxblood shrink-0" />
                      <span>{course.duration || `${course.duration_hours} hours`} on-demand access</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-oxblood shrink-0" />
                      <span>Certificate of Competency</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-oxblood shrink-0" />
                      <span>Access on mobile, desktop & TV</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-oxblood shrink-0" />
                      <span>Downloadable resources & worksheets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-red-600" />
              My Schedule & Venue
            </DialogTitle>
            <DialogDescription>
              Detailed information about your upcoming training.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className={`grid grid-cols-1 ${course.course_type === 'online' ? '' : 'md:grid-cols-2'} gap-6`}>
              {(course.course_type === 'onsite' || course.course_type === 'hybrid') && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-red-600" />
                    Location Details
                  </h4>
                  <div className="pl-6 space-y-1">
                    <p className="font-medium text-gray-800">{course.venue_name || 'Venue to be announced'}</p>
                    {(course.venue_address || course.venue_city || course.venue_country) && (
                      <p className="text-gray-600">
                        {[course.venue_address, course.venue_city, course.venue_country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {course.venue_map_url && (
                      <a
                        href={course.venue_map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:underline text-sm font-medium flex items-center mt-2 font-semibold"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-red-600" />
                  Daily Schedule
                </h4>
                <div className="pl-6">
                  {course.onsite_schedule ? (
                    typeof course.onsite_schedule === 'string' ? (
                      <p className="text-gray-600 whitespace-pre-wrap">{course.onsite_schedule}</p>
                    ) : Array.isArray(course.onsite_schedule) ? (
                      <div className="space-y-2">
                        {course.onsite_schedule.map((session: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium text-gray-800">{session.date || (idx + 1)}:</span>
                            <p className="text-gray-600">{session.start_time} - {session.end_time}: {session.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="text-xs text-gray-600 overflow-auto">{JSON.stringify(course.onsite_schedule, null, 2)}</pre>
                    )
                  ) : (
                    <p className="text-gray-500 italic">Schedule details will be provided by the instructor.</p>
                  )}
                </div>
              </div>
            </div>
            {course.course_type !== 'online' && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-red-600">Important:</span> Please arrive at least 15 minutes before the daily session starts. Don't forget to bring your ID for verification at the venue entrance.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;