import { useEffect, useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Card3D from '@/components/ui/Card3D';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowRight, Layers, Tag, X } from 'lucide-react';
import CoursesSection from '@/components/CoursesSection';
import type { Course, Category, Subcategory } from '@/services/courseService';
import { fetchAllCourses, fetchCategoriesWithSubcategories } from '@/services/courseService';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSiteImage } from '@/hooks/useSiteImage';

const PublicCoursesPage = () => {
  // Fetch header image from centralized system
  const { imageUrl: headerImage } = useSiteImage('header_training');

  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Sidebar interactive filter states
  const [selectedMinRating, setSelectedMinRating] = useState<number | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Fetch all courses and categories with nested subcategories
    const loadData = async () => {
      try {
        const [courses, cats] = await Promise.all([
          fetchAllCourses(),
          fetchCategoriesWithSubcategories()
        ]);
        setAllCourses(courses);
        setFilteredCourses(courses);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredCourses]);

  // Helper function to normalize category strings for comparison
  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')  // Replace spaces, dashes, special chars with underscore
      .replace(/_courses$/i, '')     // Remove "_courses" suffix if present
      .replace(/^_+|_+$/g, '');      // Remove leading/trailing underscores
  };

  // Dynamic discovery of subcategories / course areas with course counts
  const availableSubcategories = useMemo(() => {
    // Determine relevant courses for active category
    const relevantCourses = activeFilter === 'All'
      ? allCourses
      : allCourses.filter(c => {
          const catVal = c.category_name || c.category || '';
          return normalizeCategory(catVal) === normalizeCategory(activeFilter);
        });

    const areaCountMap = new Map<string, number>();
    relevantCourses.forEach(c => {
      const area = c.course_area || c.subcategory_name;
      if (area) {
        areaCountMap.set(area, (areaCountMap.get(area) || 0) + 1);
      }
    });

    // Also include subcategories attached to category from database if present
    const activeCatObj = categories.find(c => c.slug === activeFilter || normalizeCategory(c.name) === normalizeCategory(activeFilter));
    if (activeCatObj?.subcategories) {
      activeCatObj.subcategories.forEach(sub => {
        if (!areaCountMap.has(sub.name)) {
          areaCountMap.set(sub.name, 0);
        }
      });
    }

    const list: { name: string; count: number }[] = [];
    areaCountMap.forEach((count, name) => {
      list.push({ name, count });
    });

    return list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [categories, allCourses, activeFilter]);

  // Filter courses based on search query, active filter, subcategory, ratings, durations, and levels
  const filterCourses = (
    query = searchQuery,
    filter = activeFilter,
    subcat = selectedSubcategory,
    minRating = selectedMinRating,
    durations = selectedDurations,
    levels = selectedLevels
  ) => {
    let results = [...allCourses];

    // Apply search query filter (matches title, description, instructor, category, course code, course area)
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        course =>
          course.title?.toLowerCase().includes(q) ||
          course.description?.toLowerCase().includes(q) ||
          course.instructor?.toLowerCase().includes(q) ||
          course.instructor_name?.toLowerCase().includes(q) ||
          course.category?.toLowerCase().includes(q) ||
          (course.code && course.code.toLowerCase().includes(q)) ||
          (course.course_area && course.course_area.toLowerCase().includes(q)) ||
          (course.subcategory_name && course.subcategory_name.toLowerCase().includes(q))
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
        if (course.category_name) {
          const normalizedCategory = normalizeCategory(course.category_name);
          if (normalizedCategory === normalizedFilter) return true;
        }
        if (course.level) {
          const normalizedLevel = normalizeCategory(course.level);
          if (normalizedLevel === normalizedFilter) return true;
        }
        return false;
      });
    }

    // Apply subcategory / course area filter
    if (subcat) {
      const normalizedSubcat = normalizeCategory(subcat);
      results = results.filter(course => {
        const area = course.course_area || course.subcategory_name;
        if (!area) return false;
        return normalizeCategory(area) === normalizedSubcat;
      });
    }

    // Apply rating filter
    if (minRating !== null) {
      results = results.filter(course => (course.rating || 0) >= minRating);
    }

    // Apply duration filter
    if (durations.length > 0) {
      results = results.filter(course => {
        const hrs = course.duration_hours || 0;
        return durations.some(d => {
          if (d === '0-3 Hours') return hrs <= 3;
          if (d === '3-6 Hours') return hrs > 3 && hrs <= 6;
          if (d === '6-20 Hours') return hrs > 6 && hrs <= 20;
          if (d === '20+ Hours') return hrs > 20;
          return false;
        });
      });
    }

    // Apply level filter
    if (levels.length > 0 && !levels.includes('All Levels')) {
      results = results.filter(course =>
        course.level && levels.some(l => l.toLowerCase() === course.level?.toLowerCase())
      );
    }

    setFilteredCourses(results);
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCourses(query, activeFilter, selectedSubcategory, selectedMinRating, selectedDurations, selectedLevels);
  };

  // Handle category filter click
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSelectedSubcategory(null);
    filterCourses(searchQuery, filter, null, selectedMinRating, selectedDurations, selectedLevels);
  };

  // Handle subcategory click
  const handleSubcategoryClick = (subcat: string | null) => {
    setSelectedSubcategory(subcat);
    filterCourses(searchQuery, activeFilter, subcat, selectedMinRating, selectedDurations, selectedLevels);
  };

  const handleRatingChange = (min: number | null) => {
    setSelectedMinRating(min);
    filterCourses(searchQuery, activeFilter, selectedSubcategory, min, selectedDurations, selectedLevels);
  };

  const handleDurationToggle = (label: string) => {
    const updated = selectedDurations.includes(label)
      ? selectedDurations.filter(d => d !== label)
      : [...selectedDurations, label];
    setSelectedDurations(updated);
    filterCourses(searchQuery, activeFilter, selectedSubcategory, selectedMinRating, updated, selectedLevels);
  };

  const handleLevelToggle = (lvl: string) => {
    const updated = selectedLevels.includes(lvl)
      ? selectedLevels.filter(l => l !== lvl)
      : [...selectedLevels, lvl];
    setSelectedLevels(updated);
    filterCourses(searchQuery, activeFilter, selectedSubcategory, selectedMinRating, selectedDurations, updated);
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
      <div className="relative min-h-[500px] bg-cover bg-center mt-20">
        {headerImage ? (
          <img
            src={headerImage}
            alt="Training Programs"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pana-navy to-pana-red z-0"></div>
        )}
        <div className="absolute inset-0 bg-black/70 bg-blend-multiply z-10"></div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 flex flex-col justify-center min-h-[500px] px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-red-500 font-bold text-xs uppercase tracking-wider block mb-3">Competency · Programmes</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-[1.25] pb-2">
              Programmes & <span className="text-red-600">Qualifications</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
              We train for performance, prevention and sustainability, across tailored, product specific and NCDMB stipulated Human Capital Development programmes. Thirteen categories of training solution sit under the pillar.
            </p>
          </div>
        </div>
      </div>





      {/* Main Filter & Course Listing Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Control Bar with Search and Category Dropdown */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
            {/* Search Input for courses, codes (PD01, VA05), and topics */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses or codes (e.g. PD01, SC17)..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-9 py-2 bg-white border-gray-300 rounded-lg text-sm focus:border-red-600 focus:ring-red-600 shadow-sm w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    filterCourses('', activeFilter, selectedSubcategory, selectedMinRating, selectedDurations, selectedLevels);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Domain / Category Select */}
            <Select value={activeFilter} onValueChange={handleFilterClick}>
              <SelectTrigger className="w-full sm:w-[220px] bg-white border-gray-300 font-bold text-sm text-gray-900 rounded-lg shadow-sm">
                <Filter className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                <SelectValue placeholder="Domain / Category" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="All">All Domains (Categories)</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.domain_no ? `${cat.domain_no}. ` : ''}{cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <Select defaultValue="popular">
              <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-300 font-bold text-sm text-gray-900 rounded-lg shadow-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm font-bold text-gray-600 shrink-0 self-end md:self-center">
            {filteredCourses.length.toLocaleString()} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </div>
        </div>

        {/* Course Areas (Sub-categories) Horizontal Scrollable Filter Bar */}
        {availableSubcategories.length > 0 && (
          <div className="mb-8 bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5 pl-1">
                <Layers className="w-4 h-4 text-red-600" />
                Course Areas:
              </span>
              <button
                onClick={() => handleSubcategoryClick(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedSubcategory === null
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                All Areas
              </button>
              {availableSubcategories.map((sub) => {
                const isSelected = selectedSubcategory === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => handleSubcategoryClick(isSelected ? null : sub.name)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                    }`}
                  >
                    <span>{sub.name}</span>
                    {sub.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {sub.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Areas (Sub-categories) Sidebar Filter */}
            {availableSubcategories.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-bold text-gray-900 text-sm tracking-tight flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-red-600" />
                    Course Areas
                  </h3>
                  {selectedSubcategory && (
                    <button
                      onClick={() => handleSubcategoryClick(null)}
                      className="text-[11px] text-red-600 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 text-xs font-semibold text-gray-700">
                  {availableSubcategories.map((sub, idx) => {
                    const isChecked = selectedSubcategory === sub.name;
                    return (
                      <label
                        key={idx}
                        className={`flex items-center justify-between gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50 hover:text-red-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <input
                            type="radio"
                            name="course_area_sidebar"
                            className="text-red-600 focus:ring-red-500"
                            checked={isChecked}
                            onChange={() => handleSubcategoryClick(isChecked ? null : sub.name)}
                          />
                          <span className="truncate" title={sub.name}>{sub.name}</span>
                        </div>
                        {sub.count > 0 && (
                          <span className="text-gray-400 font-normal ml-auto shrink-0 text-[11px]">
                            ({sub.count})
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ratings Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">Ratings</h3>
                {selectedMinRating !== null && (
                  <button onClick={() => handleRatingChange(null)} className="text-[11px] text-red-600 font-semibold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                {[
                  { stars: '4.5 & up', min: 4.5 },
                  { stars: '4.0 & up', min: 4.0 },
                  { stars: '3.5 & up', min: 3.5 },
                  { stars: '3.0 & up', min: 3.0 },
                ].map((item, idx) => {
                  const cnt = allCourses.filter(c => (c.rating || 0) >= item.min).length;
                  const isChecked = selectedMinRating === item.min;
                  return (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer hover:text-purple-700 transition-colors">
                      <input
                        type="radio"
                        name="rating"
                        className="text-purple-600 focus:ring-purple-500"
                        checked={isChecked}
                        onChange={() => handleRatingChange(isChecked ? null : item.min)}
                      />
                      <span className="text-amber-500 font-bold text-sm">★★★★☆</span>
                      <span>{item.stars}</span>
                      <span className="text-gray-400 font-normal ml-auto">({cnt})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Video Duration Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">Duration</h3>
                {selectedDurations.length > 0 && (
                  <button onClick={() => { setSelectedDurations([]); filterCourses(searchQuery, activeFilter, selectedSubcategory, selectedMinRating, [], selectedLevels); }} className="text-[11px] text-red-600 font-semibold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2.5 text-xs font-semibold text-gray-700">
                {[
                  { label: '0-3 Hours', filterFn: (c: Course) => (c.duration_hours || 0) <= 3 },
                  { label: '3-6 Hours', filterFn: (c: Course) => (c.duration_hours || 0) > 3 && (c.duration_hours || 0) <= 6 },
                  { label: '6-20 Hours', filterFn: (c: Course) => (c.duration_hours || 0) > 6 && (c.duration_hours || 0) <= 20 },
                  { label: '20+ Hours', filterFn: (c: Course) => (c.duration_hours || 0) > 20 },
                ].map((item, idx) => {
                  const cnt = allCourses.filter(item.filterFn).length;
                  const isChecked = selectedDurations.includes(item.label);
                  return (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer hover:text-purple-700 transition-colors">
                      <input
                        type="checkbox"
                        className="rounded text-purple-600 focus:ring-purple-500"
                        checked={isChecked}
                        onChange={() => handleDurationToggle(item.label)}
                      />
                      <span>{item.label}</span>
                      <span className="text-gray-400 font-normal ml-auto">({cnt})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm tracking-tight">Level</h3>
                {selectedLevels.length > 0 && (
                  <button onClick={() => { setSelectedLevels([]); filterCourses(searchQuery, activeFilter, selectedSubcategory, selectedMinRating, selectedDurations, []); }} className="text-[11px] text-red-600 font-semibold hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs font-semibold text-gray-700">
                {['All Levels', 'Beginner', 'Intermediate', 'Expert'].map((lvl, idx) => {
                  const cnt = lvl === 'All Levels' 
                    ? allCourses.length 
                    : allCourses.filter(c => c.level?.toLowerCase() === lvl.toLowerCase()).length;
                  const isChecked = lvl === 'All Levels' ? selectedLevels.length === 0 : selectedLevels.includes(lvl);
                  return (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer hover:text-purple-700">
                      <input
                        type="checkbox"
                        className="rounded text-purple-600 focus:ring-purple-500"
                        checked={isChecked}
                        onChange={() => {
                          if (lvl === 'All Levels') {
                            setSelectedLevels([]);
                            filterCourses(searchQuery, activeFilter, selectedSubcategory, selectedMinRating, selectedDurations, []);
                          } else {
                            handleLevelToggle(lvl);
                          }
                        }}
                      />
                      <span>{lvl}</span>
                      <span className="text-gray-400 font-normal ml-auto">({cnt})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Course List - Udemy Row Display */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : currentCourses.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 text-gray-500">
                No programmes matching your criteria.
              </div>
            ) : (
              currentCourses.map((course) => {
                const originalPriceNum = course.price ? Math.round(course.price * 1.25) : null;
                return (
                  <Link
                    to={`/course/${course.id}`}
                    key={course.id}
                    className="block bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 no-underline group"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Left Course Image Thumbnail */}
                      <div className="w-full sm:w-64 h-44 shrink-0 rounded-xl overflow-hidden relative bg-zinc-950">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-red-950 to-zinc-950 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">PANA Institute</span>
                          </div>
                        )}
                      </div>

                      {/* Right Detail Information Column */}
                      <div className="flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          {/* Course Code, Area, and Domain Tags */}
                          {(course.code || course.course_area || course.subcategory_name || course.domain_no) && (
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {course.code && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-100 text-red-700 border border-red-200">
                                  {course.code}
                                </span>
                              )}
                              {(course.course_area || course.subcategory_name) && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                  {course.course_area || course.subcategory_name}
                                </span>
                              )}
                              {course.domain_no && (
                                <span className="text-[11px] text-gray-400 font-medium">
                                  Domain {course.domain_no}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors leading-snug">
                              {course.title}
                            </h3>
                            <button className="text-gray-400 hover:text-gray-600 p-1">⋮</button>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2 font-normal">
                            {course.description}
                          </p>

                          {course.instructor && (
                            <p className="text-xs text-gray-500 font-medium mb-1">
                              {course.instructor}
                            </p>
                          )}

                          {/* Star Rating & Student Metadata */}
                          {course.rating && course.rating > 0 ? (
                            <div className="flex items-center gap-2 text-xs mb-2">
                              <span className="font-bold text-amber-700 text-sm">{course.rating.toFixed(1)}</span>
                              <div className="flex text-amber-500 text-sm">★★★★★</div>
                              {course.reviews_count ? (
                                <span className="text-gray-500 font-medium">({course.reviews_count.toLocaleString()})</span>
                              ) : null}
                            </div>
                          ) : null}

                          {/* Lecture & Hours Metadata */}
                          <div className="text-xs text-gray-500 font-semibold space-x-2">
                            {course.duration_hours ? (
                              <span>{course.duration_hours} total hours</span>
                            ) : course.duration ? (
                              <span>{course.duration}</span>
                            ) : null}
                            {course.level && (
                              <>
                                <span>•</span>
                                <span>{course.level}</span>
                              </>
                            )}
                            {course.course_type && (
                              <>
                                <span>•</span>
                                <span>
                                  {course.course_type === 'online'
                                    ? 'Online Training'
                                    : course.course_type === 'onsite'
                                    ? 'On-Site Practical'
                                    : 'Hybrid Delivery'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Price Tag & Badges Row */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-gray-900">
                              {course.price ? `₦${course.price.toLocaleString()}` : 'Free'}
                            </span>
                            {originalPriceNum && (
                              <span className="text-xs text-gray-400 line-through font-semibold">
                                ₦{originalPriceNum.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-purple-700 text-white text-[11px] font-bold rounded-md uppercase tracking-wider shadow-xs">
                              Premium
                            </span>
                            <span className="px-3 py-1 bg-teal-100 text-teal-800 text-[11px] font-bold rounded-md uppercase tracking-wider">
                              Bestseller
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 pt-4">
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
                            className="cursor-pointer font-bold text-sm"
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

                <div className="text-center mt-4 text-xs font-semibold text-gray-500">
                  Showing {indexOfFirstCourse + 1} - {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
                </div>
              </div>
            )}
          </div>
        </div>
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

