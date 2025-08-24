import { useState, useEffect } from 'react';
import { format, addDays, isToday, isBefore, isAfter, isSameDay, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export interface StudySession {
  id: string;
  title: string;
  courseId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
  completed: boolean;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export const StudySchedule = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    completed: false,
  });
  const { toast } = useToast();

  // Load saved sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('study_sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessions(parsedSessions);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('study_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const addSession = () => {
    if (!newSession.title || !newSession.date || !newSession.startTime || !newSession.endTime) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const session: StudySession = {
      id: Date.now().toString(),
      title: newSession.title,
      date: newSession.date || new Date(),
      startTime: newSession.startTime || '09:00',
      endTime: newSession.endTime || '10:00',
      description: newSession.description || '',
      completed: false,
    };

    setSessions([...sessions, session]);
    setNewSession({
      title: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      completed: false,
    });
    setIsAdding(false);
    
    toast({
      title: 'Session Added',
      description: 'Your study session has been scheduled',
    });
  };

  const removeSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
    toast({
      title: 'Session Removed',
      description: 'The study session has been removed',
    });
  };

  const toggleComplete = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { ...session, completed: !session.completed } 
        : session
    ));
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => isSameDay(new Date(session.date), date));
  };

  const getUpcomingSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date.toISOString().split('T')[0]}T${a.startTime}`);
        const dateB = new Date(`${b.date.toISOString().split('T')[0]}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
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
          <Button 
            size="sm" 
            onClick={() => setIsAdding(!isAdding)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newSession.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSession.date ? (
                          format(newSession.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
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
                    <Select
                      value={newSession.startTime}
                      onValueChange={(value) => setNewSession({ ...newSession, startTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeSlots.map((time) => (
                          <SelectItem key={`start-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={newSession.endTime}
                      onValueChange={(value) => setNewSession({ ...newSession, endTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeSlots
                          .filter(time => 
                            new Date(`1970-01-01T${time}`) > new Date(`1970-01-01T${newSession.startTime}`)
                          )
                          .map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
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
                  value={newSession.description || ''}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                />
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
                  onClick={addSession}
                >
                  Add Session
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                {format(selectedDate, 'MMMM yyyy')}
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                disabled={(date) => isDateInPast(date) && !isToday(date)}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              {getSessionsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 border rounded-lg">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No study sessions scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getSessionsForDate(selectedDate).map((session) => (
                    <div 
                      key={session.id}
                      className={cn(
                        "border rounded-lg p-4 flex justify-between items-start",
                        session.completed && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => toggleComplete(session.id)}
                          className="mt-1"
                        >
                          <CheckCircle2 
                            className={cn(
                              "h-5 w-5",
                              session.completed 
                                ? "text-green-500" 
                                : "text-muted-foreground/30"
                            )} 
                          />
                        </button>
                        <div>
                          <h4 className={cn(
                            "font-medium",
                            session.completed && "line-through text-muted-foreground"
                          )}>
                            {session.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {session.startTime} - {session.endTime}
                          </p>
                          {session.description && (
                            <p className="text-sm mt-1">{session.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeSession(session.id)}
                      >
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
                  <div 
                    key={session.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(session.date, 'EEE, MMM d')} • {session.startTime} - {session.endTime}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Remove session</span>
                      </Button>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDate(new Date(session.date))}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                
                {sessions.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    View All Sessions
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
