import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trophy, Trash2, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface Goal {
  id: string;
  title: string;
  type: 'course' | 'time' | 'certificate' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
}

export const SetGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    type: 'time',
    target: 0,
    unit: 'hours',
  });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('student_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('student_goals', JSON.stringify(goals));
    }
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      type: newGoal.type || 'custom',
      target: Number(newGoal.target) || 0,
      current: 0,
      unit: newGoal.unit || '',
      deadline: newGoal.deadline,
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', type: 'time', target: 0, unit: 'hours' });
    setIsAdding(false);
    
    toast({
      title: 'Goal Added',
      description: 'Your new goal has been added successfully',
    });
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: 'Goal Removed',
      description: 'The goal has been removed',
    });
  };

  const updateProgress = (id: string, increment: boolean = true) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newCurrent = increment 
          ? Math.min(goal.current + 1, goal.target)
          : Math.max(0, goal.current - 1);
        return { ...goal, current: newCurrent };
      }
      return goal;
    }));
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      case 'time':
        return <span className="text-blue-500">⏱️</span>;
      case 'certificate':
        return <Award className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Learning Goals</CardTitle>
            <CardDescription>Set and track your learning objectives</CardDescription>
          </div>
          <Button 
            size="sm" 
            onClick={() => setIsAdding(!isAdding)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium mb-4">Add New Goal</h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Complete React Course"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-type">Type</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={(value: Goal['type']) => setNewGoal({ ...newGoal, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Study Time</SelectItem>
                      <SelectItem value="course">Course Completion</SelectItem>
                      <SelectItem value="certificate">Earn Certificate</SelectItem>
                      <SelectItem value="custom">Custom Goal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="goal-target">
                    {newGoal.type === 'time' ? 'Hours' : 'Target'}
                  </Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min="1"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddGoal}
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">No goals yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by adding your first learning goal.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              
              return (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getGoalIcon(goal.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {goal.current} of {goal.target} {goal.unit}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Remove goal</span>
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{Math.round(progress)}% Complete</span>
                      <span>{goal.current}/{goal.target} {goal.unit}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex justify-between mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateProgress(goal.id, false)}
                        disabled={goal.current <= 0}
                      >
                        -
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateProgress(goal.id, true)}
                        disabled={goal.current >= goal.target}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
