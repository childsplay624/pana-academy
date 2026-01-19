import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowRight } from 'lucide-react';
import CoursesSection from '@/components/CoursesSection';
import type { Course } from '@/services/courseService';
import { fetchAllCourses } from '@/services/courseService';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PublicCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCourses]);

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

  // Helper function to normalize category strings for comparison
  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')  // Replace spaces, dashes, special chars with underscore
      .replace(/_courses$/i, '')     // Remove "_courses" suffix if present
      .replace(/^_+|_+$/g, '');      // Remove leading/trailing underscores
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

    // Apply category filter with normalization
    if (filter !== 'All') {
      const normalizedFilter = normalizeCategory(filter);
      results = results.filter(course => {
        if (course.category) {
          const normalizedCategory = normalizeCategory(course.category);
          if (normalizedCategory === normalizedFilter) return true;
        }
        if (course.level) {
          const normalizedLevel = normalizeCategory(course.level);
          if (normalizedLevel === normalizedFilter) return true;
        }
        return false;
      });
    }

    setFilteredCourses(results);
  };

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            Explore our Training Solutions designed to advance your career and organization
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-6 text-base bg-white/10 border-0 text-white placeholder-gray-300 focus-visible:ring-2 focus-visible:ring-white/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              </div>

              {/* Category Dropdown */}
              <Select value={activeFilter} onValueChange={handleFilterClick}>
                <SelectTrigger className="w-[220px] py-6 bg-white/10 border-0 text-white focus:ring-2 focus:ring-white/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="soft_skills">Soft Skills</SelectItem>
                  <SelectItem value="safety_courses">Safety Courses</SelectItem>
                  <SelectItem value="sustainability_courses">Sustainability Courses</SelectItem>
                  <SelectItem value="general_technical_courses">General Technical Courses</SelectItem>
                  <SelectItem value="flow_drives_courses">Flow Drives Courses</SelectItem>
                  <SelectItem value="flow_control_courses">Flow Control Courses</SelectItem>
                  <SelectItem value="flow_measurement_courses">Flow Measurement Courses</SelectItem>
                  <SelectItem value="instrumentation_automation">Instrumentation/Automation and Process Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <>
            <CoursesSection
              showAll={true}
              courses={currentCourses}
              loading={isLoading}
              error={error}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={`${page}-${index}`}>
                        {typeof page === 'number' ? (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        ) : (
                          <PaginationEllipsis />
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Results info */}
                <div className="text-center mt-6 text-sm text-gray-600">
                  Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
                </div>
              </div>
            )}
          </>
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

