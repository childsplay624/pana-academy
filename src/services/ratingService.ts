import { supabase } from '@/integrations/supabase/client';

export interface CourseRating {
  id?: string;
  user_id: string;
  course_id: string;
  rating: number;
  review?: string;
  created_at?: string;
  updated_at?: string;
}

export const submitCourseRating = async (ratingData: Omit<CourseRating, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('course_ratings')
    .upsert(
      { 
        user_id: ratingData.user_id,
        course_id: ratingData.course_id,
        rating: ratingData.rating,
        review: ratingData.review,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,course_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTopRatedCourses = async (limit: number = 5) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const getUserRating = async (userId: string, courseId: string) => {
  const { data, error } = await supabase
    .from('course_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" errors
  return data || null;
};