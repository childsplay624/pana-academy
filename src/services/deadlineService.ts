import { supabase } from '@/integrations/supabase/client';

export interface Deadline {
    id: string;
    courseId: string;
    moduleId?: string;
    title: string;
    description?: string;
    type: 'assignment' | 'quiz' | 'project' | 'live_session' | 'exam';
    dueDate: string;
    points: number;
    isPublished: boolean;
    attachmentUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserDeadline {
    id: string;
    userId: string;
    deadlineId: string;
    completed: boolean;
    completedAt?: string;
    submissionUrl?: string;
    score?: number;
    feedback?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeadlineWithCourse extends Deadline {
    courseTitle: string;
    moduleName?: string;
    userSubmission?: UserDeadline;
    isOverdue: boolean;
    daysUntilDue: number;
}

/**
 * Get upcoming deadlines for a user
 */
export async function getUpcomingDeadlines(
    userId: string,
    limit = 10
): Promise<DeadlineWithCourse[]> {
    try {
        // Get user's enrolled courses
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('student_id', userId);

        if (enrollError) throw enrollError;

        const courseIds = enrollments?.map(e => e.course_id) || [];

        if (courseIds.length === 0) {
            return [];
        }

        // Get deadlines for enrolled courses
        const now = new Date().toISOString();
        const { data: deadlines, error: deadlinesError } = await supabase
            .from('deadlines')
            .select(`
        *,
        course:courses(id, title),
        module:modules(id, title)
      `)
            .in('course_id', courseIds)
            .eq('is_published', true)
            .gte('due_date', now)
            .order('due_date', { ascending: true })
            .limit(limit);

        if (deadlinesError) throw deadlinesError;

        if (!deadlines || deadlines.length === 0) {
            return [];
        }

        // Get user submissions for these deadlines
        const deadlineIds = deadlines.map(d => d.id);
        const { data: submissions, error: submissionsError } = await supabase
            .from('user_deadlines')
            .select('*')
            .eq('student_id', userId)
            .in('deadline_id', deadlineIds);

        if (submissionsError) {
            console.error('Error fetching submissions:', submissionsError);
        }

        // Type for submission data from database
        type SubmissionData = {
            id: string;
            student_id: string;
            deadline_id: string;
            completed: boolean;
            completed_at: string | null;
            submission_url: string | null;
            score: number | null;
            feedback: string | null;
            created_at: string;
            updated_at: string;
        };

        const submissionsMap = new Map<string, SubmissionData>(
            (submissions as SubmissionData[])?.map(s => [s.deadline_id, s]) || []
        );

        // Format deadlines with additional info
        return deadlines.map(deadline => {
            const now = new Date();
            const dueDate = new Date(deadline.due_date);
            const diffTime = dueDate.getTime() - now.getTime();
            const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;

            const submission = submissionsMap.get(deadline.id);

            return {
                id: deadline.id,
                courseId: deadline.course_id,
                moduleId: deadline.module_id,
                title: deadline.title,
                description: deadline.description,
                type: deadline.type,
                dueDate: deadline.due_date,
                points: deadline.points || 0,
                isPublished: deadline.is_published,
                attachmentUrl: deadline.attachment_url,
                createdAt: deadline.created_at,
                updatedAt: deadline.updated_at,
                courseTitle: deadline.course?.title || 'Unknown Course',
                moduleName: deadline.module?.title,
                userSubmission: submission ? {
                    id: submission.id,
                    userId: submission.student_id,
                    deadlineId: submission.deadline_id,
                    completed: submission.completed,
                    completedAt: submission.completed_at,
                    submissionUrl: submission.submission_url,
                    score: submission.score,
                    feedback: submission.feedback,
                    createdAt: submission.created_at,
                    updatedAt: submission.updated_at
                } : undefined,
                isOverdue,
                daysUntilDue
            };
        });
    } catch (error) {
        console.error('Error fetching upcoming deadlines:', error);
        return [];
    }
}

/**
 * Get all deadlines for a course (for instructors)
 */
export async function getCourseDeadlines(courseId: string): Promise<Deadline[]> {
    try {
        const { data, error } = await supabase
            .from('deadlines')
            .select('*')
            .eq('course_id', courseId)
            .order('due_date', { ascending: true });

        if (error) throw error;

        return (data || []).map(item => ({
            id: item.id,
            courseId: item.course_id,
            moduleId: item.module_id,
            title: item.title,
            description: item.description,
            type: item.type,
            dueDate: item.due_date,
            points: item.points || 0,
            isPublished: item.is_published,
            attachmentUrl: item.attachment_url,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        }));
    } catch (error) {
        console.error('Error fetching course deadlines:', error);
        return [];
    }
}

/**
 * Create a new deadline
 */
export async function createDeadline(
    deadline: Omit<Deadline, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ data: Deadline | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('deadlines')
            .insert({
                course_id: deadline.courseId,
                module_id: deadline.moduleId,
                title: deadline.title,
                description: deadline.description,
                type: deadline.type,
                due_date: deadline.dueDate,
                points: deadline.points,
                is_published: deadline.isPublished,
                attachment_url: deadline.attachmentUrl
            })
            .select()
            .single();

        if (error) {
            return { data: null, error };
        }

        return {
            data: {
                id: data.id,
                courseId: data.course_id,
                moduleId: data.module_id,
                title: data.title,
                description: data.description,
                type: data.type,
                dueDate: data.due_date,
                points: data.points,
                isPublished: data.is_published,
                attachmentUrl: data.attachment_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            },
            error: null
        };
    } catch (error) {
        console.error('Error creating deadline:', error);
        return { data: null, error };
    }
}

/**
 * Submit to a deadline
 */
export async function submitDeadline(
    userId: string,
    deadlineId: string,
    submissionUrl?: string
): Promise<{ data: UserDeadline | null; error: any }> {
    try {
        // Check if submission already exists
        const { data: existing } = await supabase
            .from('user_deadlines')
            .select('*')
            .eq('student_id', userId)
            .eq('deadline_id', deadlineId)
            .maybeSingle();

        if (existing) {
            // Update existing submission
            const { data, error } = await supabase
                .from('user_deadlines')
                .update({
                    submission_url: submissionUrl,
                    completed: true,
                    completed_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                return { data: null, error };
            }

            return {
                data: {
                    id: data.id,
                    userId: data.student_id,
                    deadlineId: data.deadline_id,
                    completed: data.completed,
                    completedAt: data.completed_at,
                    submissionUrl: data.submission_url,
                    score: data.score,
                    feedback: data.feedback,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                },
                error: null
            };
        } else {
            // Create new submission
            const { data, error } = await supabase
                .from('user_deadlines')
                .insert({
                    student_id: userId,
                    deadline_id: deadlineId,
                    submission_url: submissionUrl,
                    completed: true,
                    completed_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) {
                return { data: null, error };
            }

            return {
                data: {
                    id: data.id,
                    userId: data.student_id,
                    deadlineId: data.deadline_id,
                    completed: data.completed,
                    completedAt: data.completed_at,
                    submissionUrl: data.submission_url,
                    score: data.score,
                    feedback: data.feedback,
                    createdAt: data.created_at,
                    updatedAt: data.updated_at
                },
                error: null
            };
        }
    } catch (error) {
        console.error('Error submitting deadline:', error);
        return { data: null, error };
    }
}

/**
 * Grade a submission (for instructors)
 */
export async function gradeSubmission(
    submissionId: string,
    score: number,
    feedback?: string
): Promise<{ data: UserDeadline | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('user_deadlines')
            .update({
                score,
                feedback
            })
            .eq('id', submissionId)
            .select()
            .single();

        if (error) {
            return { data: null, error };
        }

        return {
            data: {
                id: data.id,
                userId: data.student_id,
                deadlineId: data.deadline_id,
                completed: data.completed,
                completedAt: data.completed_at,
                submissionUrl: data.submission_url,
                score: data.score,
                feedback: data.feedback,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            },
            error: null
        };
    } catch (error) {
        console.error('Error grading submission:', error);
        return { data: null, error };
    }
}

/**
 * Helper: Get urgency level based on days until due
 */
export function getDeadlineUrgency(daysUntilDue: number): 'overdue' | 'urgent' | 'soon' | 'normal' {
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 2) return 'urgent';
    if (daysUntilDue <= 7) return 'soon';
    return 'normal';
}

/**
 * Helper: Get formatted deadline text
 */
export function formatDeadlineTime(daysUntilDue: number): string {
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due Today';
    if (daysUntilDue === 1) return 'Due Tomorrow';
    return `Due in ${daysUntilDue} days`;
}
