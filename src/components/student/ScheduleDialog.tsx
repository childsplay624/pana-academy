import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Repeat, BookOpen, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface StudySession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  days: string[];
  courseId?: string;
  type: 'study' | 'review' | 'practice' | 'custom';
}

interface ScheduleDialogProps {
  children: React.ReactNode;
}

const daysOfWeek = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];

const sessionTypes = [
  { value: 'study', label: 'Study Session', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'Review', color: 'bg-green-100 text-green-800' },
  { value: 'practice', label: 'Practice', color: 'bg-orange-100 text-orange-800' },
  { value: 'custom', label: 'Custom', color: 'bg-purple-100 text-purple-800' }
];

export function ScheduleDialog({ children }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [newSession, setNewSession] = useState<Omit<StudySession, 'id'>>({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    days: [],
    type: 'study'
  });
  const { toast } = useToast();

  const handleAddSession = () => {
    if (!newSession.title || newSession.days.length === 0) {
      toast({
        title: "Incomplete Session",
        description: "Please fill in the session title and select at least one day.",
        variant: "destructive"
      });
      return;
    }

    const session: StudySession = {
      ...newSession,
      id: Date.now().toString()
    };
    
    setSessions(prev => [...prev, session]);
    setNewSession({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      days: [],
      type: 'study'
    });
  };

  const handleRemoveSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    setNewSession(prev => ({
      ...prev,
      days: checked 
        ? [...prev.days, day]
        : prev.days.filter(d => d !== day)
    }));
  };

  const handleSaveSchedule = () => {
    // Here you would typically save to your backend/database
    toast({
      title: "Schedule Saved!",
      description: `${sessions.length} study sessions have been scheduled.`,
    });
    setOpen(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Study Schedule
          </DialogTitle>
          <DialogDescription>
            Create a personalized study schedule to stay consistent with your learning.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Add New Session */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Study Session
            </h4>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input
                    id="session-title"
                    placeholder="e.g., Morning React Study"
                    value={newSession.title}
                    onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-type">Type</Label>
                  <Select value={newSession.type} onValueChange={(value) => setNewSession(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={newSession.days.includes(day.value)}
                        onCheckedChange={(checked) => handleDayToggle(day.value, !!checked)}
                      />
                      <Label htmlFor={day.value} className="text-sm font-normal">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleAddSession} className="w-full">
                Add Session
              </Button>
            </div>
          </div>

          {/* Scheduled Sessions */}
          {sessions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Scheduled Sessions ({sessions.length})
              </h4>
              
              {sessions.map((session) => {
                const sessionType = sessionTypes.find(t => t.value === session.type);
                return (
                  <div key={session.id} className="border rounded-lg p-4 bg-background">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{session.title}</h5>
                        <Badge variant="secondary" className={sessionType?.color}>
                          {sessionType?.label}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSession(session.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.days.map(day => daysOfWeek.find(d => d.value === day)?.label).join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No study sessions scheduled yet.</p>
              <p className="text-sm">Add your first session above to get started.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSchedule} disabled={sessions.length === 0}>
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}