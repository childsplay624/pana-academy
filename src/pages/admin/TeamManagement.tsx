import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Save, X, Users, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { TeamMember, InsertTeamMember } from '@/types/team.types';
import { useSiteImages } from '@/hooks/useSiteImage';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TeamManagementContent = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const { images: siteImages } = useSiteImages('team');

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    full_bio: '',
    experience: [],
    category: 'board',
    image_key: '',
    is_active: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMembers((data as TeamMember[]) || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch team members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare experience data safely
      let experienceData = [];
      if (Array.isArray(formData.experience)) {
        experienceData = formData.experience;
      } else if (typeof formData.experience === 'string' && formData.experience.trim() !== '') {
        try {
          experienceData = JSON.parse(formData.experience);
        } catch (e) {
          // If it's not JSON, maybe it's just a text list? Or just empty array
          experienceData = formData.experience.split('\n').filter(l => l.trim() !== '');
        }
      }

      const dataToSave = {
        ...formData,
        image_key: formData.image_key || null,
        subtitle: formData.subtitle || null,
        full_bio: formData.full_bio || null,
        experience: experienceData
      };

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(dataToSave)
          .eq('id', editingMember.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Team member updated successfully' });
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([{ ...dataToSave, display_order: members.length + 1 }]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Team member added successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Team member deleted' });
      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete team member',
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !member.is_active })
        .eq('id', member.id);

      if (error) throw error;
      fetchMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      full_bio: '',
      experience: [],
      category: 'board',
      image_key: '',
      is_active: true,
    });
  };

  const handleMove = async (member: TeamMember, direction: 'up' | 'down') => {
    const currentIndex = members.findIndex(m => m.id === member.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= members.length) return;

    const targetMember = members[targetIndex];

    try {
      setLoading(true);
      // Swap display orders
      const { error: error1 } = await supabase
        .from('team_members')
        .update({ display_order: targetMember.display_order })
        .eq('id', member.id);

      const { error: error2 } = await supabase
        .from('team_members')
        .update({ display_order: member.display_order })
        .eq('id', targetMember.id);

      if (error1 || error2) throw error1 || error2;
      
      await fetchMembers();
      toast({ title: 'Success', description: 'Order updated' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage PANA Institute leadership and advisory board</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle (Optional)</label>
                  <Input
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="board">Board of Directors</SelectItem>
                      <SelectItem value="advisory">Advisory Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium">Image Key (Select from Site Images)</label>
                  <Select 
                    value={formData.image_key || 'none'} 
                    onValueChange={(val) => setFormData({ ...formData, image_key: val === 'none' ? '' : val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Image (Uses initials)</SelectItem>
                      {siteImages?.map((img) => (
                        <SelectItem key={img.key} value={img.key}>
                          <div className="flex items-center gap-2">
                             {img.key}
                             <span className="text-[10px] text-muted-foreground">({img.url.split('/').pop()})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">
                    Upload new team images in <Link to="/dashboard/images" className="text-red-600 underline">Manage Images</Link>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Biography</label>
                <Textarea
                  value={formData.full_bio || ''}
                  onChange={(e) => setFormData({ ...formData, full_bio: e.target.value })}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience (JSON format: ["exp1", "exp2"])</label>
                <Textarea
                  value={typeof formData.experience === 'string' ? formData.experience : JSON.stringify(formData.experience)}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder='["Over 20 years event...", "Strategic advisor..."]'
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingMember ? 'Update Member' : 'Save Member'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <Card key={member.id} className={`${!member.is_active ? 'opacity-60' : ''} border-l-4 ${member.category === 'board' ? 'border-l-red-600' : 'border-l-blue-600'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {member.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.title}</p>
                  </div>
                </div>

                 <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1 mr-2 border-r pr-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      disabled={members.indexOf(member) === 0}
                      onClick={() => handleMove(member, 'up')}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      disabled={members.indexOf(member) === members.length - 1}
                      onClick={() => handleMove(member, 'down')}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus(member)}>
                    {member.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {member.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(member.id)} className="bg-red-600 hover:bg-red-700">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TeamManagement = () => {
  return (
    <DashboardLayout>
      <TeamManagementContent />
    </DashboardLayout>
  );
};

export default TeamManagement;
