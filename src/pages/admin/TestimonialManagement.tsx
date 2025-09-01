import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Star, Eye, EyeOff, Edit } from 'lucide-react';
import { Testimonial } from '@/types/testimonial.types';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TestimonialManagementContent = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  
  type FormData = {
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    image_initials: string;
  };

  const [formData, setFormData] = useState<FormData>({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    image_initials: '',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonials((data as Testimonial[]) || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch testimonials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const handleSaveTestimonial = async () => {
        if (!formData.name || !formData.content) {
          toast({
            title: 'Error',
            description: 'Name and content are required',
            variant: 'destructive',
          });
          return;
        }

        try {
          if (editingTestimonial && editingTestimonial.id) {
            const { error } = await supabase
              .from('testimonials')
              .update(formData)
              .eq('id', editingTestimonial.id);

            if (error) throw error;

            toast({
              title: 'Success',
              description: 'Testimonial updated successfully',
            });
          } else {
            const { error } = await supabase.from('testimonials').insert([
              {
                ...formData,
                is_active: true,
                display_order: testimonials.length + 1,
              } as any,
            ]);

            if (error) throw error;

            toast({
              title: 'Success',
              description: 'Testimonial added successfully',
            });
          }

          await fetchTestimonials();
          setIsAddDialogOpen(false);
          setEditingTestimonial(null);
          setFormData({
            name: '',
            position: '',
            company: '',
            content: '',
            rating: 5,
            image_initials: '',
          });
        } catch (error) {
          console.error('Error saving testimonial:', error);
          toast({
            title: 'Error',
            description: 'Failed to save testimonial',
            variant: 'destructive',
          });
        }
      };

      const handleDeleteTestimonial = async (testimonialId: string) => {
        try {
          const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', testimonialId);

          if (error) throw error;

          await fetchTestimonials();
          toast({
            title: 'Success',
            description: 'Testimonial deleted successfully',
          });
        } catch (error) {
          console.error('Error deleting testimonial:', error);
          toast({
            title: 'Error',
            description: 'Failed to delete testimonial',
            variant: 'destructive',
          });
        }
      };

      const toggleTestimonialStatus = async (testimonial: Testimonial) => {
        try {
          const { error } = await supabase
            .from('testimonials')
            .update({ is_active: !testimonial.is_active })
            .eq('id', testimonial.id);

          if (error) throw error;

          await fetchTestimonials();
          toast({
            title: 'Success',
            description: `Testimonial ${testimonial.is_active ? 'deactivated' : 'activated'}`,
          });
        } catch (error) {
          console.error('Error toggling testimonial status:', error);
          toast({
            title: 'Error',
            description: 'Failed to update testimonial status',
            variant: 'destructive',
          });
        }
      };

      handleSaveTestimonial();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !testimonial.is_active })
        .eq('id', testimonial.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Testimonial ${!testimonial.is_active ? 'activated' : 'deactivated'} successfully`,
      });
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial status',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      image_initials: testimonial.image_initials || '',
    });
    setEditingTestimonial(testimonial);
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      image_initials: '',
    });
    setEditingTestimonial(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testimonial Management</h1>
          <p className="text-muted-foreground">Manage client testimonials displayed on your website</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit' : 'Add'} Testimonial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Position</label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Job title"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Initials (for avatar)</label>
                  <Input
                    value={formData.image_initials}
                    onChange={(e) => setFormData({ ...formData, image_initials: e.target.value })}
                    placeholder="e.g., JD"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Testimonial Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the testimonial content..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingTestimonial ? 'Update' : 'Add'} Testimonial
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length > 0 ? (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={`${!testimonial.is_active ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {testimonial.image_initials || testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.position} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={testimonial.is_active ? 'default' : 'secondary'}>
                      {testimonial.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(testimonial)}
                    >
                      {testimonial.is_active ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Show
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(testimonial)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this testimonial? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(testimonial.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No testimonials found. Add your first testimonial to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TestimonialManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Testimonials</h2>
            <p className="text-muted-foreground">
              Manage and moderate user testimonials
            </p>
          </div>
        </div>
        <TestimonialManagementContent />
      </div>
    </DashboardLayout>
  );
};

export default TestimonialManagement;