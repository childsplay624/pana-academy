import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Award, 
  Save, 
  Eye,
  Download,
  Send,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CertificateGeneratorProps {
  enrollmentId?: string;
  courseId?: string;
  studentId?: string;
  onCertificateCreated?: (certificateId: string) => void;
}

export function CertificateGenerator({ 
  enrollmentId, 
  courseId, 
  studentId,
  onCertificateCreated 
}: CertificateGeneratorProps) {
  const [formData, setFormData] = useState({
    courseId: courseId || '',
    studentId: studentId || '',
    enrollmentId: enrollmentId || '',
    completionDate: new Date().toISOString().split('T')[0],
    score: '',
    grade: '',
    customTitle: '',
    customDescription: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    return 'D';
  };

  const handleScoreChange = (value: string) => {
    const score = parseInt(value);
    handleInputChange('score', value);
    if (!isNaN(score) && score >= 0 && score <= 100) {
      handleInputChange('grade', calculateGrade(score));
    }
  };

  const generateCertificate = async () => {
    if (!formData.courseId || !formData.studentId || !formData.enrollmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('award_certificate', {
        _user_id: formData.studentId,
        _course_id: formData.courseId,
        _enrollment_id: formData.enrollmentId,
        _completion_date: new Date(formData.completionDate).toISOString(),
        _score: formData.score ? parseInt(formData.score) : null,
        _grade: formData.grade || null
      });

      if (error) throw error;

      // If custom title or description, update the certificate
      if (formData.customTitle || formData.customDescription) {
        const updateData: any = {};
        if (formData.customTitle) updateData.title = formData.customTitle;
        if (formData.customDescription) updateData.description = formData.customDescription;

        await supabase
          .from('certificates')
          .update(updateData)
          .eq('id', data);
      }

      toast.success('Certificate generated successfully');
      onCertificateCreated?.(data);
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast.error(error.message || 'Failed to generate certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const previewCertificate = () => {
    setPreviewMode(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificate Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Course ID</Label>
              <Input
                id="courseId"
                value={formData.courseId}
                onChange={(e) => handleInputChange('courseId', e.target.value)}
                placeholder="Enter course ID"
                disabled={!!courseId}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="Enter student ID"
                disabled={!!studentId}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enrollmentId">Enrollment ID</Label>
              <Input
                id="enrollmentId"
                value={formData.enrollmentId}
                onChange={(e) => handleInputChange('enrollmentId', e.target.value)}
                placeholder="Enter enrollment ID"
                disabled={!!enrollmentId}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <Input
                id="completionDate"
                type="date"
                value={formData.completionDate}
                onChange={(e) => handleInputChange('completionDate', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Grading Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (%)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={formData.score}
                onChange={(e) => handleScoreChange(e.target.value)}
                placeholder="Enter score (0-100)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C+">C+</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Customization Options */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customTitle">Custom Certificate Title (Optional)</Label>
              <Input
                id="customTitle"
                value={formData.customTitle}
                onChange={(e) => handleInputChange('customTitle', e.target.value)}
                placeholder="Leave empty to use default course title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customDescription">Custom Description (Optional)</Label>
              <Textarea
                id="customDescription"
                value={formData.customDescription}
                onChange={(e) => handleInputChange('customDescription', e.target.value)}
                placeholder="Leave empty to use default description"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={generateCertificate}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Generating...' : 'Generate Certificate'}
            </Button>
            <Button 
              variant="outline"
              onClick={previewCertificate}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal/Section */}
      {previewMode && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Certificate Preview
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewMode(false)}
              >
                Close Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* Certificate Preview Design */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-lg border-2 border-dashed border-primary/30">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <Award className="h-16 w-16 text-yellow-500" />
                </div>
                
                <h1 className="text-3xl font-bold text-primary">
                  CERTIFICATE OF COMPLETION
                </h1>
                
                <div className="space-y-4">
                  <p className="text-lg">This is to certify that</p>
                  <div className="border-b-2 border-primary/30 pb-2 max-w-md mx-auto">
                    <p className="text-xl font-semibold">[Student Name]</p>
                  </div>
                  <p className="text-lg">has successfully completed the course</p>
                  <div className="border-b-2 border-primary/30 pb-2 max-w-lg mx-auto">
                    <p className="text-xl font-semibold">
                      {formData.customTitle || '[Course Title]'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-8 mt-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Completion Date</p>
                    <p className="font-semibold">{new Date(formData.completionDate).toLocaleDateString()}</p>
                  </div>
                  {formData.grade && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <Badge variant="secondary" className="font-semibold">
                        {formData.grade}
                      </Badge>
                    </div>
                  )}
                  {formData.score && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="font-semibold">{formData.score}%</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6 mt-8">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <div className="border-b border-gray-300 pb-1 mb-1 w-32">
                        <p className="text-sm">Instructor</p>
                      </div>
                      <p className="text-xs text-muted-foreground">[Instructor Name]</p>
                    </div>
                    <div className="text-right">
                      <div className="border-b border-gray-300 pb-1 mb-1 w-32">
                        <p className="text-sm">Certificate ID</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">[Certificate Number]</p>
                    </div>
                  </div>
                </div>

                {formData.customDescription && (
                  <div className="mt-6 p-4 bg-white/50 dark:bg-black/20 rounded">
                    <p className="text-sm italic">{formData.customDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}