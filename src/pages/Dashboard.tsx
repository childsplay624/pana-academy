import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  switch (profile.role) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'instructor':
      return <Navigate to="/dashboard/instructor" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/dashboard/student" replace />;
  }
}