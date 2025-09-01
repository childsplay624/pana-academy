import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { goalsApi } from '@/lib/api/goals';

interface GoalsFormData {
  weeklyStudyHours: number;
  targetCoursesCompleted: number;
  targetWeeklyStreak: number;
}

export function SetGoalsDialog({ 
  children,
  onGoalsUpdated,
}: { 
  children: React.ReactNode;
  onGoalsUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<GoalsFormData>({
    weeklyStudyHours: 5,
    targetCoursesCompleted: 2,
    targetWeeklyStreak: 7,
  });

  useEffect(() => {
    const loadCurrentGoals = async () => {
      try {
        const currentGoals = await goalsApi.getOrCreateGoals();
        setFormData({
          weeklyStudyHours: currentGoals.weekly_study_hours,
          targetCoursesCompleted: currentGoals.target_courses_completed,
          targetWeeklyStreak: currentGoals.target_weekly_streak,
        });
      } catch (error) {
        console.error('Error loading goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your current goals',
          variant: 'destructive',
        });
      }
    };

    if (open) {
      loadCurrentGoals();
    }
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await goalsApi.updateGoals({
        weekly_study_hours: formData.weeklyStudyHours,
        target_courses_completed: formData.targetCoursesCompleted,
        target_weekly_streak: formData.targetWeeklyStreak,
      });
      
      toast({
        title: 'Success',
        description: 'Your goals have been updated!',
      });
      
      setOpen(false);
      onGoalsUpdated?.();
    } catch (error) {
      console.error('Error updating goals:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your goals. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (key: keyof GoalsFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set Your Study Goals</DialogTitle>
            <DialogDescription>
              Customize your learning targets to stay motivated and track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="weekly-study-hours">Weekly Study Time</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.weeklyStudyHours} hours/week
                  </span>
                </div>
                <Slider
                  id="weekly-study-hours"
                  min={1}
                  max={20}
                  step={0.5}
                  value={[formData.weeklyStudyHours]}
                  onValueChange={(value) => handleSliderChange('weeklyStudyHours', value[0])}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set your target study hours per week
                </p>
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="target-courses">Target Courses to Complete</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.targetCoursesCompleted} course{formData.targetCoursesCompleted !== 1 ? 's' : ''}
                  </span>
                </div>
                <Slider
                  id="target-courses"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.targetCoursesCompleted]}
                  onValueChange={(value) => handleSliderChange('targetCoursesCompleted', value[0])}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set your target number of courses to complete
                </p>
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="weekly-streak">Weekly Study Streak Goal</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.targetWeeklyStreak} day{formData.targetWeeklyStreak !== 1 ? 's' : ''}
                  </span>
                </div>
                <Slider
                  id="weekly-streak"
                  min={1}
                  max={7}
                  step={1}
                  value={[formData.targetWeeklyStreak]}
                  onValueChange={(value) => handleSliderChange('targetWeeklyStreak', value[0])}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set your target study streak in days per week
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Update Goals'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
