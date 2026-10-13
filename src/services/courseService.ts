import { supabase } from "@/integrations/supabase/client";

export type CourseCategory = 
  | 'soft_skills' 
  | 'safety' 
  | 'sustainability' 
  | 'general_technical' 
  | 'flow_drives' 
  | 'flow_control' 
  | 'flow_measurement' 
  | 'instrumentation_automation'
  | 'power_and_drives'
  | 'valves_and_actuation'
  | 'integrated_automation'
  | 'field_operations'
  | 'exploration'
  | 'production'
  | 'marine_and_subsea'
  | 'supply_chain'
  | string;

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  video_url?: string;
  lesson_type?: string;
  duration_minutes?: number;
  order_index?: number;
  is_free?: boolean;
}

export interface Module {
  id: string | number;
  title: string;
  description?: string;
  duration?: string;
  order_index?: number;
  lessons?: Lesson[];
}

export interface Course {
  id: string;
  code?: string; // Course catalog code e.g. 'PD01', 'VA05'
  domain_no?: number; // Domain index (1 - 10)
  title: string;
  description: string;
  instructor_id: string;
  instructor_name: string;
  instructor_avatar?: string;
  instructor_bio?: string;
  instructor_role?: string;
  instructor?: string; // For backward compatibility
  students?: number;   // For backward compatibility
  category: CourseCategory;
  level: 'beginner' | 'intermediate' | 'advanced' | string;
  duration_hours: number;
  duration?: string;   // For backward compatibility
  students_count: number;
  rating?: number;
  reviews_count?: number;
  price: number;
  is_free?: boolean;   // Whether course is free
  is_price_tbd?: boolean; // Whether pricing is upon request / TBD
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
  category_id?: string;
  category_name?: string;
  subcategory_id?: string;
  subcategory_name?: string;
  course_area?: string; // Course area (Sub-category e.g. 'Compression and turbomachinery')
  standards?: string[]; // Compliance standards e.g. ISO 18436-2, API 670
  oem_partners?: string[]; // Technology OEM partners e.g. Baker Hughes, Siemens
  award?: string; // Award type e.g. 'Exam prep', 'Certificate of Attendance'
  target_audience?: string[]; // Who should attend sectors/roles
  practical_work?: string[]; // Hands-on exercises and practical work
  class_size?: string; // Recommended class size e.g. 'Up to 16 participants'
  delivery_options?: string; // Delivery format e.g. 'Public session, in-house, online'
}

interface DatabaseCourse {
  id: string;
  code?: string;
  domain_no?: number;
  title: string;
  description: string;
  instructor_id: string;
  instructor?: {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    role?: string;
  };
  category: CourseCategory;
  category_id?: string;
  subcategory_id?: string;
  course_area?: string;
  standards?: string[];
  oem_partners?: string[];
  award?: string;
  target_audience?: string[];
  practical_work?: string[];
  class_size?: string;
  delivery_options?: string;
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
  is_price_tbd?: boolean;
  status?: 'draft' | 'review' | 'published' | 'archived';
  modules?: any[];
  category_data?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory_data?: {
    id: string;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

export const fetchCourseById = async (id: string): Promise<Course | null> => {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabase
      .from('courses')
      .select(`
        *,
        instructor:instructor_id (id, full_name, avatar_url, bio, role),
        modules:modules (
          id,
          title,
          description,
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
        ),
        category_data:course_categories (id, name, slug)
      `);

    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.ilike('code', id);
    }

    const { data, error } = await query
      .order('order_index', { foreignTable: 'modules', ascending: true })
      .maybeSingle();

    if (error) {
      console.error('Error fetching course:', error);
      throw error;
    }

    if (!data) return null;

    const dbCourse = data as unknown as any;

    // Transform the data to match our Course interface
    const course: Course = {
      id: dbCourse.id,
      code: dbCourse.code,
      domain_no: dbCourse.domain_no,
      title: dbCourse.title,
      description: dbCourse.description,
      instructor_id: dbCourse.instructor_id,
      instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
      instructor_avatar: dbCourse.instructor?.avatar_url,
      instructor_bio: dbCourse.instructor?.bio,
      instructor_role: dbCourse.instructor?.role,
      category: (dbCourse.category_data?.name || dbCourse.category) as CourseCategory,
      category_id: dbCourse.category_id,
      category_name: dbCourse.category_data?.name,
      subcategory_id: dbCourse.subcategory_id,
      subcategory_name: dbCourse.subcategory_data?.name || dbCourse.course_area,
      course_area: dbCourse.course_area || dbCourse.subcategory_data?.name,
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
      standards: dbCourse.standards || [],
      oem_partners: dbCourse.oem_partners || [],
      award: dbCourse.award || 'Certificate of Attendance',
      target_audience: dbCourse.target_audience || [],
      practical_work: dbCourse.practical_work || [],
      class_size: dbCourse.class_size,
      delivery_options: dbCourse.delivery_options,
      course_type: dbCourse.course_type || 'online',
      start_date: dbCourse.start_date,
      end_date: dbCourse.end_date,
      is_free: dbCourse.is_free || false,
      is_price_tbd: dbCourse.is_price_tbd ?? (!dbCourse.is_free && (!dbCourse.price || dbCourse.price === 0)),
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
        instructor:instructor_id (id, full_name, avatar_url),
        category_data:course_categories (id, name, slug)
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
        code: dbCourse.code,
        domain_no: dbCourse.domain_no,
        title: dbCourse.title,
        description: dbCourse.description,
        instructor_id: dbCourse.instructor_id,
        instructor_name: dbCourse.instructor?.full_name || 'Unknown Instructor',
        instructor_avatar: dbCourse.instructor?.avatar_url,
        category: (dbCourse.category_data?.name || dbCourse.category) as CourseCategory,
        category_id: (dbCourse as any).category_id,
        category_name: dbCourse.category_data?.name,
        subcategory_id: (dbCourse as any).subcategory_id,
        subcategory_name: (dbCourse as any).subcategory_data?.name || (dbCourse as any).course_area,
        course_area: (dbCourse as any).course_area || (dbCourse as any).subcategory_data?.name,
        standards: (dbCourse as any).standards || [],
        oem_partners: (dbCourse as any).oem_partners || [],
        award: (dbCourse as any).award || 'Certificate of Attendance',
        target_audience: (dbCourse as any).target_audience || [],
        practical_work: (dbCourse as any).practical_work || [],
        class_size: (dbCourse as any).class_size,
        delivery_options: (dbCourse as any).delivery_options,
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
        is_price_tbd: (dbCourse as any).is_price_tbd ?? (!(dbCourse as any).is_free && (!(dbCourse as any).price || (dbCourse as any).price === 0)),
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
        instructor:instructor_id (id, full_name, avatar_url),
        category_data:course_categories (id, name, slug)
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
        category: (dbCourse.category_data?.name || dbCourse.category) as CourseCategory,
        category_id: (dbCourse as any).category_id,
        category_name: dbCourse.category_data?.name,
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
        instructor:instructor_id (id, full_name, avatar_url),
        category_data:course_categories (id, name, slug)
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
        category: (dbCourse.category_data?.name || dbCourse.category) as CourseCategory,
        category_id: (dbCourse as any).category_id,
        category_name: dbCourse.category_data?.name,
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
 * Helper to check if a course date has passed and enrollment should be closed
 */
export const isCourseDatePassed = (course: { start_date?: string | null; end_date?: string | null; course_type?: string | null }): boolean => {
  if (!course) return false;

  const now = new Date();

  // If end_date is provided, check if end_date (end of day) has passed
  if (course.end_date) {
    const endDate = new Date(course.end_date);
    endDate.setHours(23, 59, 59, 999);
    if (endDate < now) return true;
  }

  // If start_date is provided (for onsite/hybrid or scheduled courses)
  if (course.start_date) {
    const startDate = new Date(course.start_date);
    startDate.setHours(23, 59, 59, 999);
    if (startDate < now) return true;
  }

  return false;
};

/**
 * Helper to check if a course's pricing is not set / to be determined (TBD)
 */
export const isCoursePriceTbd = (course?: { is_free?: boolean | null; price?: number | null; is_price_tbd?: boolean | null } | null): boolean => {
  if (!course) return false;
  if (course.is_price_tbd === true) return true;
  if (!course.is_free && (course.price === null || course.price === undefined || course.price === 0)) return true;
  return false;
};

/**
 * Create a new course
 */
export const createCourse = async (courseData: any) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        code: courseData.code,
        domain_no: courseData.domainNo ?? courseData.domain_no,
        title: courseData.title,
        description: courseData.description,
        instructor_id: courseData.instructorId,
        category_id: courseData.categoryId,
        subcategory_id: courseData.subcategoryId ?? courseData.subcategory_id,
        course_area: courseData.courseArea ?? courseData.course_area,
        standards: courseData.standards || [],
        oem_partners: courseData.oemPartners ?? courseData.oem_partners ?? [],
        award: courseData.award || 'Certificate of Attendance',
        target_audience: courseData.targetAudience ?? courseData.target_audience ?? [],
        practical_work: courseData.practicalWork ?? courseData.practical_work ?? [],
        class_size: courseData.classSize ?? courseData.class_size,
        delivery_options: courseData.deliveryOptions ?? courseData.delivery_options,
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


/**
 * COURSES CATEGORIES & SUBCATEGORIES (COURSE AREAS)
 */

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  course_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  domain_no?: number;
  code_prefix?: string;
  parent_id?: string | null;
  subcategories?: Subcategory[];
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('course_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
};

export const fetchSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  try {
    let query = supabase
      .from('course_subcategories')
      .select('*')
      .order('display_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Could not fetch subcategories:', error.message);
      return [];
    }
    return (data || []) as Subcategory[];
  } catch (error) {
    console.warn('Error fetching subcategories:', error);
    return [];
  }
};

export const fetchCategoriesWithSubcategories = async (): Promise<Category[]> => {
  try {
    const [categories, subcategories] = await Promise.all([
      fetchCategories(),
      fetchSubcategories()
    ]);

    return categories.map(cat => ({
      ...cat,
      subcategories: subcategories.filter(sub => sub.category_id === cat.id)
    }));
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    return fetchCategories();
  }
};

export const createCategory = async (category: Partial<Category>) => {
  const { data, error } = await supabase
    .from('course_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const { data, error } = await supabase
    .from('course_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('course_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const createSubcategory = async (subcategory: Partial<Subcategory>) => {
  const { data, error } = await supabase
    .from('course_subcategories')
    .insert([subcategory])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSubcategory = async (id: string, subcategory: Partial<Subcategory>) => {
  const { data, error } = await supabase
    .from('course_subcategories')
    .update(subcategory)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSubcategory = async (id: string) => {
  const { error } = await supabase
    .from('course_subcategories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
