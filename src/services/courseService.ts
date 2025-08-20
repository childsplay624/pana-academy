import { supabase } from "@/integrations/supabase/client";

type CourseCategory = 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic';

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
  level: 'beginner' | 'intermediate' | 'advanced' | string; // Make level more flexible
  duration_hours: number;
  duration?: string;   // For backward compatibility
  students_count: number;
  rating?: number;
  price: number;
  thumbnail_url?: string;
  learning_outcomes: string[];
  modules: Module[];
  created_at: string;
  updated_at: string;
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
        instructor:instructor_id (id, full_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course:', error);
      throw error;
    }

    if (!data) return null;

    const dbCourse = data as unknown as DatabaseCourse;

    // Transform the data to match our Course interface
    const course: Course = {
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
      modules: dbCourse.modules || [],
      created_at: dbCourse.created_at,
      updated_at: dbCourse.updated_at
    };

    return course;
  } catch (error) {
    console.error('Error in fetchCourseById:', error);
    throw error; // Re-throw to handle in the component
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
        updated_at: dbCourse.updated_at
      };
    });
  } catch (error) {
    console.error('Error in fetchAllCourses:', error);
    throw error; // Re-throw to handle in the component
  }
};
