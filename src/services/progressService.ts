import { supabase } from '@/integrations/supabase/client';

// Simplified type definitions to avoid deep instantiation
// Simple interface to avoid deep instantiation issues
interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;  // Added module_id
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  progress_percentage: number;
  time_spent_minutes: number;
  created_at: string;
  updated_at?: string;
  last_accessed?: string;
  // Use a more specific type for metadata to avoid deep instantiation
  metadata?: {
    [key: string]: string | number | boolean | null | undefined;
  };
}

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  certificate_url: string;
  issued_date: string;
  completion_date: string;
  status: 'active' | 'revoked' | 'expired';
  course_title: string;
  course_duration_hours: number;
  verification_code: string;
  title: string;
  description?: string;
  enrollment_id?: string;
  instructor_name?: string;
  created_at: string;
  updated_at: string;
}

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  device_info?: Record<string, unknown>;
  ip_address?: string;
}

// Helper interface for service responses
// Use a simpler generic type with a constraint to prevent deep instantiation
type ServiceResponse<T extends object> = {
  data: T | null;
  error: Error | null;
};

export const progressService = {
  // Track lesson progress
  async trackLessonProgress(params: {
    userId: string;
    lessonId: string;
    moduleId?: string;
    completed?: boolean;
    timeSpentMinutes?: number;
  }) {
    try {
      const { data: existingProgress, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', params.userId)
        .eq('lesson_id', params.lessonId)
        .single() as { data: Progress | null; error: any };

      // Calculate progress percentage (for simplicity, 0% or 100% for now)
      if (fetchError?.code !== 'PGRST116') { // PGRST116 = not found
        throw fetchError;
      }

      let result;
      const now = new Date().toISOString();
      
      if (existingProgress) {
        // Update existing progress
        result = await supabase
          .from('lesson_progress')
          .update({
            completed: params.completed ?? existingProgress.completed,
            completed_at: params.completed ? now : existingProgress.completed_at,
            time_spent_minutes: (existingProgress.time_spent_minutes || 0) + (params.timeSpentMinutes || 0),
            updated_at: now
          })
          .eq('id', existingProgress.id)
          .select()
          .single();
      } else {
        // Create new progress record
        result = await supabase
          .from('lesson_progress')
          .insert({
            student_id: params.userId,
            lesson_id: params.lessonId,
            module_id: params.moduleId || '', // Add module_id if provided
            completed: params.completed || false,
            completed_at: params.completed ? now : null,
            time_spent_minutes: params.timeSpentMinutes || 0,
            created_at: now,
            updated_at: now
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      // Log activity
      await this.logActivity({
        userId: params.userId,
        activityType: params.completed ? 'lesson_completed' : 'lesson_progress',
        entityType: 'lesson',
        entityId: params.lessonId,
      });

      // Note: Course completion check is handled separately when needed
      // as we don't have courseId in the params

      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error tracking lesson progress:', error);
      return { data: null, error: error as Error };
    }
  },

  // Check if course is completed and issue certificate if needed
  async checkCourseCompletion(userId: string, courseId: string): Promise<{ completed: boolean; certificate?: Certificate }> {
    try {
      // Get total lessons in course
      const { count: totalLessons, error: countError } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      if (countError) throw countError;

      // First get all lesson IDs for the course
      const { data: courseLessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);
      
      if (lessonsError) throw lessonsError;
      
      const lessonIds = courseLessons?.map(lesson => lesson.id) || [];
      
      // Then count completed lessons
      const { count: completedCount, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', userId)
        .eq('completed', true)
        .in('lesson_id', lessonIds);

      if (progressError) throw progressError;

      const allLessonsCompleted = (completedCount || 0) >= (totalLessons || 0);

      // If course is completed, issue a certificate
      if (allLessonsCompleted) {
        const certificate = await this.issueCertificate(userId, courseId);
        return { completed: true, certificate };
      }

      return { completed: false };
    } catch (error) {
      console.error('Error checking course completion:', error);
      return { completed: false };
    }
  },

  // Issue a certificate for course completion
  async issueCertificate(userId: string, courseId: string): Promise<ServiceResponse<Certificate>> {
    try {
      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (existingCert) return { data: existingCert as unknown as Certificate, error: null };

      const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 6)}`;
      const verificationCode = `VC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const now = new Date().toISOString();
      
      // Get course details for the certificate
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('title, duration_hours')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      // Create certificate with all required fields
      const certificateData = {
        user_id: userId,
        course_id: courseId,
        certificate_number: certificateNumber,
        certificate_url: `https://pana-academy.com/certificates/${certificateNumber}`,
        issued_date: now,
        completion_date: now,
        course_title: course.title,
        course_duration_hours: course.duration_hours || 0,
        verification_code: verificationCode,
        status: 'active' as const,
        created_at: now,
        updated_at: now,
        title: `Certificate of Completion - ${course.title}`,
        description: `Awarded for successfully completing the ${course.title} course`,
        enrollment_id: '', // This should be set to the actual enrollment ID if available
        instructor_name: 'PANA Academy Instructor' // Default value, should be replaced with actual instructor
      } satisfies Omit<Certificate, 'id'>;
      
      const { data: certificate, error: certError } = await supabase
        .from('certificates')
        .insert(certificateData)
        .select()
        .single();

      if (certError) throw certError;

      // Log certificate issuance
      await this.logActivity({
        userId,
        activityType: 'certificate_issued',
        entityType: 'certificate',
        entityId: certificate.id,
        deviceInfo: {},
        ipAddress: ''
      });

      return { data: certificate as unknown as Certificate, error: null };
    } catch (error) {
      console.error('Error issuing certificate:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to issue certificate') 
      };
    }
  },

  // Log user activity
  async logActivity(params: {
    userId: string;
    activityType: string;
    entityType: string;
    entityId: string;
    deviceInfo?: Record<string, unknown>;
    ipAddress?: string;
  }) {
    try {
      // For now, just log to console since we don't have a user_activities table
      // Create a mock activity with required fields
      const activity: UserActivity = {
        id: `activity-${Date.now()}`,
        user_id: params.userId,
        activity_type: params.activityType,
        entity_type: params.entityType,
        entity_id: params.entityId,
        device_info: params.deviceInfo || {},
        ip_address: params.ipAddress || '',
        created_at: new Date().toISOString()
      };
      
      console.log('Activity logged:', activity);
      return { data: activity, error: null };
    } catch (error) {
      console.error('Error logging activity:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to log activity') 
      };
    }
  },

  // Get course progress
  async getCourseProgress(userId: string, courseId: string) {
    try {
      // Get all lessons for the course
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      if (lessonsError) throw lessonsError;

      const lessonIds = lessons?.map(lesson => lesson.id) || [];

      // Get user's progress for these lessons
      const { data: progress, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds) as { data: Array<{
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          time_spent_minutes: number;
          created_at: string;
          updated_at?: string;
          last_accessed?: string;
        }> | null; error: any };

      if (progressError) throw progressError;
      const progressList = progress || [];

      // Calculate progress
      const completedLessons = progressList.filter(p => p.completed).length;
      const totalLessons = lessonIds.length;
      const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      // Calculate total time spent
      const totalTimeSpent = progressList.reduce(
        (sum, p) => sum + (p.time_spent_minutes || 0), 0
      );

      // Get last accessed time using last updated or created time
      const lastAccessed = progressList.length > 0
        ? new Date(Math.max(...progressList
            .map(p => {
              const updated = p.updated_at ? new Date(p.updated_at).getTime() : 0;
              const created = p.created_at ? new Date(p.created_at).getTime() : 0;
              return Math.max(updated, created);
            })
          )).toISOString()
        : null;

      return {
        data: {
          progress: progressPercentage,
          completedLessons,
          totalLessons,
          timeSpent: totalTimeSpent,
          lastAccessed,
          details: progressList
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting course progress:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to get course progress') 
      };
    }
  },

  // Get user activity
  async getUserActivity(userId: string, limit = 10): Promise<ServiceResponse<UserActivity[]>> {
    try {
      // Using 'user_activities' table with type assertion
      const { data: activities, error } = await (supabase as any)
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }
      
      // Return empty array if no activities found
      if (!activities) {
        return { data: [], error: null };
      }
      
      // Ensure all required fields are present
      const validatedActivities = activities.map((activity: any) => ({
        id: activity.id || `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: activity.user_id,
        activity_type: activity.activity_type,
        entity_type: activity.entity_type,
        entity_id: activity.entity_id,
        device_info: activity.device_info || {},
        ip_address: activity.ip_address || '',
        created_at: activity.created_at || new Date().toISOString()
      }));
      
      return { data: validatedActivities, error: null };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  },

// ...
  // Sync progress from offline storage
  async syncProgressFromOffline(
    offlineProgress: Array<{
      userId: string;
      lessonId: string;
      moduleId?: string;
      completed?: boolean;
      timeSpentMinutes?: number;
    }>
  ): Promise<ServiceResponse<Array<ServiceResponse<Progress>>>> {
    try {
      const results = [];
      for (const progress of offlineProgress) {
        const { userId, lessonId, moduleId, completed, timeSpentMinutes } = progress;
        const result = await this.trackLessonProgress({
          userId,
          lessonId,
          moduleId,
          completed,
          timeSpentMinutes
        });
        results.push(result);
      }
      return { data: results, error: null };
    } catch (error) {
      console.error('Error syncing offline progress:', error);
      return { data: null, error };
    }
  }
};
