import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Target, Calendar, Clock, BookOpen, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  type: 'weekly_hours' | 'courses_complete' | 'certificates' | 'streak_days' | 'custom';
  target: number;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  description?: string;
}

interface SetGoalsDialogProps {
  children: React.ReactNode;
}

export function SetGoalsDialog({ children }: SetGoalsDialogProps) {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState<Goal>({
    type: 'weekly_hours',
    target: 5,
    timeframe: 'week'
  });
  const { toast } = useToast();

  const goalTypes = [
    { value: 'weekly_hours', label: 'Study Hours', icon: Clock },
    { value: 'courses_complete', label: 'Complete Courses', icon: BookOpen },
    { value: 'certificates', label: 'Earn Certificates', icon: Trophy },
    { value: 'streak_days', label: 'Study Streak', icon: Target },
    { value: 'custom', label: 'Custom Goal', icon: Target }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const handleSaveGoal = () => {
    // Here you would typically save to your backend/database
    toast({
      title: "Goal Set Successfully!",
      description: `Your ${goalTypes.find(t => t.value === goal.type)?.label.toLowerCase()} goal has been set.`,
    });
    setOpen(false);
  };

  const getGoalDescription = () => {
    const typeLabel = goalTypes.find(t => t.value === goal.type)?.label;
    const timeframeLabel = timeframes.find(t => t.value === goal.timeframe)?.label;
    
    if (goal.type === 'weekly_hours') {
      return `Study for ${goal.target} hours ${goal.timeframe === 'week' ? 'this week' : timeframeLabel?.toLowerCase()}`;
    }
    if (goal.type === 'courses_complete') {
      return `Complete ${goal.target} ${goal.target === 1 ? 'course' : 'courses'} ${timeframeLabel?.toLowerCase()}`;
    }
    if (goal.type === 'certificates') {
      return `Earn ${goal.target} ${goal.target === 1 ? 'certificate' : 'certificates'} ${timeframeLabel?.toLowerCase()}`;
    }
    if (goal.type === 'streak_days') {
      return `Maintain a ${goal.target}-day study streak`;
    }
    return goal.description || 'Custom learning goal';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Learning Goal
          </DialogTitle>
          <DialogDescription>
            Set a specific goal to track your learning progress and stay motivated.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goal-type">Goal Type</Label>
            <Select value={goal.type} onValueChange={(value) => setGoal(prev => ({ ...prev, type: value as Goal['type'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goalTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={goal.target}
                onChange={(e) => setGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
              />
            </div>
            
            {goal.type !== 'streak_days' && (
              <div className="grid gap-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={goal.timeframe} onValueChange={(value) => setGoal(prev => ({ ...prev, timeframe: value as Goal['timeframe'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map((timeframe) => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {goal.type === 'custom' && (
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your custom learning goal..."
                value={goal.description || ''}
                onChange={(e) => setGoal(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Goal Summary</h4>
            <p className="text-sm text-muted-foreground">{getGoalDescription()}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveGoal}>
            Set Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}