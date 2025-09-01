import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

type Schedule = Database['public']['Tables']['schedules']['Insert'];

export const schedulesApi = {
  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'created_at' | 'user_id'>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([{ ...scheduleData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async getSchedules() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  },

  async updateSchedule(id: string, updates: Partial<Schedule>) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async deleteSchedule(id: string) {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};
