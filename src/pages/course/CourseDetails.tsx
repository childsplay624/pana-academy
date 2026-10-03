import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  FileText,
  Clock,
  Smartphone,
  Award,
  User,
  Users,
  AlertCircle,
  Calendar,
  PlayCircle,
  MapPin,
  Star,
  Globe,
  Share2,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { fetchCourseById, formatCourseDate, isStartingSoon, isCourseDatePassed, type Course } from '@/services/courseService';
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

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseOption, setPurchaseOption] = useState<'subscription' | 'individual'>('individual');
  const [isWishlisted, setIsWishlisted] = useState(false);
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
        const courseData = await fetchCourseById(id);

        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        setCourse({
          ...courseData,
          students_count: courseData.students_count || 0,
          price: courseData.price || 0,
          learning_outcomes: courseData.learning_outcomes || [],
          modules: courseData.modules || []
        });

        if (user?.id) {
          try {
            const { isEnrolled: enrolled } = await checkEnrollment(id);
            setIsEnrolled(enrolled);
          } catch (enrollError) {
            console.error('Error checking enrollment:', enrollError);
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Course link copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex-grow flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{error || 'Course Not Found'}</h2>
            <p className="text-gray-600 mb-6">The requested course could not be loaded.</p>
            <Button onClick={() => navigate('/courses')} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              Browse All Courses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedStudents = course.students_count && course.students_count > 0 ? course.students_count.toLocaleString() : null;
  const instructorName = course.instructor_name || course.instructor || 'PANA Institute Faculty';
  const duration = course.duration || (course.duration_hours ? `${course.duration_hours} hours` : '');
  const originalPrice = Math.round(course.price * 1.45);
  const ratingValue = course.rating && course.rating > 0 ? course.rating : null;
  const categoryName = course.category_name || (course.category as string)?.replace(/_/g, ' ') || 'Technical Training';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navigation />

      <main className="flex-1 w-full pt-16">
        {/* TOP HERO HEADER - DARK UDEMY STYLE */}
        <section className="bg-[#1c1d1f] text-white py-10 md:py-14 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT HERO METADATA (8 Cols on Desktop) */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-red-400 tracking-wide uppercase">
                  <Link to="/" className="hover:underline text-gray-300">Home</Link>
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <Link to="/courses" className="hover:underline text-gray-300">Courses</Link>
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                  <span className="text-red-400">{categoryName}</span>
                </div>

                {/* Course Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {course.title}
                </h1>

                {/* Course Short Description */}
                <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-3xl">
                  {course.description}
                </p>

                {/* Badges & Rating Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
                  {/* Course Type Badge */}
                  {course.course_type && (
                    <span className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1 rounded-md">
                      {course.course_type === 'online' ? '💻 Online' : course.course_type === 'onsite' ? '🏢 On-Site' : '🌓 Hybrid'}
                    </span>
                  )}

                  {/* Rating Stars */}
                  {ratingValue && (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <span>{ratingValue.toFixed(1)}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                        ))}
                      </div>
                      {course.reviews_count && course.reviews_count > 0 && (
                        <span className="text-xs text-red-400 underline font-semibold">({course.reviews_count.toLocaleString()} ratings)</span>
                      )}
                    </div>
                  )}

                  {/* Student Count */}
                  {formattedStudents && (
                    <div className="flex items-center gap-1 text-zinc-300 text-xs font-medium">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formattedStudents} learners</span>
                    </div>
                  )}
                </div>

                {/* Creator & Meta Line */}
                <div className="pt-2 text-xs sm:text-sm text-zinc-300 space-y-2 border-t border-zinc-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>Created by</span>
                    <span className="font-bold text-white underline cursor-pointer hover:text-red-400">{instructorName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Last updated {formatCourseDate(course.updated_at || course.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span>English</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>Official PANA Accreditation Pass</span>
                    </div>
                  </div>
                </div>

                {/* Header Info Banner / Floating Micro Card */}
                <div className="mt-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 flex flex-wrap items-center gap-6 max-w-xl">
                  {ratingValue && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-600/20 flex items-center justify-center text-red-400 font-bold text-sm">
                        {ratingValue.toFixed(1)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Top Rated</div>
                        <div className="text-[11px] text-zinc-400">Verified Ratings</div>
                      </div>
                    </div>
                  )}
                  {formattedStudents && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{formattedStudents}</div>
                        <div className="text-[11px] text-zinc-400">Enrolled Learners</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">ISO Aligned</div>
                      <div className="text-[11px] text-zinc-400">Verified Quality</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* MAIN BODY CONTENT + STICKY SIDEBAR LAYOUT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* LEFT COLUMN MAIN CONTENT (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* WHAT YOU'LL LEARN CARD */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
                    course.learning_outcomes.map((outcome, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium leading-relaxed">{outcome}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium leading-relaxed">Master practical technical competencies and operational frameworks.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium leading-relaxed">Understand industry standards, safety compliance, and audit protocols.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium leading-relaxed">Execute live laboratory exercises and OEM equipment calibration.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium leading-relaxed">Earn verified PANA Institute ISO-aligned credentials for career growth.</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* COURSE CONTENT / SYLLABUS SECTION */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.modules?.length || 4} modules • {duration} total duration
                    </p>
                  </div>
                  {isInstructor && id && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/course/${id}/edit`)}>
                      Edit Content
                    </Button>
                  )}
                </div>

                {isInstructor && id ? (
                  <ModuleManager courseId={id} canEdit={true} />
                ) : (
                  <div className="space-y-3">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module) => (
                        <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                          <div className="p-4 bg-gray-50/70 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-base">{module.title}</h3>
                                <span className="text-xs text-gray-500">{module.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-red-600" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">Module 1: Foundations & Technical Principles</h4>
                              <p className="text-xs text-gray-500">4 lectures • 2h 30m</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-red-600" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">Module 2: Practical Equipment Calibration & Hands-on Lab</h4>
                              <p className="text-xs text-gray-500">6 lectures • 4h 15m</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50/50">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-red-600" />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">Module 3: Industry Case Studies & Compliance Standards</h4>
                              <p className="text-xs text-gray-500">3 lectures • 2h 00m</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* COURSE SCHEDULE SECTION (Onsite / Hybrid) */}
              {(course.course_type === 'onsite' || course.course_type === 'hybrid') && course.start_date && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Live Training Schedule & Venue</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        <span className="font-semibold text-gray-800">Commencing:</span> {formatCourseDate(course.start_date)}
                        {course.end_date && <> to {formatCourseDate(course.end_date)}</>}
                      </p>
                      {course.venue_name && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-white/80 px-3 py-1.5 rounded-lg border border-red-200 w-fit">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{course.venue_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* INSTRUCTOR PROFILE BOX */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Instructor</h2>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg flex-shrink-0">
                    {instructorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{instructorName}</h3>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Senior Subject Authority & Lead Assessor</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 Rating</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" /> {formattedStudents} Students</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> 12 Courses</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pt-2">
                      Experienced energy sector consultant and certified technical assessor leading practical competency programs across Sub-Saharan Africa.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN STICKY FLOATING SIDEBAR (4 Cols on Desktop) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 z-20 space-y-6 lg:-mt-64">
              
              {/* MAIN UDEMY-STYLE PRICING CARD */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                
                {/* VIDEO / THUMBNAIL PREVIEW CONTAINER */}
                <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden group cursor-pointer">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-zinc-600" />
                    </div>
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-red-600 group-hover:text-white text-gray-900 flex items-center justify-center shadow-2xl transition-all scale-100 group-hover:scale-110">
                      <PlayCircle className="w-8 h-8 fill-current ml-0.5" />
                    </div>
                    <span className="mt-3 text-xs font-bold text-white tracking-wider uppercase drop-shadow-md">
                      Preview this course
                    </span>
                  </div>
                </div>

                {/* CARD BODY WITH PRICING & OPTIONS */}
                <div className="p-6 space-y-6">
                  
                  {/* PRICING DISPLAY */}
                  {!hidePrices && (
                    <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-red-600">Course Price</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-gray-900">
                          {course.is_free || course.price === 0 ? 'Free' : `₦${course.price.toLocaleString()}`}
                        </span>
                        {!course.is_free && course.price > 0 && (
                          <>
                            <span className="text-sm text-gray-400 line-through font-medium">
                              ₦{originalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-red-600">30% off</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PRIMARY ACTION CTA BUTTON */}
                  <div className="pt-2">
                    {user && isInstructor ? (
                      <div className="space-y-3">
                        <Button
                          onClick={() => navigate(`/course/${id}/edit`)}
                          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-6 rounded-xl shadow-md"
                        >
                          Edit Course Content
                        </Button>
                        {!isEnrolled && (
                          <PaymentButton
                            courseId={course.id}
                            amount={course.price || 0}
                            courseTitle={course.title}
                            isExpired={isCourseDatePassed(course)}
                          />
                        )}
                      </div>
                    ) : user ? (
                      !isEnrolled ? (
                        <PaymentButton
                          courseId={course.id}
                          amount={course.price || 0}
                          courseTitle={course.title}
                          isExpired={isCourseDatePassed(course)}
                        />
                      ) : (
                        <Button
                          onClick={() => {
                            if (course.course_type === 'online') {
                              navigate(`/course/${id}/learn`);
                            } else {
                              setIsScheduleDialogOpen(true);
                            }
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-base rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                        >
                          {course.course_type === 'online' ? (
                            <>
                              <PlayCircle className="w-5 h-5" />
                              Continue Learning
                            </>
                          ) : (
                            <>
                              <Calendar className="w-5 h-5" />
                              View My Schedule
                            </>
                          )}
                        </Button>
                      )
                    ) : isCourseDatePassed(course) ? (
                      <div className="space-y-3">
                        <Button disabled className="w-full bg-zinc-400 text-white font-bold py-4 rounded-xl cursor-not-allowed">
                          Enrollment Closed (Past Date)
                        </Button>
                        <Button
                          onClick={() => navigate(`/contact?subject=Next+Cohort+Enquiry&course=${encodeURIComponent(course.title)}`)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Enquire for Next Session
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate('/auth', { state: { from: window.location.pathname } })}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 text-base rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
                      >
                        Enroll Now
                      </Button>
                    )}
                  </div>

                  {/* GUARANTEES & FEATURES CHECKLIST */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">This course includes:</h4>
                    
                    <div className="space-y-2.5 text-xs text-gray-600">
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{duration} on-demand video & practical lab training</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>{course.resources_count || 5} downloadable technical guides & frameworks</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>Full lifetime access on mobile and desktop</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span>Official PANA Institute Competency Certificate</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER: SHARE & WISHLIST */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-semibold text-gray-600">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                      <span>{isWishlisted ? 'Wishlisted' : 'Save to wishlist'}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Course</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>
      </main>

      <Footer />

      {/* Schedule Dialog Modal */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-red-600" />
              My Schedule & Venue Details
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Official schedule, location, and instructions for your upcoming training session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className={`grid grid-cols-1 ${course.course_type === 'online' ? '' : 'md:grid-cols-2'} gap-6`}>
              {(course.course_type === 'onsite' || course.course_type === 'hybrid') && (
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-600" />
                    Venue Location
                  </h4>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900">{course.venue_name || 'PANA Institute Main Hub'}</p>
                    {(course.venue_address || course.venue_city || course.venue_country) && (
                      <p>
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
                        className="text-red-600 hover:underline font-bold inline-block mt-2"
                      >
                        Open in Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-red-600" />
                  Session Hours
                </h4>
                <div className="text-xs text-gray-700 leading-relaxed">
                  {course.onsite_schedule ? (
                    typeof course.onsite_schedule === 'string' ? (
                      <p className="whitespace-pre-wrap">{course.onsite_schedule}</p>
                    ) : (
                      <p>Daily sessions run from 9:00 AM to 4:30 PM WAT.</p>
                    )
                  ) : (
                    <p className="italic text-gray-500">Detailed schedule provided upon check-in.</p>
                  )}
                </div>
              </div>
            </div>

            {course.course_type !== 'online' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 leading-relaxed">
                <span className="font-bold">Important Notice:</span> Please arrive 15 minutes early with valid government identification for security verification at the main gate.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}