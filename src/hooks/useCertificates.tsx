import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_id: string;
  certificate_number: string;
  title: string;
  description?: string;
  issued_date: string;
  completion_date: string;
  grade?: string;
  score?: number;
  instructor_name: string;
  course_title: string;
  course_duration_hours?: number;
  certificate_url?: string;
  verification_code: string;
  metadata?: any;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
}

export interface CertificateStats {
  totalCertificates: number;
  thisMonth: number;
  averageGrade: string;
  completionRate: number;
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    totalCertificates: 0,
    thisMonth: 0,
    averageGrade: 'N/A',
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_valid', true)
        .order('issued_date', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
      calculateStats(data || []);
    } catch (err: any) {
      console.error('Error fetching certificates:', err);
      setError(err.message);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (certs: Certificate[]) => {
    const totalCertificates = certs.length;
    
    // Calculate certificates issued this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonth = certs.filter(cert => {
      const issueDate = new Date(cert.issued_date);
      return issueDate.getMonth() === currentMonth && 
             issueDate.getFullYear() === currentYear;
    }).length;

    // Calculate average grade
    const gradesWithScores = certs.filter(cert => cert.score !== null && cert.score !== undefined);
    const averageScore = gradesWithScores.length > 0 
      ? gradesWithScores.reduce((sum, cert) => sum + (cert.score || 0), 0) / gradesWithScores.length
      : 0;
    
    let averageGrade = 'N/A';
    if (averageScore > 0) {
      if (averageScore >= 90) averageGrade = 'A+';
      else if (averageScore >= 85) averageGrade = 'A';
      else if (averageScore >= 80) averageGrade = 'B+';
      else if (averageScore >= 75) averageGrade = 'B';
      else if (averageScore >= 70) averageGrade = 'C+';
      else if (averageScore >= 65) averageGrade = 'C';
      else averageGrade = 'D';
    }

    // For completion rate, we'd need enrollment data
    // For now, assume 100% completion rate since they have certificates
    const completionRate = totalCertificates > 0 ? 100 : 0;

    setStats({
      totalCertificates,
      thisMonth,
      averageGrade,
      completionRate
    });
  };

  const verifyCertificate = async (verificationCode: string) => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('verification_code', verificationCode.toUpperCase())
        .eq('is_valid', true)
        .single();

      if (error) throw error;

      return data;
    } catch (err: any) {
      console.error('Error verifying certificate:', err);
      throw new Error('Certificate not found or invalid');
    }
  };

  const downloadCertificate = async (certificateId: string) => {
    try {
      // For now, we'll create a simple certificate download
      // In a real implementation, this would generate a PDF
      const certificate = certificates.find(cert => cert.id === certificateId);
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      // Create a simple text representation for download
      const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that the course:
${certificate.course_title}

Has been successfully completed by the recipient on:
${new Date(certificate.completion_date).toLocaleDateString()}

Certificate Number: ${certificate.certificate_number}
Verification Code: ${certificate.verification_code}
Instructor: ${certificate.instructor_name}
Grade: ${certificate.grade || 'N/A'}
Duration: ${certificate.course_duration_hours || 'N/A'} hours

This certificate is valid and can be verified using the verification code.
`;

      // Create and download the file
      const blob = new Blob([certificateContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.certificate_number}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Certificate downloaded successfully');
    } catch (err: any) {
      console.error('Error downloading certificate:', err);
      toast.error('Failed to download certificate');
    }
  };

  const shareCertificate = async (certificateId: string) => {
    try {
      const certificate = certificates.find(cert => cert.id === certificateId);
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      const shareUrl = `${window.location.origin}/verify-certificate?code=${certificate.verification_code}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Certificate: ${certificate.course_title}`,
          text: `I've completed ${certificate.course_title} and received a certificate!`,
          url: shareUrl
        });
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Certificate verification link copied to clipboard');
      }
    } catch (err: any) {
      console.error('Error sharing certificate:', err);
      toast.error('Failed to share certificate');
    }
  };

  const syncMissingCertificates = async () => {
    try {
      if (!user?.id) return;

      const { data: enrollments, error: enrError } = await supabase
        .from('enrollments')
        .select('id, course_id, status, progress_percentage, completed_at')
        .eq('student_id', user.id);

      if (enrError) throw enrError;

      const completed = (enrollments || []).filter((e: any) => e.status === 'completed' || e.progress_percentage === 100);

      for (const enr of completed) {
        const { data: existing } = await supabase
          .from('certificates')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', enr.course_id)
          .maybeSingle();

        if (!existing) {
          const { error: certError } = await supabase.rpc('award_certificate', {
            _user_id: user.id,
            _course_id: enr.course_id,
            _enrollment_id: enr.id,
            _completion_date: enr.completed_at || new Date().toISOString(),
          });

          if (certError) {
            console.error('Error awarding missing certificate:', certError);
          }
        }
      }

      await fetchCertificates();
    } catch (err: any) {
      console.error('Error syncing certificates:', err);
    }
  };

  return {
    certificates,
    stats,
    loading,
    error,
    fetchCertificates,
    verifyCertificate,
    downloadCertificate,
    shareCertificate,
    syncMissingCertificates
  };
}
