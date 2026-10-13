import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, Loader2, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAllCourses, formatCourseDate, isCoursePriceTbd } from "@/services/courseService";
import type { Course } from "@/services/courseService";
import { usePlatformSettings } from "@/hooks/usePlatformSettings";
import Card3D from "@/components/ui/Card3D";

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
            {displayCourses.map((course) => (
              <Link to={`/course/${course.id}`} key={course.id} className="block h-full no-underline">
                <Card3D intensity={12} depth={15} glowColor="rgba(220, 38, 38, 0.12)" className="h-full">
                  <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between preserve-3d">
                    {/* Media Header */}
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-red-950 to-zinc-950 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-red-500/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Category Pill */}
                        <div className="absolute top-3 left-3 translate-z-10">
                          <span className="inline-block px-3 py-1 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider rounded-md shadow-md">
                            {course.category_name || (course.category as string)?.replace('_', ' ') || 'Professional'}
                          </span>
                        </div>

                        {/* Level Badge */}
                        {course.level && (
                          <div className="absolute top-3 right-3 translate-z-10">
                            <span className="inline-block px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-zinc-200 text-[10px] font-semibold uppercase tracking-wider rounded-md border border-white/20">
                              {course.level}
                            </span>
                          </div>
                        )}

                        {/* Price Overlay */}
                        {!hidePrices && (
                          <div className="absolute bottom-3 left-3 translate-z-10">
                            {isCoursePriceTbd(course) ? (
                              <span className="inline-block px-3 py-1 bg-amber-600/95 backdrop-blur-md text-white text-xs font-black rounded-lg shadow-lg">
                                Fee TBD
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-md text-zinc-950 text-sm font-black rounded-lg shadow-lg">
                                {course.is_free || !course.price ? 'Free' : `₦${course.price.toLocaleString()}`}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content Body */}
                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 hover:text-red-600 transition-colors translate-z-10">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 translate-z-5">
                          {course.description}
                        </p>

                        {/* Start Date */}
                        {course.start_date && (
                          <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-zinc-700 translate-z-5">
                            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                              <Calendar className="h-3.5 w-3.5" />
                            </div>
                            <span>Starts: {formatCourseDate(course.start_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Link */}
                    <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-end mt-auto translate-z-10">
                      <div className="inline-flex items-center text-sm font-bold text-red-600 hover:text-red-700 group cursor-pointer">
                        <span className="relative py-0.5">
                          View Details
                          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
                        </span>
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Card3D>
              </Link>
            ))}
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
