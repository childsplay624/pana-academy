import { supabase } from "@/integrations/supabase/client";

type CourseCategory = 'soft_skills' | 'safety' | 'sustainability' | 'general_technical' | 'flow_drives' | 'flow_control' | 'flow_measurement' | 'instrumentation_automation';

export interface Module {
  id: number;
  title: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor_name: string;
  instructor_avatar?: string;
  instructor?: string; // For backward compatibility
  students?: number;   // For backward compatibility
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  duration_hours: number;
  duration?: string;   // For backward compatibility
  students_count: number;
  rating?: number;
  price: number;
  is_free?: boolean;   // Whether course is free
  thumbnail_url?: string;
  learning_outcomes: string[];
  modules: Module[];
  created_at: string;
  updated_at: string;
  start_date?: string;  // ISO date string
  end_date?: string;    // ISO date string
  course_type?: 'online' | 'onsite' | 'hybrid';  // Course delivery type
  status?: 'draft' | 'review' | 'published' | 'archived';  // Course status
  features?: string[];
  requirements?: string[];
  resources_count?: number;
  venue_name?: string;
  venue_address?: string;
  venue_city?: string;
  venue_country?: string;
  venue_map_url?: string;
  onsite_schedule?: any;
  venue_id?: string;
}

interface DatabaseCourse {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  category: CourseCategory;
  level: string;
  duration_hours: number;
  students_count?: number;
  rating?: number;
  price?: number;
  thumbnail_url?: string;
  learning_outcomes?: string[];
  requirements?: string[];
  features?: string[];
  resources_count?: number;
  venue_name?: string;
  venue_address?: string;
  venue_city?: string;
  venue_country?: string;
  venue_map_url?: string;
  onsite_schedule?: any;
  course_type?: 'online' | 'onsite' | 'hybrid';
  start_date?: string;
  end_date?: string;
  is_free?: boolean;
  status?: 'draft' | 'review' | 'published' | 'archived';
  modules?: any[];
  created_at: string;
  updated_at: string;
}

export const fetchCourseById = async (id: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (id, full_name, avatar_url),
        modules:modules (
          id,
          title,
          order_index,
          lessons:lessons (
            id,
            title,
            content,
            video_url,
            lesson_type,
            duration_minutes,
            order_index,
            is_free
          )
        )
      `)
      .eq('id', id)
      .order('order_index', { foreignTable: 'modules', ascending: true })
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      throw error;
    }

    if (!data) return null;

    const dbCourse = data as unknown as any;

    // Transform the data to match our Course interface
    const course: Course = {
      id: dbCourse.id,
      title: dbCourse.title,
      description: dbCourse.description,
      instructor_id: dbCourse.instructor_id,
      instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
      instructor_avatar: dbCourse.instructor?.avatar_url,
      category: dbCourse.category,
      level: dbCourse.level,
      duration_hours: dbCourse.duration_hours,
      students_count: dbCourse.students_count || 0,
      rating: dbCourse.rating,
      price: dbCourse.price || 0,
      thumbnail_url: dbCourse.thumbnail_url,
      learning_outcomes: dbCourse.learning_outcomes || [],
      requirements: dbCourse.requirements || [],
      features: dbCourse.features || [],
      resources_count: dbCourse.resources_count || 0,
      venue_name: dbCourse.venue_name,
      venue_address: dbCourse.venue_address,
      venue_city: dbCourse.venue_city,
      venue_country: dbCourse.venue_country,
      venue_map_url: dbCourse.venue_map_url,
      onsite_schedule: dbCourse.onsite_schedule,
      course_type: dbCourse.course_type || 'online',
      start_date: dbCourse.start_date,
      end_date: dbCourse.end_date,
      is_free: dbCourse.is_free || false,
      status: dbCourse.status || 'published',
      modules: (dbCourse.modules || []).map((m: any) => ({
        ...m,
        lessons: (m.lessons || []).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0))
      })),
      created_at: dbCourse.created_at,
      updated_at: dbCourse.updated_at
    };

    return course;
  } catch (error) {
    console.error('Error in fetchCourseById:', error);
    throw error;
  }
};

export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (id, full_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((course: unknown) => {
      const dbCourse = course as DatabaseCourse;
      return {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        instructor_id: dbCourse.instructor_id,
        instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
        instructor_avatar: dbCourse.instructor?.avatar_url,
        category: dbCourse.category,
        level: dbCourse.level as 'beginner' | 'intermediate' | 'advanced',
        duration_hours: dbCourse.duration_hours,
        students_count: dbCourse.students_count || 0,
        rating: dbCourse.rating,
        price: dbCourse.price || 0,
        thumbnail_url: dbCourse.thumbnail_url,
        learning_outcomes: dbCourse.learning_outcomes || [],
        modules: [], // We don't load modules for the course list
        created_at: dbCourse.created_at,
        updated_at: dbCourse.updated_at,
        start_date: (dbCourse as any).start_date,
        end_date: (dbCourse as any).end_date,
        course_type: (dbCourse as any).course_type || 'online',
        is_free: (dbCourse as any).is_free,
        status: (dbCourse as any).status || 'published'
      };
    });
  } catch (error) {
    console.error('Error in fetchAllCourses:', error);
    throw error; // Re-throw to handle in the component
  }
};

/**
 * Fetch upcoming courses that haven't started yet
 * Includes both live and self-paced courses with future start dates
 * Only returns courses with start_date in the future
 */
export const fetchUpcomingCourses = async (): Promise<Course[]> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (id, full_name, avatar_url)
      `)
      .eq('status', 'published')
      // Removed course_type filter - now includes both live and self-paced
      .gte('start_date', now)               // Start date in future
      .not('start_date', 'is', null)        // Must have start date
      .order('start_date', { ascending: true })  // Earliest first
      .limit(12);

    if (error) {
      console.error('Error fetching upcoming courses:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((course: unknown) => {
      const dbCourse = course as DatabaseCourse;
      return {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        instructor_id: dbCourse.instructor_id,
        instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
        instructor_avatar: dbCourse.instructor?.avatar_url,
        category: dbCourse.category,
        level: dbCourse.level as 'beginner' | 'intermediate' | 'advanced',
        duration_hours: dbCourse.duration_hours,
        students_count: dbCourse.students_count || 0,
        rating: dbCourse.rating,
        price: dbCourse.price || 0,
        thumbnail_url: dbCourse.thumbnail_url,
        learning_outcomes: dbCourse.learning_outcomes || [],
        modules: [],
        created_at: dbCourse.created_at,
        updated_at: dbCourse.updated_at,
        start_date: (dbCourse as any).start_date,
        end_date: (dbCourse as any).end_date,
        course_type: (dbCourse as any).course_type || 'online',
        status: 'published' as const
      };
    });
  } catch (error) {
    console.error('Error in fetchUpcomingCourses:', error);
    throw error;
  }
};

/**
 * Fetch ongoing courses (started but not finished)
 */
export const fetchOngoingCourses = async (): Promise<Course[]> => {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (id, full_name, avatar_url)
      `)
      .eq('status', 'published')
      .in('course_type', ['onsite', 'hybrid'])
      .lte('start_date', now)               // Started
      .gte('end_date', now)                 // Not finished
      .not('start_date', 'is', null)
      .not('end_date', 'is', null)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching ongoing courses:', error);
      throw error;
    }

    if (!data) return [];

    return data.map((course: unknown) => {
      const dbCourse = course as DatabaseCourse;
      return {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description,
        instructor_id: dbCourse.instructor_id,
        instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
        instructor_avatar: dbCourse.instructor?.avatar_url,
        category: dbCourse.category,
        level: dbCourse.level as 'beginner' | 'intermediate' | 'advanced',
        duration_hours: dbCourse.duration_hours,
        students_count: dbCourse.students_count || 0,
        rating: dbCourse.rating,
        price: dbCourse.price || 0,
        thumbnail_url: dbCourse.thumbnail_url,
        learning_outcomes: dbCourse.learning_outcomes || [],
        modules: [],
        created_at: dbCourse.created_at,
        updated_at: dbCourse.updated_at,
        start_date: (dbCourse as any).start_date,
        end_date: (dbCourse as any).end_date,
        course_type: (dbCourse as any).course_type || 'onsite',
        status: 'published' as const
      };
    });
  } catch (error) {
    console.error('Error in fetchOngoingCourses:', error);
    throw error;
  }
};

/**
 * Utility function to format course dates
 */
export const formatCourseDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Check if a course is starting soon (within 7 days)
 */
export const isStartingSoon = (startDate: string): boolean => {
  const days = Math.ceil(
    (new Date(startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return days >= 0 && days <= 7;
};

/**
 * Get course status based on dates
 */
export const getCourseStatus = (course: Course): {
  status: 'available' | 'upcoming' | 'starting_soon' | 'in_progress' | 'completed';
  label: string;
  color: string;
} => {
  // Online courses are always available
  if (course.course_type === 'online' || !course.start_date) {
    return { status: 'available', label: 'Enroll Anytime', color: 'green' };
  }

  const now = new Date();
  const start = new Date(course.start_date);
  const end = course.end_date ? new Date(course.end_date) : null;

  // Course hasn't started yet
  if (start > now) {
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      return { status: 'starting_soon', label: `Starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`, color: 'orange' };
    }
    return { status: 'upcoming', label: `Starts ${formatCourseDate(course.start_date)}`, color: 'blue' };
  }

  // Course has finished
  if (end && end < now) {
    return { status: 'completed', label: 'Course Completed', color: 'gray' };
  }

  // Course is currently ongoing
  return { status: 'in_progress', label: 'In Progress', color: 'green' };
};

/**
 * Create a new course
 */
export const createCourse = async (courseData: any) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        title: courseData.title,
        description: courseData.description,
        instructor_id: courseData.instructorId,
        category: courseData.categoryId,
        level: courseData.level,
        course_type: courseData.courseType,
        price: courseData.isFree ? 0 : courseData.price,
        is_free: courseData.isFree,
        start_date: courseData.startDate,
        end_date: courseData.endDate,
        thumbnail_url: courseData.thumbnailUrl,
        status: 'draft',

        // Online course fields
        learning_outcomes: courseData.learningOutcomes,
        requirements: courseData.requirements,

        // Onsite course fields
        venue_name: courseData.venueName,
        venue_address: courseData.venueAddress,
        venue_city: courseData.venueCity,
        venue_country: courseData.venueCountry,
        venue_capacity: courseData.venueCapacity,
        venue_map_url: courseData.venueMapUrl,
        onsite_schedule: courseData.onsiteSchedule,
        requires_materials: courseData.requiresMaterials,
        materials_list: courseData.materialsList,
        parking_info: courseData.parkingInfo,
        accommodation_info: courseData.accommodationInfo,
        venue_id: courseData.venueId,
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error creating course:', error);
    return { data: null, error };
  }
};

