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
import { fetchCategoriesWithSubcategories, Category, Subcategory } from '@/services/courseService';
import { ModuleManager } from './ModuleManager';

import { EnrollmentManager } from './EnrollmentManager';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  Plus,
  Settings,
  Upload,
  ImageIcon,
  Loader2,
  User,
  CheckCircle2,
  Award,
  ShieldCheck,
  Cpu,
  Briefcase,
  FileText,
  X,
  Sparkles,
  GraduationCap,
  Users as UsersIcon,
  Building2
} from 'lucide-react';
import { ImagePicker } from '@/components/admin/ImagePicker';

interface Instructor {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface Course {
  id: string;
  code?: string | null;
  domain_no?: number | null;
  subcategory_id?: string | null;
  course_area?: string | null;
  title: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived' | 'review';
  price: number;
  duration_hours: number;
  category: any;
  thumbnail_url: string | null;
  level: string | null;
  requirements: string[] | null;
  learning_outcomes: string[] | null;
  instructor_id: string;
  start_date?: string | null;
  end_date?: string | null;
  course_type?: 'online' | 'onsite' | 'hybrid';

  // Onsite fields
  venue_name?: string | null;
  venue_address?: string | null;
  venue_city?: string | null;
  venue_country?: string | null;
  venue_capacity?: number | null;
  venue_map_url?: string | null;
  onsite_schedule?: any;
  requires_materials?: boolean | null;
  materials_list?: string[] | null;
  parking_info?: string | null;
  accommodation_info?: string | null;
  features?: string[] | null;
  resources_count?: number | null;
  venue_id?: string | null;
  category_id?: string | null;

  // Industrial metadata
  standards?: string[] | null;
  oem_partners?: string[] | null;
  award?: string | null;
  target_audience?: string[] | null;
  practical_work?: string[] | null;
  class_size?: string | null;
  delivery_options?: string | null;
}

function ArrayItemEditor({
  title,
  description,
  items = [],
  onChange,
  placeholder,
  canEdit,
  icon: IconComponent,
  chipStyle = false,
  badgeText
}: {
  title: string;
  description?: string;
  items?: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  canEdit: boolean;
  icon?: any;
  chipStyle?: boolean;
  badgeText?: string;
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const [inputVal, setInputVal] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!safeItems.includes(trimmed)) {
      onChange([...safeItems, trimmed]);
    }
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    onChange(safeItems.filter((_, idx) => idx !== index));
  };

  const handleBulkAdd = () => {
    if (!bulkText.trim()) return;
    const splitLines = bulkText
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const combined = Array.from(new Set([...safeItems, ...splitLines]));
    onChange(combined);
    setBulkText('');
    setShowBulk(false);
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-border bg-card/60">
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
            {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
            <span>{title}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal">
              {safeItems.length} {badgeText || 'items'}
            </Badge>
          </label>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowBulk(!showBulk)}
            className="text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            {showBulk ? 'Single line input' : 'Paste bulk items'}
          </button>
        )}
      </div>

      {showBulk && canEdit ? (
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
          <Textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Paste items separated by newlines or commas..."
            rows={3}
            className="text-xs bg-background"
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowBulk(false)} className="text-xs h-7">
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleBulkAdd} className="text-xs h-7">
              Add All
            </Button>
          </div>
        </div>
      ) : (
        canEdit && (
          <div className="flex items-center gap-2">
            <Input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || 'Type item and press Enter...'}
              className="text-xs h-9 bg-background"
              disabled={!canEdit}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAdd}
              className="h-9 px-3 text-xs flex-shrink-0 cursor-pointer"
              disabled={!inputVal.trim() || !canEdit}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>
        )
      )}

      {/* Rendered list */}
      {safeItems.length > 0 ? (
        chipStyle ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {safeItems.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-semibold text-foreground border border-border shadow-2xs"
              >
                <span>{item}</span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-0.5 cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {safeItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border border-border text-xs text-foreground group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0 p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-xs text-muted-foreground italic pt-0.5">No entries added yet.</p>
      )}
    </div>
  );
}

function QuickVenueSelect({ onSelect }: { onSelect: (venue: any) => void }) {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          .order('name');
        if (error) throw error;
        setVenues(data || []);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, []);

  return (
    <Select onValueChange={(id) => {
      const venue = venues.find(v => v.id === id);
      if (venue) onSelect(venue);
    }}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Loading venues..." : "Select a venue"} />
      </SelectTrigger>
      <SelectContent>
        {venues.map((v) => (
          <SelectItem key={v.id} value={v.id}>
            {v.name} ({v.city})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function CourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('details');
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }

    // Set active tab from query param if available
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['details', 'content', 'students', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }

    fetchCategoriesList();
    fetchInstructorsList();
  }, [courseId]);

  const fetchInstructorsList = async () => {
    try {
      setLoadingInstructors(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, avatar_url')
        .or('role.eq.instructor,role.eq.admin')
        .order('full_name', { ascending: true });
      if (!error && data) {
        setInstructors(data);
      }
    } catch (err) {
      console.error('Error fetching instructors:', err);
    } finally {
      setLoadingInstructors(false);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${courseId || 'course'}-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file, { upsert: true });

      let publicUrl = '';
      if (uploadError) {
        // Fallback to site-images bucket
        const { error: fallbackError } = await supabase.storage
          .from('site-images')
          .upload(filePath, file, { upsert: true });
        if (fallbackError) throw uploadError;

        const { data: pubData } = supabase.storage.from('site-images').getPublicUrl(filePath);
        publicUrl = pubData.publicUrl;
      } else {
        const { data: pubData } = supabase.storage.from('course-images').getPublicUrl(filePath);
        publicUrl = pubData.publicUrl;
      }

      setCourse(prev => prev ? { ...prev, thumbnail_url: publicUrl } : null);
      toast({
        title: "Image Uploaded",
        description: "Course thumbnail updated. Click Save to persist changes."
      });
    } catch (err: any) {
      console.error("Error uploading image:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload course image",
        variant: "destructive"
      });
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const fetchCategoriesList = async () => {
    try {
      setLoadingCategories(true);
      const data = await fetchCategoriesWithSubcategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

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
          code: course.code,
          domain_no: course.domain_no,
          subcategory_id: course.subcategory_id,
          course_area: course.course_area,
          description: course.description,
          category_id: course.category_id,
          instructor_id: course.instructor_id,
          price: course.price,
          duration_hours: course.duration_hours,
          level: course.level,
          requirements: course.requirements,
          learning_outcomes: course.learning_outcomes,
          thumbnail_url: course.thumbnail_url,
          start_date: course.start_date || null,
          end_date: course.end_date || null,
          course_type: course.course_type,
          venue_name: course.venue_name,
          venue_address: course.venue_address,
          venue_city: course.venue_city,
          venue_country: course.venue_country,
          venue_capacity: course.venue_capacity,
          venue_map_url: course.venue_map_url,
          onsite_schedule: course.onsite_schedule,
          venue_id: course.venue_id,
          features: course.features,
          resources_count: course.resources_count,
          standards: course.standards || [],
          oem_partners: course.oem_partners || [],
          award: course.award || 'Certificate of Attendance',
          target_audience: course.target_audience || [],
          practical_work: course.practical_work || [],
          class_size: course.class_size || null,
          delivery_options: course.delivery_options || null
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
        {/* Navigation Bar - Sticky so actions are always available */}
        <nav className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm">
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
                  {profile?.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard/analytics')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Analytics
                    </Button>
                  )}
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
                    {categories.find(c => c.id === course.category_id)?.name || course.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    • {course.duration_hours} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="content">Content & Modules</TabsTrigger>
              <TabsTrigger value="students">Students & Grading</TabsTrigger>
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
                      <label className="text-sm font-medium">Domain (Category)</label>
                      <Select
                        value={course.category_id || ''}
                        onValueChange={async (value) => {
                          const selectedCat = categories.find(c => c.id === value);
                          const prefix = selectedCat?.code_prefix || '';
                          let nextCode = course.code;
                          if (prefix && (!course.code || course.code.length <= 4)) {
                            try {
                              const { data } = await supabase
                                .from('courses')
                                .select('code')
                                .ilike('code', `${prefix}%`);
                              let maxNum = 0;
                              if (data) {
                                data.forEach(item => {
                                  if (item.code) {
                                    const match = item.code.match(new RegExp(`^${prefix}(\\d+)`, 'i'));
                                    if (match && match[1]) {
                                      const num = parseInt(match[1], 10);
                                      if (!isNaN(num) && num > maxNum) maxNum = num;
                                    }
                                  }
                                });
                              }
                              nextCode = `${prefix}${String(maxNum + 1).padStart(2, '0')}`;
                            } catch {
                              nextCode = `${prefix}01`;
                            }
                          }
                          setCourse(prev => prev ? {
                            ...prev,
                            category_id: value,
                            category: (selectedCat?.name || prev.category) as any,
                            domain_no: selectedCat?.domain_no ?? prev.domain_no,
                            code: nextCode,
                            subcategory_id: null,
                            course_area: null
                          } : null);
                        }}
                        disabled={!canEdit || loadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCategories ? "Loading..." : "Select domain"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.domain_no ? `${cat.domain_no}. ` : ''}{cat.name} {cat.code_prefix ? `(${cat.code_prefix})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Area (Sub-category)</label>
                      <Select
                        value={course.subcategory_id || ''}
                        disabled={!canEdit || !course.category_id}
                        onValueChange={(val) => {
                          const activeCat = categories.find(c => c.id === course.category_id);
                          const sub = activeCat?.subcategories?.find(s => s.id === val);
                          setCourse(prev => prev ? {
                            ...prev,
                            subcategory_id: val,
                            course_area: sub?.name || null
                          } : null);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course area" />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories.find(c => c.id === course.category_id)?.subcategories || []).map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Course Code</label>
                        <span className="text-[10px] text-muted-foreground font-mono">Auto from domain</span>
                      </div>
                      <Input
                        value={course.code || ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                        placeholder="e.g. PD01"
                        className="font-mono font-bold"
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Title</label>
                      <Input
                        value={course.title}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, title: e.target.value } : null)}
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course Type</label>
                      <Select
                        value={course.course_type || 'online'}
                        onValueChange={(value: 'online' | 'onsite' | 'hybrid') => setCourse(prev => prev ? { ...prev, course_type: value } : null)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">💻 Online Course</SelectItem>
                          <SelectItem value="onsite">🏢 On-Site Course</SelectItem>
                          <SelectItem value="hybrid">🔄 Hybrid Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assigned Instructor</label>
                      {profile?.role === 'admin' ? (
                        <Select
                          value={course.instructor_id || ''}
                          onValueChange={(value) => setCourse(prev => prev ? { ...prev, instructor_id: value } : null)}
                          disabled={!canEdit || loadingInstructors}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingInstructors ? "Loading instructors..." : "Select instructor"} />
                          </SelectTrigger>
                          <SelectContent>
                            {instructors.map((ins) => (
                              <SelectItem key={ins.id} value={ins.id}>
                                {ins.full_name || 'Unnamed'} ({ins.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={instructors.find(i => i.id === course.instructor_id)?.full_name || profile?.full_name || 'Instructor'}
                          disabled
                          className="bg-muted/50"
                        />
                      )}
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
                        type="number"
                        value={course.price}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                        disabled={!canEdit}
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
                        value={course.level || 'beginner'}
                        onValueChange={(value) => setCourse(prev => prev ? { ...prev, level: value } : null)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={course.start_date ? new Date(course.start_date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, start_date: e.target.value } : null)}
                        disabled={!canEdit}
                      />
                      <p className="text-xs text-gray-500">When does the course start?</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={course.end_date ? new Date(course.end_date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, end_date: e.target.value } : null)}
                        disabled={!canEdit}
                        min={course.start_date ? new Date(course.start_date).toISOString().slice(0, 16) : undefined}
                      />
                      <p className="text-xs text-gray-500">When does the course finish?</p>
                    </div>
                  </div>

                  {/* Course Image / Thumbnail Section */}
                  <div className="space-y-3 pt-3 border-t">
                    <label className="text-sm font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Course Image / Thumbnail
                      </span>
                      {course.thumbnail_url && (
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Thumbnail
                        </span>
                      )}
                    </label>

                    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-border bg-card/60">
                      {/* Thumbnail Preview */}
                      <div className="w-full sm:w-56 h-36 rounded-lg border border-border bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0 relative group shadow-xs">
                        {course.thumbnail_url ? (
                          <>
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => setCourse(prev => prev ? { ...prev, thumbnail_url: null } : null)}
                                className="absolute top-2 right-2 bg-black/70 hover:bg-destructive text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-center p-3 text-muted-foreground">
                            <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                            <span className="text-xs">No image uploaded</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Actions & Controls */}
                      <div className="space-y-3 flex-1 w-full">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Upload a high-resolution banner image for this course (recommended 1280x720px, PNG, JPG, or WEBP, max 5MB).
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs ${uploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
                            {uploadingImage ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload New Image</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={!canEdit || uploadingImage}
                              onChange={handleImageFileChange}
                            />
                          </label>

                          <ImagePicker
                            value={course.thumbnail_url || ''}
                            onSelect={(url) => setCourse(prev => prev ? { ...prev, thumbnail_url: url } : null)}
                            category="other"
                            label="Media Library"
                          />

                          {course.thumbnail_url && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setCourse(prev => prev ? { ...prev, thumbnail_url: null } : null)}
                              className="text-xs text-destructive hover:bg-destructive/10"
                              disabled={!canEdit}
                            >
                              Remove
                            </Button>
                          )}
                        </div>

                        <div>
                          <Input
                            value={course.thumbnail_url || ''}
                            onChange={(e) => setCourse(prev => prev ? { ...prev, thumbnail_url: e.target.value } : null)}
                            placeholder="Or paste external image URL (https://...)"
                            className="text-xs h-8"
                            disabled={!canEdit}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* On-Site Course Fields */}
                  {(course.course_type === 'onsite' || course.course_type === 'hybrid') && (
                    <>
                      <div className="pt-6 border-t">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">🏢 Venue Information</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('/dashboard/venues', '_blank')}
                          >
                            Manage Venues
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {/* Venue Selection */}
                          <div className="p-4 bg-muted/50 rounded-lg border mb-6">
                            <label className="text-sm font-medium mb-2 block">Quick Select Venue</label>
                            <QuickVenueSelect
                              onSelect={(v) => {
                                setCourse(prev => prev ? {
                                  ...prev,
                                  venue_id: v.id,
                                  venue_name: v.name,
                                  venue_address: v.address,
                                  venue_city: v.city,
                                  venue_country: v.country,
                                  venue_capacity: v.capacity,
                                  venue_map_url: v.map_url
                                } : null);
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              Selecting a saved venue will fill the details below. You can still make custom adjustments.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Venue Name *</label>
                              <Input
                                value={course.venue_name || ''}
                                onChange={(e) => setCourse(prev => prev ? { ...prev, venue_name: e.target.value } : null)}
                                placeholder="e.g., PANA Training Center"
                                disabled={!canEdit}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Capacity</label>
                              <Input
                                type="number"
                                value={course.venue_capacity || ''}
                                onChange={(e) => setCourse(prev => prev ? { ...prev, venue_capacity: e.target.value ? Number(e.target.value) : null } : null)}
                                placeholder="Max students"
                                disabled={!canEdit}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address *</label>
                            <Input
                              value={course.venue_address || ''}
                              onChange={(e) => setCourse(prev => prev ? { ...prev, venue_address: e.target.value } : null)}
                              placeholder="Street address"
                              disabled={!canEdit}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">City *</label>
                              <Input
                                value={course.venue_city || ''}
                                onChange={(e) => setCourse(prev => prev ? { ...prev, venue_city: e.target.value } : null)}
                                placeholder="e.g., Lagos"
                                disabled={!canEdit}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Country *</label>
                              <Input
                                value={course.venue_country || 'Nigeria'}
                                onChange={(e) => setCourse(prev => prev ? { ...prev, venue_country: e.target.value } : null)}
                                placeholder="e.g., Nigeria"
                                disabled={!canEdit}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Google Maps URL</label>
                            <Input
                              value={course.venue_map_url || ''}
                              onChange={(e) => setCourse(prev => prev ? { ...prev, venue_map_url: e.target.value } : null)}
                              placeholder="https://maps.google.com/..."
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">📦 Logistics</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Parking Information</label>
                            <Textarea
                              value={course.parking_info || ''}
                              onChange={(e) => setCourse(prev => prev ? { ...prev, parking_info: e.target.value } : null)}
                              placeholder="Parking details for attendees..."
                              rows={2}
                              disabled={!canEdit}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Accommodation Suggestions</label>
                            <Textarea
                              value={course.accommodation_info || ''}
                              onChange={(e) => setCourse(prev => prev ? { ...prev, accommodation_info: e.target.value } : null)}
                              placeholder="Nearby hotels or accommodation options..."
                              rows={2}
                              disabled={!canEdit}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Card 2: Learning Outcomes & Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Learning Outcomes & Prerequisites
                  </CardTitle>
                  <CardDescription>
                    Define the core competencies students will master and any prerequisite experience required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ArrayItemEditor
                    title="What You'll Learn (Learning Outcomes)"
                    description="Key skills, principles, and methodologies participants will acquire during this course."
                    items={course.learning_outcomes || []}
                    onChange={(newItems) => setCourse(prev => prev ? { ...prev, learning_outcomes: newItems } : null)}
                    placeholder="e.g. Read a compressor performance map and locate the operating point..."
                    canEdit={canEdit}
                    icon={CheckCircle2}
                    badgeText="outcomes"
                  />

                  <ArrayItemEditor
                    title="Requirements & Prerequisites"
                    description="Knowledge, technical backgrounds, or certifications recommended before enrolling."
                    items={course.requirements || []}
                    onChange={(newItems) => setCourse(prev => prev ? { ...prev, requirements: newItems } : null)}
                    placeholder="e.g. Working knowledge of plant operations or 2 years engineering experience."
                    canEdit={canEdit}
                    icon={GraduationCap}
                    badgeText="requirements"
                  />
                </CardContent>
              </Card>

              {/* Card 3: Industrial, Technical & Accreditation Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-red-600" />
                    Industrial & Accreditation Specifications
                  </CardTitle>
                  <CardDescription>
                    Configure industry compliance standards, OEM technology partners, target disciplines, and certification awards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-border bg-card/60">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <Award className="w-4 h-4 text-primary" />
                        Certification / Award
                      </label>
                      <Select
                        value={course.award || 'Certificate of Attendance'}
                        onValueChange={(val) => setCourse(prev => prev ? { ...prev, award: val } : null)}
                        disabled={!canEdit}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select award type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Certificate of Competence">Certificate of Competence</SelectItem>
                          <SelectItem value="Certificate of Attendance">Certificate of Attendance</SelectItem>
                          <SelectItem value="Exam Preparation & Assessment">Exam Preparation & Assessment</SelectItem>
                          <SelectItem value="Continuous Professional Development (CPD)">CPD Accredited</SelectItem>
                          <SelectItem value="Official PANA Accreditation Pass">PANA Accreditation Pass</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={course.award || ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, award: e.target.value } : null)}
                        placeholder="Or type custom award title"
                        className="text-xs h-8"
                        disabled={!canEdit}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <UsersIcon className="w-4 h-4 text-primary" />
                        Recommended Class Size
                      </label>
                      <Input
                        value={course.class_size || ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, class_size: e.target.value } : null)}
                        placeholder="e.g. Up to 16 participants"
                        className="text-xs"
                        disabled={!canEdit}
                      />
                      <p className="text-[11px] text-muted-foreground">Optimal attendee cohort limit for lab drills</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                        <Building2 className="w-4 h-4 text-primary" />
                        Delivery Options & Cohorts
                      </label>
                      <Textarea
                        value={course.delivery_options || ''}
                        onChange={(e) => setCourse(prev => prev ? { ...prev, delivery_options: e.target.value } : null)}
                        placeholder="e.g. Public sessions: Mar 8 to 12. In-house dates on request."
                        rows={2}
                        className="text-xs"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArrayItemEditor
                      title="Standards & Recognized References"
                      description="International standards the curriculum aligns with (e.g. API 617, ASME PTC 10, ISO 18436)."
                      items={course.standards || []}
                      onChange={(newItems) => setCourse(prev => prev ? { ...prev, standards: newItems } : null)}
                      placeholder="e.g. API 617, API 614, ASME PTC 10"
                      canEdit={canEdit}
                      icon={ShieldCheck}
                      chipStyle={true}
                      badgeText="standards"
                    />

                    <ArrayItemEditor
                      title="Technology & OEM Partners"
                      description="OEM equipment, manufacturers, and technology references taught (e.g. Baker Hughes, Siemens)."
                      items={course.oem_partners || []}
                      onChange={(newItems) => setCourse(prev => prev ? { ...prev, oem_partners: newItems } : null)}
                      placeholder="e.g. Baker Hughes, Siemens, Goulds Pumps"
                      canEdit={canEdit}
                      icon={Cpu}
                      chipStyle={true}
                      badgeText="OEM partners"
                    />
                  </div>

                  <ArrayItemEditor
                    title="Who Should Attend (Target Audience)"
                    description="Disciplines, engineering job roles, and industrial sectors suited for this course."
                    items={course.target_audience || []}
                    onChange={(newItems) => setCourse(prev => prev ? { ...prev, target_audience: newItems } : null)}
                    placeholder="e.g. Operations engineers, reliability leads, turbomachinery supervisors"
                    canEdit={canEdit}
                    icon={Briefcase}
                    badgeText="roles"
                  />

                  <ArrayItemEditor
                    title="Practical Work & Hands-on Exercises"
                    description="Real-world diagnostic drills, dynamic simulations, or laboratory calibration exercises."
                    items={course.practical_work || []}
                    onChange={(newItems) => setCourse(prev => prev ? { ...prev, practical_work: newItems } : null)}
                    placeholder="e.g. Tune an anti-surge loop on a dynamic simulator and test a fast stop"
                    canEdit={canEdit}
                    icon={FileText}
                    badgeText="exercises"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <ModuleManager courseId={courseId!} canEdit={canEdit} />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <EnrollmentManager courseId={courseId!} canEdit={canEdit} />
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

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Course Thumbnail & Cover Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-border bg-card/60">
                      <div className="w-40 h-24 rounded-lg border border-border bg-muted/40 overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </div>

                      <div className="space-y-2 flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs ${uploadingImage ? 'opacity-60 pointer-events-none' : ''}`}>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={!canEdit || uploadingImage}
                              onChange={handleImageFileChange}
                            />
                          </label>

                          <ImagePicker
                            value={course.thumbnail_url || ''}
                            onSelect={(url) => setCourse(prev => prev ? { ...prev, thumbnail_url: url } : null)}
                            category="other"
                            label="Media Library"
                          />
                        </div>

                        <Input
                          value={course.thumbnail_url || ''}
                          onChange={(e) => setCourse(prev => prev ? { ...prev, thumbnail_url: e.target.value } : null)}
                          placeholder="https://example.com/image.jpg"
                          className="text-xs h-8"
                          disabled={!canEdit}
                        />
                      </div>
                    </div>
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