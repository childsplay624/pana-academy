import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/pages/admin/CourseManagement';
import MyCourses from '@/pages/student/MyCourses';

export default function CoursesPage() {
  const { profile } = useAuth();
  
  // Render different components based on user role
  if (profile?.role === 'student') {
    return <MyCourses />;
  }
  
  // For admin and instructor roles
  return <CourseManagement />;
}