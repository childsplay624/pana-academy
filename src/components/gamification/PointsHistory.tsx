import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Trophy, 
  FileText, 
  CheckCircle, 
  Plus,
  Minus,
  Clock
} from 'lucide-react';

interface PointsEntry {
  id: string;
  points: number;
  action_type: string;
  description: string | null;
  created_at: string;
}

interface PointsHistoryProps {
  history: PointsEntry[];
}

export function PointsHistory({ history }: PointsHistoryProps) {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'lesson_completed':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'quiz_passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'assignment_submitted':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'badge_earned':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Plus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'lesson_completed':
        return 'text-blue-600';
      case 'quiz_passed':
        return 'text-green-600';
      case 'assignment_submitted':
        return 'text-purple-600';
      case 'badge_earned':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {getActionIcon(entry.action_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">
                      {entry.description || formatActionType(entry.action_type)}
                    </p>
                    <Badge 
                      variant={entry.points > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {entry.points > 0 ? '+' : ''}{entry.points} pts
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.created_at)}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {entry.points > 0 ? (
                    <Plus className="h-4 w-4 text-green-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
            
            {history.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
                <p className="text-sm">Start learning to earn points!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}