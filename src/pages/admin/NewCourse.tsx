import { CreateCourseWizard } from '@/components/admin/CreateCourseWizard';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function NewCourse() {
    return (
        <DashboardLayout>
            <CreateCourseWizard />
        </DashboardLayout>
    );
}
