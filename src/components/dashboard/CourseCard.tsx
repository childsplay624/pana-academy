import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail?: string | null;
  lastAccessed?: string;
  isNew?: boolean;
  isTrending?: boolean;
  timeSpent?: number;
  totalHours?: number;
  className?: string;
  nextLesson?: {
    id: string;
    title: string;
    moduleName: string;
  } | null;
  enrollmentId?: string;
}

export function CourseCard({
  id,
  title,
  instructor,
  progress,
  thumbnail,
  lastAccessed,
  isNew,
  isTrending,
  timeSpent = 0,
  totalHours = 0,
  className,
  nextLesson,
  enrollmentId
}: CourseCardProps) {
  const formatLastAccessed = (date?: string) => {
    if (!date) return 'Never accessed';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card className={cn("group hover:shadow-md transition-all duration-200 cursor-pointer", className)}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/5 h-40">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
            {isTrending && <Badge variant="outline" className="text-xs">Trending</Badge>}
          </div>

          {/* Progress overlay */}
          {progress > 0 && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{instructor}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Course stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeSpent ? formatTimeSpent(timeSpent) : `${totalHours}h total`}</span>
          </div>
          <span>Last: {formatLastAccessed(lastAccessed)}</span>
        </div>

        {/* Next Lesson Info */}
        {nextLesson && progress > 0 && progress < 100 && (
          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Next up:</p>
            <p className="text-sm font-medium truncate">{nextLesson.title}</p>
            <p className="text-xs text-muted-foreground truncate">{nextLesson.moduleName}</p>
          </div>
        )}

        {/* Completed Badge */}
        {progress === 100 && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </div>
        )}

        {/* Action button */}
        <Button
          size="sm"
          className="w-full"
          variant={progress === 100 ? "outline" : "default"}
          asChild
        >
          <Link to={nextLesson && progress > 0 && progress < 100
            ? `/course/${id}/learn?lesson=${nextLesson.id}`
            : `/course/${id}`
          }>
            <Play className="h-3 w-3 mr-1" />
            {progress === 100
              ? 'Review Course'
              : progress > 0
                ? `Resume${nextLesson ? `: ${nextLesson.title.slice(0, 20)}${nextLesson.title.length > 20 ? '...' : ''}` : ''}`
                : 'Start Course'
            }
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}