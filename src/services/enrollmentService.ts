import { supabase } from '@/integrations/supabase/client';

export type EnrollmentStatus = 'enrolled' | 'completed' | 'dropped' | 'suspended';

// Database schema type
type DatabaseEnrollment = {
  id: string;
  course_id: string;
  student_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  status: EnrollmentStatus;
  certificate_url: string | null;
};

// Extended type with our additional fields
export interface Enrollment extends DatabaseEnrollment {
  completed_lessons: string[];
  last_accessed_at: string;
}

export const enrollInCourse = async (courseId: string): Promise<{ data: Enrollment | null; error: Error | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to enroll in a course');
    }

    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return { data: existingEnrollment as Enrollment, error: null };
    }

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
      throw checkError;
    }

    // Create new enrollment with only the database fields
    const newEnrollment = {
      course_id: courseId,
      student_id: user.id,
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      status: 'enrolled' as const,
      completed_at: null,
      certificate_url: null
    };

    const { data, error } = await supabase
      .from('enrollments')
      .insert(newEnrollment)
      .select()
      .single<DatabaseEnrollment>();

    if (error) throw error;

    return { 
      data: {
        ...data,
        completed_lessons: [],
        last_accessed_at: data.enrolled_at
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to enroll in course') 
    };
  }
};

export const checkEnrollment = async (courseId: string): Promise<{ isEnrolled: boolean; enrollment: Enrollment | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isEnrolled: false, enrollment: null };
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return { isEnrolled: false, enrollment: null };
      }
      throw error;
    }

    // Convert database enrollment to our extended type
    const enrollment: Enrollment = {
      ...data,
      // Initialize additional fields with default values
      completed_lessons: [],
      last_accessed_at: data.enrolled_at // Use enrolled_at as default for last_accessed_at
    };

    return { 
      isEnrolled: true, 
      enrollment 
    };
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return { isEnrolled: false, enrollment: null };
  }
};
