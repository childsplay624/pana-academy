import { DashboardLayout } from '@/components/DashboardLayout';
import { ProfileEdit } from '@/components/student/ProfileEdit';

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        
        <ProfileEdit />
      </div>
    </DashboardLayout>
  );
}
