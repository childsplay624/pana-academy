import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ScrollToTop } from '@/components/ScrollToTop';
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
import Profile from "./pages/student/Profile";
import CourseLearning from "./pages/CourseLearning";
import PublicCoursesPage from "./pages/PublicCoursesPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetails from "./pages/course/CourseDetails";
import { CoursePlayer } from "./components/course/CoursePlayer";
import { CourseEditor } from "./components/course-management/CourseEditor";
import NewCourse from "./pages/admin/NewCourse";
import PaymentManagement from "./pages/admin/PaymentManagement";
import InvoicesPage from "./pages/admin/InvoicesPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import VerifyCertificate from "./pages/VerifyCertificate";
import TestPage from "./pages/TestPage";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import TeamPage from "./pages/team/TeamPage";
import TeamMemberPage from "./pages/team/TeamMemberPage";
import TrainingDeliveryPage from "./pages/TrainingDeliveryPage";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import ImageManagement from "./pages/admin/ImageManagement";
import SupportTickets from "./pages/admin/SupportTickets";
import ConsultingServicesPage from "./pages/ConsultingServicesPage";
import RnDServicesPage from "./pages/RnDServicesPage";
import ContactPage from "./pages/ContactPage";
import TrainingCalendarPage from "./pages/TrainingCalendarPage";
import AuthCallback from "./pages/auth/callback";
import OurJourney from "./pages/our-journey";
import IndexNew from "./pages/IndexNew";
import AboutPage from "./pages/AboutPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentCallbackPage } from "./pages/PaymentCallbackPage";
import CareersPage from "./pages/CareersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Dialog>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home-new" element={<IndexNew />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/courses" element={<PublicCoursesPage />} />
                  <Route path="/courses/:category" element={<PublicCoursesPage />} />
                  <Route path="/course/:id" element={<CourseDetails />} />

                  {/* Payment Routes */}
                  <Route path="/payment/:courseId" element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment/callback" element={
                    <ProtectedRoute>
                      <PaymentCallbackPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/course/:courseId/learn" element={
                    <ProtectedRoute>
                      <CoursePlayer />
                    </ProtectedRoute>
                  } />
                  <Route path="/course/:courseId/learn/:moduleId/:lessonId" element={
                    <ProtectedRoute>
                      <CoursePlayer />
                    </ProtectedRoute>
                  } />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/verify-certificate" element={<VerifyCertificate />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/team/:memberId" element={<TeamMemberPage />} />
                  <Route path="/training-delivery" element={<TrainingDeliveryPage />} />
                  <Route path="/consulting-services" element={<ConsultingServicesPage />} />
                  <Route path="/research-development" element={<RnDServicesPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/training-calendar" element={<TrainingCalendarPage />} />
                  <Route path="/our-journey" element={<OurJourney />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/test" element={<TestPage />} />
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
                    path="/dashboard/payments"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <PaymentManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/invoices"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <InvoicesPage />
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
                        <NewCourse />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/testimonials"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <TestimonialManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/images"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <ImageManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/support-tickets"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <SupportTickets />
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
                    path="/student/profile"
                    element={
                      <ProtectedRoute allowedRoles={['student']}>
                        <Profile />
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </Dialog>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
