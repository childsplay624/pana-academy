import { useState, useEffect } from 'react';
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
import { CertificateDesign } from './CertificateDesign';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

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
  const [isFetching, setIsFetching] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { sendCertificateNotification } = useEmailNotifications();

  useEffect(() => {
    if (formData.courseId) {
      fetchCourseDetails();
    }
  }, [formData.courseId]);

  useEffect(() => {
    if (formData.studentId) {
      fetchStudentDetails();
    }
  }, [formData.studentId]);

  const fetchCourseDetails = async () => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', formData.courseId)
        .single();

      if (error) console.error('Error fetching course:', error);
      else setCourseData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchStudentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', formData.studentId)
        .single();

      if (error) console.error('Error fetching student:', error);
      else setStudentData(data);
    } catch (err) {
      console.error(err);
    }
  };

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
      const { data, error } = await supabase.rpc('generate_certificate', {
        _user_id: formData.studentId,
        _course_id: formData.courseId,
        _enrollment_id: formData.enrollmentId,
        _completion_date: formData.completionDate || new Date().toISOString(),
        _score: formData.score,
        _grade: formData.grade
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || 'Failed to generate certificate');
      }

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

      // Send certificate notification email (non-blocking)
      if (studentData?.email && studentData?.full_name && courseData?.title) {
        sendCertificateNotification(
          courseData.title,
          studentData.full_name,
          studentData.email
        ).catch(err => console.warn('Certificate email failed (non-critical):', err));
      }

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
          <CardContent className="p-8 overflow-auto">
            {/* Certificate Preview Design */}
            <div className="flex justify-center">
              <CertificateDesign
                studentName={studentData?.full_name || "[Student Name]"}
                courseTitle={formData.customTitle || courseData?.title || "[Course Title]"}
                completionDate={new Date(formData.completionDate).toISOString()}
                courseDuration={courseData?.duration_hours ? `${Math.ceil(courseData.duration_hours / 8)}-Day` : "3-Day"}
                instructorName="PANA Academy Instructor"
                certificateId="[Certificate Number]"
                venueName={courseData?.venue_name}
                venueAddress={courseData?.venue_address}
                venueCity={courseData?.venue_city}
                venueCountry={courseData?.venue_country}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}