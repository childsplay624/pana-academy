import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SuspendedAccountNotice } from '@/components/SuspendedAccountNotice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'instructor' | 'admin'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has been suspended or deactivated
  const isSuspended = Boolean(profile?.social_links && typeof profile.social_links === 'object' && (profile.social_links.is_suspended || profile.social_links.is_deleted));
  if (isSuspended) {
    return <SuspendedAccountNotice />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}