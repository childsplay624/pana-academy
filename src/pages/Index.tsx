import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import UpcomingCoursesSection from "@/components/UpcomingCoursesSection";
import { TopRatedCourses } from "@/components/course/TopRatedCourses";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import ValuesSection from "@/components/ValuesSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <SocialMediaIcons />
      <HeroSection />
      <AboutSection />
      <ValuesSection />
      <ServicesSection />
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our highest rated professional development programs
            </p>
          </div>
          <TopRatedCourses />
        </div>
      </section>
      <UpcomingCoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
