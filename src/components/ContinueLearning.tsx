import { useState } from 'react';
import { Play, ChevronRight, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail?: string | null;
  lastAccessed?: string;
  timeSpent: number;
  category: string;
  totalHours: number;
  image?: string | null;
  instructor_name?: string;
  enrollment_id?: string;
  course_id?: string;
}

interface ContinueLearningProps {
  enrolledCourses: Course[];
  isLoading?: boolean;
}

export function ContinueLearning({ enrolledCourses, isLoading = false }: ContinueLearningProps) {
  const [open, setOpen] = useState(false);

  const handleContinueCourse = (courseId: string) => {
    // Navigate to the course or lesson
    console.log('Continue course:', courseId);
    setOpen(false);
    // TODO: Implement navigation to course/lesson
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm" disabled>
        <Play className="h-5 w-5" />
        <span className="text-xs">Continue Learning</span>
      </Button>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm">
            <Play className="h-5 w-5" />
            <span className="text-xs">Continue Learning</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Enrolled Courses</DialogTitle>
            <DialogDescription>
              You haven't enrolled in any courses yet. Browse our course catalog to get started!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Start your learning journey today
            </p>
            <Button>Browse Courses</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If there's only one enrolled course, continue directly
  if (enrolledCourses.length === 1) {
    const course = enrolledCourses[0];
    return (
      <Button 
        variant="outline" 
        className="h-20 flex flex-col gap-2" 
        size="sm"
        onClick={() => handleContinueCourse(course.id)}
      >
        <Play className="h-5 w-5" />
        <span className="text-xs">Continue Learning</span>
      </Button>
    );
  }

  // If there are multiple courses, show selection dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex flex-col gap-2" size="sm">
          <Play className="h-5 w-5" />
          <span className="text-xs">Continue Learning</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Continue Learning</DialogTitle>
          <DialogDescription>
            Choose a course to continue your learning journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <Card 
              key={course.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleContinueCourse(course.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm mb-1 truncate">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.timeSpent}min spent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{course.totalHours}h total</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}