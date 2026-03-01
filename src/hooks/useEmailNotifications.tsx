import { supabase } from '@/integrations/supabase/client';

export const useEmailNotifications = () => {
  const sendEnrollmentConfirmation = async (courseTitle: string, userName: string, userEmail: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'enrollment',
          payload: { courseTitle, userName }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send enrollment confirmation email:', error);
    }
  };

  const sendCertificateNotification = async (courseTitle: string, userName: string, userEmail: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'certificate',
          payload: { courseTitle, userName }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send certificate notification email:', error);
    }
  };

  const sendAssignmentGradedNotification = async (assignmentTitle: string, score: number, userName: string, userEmail: string, feedback?: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'grading',
          payload: { assignmentTitle, score, userName, feedback }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send assignment graded email:', error);
    }
  };

  const sendSessionReminder = async (userEmail: string, courseTitle: string, reminderType: '24h' | '1h' | '15m') => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'custom',
          subject: `Reminder: Upcoming Session for ${courseTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Session Reminder</h2>
              <p>Your session for <strong>${courseTitle}</strong> starts in ${reminderType}.</p>
              <p>Please log in to your dashboard to join the session.</p>
              <a href="${window.location.origin}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #ba000e; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;">
                Go to Dashboard
              </a>
            </div>
          `
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send session reminder email:', error);
    }
  };

  const sendLevelUpNotification = async (userName: string, userEmail: string, newLevel: number, totalXp: number) => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'level_up',
          payload: { userName, newLevel, xp: totalXp }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send level up notification email:', error);
    }
  };

  const sendStreakReminder = async (userName: string, userEmail: string, streakDays: number, hoursLeft: number) => {
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          to: userEmail,
          type: 'streak_reminder',
          payload: { userName, streakDays, hoursLeft }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send streak reminder email:', error);
    }
  };

  return {
    sendEnrollmentConfirmation,
    sendCertificateNotification,
    sendAssignmentGradedNotification,
    sendSessionReminder,
    sendLevelUpNotification,
    sendStreakReminder
  };
};