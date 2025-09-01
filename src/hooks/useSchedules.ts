import { useState, useEffect, useCallback } from 'react';
import { schedulesApi } from '@/lib/api/schedules';
import { useToast } from './use-toast';

export type ScheduleInput = {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  course_id?: string;
  course_name?: string;
};

export function useSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await schedulesApi.getSchedules();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error fetching schedules',
        description: 'There was an error loading your schedules. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createSchedule = async (scheduleData: ScheduleInput) => {
    try {
      const newSchedule = await schedulesApi.createSchedule(scheduleData);
      setSchedules(prev => [...prev, newSchedule]);
      toast({
        title: 'Schedule created',
        description: 'Your study session has been successfully scheduled.',
      });
      return newSchedule;
    } catch (err) {
      toast({
        title: 'Error creating schedule',
        description: 'There was an error scheduling your session. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<ScheduleInput>) => {
    try {
      const updatedSchedule = await schedulesApi.updateSchedule(id, updates);
      setSchedules(prev =>
        prev.map(schedule => (schedule.id === id ? updatedSchedule : schedule))
      );
      toast({
        title: 'Schedule updated',
        description: 'Your study session has been successfully updated.',
      });
      return updatedSchedule;
    } catch (err) {
      toast({
        title: 'Error updating schedule',
        description: 'There was an error updating your schedule. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await schedulesApi.deleteSchedule(id);
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast({
        title: 'Schedule deleted',
        description: 'Your study session has been successfully deleted.',
      });
    } catch (err) {
      toast({
        title: 'Error deleting schedule',
        description: 'There was an error deleting your schedule. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refresh: fetchSchedules,
  };
}
