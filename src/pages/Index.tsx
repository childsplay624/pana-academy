import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CoursesSection from "@/components/CoursesSection";
import UpcomingCoursesSection from "@/components/UpcomingCoursesSection";
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
      <CoursesSection />
      <UpcomingCoursesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
