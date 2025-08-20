import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import InstructorDashboard from "./pages/dashboards/InstructorDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import MyCourses from "./pages/student/MyCourses";
import Certificates from "./pages/student/Certificates";
import Progress from "./pages/student/Progress";
import Assignments from "./pages/student/Assignments";
import Help from "./pages/student/Help";
import CourseLearning from "./pages/CourseLearning";
import PublicCoursesPage from "./pages/PublicCoursesPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetails from "./pages/course/CourseDetails";
import { CourseEditor } from "./components/course-management/CourseEditor";
import CourseCreator from "./components/course-management/CourseCreator";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import VerifyCertificate from "./pages/VerifyCertificate";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<PublicCoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/instructor" 
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/courses" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'instructor', 'student']}>
                  <CoursesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId" 
              element={
                <ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}>
                  <CourseLearning />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/course/:courseId/edit" 
              element={
                <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                  <CourseEditor />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/courses/new" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'instructor']}>
                  <CourseCreator />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/certificates" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Certificates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/progress" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Progress />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/assignments" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Assignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/help" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Help />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/analytics" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
