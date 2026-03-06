import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ContinueLearningProps {
  enrolledCourses?: any[];
  isLoading?: boolean;
}

export function ContinueLearning({ isLoading = false }: ContinueLearningProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="h-20 flex flex-col gap-2"
      size="sm"
      disabled={isLoading}
      onClick={() => navigate('/my-courses')}
    >
      <Play className="h-5 w-5" />
      <span className="text-xs">Continue Learning</span>
    </Button>
  );
}