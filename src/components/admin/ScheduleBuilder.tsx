import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Clock } from 'lucide-react';
import { OnSiteSession } from '@/types/course.types';

interface ScheduleBuilderProps {
    sessions: OnSiteSession[];
    onSessionsChange: (sessions: OnSiteSession[]) => void;
    courseStartDate?: string;
    courseEndDate?: string;
}

export function ScheduleBuilder({
    sessions,
    onSessionsChange,
    courseStartDate,
    courseEndDate
}: ScheduleBuilderProps) {
    const addSession = () => {
        const newSession: OnSiteSession = {
            date: courseStartDate ? courseStartDate.split('T')[0] : '',
            startTime: '09:00',
            endTime: '17:00',
            sessionTitle: `Session ${sessions.length + 1}`,
        };
        onSessionsChange([...sessions, newSession]);
    };

    const removeSession = (index: number) => {
        onSessionsChange(sessions.filter((_, i) => i !== index));
    };

    const updateSession = (index: number, field: keyof OnSiteSession, value: string) => {
        const updated = [...sessions];
        updated[index] = { ...updated[index], [field]: value };
        onSessionsChange(updated);
    };

    const getDuration = (startTime: string, endTime: string): string => {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const durationMinutes = endMinutes - startMinutes;

        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    };

    // Sort sessions by date and time
    const sortedSessions = [...sessions].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
    });

    return (
        <div className="space-y-4">
            {/* Session Cards */}
            <div className="space-y-3">
                {sortedSessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No sessions added yet</p>
                        <p className="text-xs">Click "Add Session" to create your first session</p>
                    </div>
                ) : (
                    sortedSessions.map((session, index) => {
                        const originalIndex = sessions.findIndex(s => s === session);
                        return (
                            <Card key={originalIndex} className="relative">
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Session Number & Delete */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {new Date(session.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    •  {getDuration(session.startTime, session.endTime)}
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSession(originalIndex)}
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Session Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Date */}
                                            <div className="space-y-1">
                                                <Label className="text-xs">Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={session.date}
                                                    onChange={(e) => updateSession(originalIndex, 'date', e.target.value)}
                                                    min={courseStartDate?.split('T')[0]}
                                                    max={courseEndDate?.split('T')[0]}
                                                />
                                            </div>

                                            {/* Session Title */}
                                            <div className="space-y-1">
                                                <Label className="text-xs">Session Title *</Label>
                                                <Input
                                                    value={session.sessionTitle}
                                                    onChange={(e) => updateSession(originalIndex, 'sessionTitle', e.target.value)}
                                                    placeholder="e.g., Day 1: Fundamentals"
                                                />
                                            </div>

                                            {/* Start Time */}
                                            <div className="space-y-1">
                                                <Label className="text-xs">Start Time *</Label>
                                                <Input
                                                    type="time"
                                                    value={session.startTime}
                                                    onChange={(e) => updateSession(originalIndex, 'startTime', e.target.value)}
                                                />
                                            </div>

                                            {/* End Time */}
                                            <div className="space-y-1">
                                                <Label className="text-xs">End Time *</Label>
                                                <Input
                                                    type="time"
                                                    value={session.endTime}
                                                    onChange={(e) => updateSession(originalIndex, 'endTime', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Add Session Button */}
            <Button
                type="button"
                variant="outline"
                onClick={addSession}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Session
            </Button>

            {/* Summary */}
            {sessions.length > 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                    <p>Total: {sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
                    {sessions.length > 1 && (
                        <p>
                            From {sortedSessions[0].date} to {sortedSessions[sortedSessions.length - 1].date}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
