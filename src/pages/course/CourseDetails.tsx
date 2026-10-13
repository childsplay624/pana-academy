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
  ShieldCheck,
  Check,
  Briefcase,
  Cpu,
  Building2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { fetchCourseById, formatCourseDate, isStartingSoon, isCourseDatePassed, isCoursePriceTbd, type Course, type Lesson } from '@/services/courseService';
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
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;
  const isInstructor = user?.id === course?.instructor_id;

  useEffect(() => {
    // Keep all module sections closed by default when course details page opens
    setExpandedModules({});
  }, [course?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const expandAllModules = () => {
    if (!course?.modules) return;
    const allExpanded: Record<string, boolean> = {};
    course.modules.forEach(m => {
      allExpanded[String(m.id)] = true;
    });
    setExpandedModules(allExpanded);
  };

  const collapseAllModules = () => {
    setExpandedModules({});
  };

  const totalLessonsCount = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

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

        if (courseData.id && id !== courseData.id) {
          navigate(`/course/${courseData.id}`, { replace: true });
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
            const { isEnrolled: enrolled } = await checkEnrollment(courseData.id);
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
                
                {/* Course Code & Title */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {course.code && (
                      <span className="bg-red-600 text-white font-mono text-xs font-extrabold tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                        {course.code}
                      </span>
                    )}
                    {course.course_area && (
                      <span className="bg-white/10 text-zinc-300 text-xs font-medium px-2.5 py-1 rounded-md border border-white/10">
                        {course.course_area}
                      </span>
                    )}
                    {course.award && (
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {course.award}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {course.title}
                  </h1>
                </div>

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

                  {/* Level Badge */}
                  {course.level && (
                    <span className="bg-white/10 border border-white/20 text-zinc-200 text-xs font-semibold px-3 py-1 rounded-md capitalize">
                      Level: {course.level}
                    </span>
                  )}

                  {/* Class Size Badge */}
                  {course.class_size && (
                    <span className="bg-white/10 border border-white/20 text-zinc-200 text-xs font-medium px-3 py-1 rounded-md flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-red-400" />
                      {course.class_size}
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
                      <span>{course.award || 'Official PANA Accreditation Pass'}</span>
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
                  {course.standards && course.standards.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{course.standards[0]} Aligned</div>
                        <div className="text-[11px] text-zinc-400">{course.standards.length} {course.standards.length === 1 ? 'Standard' : 'Standards'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">ISO Aligned</div>
                        <div className="text-[11px] text-zinc-400">Verified Quality</div>
                      </div>
                    </div>
                  )}
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

              {/* WHO SHOULD ATTEND / TARGET AUDIENCE */}
              {course.target_audience && course.target_audience.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Who Should Attend</h2>
                      <p className="text-xs text-gray-500">Target disciplines, engineering specialists, and operational sectors</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {course.target_audience.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-colors">
                        <Building2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800 text-xs sm:text-sm font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COURSE CONTENT / SYLLABUS SECTION */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Course Content & Syllabus</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800">
                        {course.modules?.length || 0} {course.modules?.length === 1 ? 'module' : 'modules'}
                      </span>
                      {totalLessonsCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{totalLessonsCount} lectures / topics</span>
                        </>
                      )}
                      {duration && (
                        <>
                          <span>•</span>
                          <span>{duration} total duration</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {course.modules && course.modules.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const allOpen = course.modules.every(m => expandedModules[String(m.id)]);
                          if (allOpen) {
                            collapseAllModules();
                          } else {
                            expandAllModules();
                          }
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100/70 cursor-pointer"
                      >
                        {course.modules.every(m => expandedModules[String(m.id)]) ? 'Collapse all sections' : 'Expand all sections'}
                      </button>
                    )}

                    {isInstructor && course?.id && (
                      <Button variant="outline" size="sm" onClick={() => navigate(`/course/${course.id}/edit`)}>
                        Edit Content
                      </Button>
                    )}
                  </div>
                </div>

                {isInstructor && id ? (
                  <ModuleManager courseId={id} canEdit={true} />
                ) : (
                  <div className="space-y-3.5">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((module, mIdx) => {
                        const mId = String(module.id);
                        const isExpanded = !!expandedModules[mId];
                        const lessons = module.lessons || [];

                        return (
                          <div
                            key={module.id}
                            className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 bg-white shadow-xs"
                          >
                            {/* Module Header Trigger */}
                            <button
                              type="button"
                              onClick={() => toggleModule(mId)}
                              className="w-full p-4 bg-gray-50/80 hover:bg-gray-100/80 flex items-center justify-between text-left transition-colors cursor-pointer border-b border-transparent data-[expanded=true]:border-gray-200"
                              data-expanded={isExpanded}
                            >
                              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {mIdx + 1}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                                    {module.title}
                                  </h3>
                                  {module.duration && (
                                    <span className="text-xs text-gray-500 font-medium">
                                      {module.duration}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-500">
                                {lessons.length > 0 ? (
                                  <span className="hidden sm:inline font-medium">
                                    {lessons.length} {lessons.length === 1 ? 'topic' : 'topics'}
                                  </span>
                                ) : null}
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-2xs">
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </div>
                              </div>
                            </button>

                            {/* Expanded Module Content */}
                            {isExpanded && (
                              <div className="divide-y divide-gray-100 bg-white">
                                {module.description && (
                                  <div className="px-5 py-3 bg-red-50/40 text-xs sm:text-sm text-gray-700 leading-relaxed border-b border-gray-100">
                                    <span className="font-semibold text-red-900 mr-1.5">Overview:</span>
                                    {module.description}
                                  </div>
                                )}

                                {lessons.length > 0 ? (
                                  lessons.map((lesson, lIdx) => (
                                    <div
                                      key={lesson.id || lIdx}
                                      onClick={() => setSelectedLesson(lesson)}
                                      className="px-5 py-3.5 hover:bg-gray-50/70 transition-colors flex items-start justify-between gap-4 cursor-pointer group"
                                    >
                                      <div className="flex items-start gap-3 min-w-0">
                                        <div className="pt-0.5 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0">
                                          {lesson.lesson_type === 'video' ? (
                                            <PlayCircle className="w-4 h-4 text-red-600" />
                                          ) : lesson.lesson_type === 'quiz' ? (
                                            <HelpCircle className="w-4 h-4 text-amber-600" />
                                          ) : (
                                            <FileText className="w-4 h-4 text-gray-500" />
                                          )}
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
                                              {lesson.title}
                                            </h4>
                                            {lesson.is_free && (
                                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                                Free Preview
                                              </span>
                                            )}
                                          </div>
                                          {lesson.content && (
                                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                              {lesson.content}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                                        {lesson.duration_minutes ? (
                                          <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            {lesson.duration_minutes}m
                                          </span>
                                        ) : null}
                                        <span className="text-[11px] font-medium text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                                          View
                                        </span>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-5 py-4 text-xs text-gray-500 italic">
                                    Detailed topic materials and resources provided during live class sessions.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 border border-dashed border-gray-300 rounded-xl text-center bg-gray-50/50 space-y-3">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
                        <h4 className="font-bold text-gray-800 text-sm">Detailed Curriculum Being Finalized</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                          The comprehensive syllabus and schedule for this course are being prepared. Check back shortly or contact our training coordinators for advance handouts.
                        </p>
                        {isInstructor && course?.id && (
                          <Button size="sm" variant="outline" onClick={() => navigate(`/course/${course.id}/edit?tab=content`)} className="mt-2 text-xs">
                            Add Course Modules
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* INDUSTRIAL STANDARDS & RECOGNIZED REFERENCES */}
              {course.standards && course.standards.length > 0 && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Standards & Recognized References</h2>
                      <p className="text-xs text-slate-300">Course syllabus strictly aligned with recognized international standards</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {course.standards.map((std, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {std}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OEM TECHNOLOGY REFERENCES & OEM PARTNERS */}
              {course.oem_partners && course.oem_partners.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Technology & OEM References</h2>
                      <p className="text-xs text-gray-500">Curriculum mapped to PE Energy OEM partner equipment & protocols</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {course.oem_partners.map((partner, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* PRACTICAL WORK & EXERCISES */}
              {course.practical_work && course.practical_work.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Practical Work & Real Datasets</h2>
                      <p className="text-xs text-gray-500">Hands-on diagnostic drills and laboratory exercises completed by participants</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    {course.practical_work.map((pw, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800 text-xs sm:text-sm font-medium">{pw}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REQUIREMENTS & PREREQUISITES */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Requirements & Prerequisites</h2>
                      <p className="text-xs text-gray-500">Recommended background and prior technical competencies</p>
                    </div>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    {course.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/40 border border-amber-100/60">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-800 text-xs sm:text-sm font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COURSE SCHEDULE SECTION (Onsite / Hybrid / In-house) */}
              {(course.course_type === 'onsite' || course.course_type === 'hybrid' || course.delivery_options) && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Live Training Schedule & Delivery</h3>
                      
                      {course.start_date ? (
                        <p className="text-gray-700 text-sm">
                          <span className="font-semibold text-gray-900">Next Scheduled Session:</span>{' '}
                          <span className="font-medium text-red-700 bg-red-100/70 px-2 py-0.5 rounded">
                            {formatCourseDate(course.start_date)}
                            {course.end_date && <> to {formatCourseDate(course.end_date)}</>}
                          </span>
                        </p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-semibold text-sm">Schedule:</span>
                          <span className="font-semibold text-xs text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg">
                            Based on Request (In-house & on-demand)
                          </span>
                        </div>
                      )}

                      {course.delivery_options && (
                        <div className="text-xs sm:text-sm text-gray-600 bg-white/80 p-3 rounded-xl border border-red-100/80">
                          <span className="font-semibold text-gray-800">Public & Client Sessions: </span>
                          <span>{course.delivery_options}</span>
                        </div>
                      )}

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
                  {course.instructor_avatar ? (
                    <img
                      src={course.instructor_avatar}
                      alt={instructorName}
                      className="w-20 h-20 rounded-2xl object-cover shadow-md flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg flex-shrink-0">
                      {instructorName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">{instructorName}</h3>
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                      {course.instructor_role ? (course.instructor_role === 'instructor' ? 'Senior Technical Instructor & Assessor' : course.instructor_role) : 'Senior Subject Authority & Lead Assessor'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                      {ratingValue && (
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {ratingValue.toFixed(1)} Rating</span>
                      )}
                      {formattedStudents && (
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gray-400" /> {formattedStudents} Students</span>
                      )}
                      {course.modules && course.modules.length > 0 && (
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-gray-400" /> {course.modules.length} {course.modules.length === 1 ? 'Module' : 'Modules'}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pt-2">
                      {course.instructor_bio || 'Experienced energy sector consultant and certified technical assessor leading practical competency programs across Sub-Saharan Africa.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* IN-HOUSE / CORPORATE FACILITY DELIVERY */}
              <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-850 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-red-500/30">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md text-white">
                    <Building2 className="w-3.5 h-3.5" />
                    In-House Client Delivery
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Deliver this training at your plant or facility
                  </h3>
                  <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                    Adapted specifically to your OEM equipment, operating procedures, and plant reliability targets. Custom group sizes, dates, and syllabus modifications available upon request.
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/contact?subject=In-House+Training+Request&course=${encodeURIComponent(course.title)}`)}
                  className="bg-white text-red-700 hover:bg-gray-100 font-bold px-6 py-6 rounded-xl text-sm shadow-md flex-shrink-0 transition-transform hover:scale-105"
                >
                  Request In-House Proposal
                </Button>
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
                      <div className="text-xs font-bold uppercase tracking-wider text-red-600">Course Fee</div>
                      {isCoursePriceTbd(course) ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-gray-900">Fee TBD</span>
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Upon Request
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-gray-900">
                            {course.is_free ? 'Free' : `₦${course.price.toLocaleString()}`}
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
                      )}
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
                        {!isEnrolled && !isCoursePriceTbd(course) && (
                          <PaymentButton
                            courseId={course.id}
                            amount={course.price || 0}
                            courseTitle={course.title}
                            isExpired={isCourseDatePassed(course)}
                          />
                        )}
                      </div>
                    ) : user && isEnrolled ? (
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
                    ) : isCoursePriceTbd(course) ? (
                      <Button
                        onClick={() => navigate(`/contact?subject=Course+Pricing+Enquiry&course=${encodeURIComponent(course.title)}`)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-6 text-base rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        Request Fee & Proposal
                      </Button>
                    ) : user ? (
                      <PaymentButton
                        courseId={course.id}
                        amount={course.price || 0}
                        courseTitle={course.title}
                        isExpired={isCourseDatePassed(course)}
                      />
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
                        <span>{course.award ? `Award: ${course.award}` : 'Official PANA Institute Competency Certificate'}</span>
                      </div>
                      {course.delivery_options && (
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="line-clamp-2">{course.delivery_options}</span>
                        </div>
                      )}
                      {course.class_size && (
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span>Class size: {course.class_size}</span>
                        </div>
                      )}
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
      {/* Lesson Details Dialog Modal */}
      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-100 text-red-700">
                {selectedLesson?.lesson_type === 'quiz' ? 'Assessment / Exam' : selectedLesson?.lesson_type === 'video' ? 'Video Lecture' : 'Topic Lecture'}
              </span>
              {selectedLesson?.duration_minutes && (
                <span className="text-xs text-gray-500 font-medium">
                  {selectedLesson.duration_minutes} minutes
                </span>
              )}
            </div>
            <DialogTitle className="text-2xl font-extrabold text-gray-900">
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Syllabus module topic overview and learning notes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-gray-800 text-sm leading-relaxed">
            {selectedLesson?.content ? (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 whitespace-pre-wrap font-normal text-gray-700 text-sm leading-relaxed">
                {selectedLesson.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">Course topic overview and exercise notes provided during session.</p>
            )}

            {selectedLesson?.video_url && (
              <div className="pt-2">
                <a
                  href={selectedLesson.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
                >
                  <PlayCircle className="w-4 h-4" /> Watch Lesson Video
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}