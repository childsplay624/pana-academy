import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  max_score: number | null;
  course_title: string;
  lesson_title: string;
  submission?: {
    id: string;
    status: 'pending' | 'submitted' | 'graded';
    submitted_at: string | null;
    score: number | null;
    content: string | null;
    feedback: string | null;
  };
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all assignments from courses the student is enrolled in
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          description,
          due_date,
          max_score,
          lessons!inner (
            title,
            modules!inner (
              courses!inner (
                title,
                enrollments!inner (
                  student_id
                )
              )
            )
          )
        `)
        .eq('lessons.modules.courses.enrollments.student_id', user.id);

      if (assignmentsError) throw assignmentsError;

      // Get submissions for these assignments
      const assignmentIds = assignmentsData?.map(a => a.id) || [];
      let submissionsData = [];

      if (assignmentIds.length > 0) {
        const { data: submissions, error: submissionsError } = await supabase
          .from('assignment_submissions')
          .select('*')
          .in('assignment_id', assignmentIds)
          .eq('student_id', user.id);

        if (submissionsError) throw submissionsError;
        submissionsData = submissions || [];
      }

      // Combine assignments with their submissions
      const processedAssignments: Assignment[] = assignmentsData?.map(assignment => {
        const submission = submissionsData.find(s => s.assignment_id === assignment.id);
        
        return {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          due_date: assignment.due_date,
          max_score: assignment.max_score,
          course_title: assignment.lessons.modules.courses.title,
          lesson_title: assignment.lessons.title,
          submission: submission ? {
            id: submission.id,
            status: submission.status as 'pending' | 'submitted' | 'graded',
            submitted_at: submission.submitted_at,
            score: submission.score,
            content: submission.content,
            feedback: submission.feedback
          } : undefined
        };
      }) || [];

      setAssignments(processedAssignments);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentsByStatus = (status: 'pending' | 'submitted' | 'graded' | 'all') => {
    if (status === 'all') return assignments;
    
    return assignments.filter(assignment => {
      if (!assignment.submission) {
        return status === 'pending';
      }
      return assignment.submission.status === status;
    });
  };

  const getStats = () => {
    const total = assignments.length;
    const pending = assignments.filter(a => !a.submission || a.submission.status === 'pending').length;
    const submitted = assignments.filter(a => a.submission?.status === 'submitted').length;
    const graded = assignments.filter(a => a.submission?.status === 'graded').length;
    
    const gradedAssignments = assignments.filter(a => a.submission?.status === 'graded' && a.submission.score !== null);
    const avgGrade = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, a) => sum + (a.submission?.score || 0), 0) / gradedAssignments.length
      : 0;

    return { total, pending, submitted, graded, avgGrade };
  };

  return {
    assignments,
    loading,
    error,
    getAssignmentsByStatus,
    getStats,
    refetch: fetchAssignments
  };
}