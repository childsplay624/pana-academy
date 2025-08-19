import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  experience: number;
  progressData: {
    current: number;
    required: number;
    percentage: number;
  };
}

export function LevelProgress({ level, experience, progressData }: LevelProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">Level {level}</span>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {experience.toLocaleString()} XP
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Progress to Level {level + 1}</span>
          <span className="text-muted-foreground">
            {progressData.current} / {progressData.required} XP
          </span>
        </div>
        <Progress value={progressData.percentage} className="h-3" />
        <div className="text-xs text-muted-foreground text-center">
          {progressData.percentage}% complete
        </div>
      </div>
    </div>
  );
}