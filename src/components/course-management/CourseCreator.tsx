import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleManager } from './ModuleManager';
import { DashboardLayout } from '@/components/DashboardLayout';

interface Course {
  id?: string;
  title: string;
  description: string;
  category: 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic';
  price: number;
  duration_hours: number;
  level: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  thumbnail_url?: string;
  instructor_id: string;
  course_type: 'self_paced' | 'live';
  zoom_meeting_id?: string;
  scheduled_date?: string;
  start_date?: string; // For both course types, but required for live courses
  is_free: boolean;
}

export default function CourseCreator() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [courseId, setCourseId] = useState<string | null>(null);
  
  const [course, setCourse] = useState<Course>({
    title: '',
    description: '',
    category: 'technology',
    price: 0,
    duration_hours: 1,
    level: 'beginner',
    status: 'draft',
    thumbnail_url: '',
    instructor_id: user?.id || '',
    course_type: 'self_paced',
    zoom_meeting_id: '',
    scheduled_date: '',
    start_date: new Date().toISOString().split('T')[0], // Default to today's date
    is_free: false
  });

  const saveCourse = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive"
      });
      return;
    }

    if (!course.title.trim()) {
      toast({
        title: "Error",
        description: "Course title is required",
        variant: "destructive"
      });
      return;
    }

    if (course.course_type === 'live' && !course.start_date) {
      toast({
        title: "Error",
        description: "Start date is required for live courses",
        variant: "destructive"
      });
      return;
    }

    // If course is free, set price to 0
    const courseData = {
      ...course,
      price: course.is_free ? 0 : course.price,
      // Convert empty string to null for database
      start_date: course.start_date || null,
      scheduled_date: course.scheduled_date || null
    };

    setSaving(true);
    
    try {
      let updatedCourse = { ...course };

      // If this is a live course and we don't have a meeting ID, create one
      if (course.course_type === 'live' && !course.zoom_meeting_id && course.scheduled_date) {
        try {
          const { data: meetingData, error: meetingError } = await supabase.functions.invoke('create-zoom-meeting', {
            body: {
              topic: course.title,
              start_time: new Date(course.scheduled_date).toISOString(),
              duration: course.duration_hours * 60, // Convert hours to minutes
              description: course.description
            }
          });

          if (meetingError) throw meetingError;

          if (meetingData?.success) {
            updatedCourse.zoom_meeting_id = meetingData.meeting_id;
            setCourse(prev => ({ ...prev, zoom_meeting_id: meetingData.meeting_id }));
            
            toast({
              title: "Zoom meeting created",
              description: `Meeting ID: ${meetingData.meeting_id}`,
            });
          }
        } catch (error) {
          console.error('Error creating Zoom meeting:', error);
          toast({
            title: "Warning",
            description: "Course saved but Zoom meeting creation failed. Please check your Zoom settings.",
            variant: "destructive"
          });
        }
      }

      if (courseId) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: updatedCourse.title,
            description: updatedCourse.description,
            category: updatedCourse.category,
            price: courseData.price, // Use the potentially adjusted price
            duration_hours: updatedCourse.duration_hours,
            level: updatedCourse.level,
            status: updatedCourse.status,
            thumbnail_url: updatedCourse.thumbnail_url,
            course_type: updatedCourse.course_type,
            zoom_meeting_id: updatedCourse.zoom_meeting_id || null,
            scheduled_date: updatedCourse.scheduled_date || null,
            start_date: courseData.start_date,
            is_free: courseData.is_free
          })
          .eq('id', courseId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully"
        });
      } else {
        // Create new course with all required fields
        const newCourse = {
          title: updatedCourse.title,
          description: updatedCourse.description || '',
          category: updatedCourse.category,
          instructor_id: user.id,
          price: courseData.price,
          status: updatedCourse.status,
          thumbnail_url: updatedCourse.thumbnail_url || '',
          duration_hours: updatedCourse.duration_hours,
          level: updatedCourse.level,
          requirements: [],
          learning_outcomes: [],
          // Additional fields from the form
          course_type: updatedCourse.course_type,
          zoom_meeting_id: updatedCourse.zoom_meeting_id || null,
          scheduled_date: updatedCourse.scheduled_date || null,
          start_date: courseData.start_date,
          is_free: courseData.is_free
        };

        console.log('Creating course with data:', newCourse);

        const { data, error } = await supabase
          .from('courses')
          .insert(newCourse)
          .select()
          .single();

        if (error) throw error;
        
        setCourseId(data.id);
        toast({
          title: "Success",
          description: "Course created successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const canEdit = true; // User is creating/editing their own course

  return (
    <DashboardLayout>
      <div className="bg-background">{/* Removed min-h-screen as it's handled by CourseLayout */}
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/courses')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {courseId ? 'Edit Course' : 'Create New Course'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {course.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveCourse}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : courseId ? 'Update' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content" disabled={!courseId}>
              Content & Modules
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic course information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Title *</label>
                    <Input
                      value={course.title}
                      onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter course title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={course.category}
                      onValueChange={(value: Course['category']) => setCourse(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="language">Language</SelectItem>
                        <SelectItem value="personal_development">Personal Development</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={course.description}
                    onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    placeholder="Describe what students will learn in this course"
                  />
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Course Type
                      </label>
                      <Select
                        value={course.course_type}
                        onValueChange={(value: 'self_paced' | 'live') =>
                          setCourse({ ...course, course_type: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self_paced">Self-Paced</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {course.course_type === 'live' ? 'Start Date & Time' : 'Start Date (Optional)'}
                      </label>
                      <Input
                        type={course.course_type === 'live' ? 'datetime-local' : 'date'}
                        value={course.start_date || ''}
                        onChange={(e) => setCourse({ ...course, start_date: e.target.value })}
                        required={course.course_type === 'live'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.course_type === 'live' && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Zoom Meeting ID (Optional)
                        </label>
                        <Input
                          value={course.zoom_meeting_id || ''}
                          onChange={(e) => setCourse(prev => ({ ...prev, zoom_meeting_id: e.target.value }))}
                          placeholder="Enter Zoom Meeting ID"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="is_free"
                        checked={course.is_free}
                        onChange={(e) => {
                          const isFree = e.target.checked;
                          setCourse({
                            ...course,
                            is_free: isFree,
                            price: isFree ? 0 : course.price
                          });
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-pana-navy focus:ring-pana-navy"
                      />
                      <label htmlFor="is_free" className="text-sm font-medium text-foreground">
                        This is a free course
                      </label>
                    </div>
                  </div>

                  {!course.is_free && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₦)</label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={course.price}
                          onChange={(e) => {
                            // Only allow numbers and convert to number
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setCourse(prev => ({ ...prev, price: Number(value) || 0 }));
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (hours)</label>
                      <Input
                        type="number"
                        value={course.duration_hours}
                        onChange={(e) => setCourse(prev => ({ ...prev, duration_hours: Number(e.target.value) }))}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Level</label>
                      <Select
                        value={course.level}
                        onValueChange={(value) => setCourse(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="all_levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {courseId ? (
              <ModuleManager courseId={courseId} canEdit={canEdit} />
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Save the course details first to add content and modules
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Configure course visibility and additional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Status</label>
                  <Select
                    value={course.status}
                    onValueChange={(value: Course['status']) => setCourse(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Thumbnail URL</label>
                  <Input
                    value={course.thumbnail_url}
                    onChange={(e) => setCourse(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
}