import { useState, useEffect, useCallback } from 'react';
import { progressService } from '@/services/progressService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define types locally to avoid database type dependency
// In your types file or at the top of the file
interface Progress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  progress_percentage: number;
  time_spent_minutes: number;
  time_spent_seconds?: number; // Add this line
  last_accessed_at?: string;   // Add this line
  created_at: string;
  updated_at?: string;
  details?: Progress[];        // Add this line for nested progress details
}

// Make all fields optional to handle partial data from Supabase
interface Certificate {
  id?: string;
  user_id?: string;
  course_id?: string;
  enrollment_id?: string;
  certificate_number?: string;
  title?: string;
  description?: string;
  issued_at?: string;
  issued_date?: string; // For backward compatibility
  completion_date?: string;
  grade?: string;
  score?: number;
  instructor_name?: string;
  course_title?: string;
  course_duration_hours?: number;
  certificate_url?: string;
  verification_code?: string;
  is_valid?: boolean;
  created_at?: string;
  updated_at?: string;
  metadata?: any;
  [key: string]: any; // Allow any other properties
}

// Mock auth context
const useAuth = () => ({
  user: { id: '' },
  isAuthenticated: false
});

export const useCourseProgress = (courseId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<{
    percentage: number;
    completedLessons: number;
    totalLessons: number;
    timeSpent: number;
    lastAccessed: Date | null;
    details: Progress[];
  } | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offlineProgress, setOfflineProgress] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline progress from localStorage
    const savedProgress = localStorage.getItem('offlineProgress');
    if (savedProgress) {
      try {
        setOfflineProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error parsing offline progress:', e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save offline progress to localStorage when it changes
  useEffect(() => {
    if (offlineProgress.length > 0) {
      localStorage.setItem('offlineProgress', JSON.stringify(offlineProgress));
    }
  }, [offlineProgress]);

  // Sync offline progress when coming back online
  useEffect(() => {
    if (isOnline && offlineProgress.length > 0 && user?.id) {
      const syncProgress = async () => {
        try {
          const result = await progressService.syncProgressFromOffline(offlineProgress);
          if (!result.error) {
            // Clear synced progress
            setOfflineProgress([]);
            localStorage.removeItem('offlineProgress');
            
            // Refresh progress
            if (courseId) {
              await loadProgress(courseId);
            }
          } else {
            console.error('Error syncing progress:', result.error);
          }
        } catch (error) {
          console.error('Error in sync progress:', error);
        }
      };

      syncProgress();
    }
  }, [isOnline, offlineProgress, user?.id, courseId]);

  // Load progress for a specific course
  const loadProgress = useCallback(async (courseId: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: progressData, error } = await progressService.getCourseProgress(user.id, courseId);
      
      if (error) throw error;
      
      if (progressData) {
        setProgress({
          percentage: progressData.progress || 0,
          completedLessons: progressData.completedLessons || 0,
          totalLessons: progressData.totalLessons || 0,
          timeSpent: progressData.timeSpent || 0,
          lastAccessed: progressData.lastAccessed ? new Date(progressData.lastAccessed) : null,
          details: progressData.details || []
        });
      }
      
      // Check for certificate - Implement this part based on your certificate service
      // try {
      //   const { data: certificates, error: certError } = await certificateService.getUserCertificates(user.id);
      //   if (certificates && !certError) {
      //     const courseCert = certificates.find(cert => cert.course_id === courseId);
      //     if (courseCert) setCertificate(courseCert);
      //   }
      // } catch (e) {
      //   console.error('Error loading certificate:', e);
      // }
    } catch (error) {
      console.error('Error loading progress:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Track lesson progress
  const trackProgress = useCallback(async ({
    courseId,
    moduleId,
    lessonId,
    completed = true,
    timeSpentSeconds = 0,
  }: {
    courseId: string;
    moduleId: string;
    lessonId: string;
    completed?: boolean;
    timeSpentSeconds?: number;
  }) => {
    if (!user?.id) return { success: false, error: new Error('User not authenticated') };

    const progressData = {
      userId: user.id,
      courseId,
      moduleId,
      lessonId,
      completed,
      timeSpentSeconds,
    };

    try {
      if (!isOnline) {
        // Store progress locally if offline
        setOfflineProgress(prev => [
          ...prev.filter(p => !(p.lessonId === lessonId && p.courseId === courseId)),
          { ...progressData, timestamp: new Date().toISOString() }
        ]);
        
        // Update local state optimistically
        setProgress(prev => {
          if (!prev) return null;
          
          const existing = prev.details.find(p => 
            p.lesson_id === lessonId && p.course_id === courseId
          );
          
          const updatedDetails = existing
            ? prev.details.map(p => 
                p.lesson_id === lessonId && p.course_id === courseId
                  ? { 
                      ...p, 
                      completed: completed ?? p.completed,
                      time_spent_seconds: (p.time_spent_seconds || 0) + timeSpentSeconds,
                      last_accessed_at: new Date().toISOString(),
                    }
                  : p
              )
            : [
                ...prev.details,
                {
                  id: `offline-${Date.now()}`,
                  user_id: user.id,
                  course_id: courseId,
                  module_id: moduleId,
                  lesson_id: lessonId,
                  completed: completed || false,
                  progress_percentage: completed ? 100 : 0,
                  time_spent_seconds: timeSpentSeconds,
                  last_accessed_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                } as any
              ];
          
          const completedLessons = updatedDetails.filter(p => p.completed).length;
          const totalLessons = updatedDetails.length;
          
          return {
            ...prev,
            percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
            completedLessons,
            totalLessons,
            timeSpent: updatedDetails.reduce((acc, p) => acc + (p.time_spent_seconds || 0), 0),
            lastAccessed: new Date(),
            details: updatedDetails,
          };
        });
        
        return { success: true, offline: true };
      }

      // If online, save to server
      const { data, error } = await progressService.trackLessonProgress({
        userId: user.id,
        lessonId,
        moduleId,
        completed,
        timeSpentMinutes: Math.ceil(timeSpentSeconds / 60) // Convert seconds to minutes
      });
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setProgress(prev => {
          if (!prev) return null;
          
          const existingIndex = prev.details.findIndex(p => 
            p.lesson_id === lessonId && p.course_id === courseId
          );
          
          const updatedDetails = [...prev.details];
          if (existingIndex >= 0) {
            updatedDetails[existingIndex] = data;
          } else {
            updatedDetails.push(data);
          }
          
          const completedLessons = updatedDetails.filter(p => p.completed).length;
          const totalLessons = updatedDetails.length;
          
          return {
            ...prev,
            percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
            completedLessons,
            totalLessons,
            timeSpent: updatedDetails.reduce((acc, p) => acc + (p.time_spent_seconds || 0), 0),
            lastAccessed: new Date(data.last_accessed_at),
            details: updatedDetails,
          };
        });
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error tracking progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress. Your progress will be saved locally and synced later.',
        variant: 'destructive',
      });
      
      // Fallback to offline mode
      setOfflineProgress(prev => [
        ...prev.filter(p => !(p.lessonId === lessonId && p.courseId === courseId)),
        { ...progressData, timestamp: new Date().toISOString() }
      ]);
      
      return { success: false, error: error as Error, offline: true };
    }
  }, [user?.id, isOnline, toast]);

  // Mark a lesson as completed
  const completeLesson = useCallback(async (params: {
    courseId: string;
    moduleId: string;
    lessonId: string;
  }) => {
    return trackProgress({
      ...params,
      completed: true,
      timeSpentSeconds: 0, // No additional time spent, just marking as complete
    });
  }, [trackProgress]);

  // Get certificate for a course
  const getCertificate = useCallback(async (courseId: string) => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('issued_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      const certData = data?.[0] as Record<string, any>; // Use type assertion to handle dynamic properties
      if (!certData) {
        setCertificate(null);
        return null;
      }
      
      // Map the data to match the Certificate interface
      const issuedDate = certData.issued_at || certData.issued_date || new Date().toISOString();
      const completionDate = certData.completion_date || issuedDate;
      const title = certData.title || certData.course_title || 'Course Completion Certificate';
      const courseTitle = certData.course_title || 'Course';

      const cert: Certificate = {
        id: certData.id || '',
        user_id: certData.user_id || '',
        course_id: certData.course_id || '',
        enrollment_id: certData.enrollment_id || '',
        certificate_number: certData.certificate_number || '',
        title,
        description: certData.description || '',
        issued_at: issuedDate,
        issued_date: certData.issued_date,
        completion_date: completionDate,
        grade: certData.grade || '',
        score: certData.score || 0,
        instructor_name: certData.instructor_name || 'Instructor',
        course_title: courseTitle,
        course_duration_hours: certData.course_duration_hours || 0,
        certificate_url: certData.certificate_url || '',
        verification_code: certData.verification_code || '',
        is_valid: certData.is_valid !== false, // Default to true if not explicitly false
        created_at: certData.created_at || new Date().toISOString(),
        updated_at: certData.updated_at,
        metadata: certData.metadata || {}
      };
      
      setCertificate(cert);
      return cert;
    } catch (error) {
      console.error('Error getting certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to load certificate',
        variant: 'destructive',
      });
      return null;
    }
  }, [user?.id]);

  // Generate certificate (if eligible)
  const generateCertificate = useCallback(async (courseId: string) => {
    if (!user?.id) return { success: false, error: new Error('User not authenticated') };
    
    try {
      const { completed, certificate: cert } = await progressService.checkCourseCompletion(user.id, courseId);
      
      if (completed && cert) {
        setCertificate(cert);
        return { success: true, certificate: cert };
      }
      
      return { 
        success: false, 
        error: new Error(completed ? 'Certificate generation failed' : 'Course not completed') 
      };
    } catch (error) {
      console.error('Error generating certificate:', error);
      return { success: false, error: error as Error };
    }
  }, [user?.id]);

  return {
    // State
    progress,
    certificate,
    isLoading,
    error,
    isOnline,
    offlineProgressCount: offlineProgress.length,
    
    // Actions
    loadProgress,
    trackProgress,
    completeLesson,
    getCertificate,
    generateCertificate,
  };
};

export default useCourseProgress;
