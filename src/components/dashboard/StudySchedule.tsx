import { useState, useEffect, useCallback } from 'react';
import { format, isSameDay, isBefore, isToday, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { schedulesApi } from '@/lib/api/schedules';

// DB row shape returned by schedulesApi.getSchedules()
interface DbSchedule {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string; // ISO datetime string
  end_time: string;   // ISO datetime string
  course_id: string | null;
  course_name: string | null;
  created_at: string;
  updated_at: string | null;
}

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

// Helpers to convert between local date+time inputs and ISO datetime stored in DB
const toISODateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':');
  const d = new Date(date);
  d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return d.toISOString();
};

const extractTime = (isoString: string): string => {
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const extractDate = (isoString: string): Date => new Date(isoString);

export const StudySchedule = () => {
  const [schedules, setSchedules] = useState<DbSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    description: '',
  });
  const { toast } = useToast();

  const loadSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await schedulesApi.getSchedules();
      setSchedules((data as DbSchedule[]) || []);
    } catch (error: any) {
      console.error('Error loading schedules:', error);
      toast({
        title: 'Error',
        description: 'Could not load your study schedule. Please sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const addSession = async () => {
    if (!newSession.title || !newSession.date || !newSession.startTime || !newSession.endTime) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await schedulesApi.createSchedule({
        title: newSession.title,
        description: newSession.description || null,
        start_time: toISODateTime(newSession.date, newSession.startTime),
        end_time: toISODateTime(newSession.date, newSession.endTime),
        course_id: null,
        course_name: null,
        updated_at: null,
      });

      await loadSchedules();
      setNewSession({ title: '', date: new Date(), startTime: '09:00', endTime: '10:00', description: '' });
      setIsAdding(false);
      toast({ title: 'Session Added', description: 'Your study session has been scheduled' });
    } catch (error: any) {
      console.error('Error adding session:', error);
      toast({ title: 'Error', description: 'Failed to add session. Please try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const removeSession = async (id: string) => {
    try {
      await schedulesApi.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Session Removed', description: 'The study session has been removed' });
    } catch (error: any) {
      console.error('Error removing session:', error);
      toast({ title: 'Error', description: 'Failed to remove session.', variant: 'destructive' });
    }
  };

  const getSessionsForDate = (date: Date) =>
    schedules.filter(s => isSameDay(extractDate(s.start_time), date));

  const getUpcomingSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return schedules
      .filter(s => {
        const d = extractDate(s.start_time);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 3);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) && !isToday(date);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Study Schedule</CardTitle>
            <CardDescription>Plan and track your study sessions</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsAdding(!isAdding)} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add Session Form */}
        {isAdding && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium mb-4">Add Study Session</h4>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="session-title">Title</Label>
                <Input
                  id="session-title"
                  placeholder="e.g., React Hooks Practice"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn('w-full justify-start text-left font-normal', !newSession.date && 'text-muted-foreground')}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSession.date ? format(newSession.date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newSession.date}
                        onSelect={(date) => date && setNewSession({ ...newSession, date })}
                        disabled={(date) => isDateInPast(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>Time</Label>
                  <div className="flex gap-2">
                    <Select value={newSession.startTime} onValueChange={(v) => setNewSession({ ...newSession, startTime: v })}>
                      <SelectTrigger><SelectValue placeholder="Start" /></SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeSlots.map((t) => <SelectItem key={`s-${t}`} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newSession.endTime} onValueChange={(v) => setNewSession({ ...newSession, endTime: v })}>
                      <SelectTrigger><SelectValue placeholder="End" /></SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeSlots
                          .filter(t => new Date(`1970-01-01T${t}`) > new Date(`1970-01-01T${newSession.startTime}`))
                          .map((t) => <SelectItem key={`e-${t}`} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="session-description">Description (Optional)</Label>
                <Input
                  id="session-description"
                  placeholder="What will you be working on?"
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setIsAdding(false)} disabled={isSaving}>Cancel</Button>
                <Button size="sm" onClick={addSession} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Add Session'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">{format(selectedDate, 'MMMM yyyy')}</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
                {getSessionsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No study sessions scheduled for this day</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getSessionsForDate(selectedDate).map((session) => (
                      <div key={session.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 mt-1 text-muted-foreground/30" />
                          <div>
                            <h4 className="font-medium">{session.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {extractTime(session.start_time)} – {extractTime(session.end_time)}
                            </p>
                            {session.description && <p className="text-sm mt-1">{session.description}</p>}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSession(session.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove session</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div>
              <h3 className="text-lg font-medium mb-4">Upcoming Sessions</h3>
              {getUpcomingSessions().length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming study sessions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getUpcomingSessions().map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(extractDate(session.start_time), 'EEE, MMM d')} • {extractTime(session.start_time)} – {extractTime(session.end_time)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSession(session.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDate(extractDate(session.start_time))}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
