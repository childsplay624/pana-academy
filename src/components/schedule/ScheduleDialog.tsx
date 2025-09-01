import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, addHours, parseISO, formatISO } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSchedules } from '@/hooks/useSchedules';
import { useStudentData } from '@/hooks/useStudentData';
import { useToast } from '@/hooks/use-toast';

export function ScheduleDialog({ children }: { children: React.ReactNode }) {
  const { enrolledCourses } = useStudentData();
  const { createSchedule, loading } = useSchedules();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  // Generate time options for select
  useEffect(() => {
    const options = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    setTimeOptions(options);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }

    if (!course.trim()) {
      toast({
        title: 'Error',
        description: 'Please select or enter a course/session title',
        variant: 'destructive',
      });
      return;
    }

    if (!course.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a course or session title',
        variant: 'destructive',
      });
      return;
    }

    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startDate = new Date(date);
      startDate.setHours(startHour, startMinute);
      
      const endDate = new Date(date);
      endDate.setHours(endHour, endMinute);
      
      if (endDate <= startDate) {
        toast({
          title: 'Error',
          description: 'End time must be after start time',
          variant: 'destructive',
        });
        return;
      }

      await createSchedule({
        title: course,
        description: description || undefined,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        course_name: course,
      });
      
      // Reset form
      setCourse('');
      setDescription('');
      setDate(undefined);
      setStartTime('09:00');
      setEndTime('10:00');
      setOpen(false);
    } catch (error) {
      // Error is handled by the useSchedules hook
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule Study Session</DialogTitle>
            <DialogDescription>
              Plan your study session by selecting date and time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="course">Course</Label>
              <div className="space-y-2">
                {enrolledCourses?.length ? (
                  <>
                    <Select onValueChange={setCourse} value={course}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {enrolledCourses.map((course) => (
                          <SelectItem key={course.id} value={course.title}>
                            {course.title}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other (specify)</SelectItem>
                      </SelectContent>
                    </Select>
                    {course === 'other' && (
                      <Input
                        className="mt-2"
                        placeholder="Enter session title"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                      />
                    )}
                  </>
                ) : (
                  <Input
                    id="course"
                    placeholder="e.g., Advanced React"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Start time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-auto">
                    {timeOptions.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>End Time</Label>
                <Select 
                  value={endTime} 
                  onValueChange={setEndTime}
                  disabled={!startTime}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="End time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-auto">
                    {timeOptions
                      .filter(time => !startTime || time > startTime)
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
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || !course.trim() || !date || !startTime || !endTime}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Session'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
