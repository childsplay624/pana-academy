import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useToast } from '@/components/ui/use-toast';

interface LessonProgressProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  durationSeconds?: number;
  onComplete?: () => void;
  className?: string;
}

export function LessonProgress({
  courseId,
  moduleId,
  lessonId,
  durationSeconds = 0,
  onComplete,
  className = '',
}: LessonProgressProps) {
  const { toast } = useToast();
  const {
    progress,
    trackProgress,
    isOnline,
    offlineProgressCount,
  } = useCourseProgress(courseId);
  
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [viewedDuration, setViewedDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Format time in seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Track viewing time
  useEffect(() => {
    if (isCompleted || !durationSeconds) return;
    
    const interval = setInterval(() => {
      setViewedDuration(prev => {
        const newDuration = prev + 1;
        
        // Auto-save progress every 30 seconds or when 80% of video is watched
        if (newDuration % 30 === 0 || (durationSeconds > 0 && newDuration >= durationSeconds * 0.8)) {
          trackProgress({
            courseId,
            moduleId,
            lessonId,
            completed: newDuration >= durationSeconds * 0.8 ? true : false,
            timeSpentSeconds: 30, // We're updating every 30 seconds
          });
        }
        
        return newDuration;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [courseId, moduleId, lessonId, durationSeconds, isCompleted, trackProgress]);
  
  // Check if lesson is already completed
  useEffect(() => {
    if (!progress?.details) return;
    
    const lessonProgress = progress.details.find(
      p => p.lesson_id === lessonId && p.course_id === courseId
    );
    
    if (lessonProgress?.completed) {
      setIsCompleted(true);
      setViewedDuration(lessonProgress.time_spent_seconds || 0);
    }
  }, [progress, courseId, lessonId]);
  
  const handleMarkComplete = async () => {
    if (isCompleted) return;
    
    setIsMarkingComplete(true);
    
    try {
      await trackProgress({
        courseId,
        moduleId,
        lessonId,
        completed: true,
        timeSpentSeconds: Math.max(30, viewedDuration), // Ensure minimum 30s for completion
      });
      
      setIsCompleted(true);
      onComplete?.();
      
      toast({
        title: 'Lesson completed!',
        description: 'Great job! Your progress has been saved.',
      });
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress. Your progress will be saved locally and synced later.',
        variant: 'destructive',
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };
  
  const completionPercentage = durationSeconds > 0 
    ? Math.min(100, Math.round((viewedDuration / durationSeconds) * 100))
    : 0;
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">
            {isCompleted ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </span>
            ) : (
              <span className="flex items-center text-amber-600">
                <Clock className="w-4 h-4 mr-1" />
                In Progress
              </span>
            )}
          </div>
          
          {!isOnline && (
            <span className="flex items-center text-xs text-muted-foreground">
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Mode
            </span>
          )}
          
          {offlineProgressCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {offlineProgressCount} {offlineProgressCount === 1 ? 'update' : 'updates'} pending sync
            </span>
          )}
        </div>
        
        {durationSeconds > 0 && (
          <div className="text-xs text-muted-foreground">
            {formatTime(viewedDuration)} / {formatTime(durationSeconds)}
          </div>
        )}
      </div>
      
      <Progress 
        value={isCompleted ? 100 : completionPercentage} 
        className="h-2"
        indicatorClassName={isCompleted ? 'bg-green-500' : 'bg-primary'}
      />
      
      {!isCompleted && (
        <div className="flex justify-end">
          <Button 
            onClick={handleMarkComplete}
            disabled={isMarkingComplete}
            className="ml-auto"
          >
            {isMarkingComplete ? 'Saving...' : 'Mark as Complete'}
          </Button>
        </div>
      )}
    </div>
  );
}
