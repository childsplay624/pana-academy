import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import {
    getUpcomingDeadlines,
    DeadlineWithCourse,
    getDeadlineUrgency,
    formatDeadlineTime
} from '@/services/deadlineService';

export const DeadlinesWidget: React.FC = () => {
    const { user } = useAuth();
    const [deadlines, setDeadlines] = useState<DeadlineWithCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDeadlines();
        }
    }, [user]);

    const loadDeadlines = async () => {
        if (!user) return;

        setIsLoading(true);
        const data = await getUpcomingDeadlines(user.id, 5);
        setDeadlines(data);
        setIsLoading(false);
    };

    const getUrgencyBadgeVariant = (urgency: string) => {
        switch (urgency) {
            case 'overdue':
                return 'destructive';
            case 'urgent':
                return 'destructive';
            case 'soon':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'assignment':
                return '📝';
            case 'quiz':
                return '❓';
            case 'project':
                return '🎯';
            case 'live_session':
                return '🎥';
            case 'exam':
                return '📋';
            default:
                return '📌';
        }
    };

    const getTypeLabel = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Upcoming Deadlines
                        </CardTitle>
                        <CardDescription>
                            Stay on track with your assignments and quizzes
                        </CardDescription>
                    </div>
                    {deadlines.length > 0 && (
                        <Badge variant="outline" className="ml-2">
                            {deadlines.length} pending
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                ) : deadlines.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-sm font-medium">All caught up!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            No upcoming deadlines at the moment
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deadlines.map(deadline => {
                            const urgency = getDeadlineUrgency(deadline.daysUntilDue);
                            const isCompleted = deadline.userSubmission?.completed || false;

                            return (
                                <div
                                    key={deadline.id}
                                    className={`flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors ${isCompleted ? 'opacity-60' : ''
                                        }`}
                                >
                                    <div className="flex-1 min-w-0 mr-3">
                                        {/* Type and Urgency Badges */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                {getTypeIcon(deadline.type)} {getTypeLabel(deadline.type)}
                                            </Badge>
                                            {!isCompleted && (
                                                <Badge variant={getUrgencyBadgeVariant(urgency)}>
                                                    {urgency === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                                                    {urgency === 'urgent' && <Clock className="h-3 w-3 mr-1" />}
                                                    {formatDeadlineTime(deadline.daysUntilDue)}
                                                </Badge>
                                            )}
                                            {isCompleted && (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Submitted
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Title and Course */}
                                        <p className="font-medium text-sm truncate mb-1">
                                            {deadline.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {deadline.courseTitle}
                                            {deadline.moduleName && ` • ${deadline.moduleName}`}
                                        </p>

                                        {/* Points */}
                                        {deadline.points > 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Worth {deadline.points} points
                                                {deadline.userSubmission?.score !== undefined &&
                                                    ` • Score: ${deadline.userSubmission.score}/${deadline.points}`
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Button size="sm" variant="ghost" className="flex-shrink-0">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {deadlines.length > 0 && (
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                        View All Deadlines <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
