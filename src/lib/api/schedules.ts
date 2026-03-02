import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';

type Schedule = Database['public']['Tables']['schedules']['Insert'];

export const schedulesApi = {
  async createSchedule(scheduleData: Omit<Schedule, 'id' | 'created_at' | 'user_id'>) {
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

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
};
