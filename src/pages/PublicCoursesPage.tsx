import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ArrowRight } from 'lucide-react';
import CoursesSection from '@/components/CoursesSection';
import type { Course } from '@/services/courseService';
import { fetchAllCourses } from '@/services/courseService';

const PublicCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch all courses
    const loadCourses = async () => {
      try {
        const courses = await fetchAllCourses();
        setAllCourses(courses);
        setFilteredCourses(courses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterCourses(query, activeFilter);
  };

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    filterCourses(searchQuery, filter);
  };

  // Filter courses based on search query and active filter
  const filterCourses = (query: string, filter: string) => {
    let results = [...allCourses];
    
    // Apply search query filter
    if (query) {
      results = results.filter(
        course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor?.toLowerCase().includes(query) ||
          course.category?.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (filter !== 'All') {
      results = results.filter(course => 
        course.category?.toLowerCase() === filter.toLowerCase() ||
        course.level?.toLowerCase() === filter.toLowerCase()
      );
    }
    
    setFilteredCourses(results);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Hero Section with Background Image */}
      <div className="relative bg-cover bg-center py-28" style={{ backgroundImage: 'url(/src/assets/hero-training.jpg)' }}>
        <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Discover professional development programs designed to advance your career
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search courses..."
                className="pl-10 pr-4 py-6 text-base bg-white/10 border-0 text-white placeholder-gray-300 focus-visible:ring-2 focus-visible:ring-white/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['All', 'Leadership', 'Digital', 'Energy', 'Beginner', 'Intermediate', 'Advanced'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleFilterClick(tag)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  activeFilter === tag 
                    ? 'bg-white text-pana-navy' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pana-blue"></div>
          </div>
        ) : (
          <CoursesSection 
            showAll={true} 
            courses={filteredCourses}
            loading={isLoading}
            error={error}
          />
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 text-pana-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to advance your career?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who have already transformed their careers with our courses
          </p>
          <Button 
            size="lg" 
            className="bg-pana-navy hover:bg-pana-navy/90 text-white px-8 py-6 text-lg"
          >
            Browse All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicCoursesPage;
