import { useState, useEffect, useCallback } from 'react';
import { goalsApi } from '@/lib/api/goals';
import { useToast } from './use-toast';

export type GoalInput = {
  title: string;
  description: string;
  target_date: string;
  status?: 'not_started' | 'in_progress' | 'completed';
};

export function useGoals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await goalsApi.getOrCreateGoals();
      setGoals([data]); // Wrap in array since getOrCreateGoals returns a single goal
      setError(null);
    } catch (err) {
      setError(err as Error);
      toast({
        title: 'Error fetching goals',
        description: 'There was an error loading your goals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createGoal = async (goalData: GoalInput) => {
    try {
      const newGoal = await goalsApi.updateGoals({
        weekly_study_hours: 5, // Default value, adjust as needed
        target_courses_completed: 1, // Default value, adjust as needed
        target_weekly_streak: 7, // Default value, adjust as needed
      });
      setGoals([newGoal]);
      toast({
        title: 'Goal created',
        description: 'Your goal has been successfully created.',
      });
      return newGoal;
    } catch (err) {
      toast({
        title: 'Error creating goal',
        description: 'There was an error creating your goal. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalInput>) => {
    try {
      // Map the generic goal updates to the specific fields expected by the API
      const mappedUpdates: any = {};
      
      if ('title' in updates) {
        // If you need to handle title updates, map them to the appropriate field
        // This is a placeholder - adjust based on your actual needs
        console.log('Title updates not directly supported in this implementation');
      }
      
      const updatedGoal = await goalsApi.updateGoals({
        // Add any other field mappings here
        // For now, just pass through any numeric values that match our API
        ...(updates as any),
      });
      
      setGoals([updatedGoal]);
      toast({
        title: 'Goal updated',
        description: 'Your goal has been successfully updated.',
      });
      return updatedGoal;
    } catch (err) {
      toast({
        title: 'Error updating goal',
        description: 'There was an error updating your goal. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      // Reset goals to default values instead of deleting
      const defaultGoal = await goalsApi.updateGoals({
        weekly_study_hours: 5,
        target_courses_completed: 1,
        target_weekly_streak: 7,
      });
      
      setGoals([defaultGoal]);
      toast({
        title: 'Goal reset',
        description: 'Your goals have been reset to default values.',
      });
    } catch (err) {
      toast({
        title: 'Error resetting goals',
        description: 'There was an error resetting your goals. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refresh: fetchGoals,
  };
}
