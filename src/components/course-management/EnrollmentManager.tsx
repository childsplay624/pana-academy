import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Users,
    MoreHorizontal,
    CheckCircle,
    Award,
    XCircle,
    Clock,
    Search,
    Mail,
    Filter
} from "lucide-react";
import { toast } from 'sonner';
import { CertificateGenerator } from '../certificate/CertificateGenerator';

interface EnrollmentManagerProps {
    courseId: string;
    canEdit: boolean;
}

interface EnrollmentWithStudent {
    id: string;
    student_id: string;
    status: string;
    progress_percentage: number;
    enrolled_at: string;
    completed_at: string | null;
    profiles: {
        full_name: string | null;
        email: string | null;
    };
}

export function EnrollmentManager({ courseId, canEdit }: EnrollmentManagerProps) {
    const [enrollments, setEnrollments] = useState<EnrollmentWithStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithStudent | null>(null);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const { sendEnrollmentConfirmation, sendCertificateNotification } = useEmailNotifications();

    useEffect(() => {
        fetchEnrollments();
    }, [courseId]);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
          id,
          student_id,
          status,
          progress_percentage,
          enrolled_at,
          completed_at,
          profiles:student_id (full_name, email)
        `)
                .eq('course_id', courseId)
                .order('enrolled_at', { ascending: false });

            if (error) throw error;
            setEnrollments(data as any || []);
        } catch (error: any) {
            console.error('Error fetching enrollments:', error);
            toast.error('Failed to load enrollments');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (enrollmentId: string, status: string) => {
        try {
            const { error } = await supabase
                .from('enrollments')
                .update({
                    status,
                    completed_at: status === 'completed' ? new Date().toISOString() : null,
                    progress_percentage: status === 'completed' ? 100 : undefined
                })
                .eq('id', enrollmentId);

            if (error) throw error;

            toast.success(`Enrollment marked as ${status}`);

            // Send certificate notification email when enrollment is completed
            if (status === 'completed') {
                const enrollment = enrollments.find(e => e.id === enrollmentId);
                if (enrollment?.profiles?.email && enrollment?.profiles?.full_name) {
                    // Fetch course title for the email
                    supabase.from('courses').select('title').eq('id', courseId).single().then(({ data: course }) => {
                        if (course) {
                            sendCertificateNotification(
                                course.title,
                                enrollment.profiles.full_name!,
                                enrollment.profiles.email!
                            ).catch(err => console.warn('Certificate email failed (non-critical):', err));
                        }
                    });
                }
            }

            fetchEnrollments();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update enrollment');
        }
    };

    const filteredEnrollments = enrollments.filter(e =>
        e.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold">Student Enrollments</h2>
                    <Badge variant="secondary" className="ml-2">
                        {enrollments.length} Total
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            className="pl-9 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Enrolled On</TableHead>
                            <TableHead>Completed On</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEnrollments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                    No students enrolled in this course yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEnrollments.map((enr) => (
                                <TableRow key={enr.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground">
                                                {enr.profiles?.full_name || 'Unnamed Student'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {enr.profiles?.email || 'No email provided'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                enr.status === 'completed' ? 'default' :
                                                    enr.status === 'active' ? 'secondary' : 'outline'
                                            }
                                            className="capitalize"
                                        >
                                            {enr.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${enr.progress_percentage || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium">{enr.progress_percentage || 0}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(enr.enrolled_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {enr.completed_at ? new Date(enr.completed_at).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />

                                                {enr.status !== 'completed' && (
                                                    <DropdownMenuItem onClick={() => updateStatus(enr.id, 'completed')}>
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Quick Complete
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedEnrollment(enr);
                                                    setIsGeneratorOpen(true);
                                                }}>
                                                    <Award className="h-4 w-4 mr-2" />
                                                    Issue Certificate
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={() => window.open(`mailto:${enr.profiles?.email}`)}>
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Email Student
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => updateStatus(enr.id, 'cancelled')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Revoke Access
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Certificate Generator Dialog */}
            <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Issue Certificate</DialogTitle>
                        <DialogDescription>
                            Create a custom certificate for {selectedEnrollment?.profiles?.full_name}.
                            This will also mark the course as completed for them.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEnrollment && (
                        <div className="mt-4">
                            <CertificateGenerator
                                enrollmentId={selectedEnrollment.id}
                                courseId={courseId}
                                studentId={selectedEnrollment.student_id}
                                onCertificateCreated={() => {
                                    fetchEnrollments();
                                    setIsGeneratorOpen(false);
                                }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
