import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import CoursesSection from '@/components/CoursesSection';

const PublicCoursesPage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pana-navy to-pana-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl text-pana-light-gray max-w-3xl mx-auto mb-10">
            Discover professional development programs designed to advance your career
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-6 text-base bg-white/10 border-0 text-white placeholder-gray-300 focus-visible:ring-2 focus-visible:ring-white/50"
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-pana-navy hover:bg-gray-100"
                size="lg"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['All', 'Leadership', 'Digital', 'Energy', 'Beginner', 'Intermediate', 'Advanced'].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-16">
        <CoursesSection showAll={true} />
      </div>

      {/* CTA Section */}
      <div className="bg-pana-navy text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to advance your career?</h2>
          <p className="text-xl text-pana-light-gray mb-8">
            Join thousands of professionals who have already transformed their careers with our courses
          </p>
          <Button 
            variant="premium" 
            size="lg" 
            className="text-lg px-8 py-6"
          >
            Enroll Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicCoursesPage;
