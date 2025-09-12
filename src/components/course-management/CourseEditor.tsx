import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ModuleManager } from './ModuleManager';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2,
  Plus,
  Settings
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived' | 'review';
  price: number;
  duration_hours: number;
  category: 'technology' | 'business' | 'design' | 'marketing' | 'health' | 'language' | 'personal_development' | 'academic';
  thumbnail_url: string | null;
  level: string | null;
  requirements: string[] | null;
  learning_outcomes: string[] | null;
  instructor_id: string;
}

export function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Error",
        description: "Failed to load course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    if (!course || !courseId) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          description: course.description,
          category: course.category,
          price: course.price,
          duration_hours: course.duration_hours,
          level: course.level,
          requirements: course.requirements,
          learning_outcomes: course.learning_outcomes,
          thumbnail_url: course.thumbnail_url
        })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course saved successfully",
      });
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCourseStatus = async (newStatus: Course['status']) => {
    if (!courseId) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourse(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: "Success",
        description: `Course ${newStatus === 'published' ? 'published' : 'updated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating course status:', error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async () => {
    if (!courseId || !course) return;
    
    if (confirm('Are you sure you want to delete this course? This will also delete all related modules, lessons, and enrollment records. This action cannot be undone.')) {
      try {
        // First, delete related data in a transaction
        const { error: enrollmentsError } = await supabase
          .from('enrollments')
          .delete()
          .eq('course_id', courseId);

        if (enrollmentsError) throw enrollmentsError;

        // Get all modules for this course to delete their lessons
        const { data: modules, error: modulesError } = await supabase
          .from('modules')
          .select('id')
          .eq('course_id', courseId);

        if (modulesError) throw modulesError;

        // Delete all lessons for each module
        if (modules && modules.length > 0) {
          for (const module of modules) {
            const { error: lessonsError } = await supabase
              .from('lessons')
              .delete()
              .eq('module_id', module.id);

            if (lessonsError) throw lessonsError;
          }
        }

        // Delete all modules for this course
        const { error: modulesDeleteError } = await supabase
          .from('modules')
          .delete()
          .eq('course_id', courseId);

        if (modulesDeleteError) throw modulesDeleteError;

        // Finally, delete the course
        const { error: courseDeleteError } = await supabase
          .from('courses')
          .delete()
          .eq('id', courseId);

        if (courseDeleteError) throw courseDeleteError;

        toast({
          title: "Success",
          description: "Course and all related content deleted successfully",
        });
        
        navigate('/dashboard/courses');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete course. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/dashboard/courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = profile?.role === 'admin' || course.instructor_id === user?.id;

  return (
    <DashboardLayout>
      <div className="bg-background">
        {/* Navigation Bar */}
        <nav className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Navigation */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/courses')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Courses
                </Button>
                <div className="h-6 w-px bg-border"></div>
                <nav className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/courses')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    My Courses
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/dashboard/analytics')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Analytics
                  </Button>
                </nav>
              </div>

              {/* Right side - Actions */}
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/course/${courseId}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveCourse}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  
                  {course.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => updateCourseStatus('published')}
                    >
                      Publish Course
                    </Button>
                  )}
                  
                  {course.status === 'published' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCourseStatus('draft')}
                    >
                      Unpublish
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteCourse}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Course Header */}
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {course.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {course.duration_hours} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Content & Modules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic course information and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course Title</label>
                    <Input
                      value={course.title}
                      onChange={(e) => setCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={course.category}
                      onValueChange={(value: Course['category']) => setCourse(prev => prev ? { ...prev, category: value } : null)}
                      disabled={!canEdit}
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
                    value={course.description || ''}
                    onChange={(e) => setCourse(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={4}
                    disabled={!canEdit}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₦)</label>
                    <Input
                      type="text"
                      value={course.price}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setCourse(prev => prev ? { ...prev, price: Number(value) || 0 } : null);
                      }}
                      disabled={!canEdit}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (hours)</label>
                    <Input
                      type="number"
                      value={course.duration_hours}
                      onChange={(e) => setCourse(prev => prev ? { ...prev, duration_hours: Number(e.target.value) } : null)}
                      disabled={!canEdit}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Level</label>
                    <Select
                      value={course.level || ''}
                      onValueChange={(value) => setCourse(prev => prev ? { ...prev, level: value } : null)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ModuleManager courseId={courseId!} canEdit={canEdit} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Manage course visibility, enrollment, and other settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Status</label>
                  <Select
                    value={course.status}
                    onValueChange={(value: Course['status']) => updateCourseStatus(value)}
                    disabled={!canEdit}
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
                    value={course.thumbnail_url || ''}
                    onChange={(e) => setCourse(prev => prev ? { ...prev, thumbnail_url: e.target.value } : null)}
                    placeholder="https://example.com/image.jpg"
                    disabled={!canEdit}
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