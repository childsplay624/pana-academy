import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEmailNotifications = () => {
  const sendEnrollmentConfirmation = async (courseId: string, studentId: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-enrollment-confirmation-email', {
        body: { courseId, studentId }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to send enrollment confirmation email:', error);
      // Don't throw error to prevent enrollment failure
    }
  };

  const sendCertificateNotification = async (certificateId: string, userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-certificate-email', {
        body: { certificateId, userId }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to send certificate notification email:', error);
    }
  };

  const sendAssignmentGradedNotification = async (submissionId: string, score: number, feedback?: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-assignment-graded-email', {
        body: { submissionId, score, feedback }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to send assignment graded email:', error);
    }
  };

  const sendSessionReminder = async (courseId: string, reminderType: '24h' | '1h' | '15m') => {
    try {
      const { error } = await supabase.functions.invoke('send-session-reminder-email', {
        body: { courseId, reminderType }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to send session reminder email:', error);
    }
  };

  return {
    sendEnrollmentConfirmation,
    sendCertificateNotification,
    sendAssignmentGradedNotification,
    sendSessionReminder
  };
};