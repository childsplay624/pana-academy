import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LessonManager } from './LessonManager';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  course_id: string;
  lessons?: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  lesson_type: string | null;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  module_id: string;
  file_urls: string[] | null;
}

interface ModuleManagerProps {
  courseId: string;
  canEdit: boolean;
}

export function ModuleManager({ courseId, canEdit }: ModuleManagerProps) {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (
            id,
            title,
            content,
            video_url,
            lesson_type,
            duration_minutes,
            order_index,
            is_free,
            file_urls
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const modulesWithSortedLessons = data?.map(module => ({
        ...module,
        lessons: module.lessons?.map(lesson => ({ ...lesson, module_id: module.id })).sort((a, b) => a.order_index - b.order_index) || []
      })) || [];

      setModules(modulesWithSortedLessons);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: "Error",
        description: "Failed to load modules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addModule = async () => {
    if (!newModule.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextOrderIndex = Math.max(...modules.map(m => m.order_index), 0) + 1;
      
      const { error } = await supabase
        .from('modules')
        .insert({
          title: newModule.title,
          description: newModule.description,
          course_id: courseId,
          order_index: nextOrderIndex
        });

      if (error) throw error;

      setIsAddModuleOpen(false);
      setNewModule({ title: '', description: '' });
      fetchModules();
      
      toast({
        title: "Success",
        description: "Module created successfully",
      });
    } catch (error) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
    }
  };

  const updateModule = async () => {
    if (!editingModule || !editingModule.title.trim()) {
      toast({
        title: "Error",
        description: "Module title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('modules')
        .update({
          title: editingModule.title,
          description: editingModule.description
        })
        .eq('id', editingModule.id);

      if (error) throw error;

      setEditingModule(null);
      fetchModules();
      
      toast({
        title: "Success",
        description: "Module updated successfully",
      });
    } catch (error) {
      console.error('Error updating module:', error);
      toast({
        title: "Error",
        description: "Failed to update module",
        variant: "destructive",
      });
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module? All lessons in this module will also be deleted.')) {
      try {
        const { error } = await supabase
          .from('modules')
          .delete()
          .eq('id', moduleId);

        if (error) throw error;

        fetchModules();
        
        toast({
          title: "Success",
          description: "Module deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting module:', error);
        toast({
          title: "Error",
          description: "Failed to delete module",
          variant: "destructive",
        });
      }
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Module Button */}
      {canEdit && (
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new module to organize your course content
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newModule.title}
                  onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newModule.description}
                  onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addModule}>Create Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Module Dialog */}
      {editingModule && (
        <Dialog open={true} onOpenChange={() => setEditingModule(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>
                Update the module information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingModule.title}
                  onChange={(e) => setEditingModule(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingModule.description || ''}
                  onChange={(e) => setEditingModule(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateModule}>Update Module</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Modules Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your course by adding your first module
            </p>
            {canEdit && (
              <Button onClick={() => setIsAddModuleOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Module
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModule(module.id)}
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span>Module {index + 1}: {module.title}</span>
                        <Badge variant="outline">
                          {module.lessons?.length || 0} lessons
                        </Badge>
                      </CardTitle>
                      {module.description && (
                        <CardDescription className="mt-1">
                          {module.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingModule(module)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteModule(module.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {expandedModules.has(module.id) && (
                <CardContent>
                  <LessonManager
                    moduleId={module.id}
                    lessons={module.lessons || []}
                    canEdit={canEdit}
                    onLessonsUpdate={fetchModules}
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}