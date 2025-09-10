import * as React from "react";
import { addMonths, format, isSameDay, isWithinInterval, parseISO, isToday } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  location: string;
  duration: string;
  capacity: number;
  enrolled: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface TrainingCalendarProps {
  courses: Course[];
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function TrainingCalendar({ courses, onDateSelect, className }: TrainingCalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // Get unique categories
  const categories = React.useMemo(() => {
    return [...new Set(courses.map(course => course.category))];
  }, [courses]);
  
  // Filter courses by selected category
  const filteredCourses = selectedCategory 
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  // Get courses for the current month
  const getCoursesForMonth = (date: Date) => {
    return filteredCourses.filter(course => {
      const courseStart = parseISO(course.startDate);
      const courseEnd = parseISO(course.endDate);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      return (
        (courseStart >= startOfMonth && courseStart <= endOfMonth) ||
        (courseEnd >= startOfMonth && courseEnd <= endOfMonth) ||
        (courseStart <= startOfMonth && courseEnd >= endOfMonth)
      );
    });
  };
  
  // Get badge variant based on course level
  const getLevelVariant = (level: string) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if a date has any courses
  const hasCourses = (day: Date) => {
    return filteredCourses.some(course => {
      const start = parseISO(course.startDate);
      const end = parseISO(course.endDate);
      return isWithinInterval(day, { start, end });
    });
  };

  // Get courses for a specific date
  const getCoursesForDate = (day: Date) => {
    return filteredCourses.filter(course => {
      const start = parseISO(course.startDate);
      const end = parseISO(course.endDate);
      return isWithinInterval(day, { start, end });
    });
  };
  
  // Format time range
  const formatTimeRange = (startDate: string, endDate: string) => {
    return `${format(parseISO(startDate), 'h:mma')} - ${format(parseISO(endDate), 'h:mma')}`;
  };
  
  // Calculate available spots
  const getAvailableSpots = (course: Course) => {
    return course.capacity - course.enrolled;
  };

  // Handle month change
  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
  };

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    return `${format(parseISO(start), 'MMM d')} - ${format(parseISO(end), 'MMM d, yyyy')}`;
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Training Calendar</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse and register for upcoming training programs
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2"
              onClick={() => setMonth(addMonths(month, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[120px] text-center">
              {format(month, 'MMMM yyyy')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-md px-2"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Calendar */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            if (onDateSelect && selectedDate) {
              onDateSelect(selectedDate);
            }
          }}
          month={month}
          onMonthChange={handleMonthChange}
          className="w-full p-0"
          classNames={{
            root: "w-full",
            months: "w-full",
            month: "w-full space-y-4",
            caption: "flex justify-center pt-1 relative items-center mb-4",
            caption_label: "text-base font-semibold text-gray-900 dark:text-white",
            nav: "flex items-center space-x-1",
            nav_button: cn(
              "h-8 w-8 p-0 rounded-md flex items-center justify-center",
              "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
              "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex justify-between mb-2",
            head_cell: "text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider w-10 text-center p-0",
            row: "flex w-full mt-1 justify-between",
            cell: "h-10 w-10 p-0 relative [&:has([aria-selected])]:bg-transparent",
            day: cn(
              "h-10 w-10 p-0 font-normal rounded-md flex items-center justify-center",
              "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            ),
            day_selected: "bg-pana-gold text-white hover:bg-pana-gold/90 hover:text-white",
            day_today: isToday(month) ? "bg-pana-gold/10 text-pana-gold dark:bg-pana-gold/20" : "",
            day_outside: "text-gray-400 dark:text-gray-500",
            day_disabled: "text-gray-300 dark:text-gray-600",
          }}
          components={{
            Day: (props: any) => {
              const day = props.date;
              const dayHasCourses = hasCourses(day);
              const isDayToday = isToday(day);
              
              // Get the className from the props if it exists
              const dayClass = props.className || '';
              
              return (
                <Popover>
                  <PopoverTrigger asChild>
                    <div 
                      {...props}
                      className={cn(
                        "relative h-10 w-10 flex items-center justify-center rounded-md transition-colors",
                        isDayToday && !dayClass.includes('bg-pana-gold') && "bg-pana-gold/10 text-pana-gold dark:bg-pana-gold/20 font-medium",
                        dayHasCourses && "font-semibold text-pana-navy dark:text-white",
                        "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      style={{ margin: 0 }}
                    >
                      {format(day, 'd')}
                      {dayHasCourses && (
                        <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 transform rounded-full bg-pana-gold" />
                      )}
                    </div>
                  </PopoverTrigger>
                  {dayHasCourses && (
                    <PopoverContent className="w-96 p-0" align="start">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {format(day, 'EEEE, MMMM d, yyyy')}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getCoursesForDate(day).length} training program{getCoursesForDate(day).length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {getCoursesForDate(day).map((course) => (
                          <div key={course.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900 dark:text-white">{course.title}</h5>
                                  <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    <span>{formatTimeRange(course.startDate, course.endDate)}</span>
                                  </div>
                                </div>
                                <Badge className={cn("text-xs", getLevelVariant(course.level))}>
                                  {course.level}
                                </Badge>
                              </div>
                              
                              <div className="mt-2 flex flex-wrap gap-2">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{course.location}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <Users className="h-3.5 w-3.5 mr-1" />
                                  <span>{getAvailableSpots(course)}/{course.capacity} spots left</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  )}
                </Popover>
              );
            },
          }}
        />
      </Card>
      
      {/* Upcoming Trainings */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Trainings</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getCoursesForMonth(month).slice(0, 3).map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <Badge className={cn("text-xs", getLevelVariant(course.level))}>
                    {course.level}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                  <span>{format(parseISO(course.startDate), 'MMM d')} - {format(parseISO(course.endDate), 'd, yyyy')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1.5" />
                    <span>{getAvailableSpots(course)} spots left</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
