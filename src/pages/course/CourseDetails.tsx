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
  MapPin
} from 'lucide-react';
import { fetchCourseById, formatCourseDate, isStartingSoon, type Course } from '@/services/courseService';
import { ModuleManager } from '@/components/course-management/ModuleManager';
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
      <main className="flex-1 w-full">
        <div className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mb-6"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                    {course.level}
                  </Badge>
                  {course.course_type && (
                    <Badge
                      variant="outline"
                      className={course.course_type === 'online'
                        ? 'bg-green-500/20 border-green-300 text-white'
                        : course.course_type === 'onsite'
                          ? 'bg-blue-500/20 border-blue-300 text-white'
                          : 'bg-purple-500/20 border-purple-300 text-white'
                      }
                    >
                      {course.course_type === 'online' ? '💻 Online' : course.course_type === 'onsite' ? '🏢 On-Site' : '🌓 Hybrid'}
                    </Badge>
                  )}
                  {(course.course_type === 'onsite' || course.course_type === 'hybrid') && course.start_date && isStartingSoon(course.start_date) && (
                    <Badge variant="outline" className="bg-red-500/30 border-red-300 text-white animate-pulse">
                      🔥 Starting Soon
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-pana-gray-100 mb-4">{course.description}</p>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {course.is_free || course.price === 0 ? (
                      <span className="text-green-300">Free</span>
                    ) : (
                      <span>₦{course.price.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                {/* Course Dates for Onsite/Hybrid Courses */}
                {(course.course_type === 'onsite' || course.course_type === 'hybrid') && course.start_date && (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-white mt-0.5" />
                      <div>
                        <p className="font-semibold text-white mb-1">Course Schedule</p>
                        <p className="text-sm text-white/90">
                          <span className="font-medium">Starts:</span> {formatCourseDate(course.start_date)}
                          {course.end_date && (
                            <>
                              <br />
                              <span className="font-medium">Ends:</span> {formatCourseDate(course.end_date)}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>By {instructorName}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{formattedStudents} Students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{duration}</span>
                  </div>
                </div>
                {course.rating && course.rating > 0 ? (
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-white">{course.rating.toFixed(1)}/5.0</span>
                  </div>
                ) : (
                  <div className="text-pana-light-gray">No ratings yet</div>
                )}
              </div>
              {user && isInstructor ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate(`/instructor/courses/${id}/edit`)}
                >
                  Edit Course
                </Button>
              ) : user ? (
                !isInstructor && !isEnrolled && (
                  <PaymentButton
                    courseId={course.id}
                    amount={course.price || 0}
                    courseTitle={course.title}
                  />
                )
              ) : (
                <Button
                  className="mt-4"
                  onClick={() => navigate('/auth', { state: { from: window.location.pathname } })}
                >
                  Sign In to Enroll
                </Button>
              )}
            </div>

            {/* Navigation Button for Enrolled Students */}
            {user && !isInstructor && isEnrolled && (
              <Button
                className="mt-4"
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
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* What You'll Learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learning_outcomes?.length > 0 ? (
                        course.learning_outcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-pana-green mr-3 mt-0.5 flex-shrink-0" />
                            <span>{outcome}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">No learning outcomes provided.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Content */}
                <Card className="mt-8">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl font-bold">Course Content</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isInstructor && id ? (
                      <ModuleManager courseId={id} canEdit={true} />
                    ) : (
                      <div className="space-y-4">
                        {course.modules?.length > 0 ? (
                          course.modules.map((module) => (
                            <div key={module.id} className="border rounded-lg overflow-hidden">
                              <div className="p-4 hover:bg-gray-50">
                                <div className="flex items-center">
                                  <div className="bg-pana-blue/10 p-2 rounded-full mr-3">
                                    <BookOpen className="h-4 w-4 text-pana-blue" />
                                  </div>
                                  <div className="flex-grow">
                                    <h3 className="font-medium">{module.title}</h3>
                                    <p className="text-sm text-gray-500">{module.duration}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No course content available yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Course Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">This Course Includes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.features && course.features.length > 0 ? (
                      course.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-pana-blue mr-3" />
                          <span>{feature}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 text-pana-blue mr-3" />
                          <span>{course.duration || `${course.duration_hours} hours`} on-demand content</span>
                        </div>
                        {course.resources_count > 0 && (
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-pana-blue mr-3" />
                            <span>{course.resources_count} downloadable resources</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-pana-blue mr-3" />
                          <span>Full lifetime access</span>
                        </div>
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 text-pana-blue mr-3" />
                          <span>Access on mobile and TV</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-pana-blue mr-3" />
                          <span>Certificate of completion</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Instructor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-pana-blue/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-pana-blue" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{instructorName}</h4>
                        <p className="text-sm text-gray-500">Course Instructor</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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