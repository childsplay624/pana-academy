import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { FileUpload } from './FileUpload';
import {
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Clock,
  Play,
  Paperclip
} from 'lucide-react';

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

interface LessonManagerProps {
  moduleId: string;
  lessons: Lesson[];
  canEdit: boolean;
  onLessonsUpdate: () => void;
}

export function LessonManager({ moduleId, lessons, canEdit, onLessonsUpdate }: LessonManagerProps) {
  const { toast } = useToast();
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    video_url: '',
    lesson_type: 'video' as string,
    duration_minutes: 0,
    is_free: false,
    file_urls: [] as string[]
  });

  const addLesson = async () => {
    if (!newLesson.title.trim()) {
      toast({
        title: "Error",
        description: "Lesson title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextOrderIndex = Math.max(...lessons.map(l => l.order_index), 0) + 1;
      
      const { error } = await supabase
        .from('lessons')
        .insert({
          title: newLesson.title,
          content: newLesson.content || null,
          video_url: newLesson.video_url || null,
          lesson_type: newLesson.lesson_type,
          duration_minutes: newLesson.duration_minutes,
          is_free: newLesson.is_free,
          module_id: moduleId,
          order_index: nextOrderIndex,
          file_urls: newLesson.file_urls.length > 0 ? newLesson.file_urls : null
        });

      if (error) throw error;

      setIsAddLessonOpen(false);
      setNewLesson({
        title: '',
        content: '',
        video_url: '',
        lesson_type: 'video',
        duration_minutes: 0,
        is_free: false,
        file_urls: []
      });
      onLessonsUpdate();
      
      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive",
      });
    }
  };

  const updateLesson = async () => {
    if (!editingLesson || !editingLesson.title.trim()) {
      toast({
        title: "Error",
        description: "Lesson title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          title: editingLesson.title,
          content: editingLesson.content,
          video_url: editingLesson.video_url,
          lesson_type: editingLesson.lesson_type,
          duration_minutes: editingLesson.duration_minutes,
          is_free: editingLesson.is_free,
          file_urls: editingLesson.file_urls
        })
        .eq('id', editingLesson.id);

      if (error) throw error;

      setEditingLesson(null);
      onLessonsUpdate();
      
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: "Error",
        description: "Failed to update lesson",
        variant: "destructive",
      });
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        const { error } = await supabase
          .from('lessons')
          .delete()
          .eq('id', lessonId);

        if (error) throw error;

        onLessonsUpdate();
        
        toast({
          title: "Success",
          description: "Lesson deleted successfully",
        });
      } catch (error) {
        console.error('Error deleting lesson:', error);
        toast({
          title: "Error",
          description: "Failed to delete lesson",
          variant: "destructive",
        });
      }
    }
  };

  const getLessonTypeIcon = (type: string | null) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'reading':
        return <FileText className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Lesson Button */}
      {canEdit && (
        <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              <DialogDescription>
                Create a new lesson for this module
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="lesson-title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newLesson.lesson_type}
                  onValueChange={(value) => setNewLesson(prev => ({ ...prev, lesson_type: value }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-duration" className="text-right">
                  Duration (minutes)
                </Label>
                <Input
                  id="lesson-duration"
                  type="number"
                  value={newLesson.duration_minutes}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-video" className="text-right">
                  Video URL
                </Label>
                <Input
                  id="lesson-video"
                  value={newLesson.video_url}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="lesson-content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="lesson-content"
                  value={newLesson.content}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Lesson content, notes, or description..."
                  rows={4}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lesson-free" className="text-right">
                  Free Lesson
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    id="lesson-free"
                    checked={newLesson.is_free}
                    onCheckedChange={(checked) => setNewLesson(prev => ({ ...prev, is_free: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">
                    Allow non-enrolled students to access this lesson
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addLesson}>Create Lesson</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lesson Dialog */}
      {editingLesson && (
        <Dialog open={true} onOpenChange={() => setEditingLesson(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
              <DialogDescription>
                Update the lesson information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lesson-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-lesson-title"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lesson-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={editingLesson.lesson_type || 'video'}
                  onValueChange={(value) => setEditingLesson(prev => prev ? { ...prev, lesson_type: value } : null)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lesson-duration" className="text-right">
                  Duration (minutes)
                </Label>
                <Input
                  id="edit-lesson-duration"
                  type="number"
                  value={editingLesson.duration_minutes}
                  onChange={(e) => setEditingLesson(prev => prev ? { ...prev, duration_minutes: Number(e.target.value) } : null)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lesson-video" className="text-right">
                  Video URL
                </Label>
                <Input
                  id="edit-lesson-video"
                  value={editingLesson.video_url || ''}
                  onChange={(e) => setEditingLesson(prev => prev ? { ...prev, video_url: e.target.value } : null)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-lesson-content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="edit-lesson-content"
                  value={editingLesson.content || ''}
                  onChange={(e) => setEditingLesson(prev => prev ? { ...prev, content: e.target.value } : null)}
                  placeholder="Lesson content, notes, or description..."
                  rows={4}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lesson-free" className="text-right">
                  Free Lesson
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    id="edit-lesson-free"
                    checked={editingLesson.is_free}
                    onCheckedChange={(checked) => setEditingLesson(prev => prev ? { ...prev, is_free: checked } : null)}
                  />
                  <span className="text-sm text-muted-foreground">
                    Allow non-enrolled students to access this lesson
                  </span>
                </div>
              </div>

              <div className="col-span-4">
                <FileUpload
                  onFileUpload={(fileUrl, fileName) => {
                    setEditingLesson(prev => prev ? {
                      ...prev,
                      file_urls: [...(prev.file_urls || []), fileUrl]
                    } : null);
                  }}
                  existingFiles={editingLesson.file_urls || []}
                  multiple={true}
                  accept="video/*,application/pdf,image/*,.doc,.docx,.txt"
                  description="Upload lesson materials (videos, documents, images)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={updateLesson}>Update Lesson</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No lessons in this module yet</p>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsAddLessonOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Lesson
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getLessonTypeIcon(lesson.lesson_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {index + 1}. {lesson.title}
                    </span>
                    {lesson.is_free && (
                      <Badge variant="secondary" className="text-xs">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration_minutes} min
                    </span>
                    <span>{lesson.lesson_type || 'Lesson'}</span>
                    {lesson.file_urls && lesson.file_urls.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {lesson.file_urls.length} file{lesson.file_urls.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingLesson(lesson)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLesson(lesson.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}