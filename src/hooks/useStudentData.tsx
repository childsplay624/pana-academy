import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail?: string | null;
  lastAccessed?: string;
  isNew?: boolean;
  isTrending?: boolean;
  timeSpent: number;
  category: string;
  totalHours: number;
  image?: string | null;
  instructor_name?: string;
  enrollment_id?: string;
  course_id?: string;
  status?: string;
  course_type?: 'online' | 'onsite' | 'hybrid'; // ✅ Add course type
}

interface Stats {
  enrolledCourses: number;
  certificates: number;
  totalProgress: number;
  totalTimeSpent: number;
  weeklyGoalProgress: number;
  completedCourses: number;
  streakDays: number;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'progress' | 'completion' | 'certificate';
  title: string;
  description: string;
  timestamp: string;
  metadata?: string;
}

export function useStudentData() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState<Stats>({
    enrolledCourses: 0,
    certificates: 0,
    totalProgress: 0,
    totalTimeSpent: 0,
    weeklyGoalProgress: 75,
    completedCourses: 0,
    streakDays: 5
  });

  useEffect(() => {
    if (!user) return;

    async function fetchStudentData() {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching student data for user:', user.id);

        // Fetch enrolled courses with instructor details
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            id,
            course_id,
            progress_percentage,
            enrolled_at,
            status,
            courses (
              id,
              title,
              description,
              category,
              duration_hours,
              thumbnail_url,
              course_type,
              profiles!courses_instructor_id_fkey (
                full_name
              )
            )
          `)
          .eq('student_id', user.id)
          .in('status', ['enrolled', 'completed']);

        if (enrollmentsError) {
          console.error('Enrollments error:', enrollmentsError);
          throw enrollmentsError;
        }

        console.log('Enrollments data:', enrollmentsData);

        // Transform enrolled courses data
        const transformedEnrolledCourses: Course[] = (enrollmentsData || [])
          .filter(enrollment => enrollment?.courses) // Filter out any null/undefined courses
          .map((enrollment: any) => ({
            id: enrollment.courses?.id || enrollment.course_id,
            course_id: enrollment.course_id,
            enrollment_id: enrollment.id,
            title: enrollment.courses?.title || 'Untitled Course',
            instructor: enrollment.courses?.profiles?.full_name || 'Unknown Instructor',
            instructor_name: enrollment.courses?.profiles?.full_name || 'Unknown Instructor',
            progress: enrollment.progress_percentage || 0,
            thumbnail: enrollment.courses?.thumbnail_url,
            lastAccessed: enrollment.enrolled_at,
            timeSpent: Math.floor(Math.random() * 180) + 30, // Mock time spent for now
            category: enrollment.courses?.category || 'General',
            totalHours: enrollment.courses?.duration_hours || 0,
            image: enrollment.courses?.thumbnail_url,
            status: enrollment.status,
            course_type: enrollment.courses?.course_type || 'online' // ✅ Include course type
          }));

        console.log('Transformed enrolled courses:', transformedEnrolledCourses);

        // 🐛 DEBUG: Log enrollment statuses
        console.log('📊 ENROLLMENT STATUSES:', transformedEnrolledCourses.map(c => ({
          title: c.title,
          status: c.status,
          progress: c.progress
        })));

        // Fetch recommended courses (published courses not enrolled in)
        const enrolledCourseIds = transformedEnrolledCourses.map(course => course.course_id).filter(Boolean);

        let recommendedQuery = supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            category,
            duration_hours,
            thumbnail_url,
            course_type,
            profiles!courses_instructor_id_fkey (
              full_name
            )
          `)
          .eq('status', 'published')
          .limit(4);

        // Only exclude enrolled courses if there are any
        if (enrolledCourseIds.length > 0) {
          recommendedQuery = recommendedQuery.not('id', 'in', `(${enrolledCourseIds.join(',')})`);
        }

        const { data: recommendedData, error: recommendedError } = await recommendedQuery;

        if (recommendedError) {
          console.error('Recommended courses error:', recommendedError);
          throw recommendedError;
        }

        console.log('Recommended courses data:', recommendedData);

        // Transform recommended courses data
        const transformedRecommendedCourses: Course[] = (recommendedData || []).map((course: any) => ({
          id: course.id,
          title: course.title,
          instructor: course.profiles?.full_name || 'Unknown Instructor',
          instructor_name: course.profiles?.full_name || 'Unknown Instructor',
          progress: 0,
          thumbnail: course.thumbnail_url,
          timeSpent: 0,
          category: course.category || 'General',
          totalHours: course.duration_hours || 0,
          image: course.thumbnail_url,
          course_type: course.course_type || 'online', // ✅ Include course type
          isNew: Math.random() > 0.7,
          isTrending: Math.random() > 0.8
        }));

        setEnrolledCourses(transformedEnrolledCourses);
        setRecommendedCourses(transformedRecommendedCourses);

        // Fetch actual certificates from certificates table
        const { data: certificatesData, error: certificatesError } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_valid', true);  // ✅ Using is_valid instead of status

        if (certificatesError) {
          console.error('Certificates error:', certificatesError);
          // Don't throw, just log - we can still show other data
        }

        const certificateCount = certificatesData?.length || 0;

        // Calculate stats
        const enrolledCount = transformedEnrolledCourses.length;
        const totalProgress = enrolledCount > 0
          ? Math.round(transformedEnrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCount)
          : 0;
        const totalTimeSpent = transformedEnrolledCourses.reduce((acc, course) => acc + course.timeSpent, 0);
        const completedCourses = transformedEnrolledCourses.filter(course => {
          const statusMatch = course.status?.toLowerCase() === 'completed';
          const progressMatch = course.progress >= 100;
          return statusMatch || progressMatch;
        }).length;

        // 🐛 DEBUG: Log completion calculation
        console.log('✅ COMPLETED COUNT:', {
          total: transformedEnrolledCourses.length,
          completed: completedCourses,
          breakdown: transformedEnrolledCourses.map(c => ({
            title: c.title,
            status: c.status,
            progress: c.progress,
            isCompleted: c.status?.toLowerCase() === 'completed' || c.progress >= 100
          }))
        });

        // Fetch and process recent activities
        const activities: RecentActivity[] = [];

        // 1. New enrollments
        (enrollmentsData || []).forEach((e: any) => {
          const course = Array.isArray(e.courses) ? e.courses[0] : e.courses;
          activities.push({
            id: `enroll-${e.id}`,
            type: 'enrollment',
            title: 'New Enrollment',
            description: `You enrolled in ${course?.title || 'a new course'}`,
            timestamp: e.enrolled_at,
            metadata: e.status === 'completed' ? 'Successfully completed' : 'Just started'
          });
        });

        // 2. Lesson progress (recent completions)
        const { data: recentProgress } = await supabase
          .from('lesson_progress')
          .select(`
            id,
            completed_at,
            lessons (
              title,
              modules (
                courses (title)
              )
            )
          `)
          .eq('student_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false })
          .limit(5);

        (recentProgress || []).forEach((p: any) => {
          const lesson = Array.isArray(p.lessons) ? p.lessons[0] : p.lessons;
          const module = Array.isArray(lesson?.modules) ? lesson.modules[0] : lesson?.modules;
          const course = Array.isArray(module?.courses) ? module.courses[0] : module?.courses;

          activities.push({
            id: `progress-${p.id}`,
            type: 'progress',
            title: 'Lesson Completed',
            description: `You completed "${lesson?.title || 'a lesson'}"`,
            timestamp: p.completed_at,
            metadata: course?.title
          });
        });

        // 3. Certificates
        const { data: recentCerts } = await supabase
          .from('certificates')
          .select(`
            id,
            issued_date,
            courses (title)
          `)
          .eq('user_id', user.id)
          .order('issued_date', { ascending: false })
          .limit(3);

        (recentCerts || []).forEach((c: any) => {
          const course = Array.isArray(c.courses) ? c.courses[0] : c.courses;
          activities.push({
            id: `cert-${c.id}`,
            type: 'certificate',
            title: 'Certificate Earned',
            description: `You earned a certificate in ${course?.title || 'a course'}`,
            timestamp: c.issued_date,
            metadata: 'Verified Achievement'
          });
        });

        // Sort by timestamp and take top 5
        const sortedActivities = activities
          .filter(a => a.timestamp)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        setRecentActivities(sortedActivities);

        setStats({
          enrolledCourses: enrolledCount,
          certificates: certificateCount, // ✅ Using actual certificate count from database
          totalProgress,
          totalTimeSpent,
          weeklyGoalProgress: 75,
          completedCourses,
          streakDays: 5
        });

      } catch (err) {
        console.error('Error fetching student data:', err);
        console.error('Error details:', err);

        // Set empty data instead of leaving it undefined
        setEnrolledCourses([]);
        setRecommendedCourses([]);
        setRecentActivities([]);
        setStats({
          enrolledCourses: 0,
          certificates: 0,
          totalProgress: 0,
          totalTimeSpent: 0,
          weeklyGoalProgress: 0,
          completedCourses: 0,
          streakDays: 0
        });

        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStudentData();
  }, [user]);

  return {
    isLoading,
    error,
    enrolledCourses,
    recommendedCourses,
    recentActivities,
    stats
  };
}