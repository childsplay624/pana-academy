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
  try {
    // First, get the average rating for each course
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('course_ratings')
      .select('course_id, rating')
      .not('rating', 'is', null);

    if (ratingsError) {
      console.error('Error fetching course ratings:', ratingsError);
      throw new Error('Failed to fetch course ratings');
    }

    // If no ratings yet, return an empty array
    if (!ratingsData || ratingsData.length === 0) {
      console.log('No course ratings found');
      return [];
    }

    // Calculate average rating for each course
    const courseAverages = ratingsData.reduce((acc, { course_id, rating }) => {
      if (!acc[course_id]) {
        acc[course_id] = { sum: 0, count: 0 };
      }
      acc[course_id].sum += rating;
      acc[course_id].count += 1;
      return acc;
    }, {} as Record<string, { sum: number; count: number }>);

    // Convert to array of { course_id, average_rating }
    const courseAveragesArray = Object.entries(courseAverages).map(([course_id, { sum, count }]) => ({
      course_id,
      average_rating: sum / count
    }));

    // Sort by average rating (highest first)
    courseAveragesArray.sort((a, b) => b.average_rating - a.average_rating);
    
    // Get the top N course IDs
    const topCourseIds = courseAveragesArray.slice(0, limit).map(item => item.course_id);

    // If no courses with ratings, return empty array
    if (topCourseIds.length === 0) {
      return [];
    }

    // Fetch the full course details for these courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .in('id', topCourseIds);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      throw new Error('Failed to fetch course details');
    }

    // If no courses found, return empty array
    if (!coursesData || coursesData.length === 0) {
      return [];
    }

    // Map the average ratings back to the courses
    const coursesWithRatings = coursesData.map(course => ({
      ...course,
      rating: courseAveragesArray.find(avg => avg.course_id === course.id)?.average_rating || 0
    }));

    // Sort by the original order of topCourseIds to maintain the rating order
    return topCourseIds
      .map(courseId => coursesWithRatings.find(c => c.id === courseId))
      .filter((course): course is typeof course & { rating: number } => course !== undefined);
  } catch (error) {
    console.error('Error in getTopRatedCourses:', error);
    throw error; // Re-throw to be handled by the component
  }
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