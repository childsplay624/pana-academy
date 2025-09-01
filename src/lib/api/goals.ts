import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type StudySessionInsert = Omit<Database['public']['Tables']['study_sessions']['Insert'], 'id' | 'user_id' | 'created_at'>;
type StudySession = Database['public']['Tables']['study_sessions']['Row'];
type Goal = Database['public']['Tables']['student_goals']['Row'];
type Progress = Database['public']['Tables']['student_progress']['Row'];
type Streak = Database['public']['Tables']['study_streaks']['Row'];

interface StudyStatistics {
  totalMinutesThisWeek: number;
  completedCourses: number;
  currentStreak: number;
}

interface UpdateGoalsParams {
  weekly_study_hours?: number;
  target_courses_completed?: number;
  target_weekly_streak?: number;
}

export const goalsApi = {
  // Get or create user goals with default values
  async getOrCreateGoals() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Try to get existing goals
    const { data, error } = await supabase
      .from('student_goals')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // If no goals exist, create default ones
    if (!data) {
      const defaultGoals = {
        user_id: user.id,
        weekly_study_hours: 5,
        target_courses_completed: 2,
        target_weekly_streak: 7,
      };

      const { data: newGoals, error: createError } = await supabase
        .from('student_goals')
        .insert([defaultGoals])
        .select()
        .single();

      if (createError) {
        throw createError;
      }
      return newGoals;
    }

    return data;
  },

  // Update user goals
  async updateGoals(updates: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('student_goals')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Record a study session
  async recordStudySession(session: StudySessionInsert): Promise<StudySession> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .insert([{ ...session, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // Get study statistics
  async getStudyStatistics(): Promise<StudyStatistics> {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        throw new Error('User not authenticated. Please sign in again.');
      }

      // Get total study time this week
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of current week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);

      console.log('Fetching study sessions for user:', user.id);
      const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('created_at', startOfWeek.toISOString());

      if (sessionsError) {
        console.error('Error fetching study sessions:', sessionsError);
        throw new Error(`Failed to load study sessions: ${sessionsError.message}`);
      }

      console.log('Found study sessions:', sessions);
      const totalMinutesThisWeek = sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);

      // Get completed courses count
      console.log('Fetching completed courses for user:', user.id);
      const { data: progress, error: progressError } = await supabase
        .from('student_progress')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      if (progressError) {
        console.error('Error fetching completed courses:', progressError);
        throw new Error(`Failed to load completed courses: ${progressError.message}`);
      }
      console.log('Found completed courses:', progress?.length || 0);

      // Get current streak
      const currentStreak = await this.getCurrentStreak();
      console.log('Current streak:', currentStreak);
      
      return {
        totalMinutesThisWeek,
        completedCourses: progress?.length || 0,
        currentStreak,
      };
    } catch (error) {
      console.error('Error in getStudyStatistics:', error);
      throw new Error(error.message || 'Failed to load study statistics');
    }
  },

  // Get current streak
  async getCurrentStreak(): Promise<number> {
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error in getCurrentStreak:', authError);
        throw new Error('User not authenticated');
      }

      console.log('Fetching current streak for user:', user.id);
      const { data: streak, error } = await supabase
        .from('study_streaks')
        .select('current_streak_days')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          console.log('No streak record found for user, defaulting to 0');
          return 0;
        }
        console.error('Database error in getCurrentStreak:', error);
        throw new Error(`Failed to load streak data: ${error.message}`);
      }

      console.log('Current streak days:', streak?.current_streak_days || 0);
      return streak?.current_streak_days || 0;
    } catch (error) {
      console.error('Error in getCurrentStreak:', error);
      return 0; // Return 0 as fallback
    }
  },

  // Update course progress
  async updateCourseProgress(courseId: string, progress: number): Promise<Progress> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('student_progress')
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          completion_percentage: Math.min(100, Math.max(0, progress)),
          is_completed: progress >= 100,
          last_accessed: new Date().toISOString(),
        },
        { 
          onConflict: 'user_id,course_id',
          ignoreDuplicates: false 
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },
};
