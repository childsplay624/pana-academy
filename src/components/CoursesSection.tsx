import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, Loader2, BookOpen, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllCourses, formatCourseDate } from "@/services/courseService";
import type { Course } from "@/services/courseService";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";

interface CoursesSectionProps {
  showAll?: boolean;
  courses?: Course[];
  loading?: boolean;
  error?: string | null;
}

const CoursesSection = ({
  showAll = false,
  courses = [],
  loading = false,
  error = null
}: CoursesSectionProps) => {
  const displayCourses = showAll ? courses : courses.slice(0, 4);
  const { data: settings } = usePlatformSettings();
  const hidePrices = settings?.hide_course_prices;

  return (
    <section className={`py-12 ${!showAll ? 'bg-gray-50' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showAll && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our most popular professional development programs
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-pana-blue" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : displayCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => {
              const categoryText = (course.category_name || (course.category as string)?.replace('_', ' ') || 'BUSINESS').toUpperCase();
              const levelBadge = (course.level || 'BEGINNER').toUpperCase();
              const formattedDate = course.start_date ? formatCourseDate(course.start_date) : 'Sep 15, 2025';
              const durationText = course.duration || (course.duration_hours ? `${course.duration_hours} hours` : '24 hours');
              const locationText = course.location || 'Port Harcourt Hub & Virtual';
              const priceText = !hidePrices ? (course.price ? `₦${course.price.toLocaleString()}` : '₦7,900') : null;
              const originalPriceText = !hidePrices && (course.original_price || course.price) ? `₦${((course.original_price || (course.price ? course.price * 1.6 : 12900))).toLocaleString()}` : '₦12,900';

              return (
                <Link to={`/course/${course.id}`} key={course.id} className="block h-full">
                  <div className="bg-[#FDFBF7] border border-[#E2DDD5] rounded-xs overflow-hidden flex flex-col justify-between hover:border-[#6E1D2B]/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group h-full">
                    <div>
                      {/* Thumbnail with Level Badge */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#1C1D1F]">
                        <img
                          src={course.thumbnail_url || course.image_url || '/images/hero_slide_1.png'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                        />
                        <div className="absolute top-3 left-3 bg-[#6E1D2B] text-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest rounded-xs shadow-md z-10">
                          {levelBadge}
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6">
                        {/* Category & Status Row */}
                        <div className="flex items-center justify-between gap-2 font-mono text-xs uppercase font-bold tracking-wider mb-2">
                          <span className="text-[#9A7B3E]">{categoryText}</span>
                          <span className="text-[#6E1D2B]">ENROLLMENT OPEN</span>
                        </div>

                        {/* Course Title */}
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1D1F] leading-tight mb-3 group-hover:text-[#6E1D2B] transition-colors line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Excerpt Description */}
                        <p className="font-serif text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                          {course.description || 'This foundational course offers a deep dive into the economic principles, market dynamics, and financial frameworks that drive modern industry performance.'}
                        </p>

                        {/* Metadata List with Top Divider */}
                        <div className="pt-3 border-t border-[#E2DDD5] space-y-2 text-xs font-mono text-slate-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#6E1D2B] shrink-0" />
                            <span className="font-semibold text-slate-700">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#9A7B3E] shrink-0" />
                            <span>{durationText}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#6E1D2B] shrink-0" />
                            <span>{locationText}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer with Price and ENROL NOW Button */}
                    <div className="px-6 py-4 border-t border-[#E2DDD5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
                      <div>
                        {priceText && (
                          <div className="font-serif text-2xl font-bold text-[#1C1D1F] leading-none">
                            {priceText}
                          </div>
                        )}
                        {originalPriceText && (
                          <div className="font-mono text-[10px] text-slate-400 line-through mt-1">
                            {originalPriceText}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#6E1D2B] group-hover:bg-[#581722] text-white px-5 py-2.5 rounded-xs font-mono text-xs font-bold uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 shadow-sm">
                        ENROL NOW <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!showAll && (
          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg" className="border-pana-navy text-pana-navy hover:bg-pana-navy hover:text-white">
                View All Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
