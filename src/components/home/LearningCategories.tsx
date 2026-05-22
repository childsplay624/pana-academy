import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Shield, Globe, Briefcase, Zap, Target, Gauge, Cpu, ArrowRight } from "lucide-react";
import { fetchAllCourses } from "@/services/courseService";

export function LearningCategories() {
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const categories = [
    { name: "Soft Skills", slug: "soft_skills", icon: Users, color: "from-blue-500 to-blue-600" },
    { name: "Safety", slug: "safety", icon: Shield, color: "from-red-500 to-red-600" },
    { name: "Sustainability", slug: "sustainability", icon: Globe, color: "from-green-500 to-green-600" },
    { name: "General Technical", slug: "general_technical", icon: Briefcase, color: "from-purple-500 to-purple-600" },
    { name: "Flow Drives", slug: "flow_drives", icon: Zap, color: "from-orange-500 to-orange-600" },
    { name: "Flow Control", slug: "flow_control", icon: Target, color: "from-cyan-500 to-cyan-600" },
    { name: "Flow Measurement", slug: "flow_measurement", icon: Gauge, color: "from-teal-500 to-teal-600" },
    { name: "Instrumentation & Automation", slug: "instrumentation_automation", icon: Cpu, color: "from-indigo-500 to-indigo-600" },
  ];

  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/_courses$/i, '')
      .replace(/^_+|_+$/g, '');
  };

  useEffect(() => {
    const loadCourseCounts = async () => {
      try {
        const courses = await fetchAllCourses();
        const counts: Record<string, number> = {};

        categories.forEach(category => {
          const normalizedSlug = normalizeCategory(category.slug);

          counts[category.slug] = courses.filter(course => {
            if (!course.category) return false;
            const normalizedDbCategory = normalizeCategory(course.category);
            return normalizedDbCategory === normalizedSlug;
          }).length;
        });

        setCourseCounts(counts);
      } catch (error) {
        console.error('Error loading course counts:', error);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    loadCourseCounts();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Specializations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from industry-leading programs designed for Oil & Gas professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const count = courseCounts[category.slug] || 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/courses?category=${category.slug}`}>
                  <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative">
                      <Icon className="w-12 h-12 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2 break-words leading-tight min-h-[3.5rem]">{category.name}</h3>
                      <p className="text-gray-600 mb-4">
                        {isLoadingCounts ? (
                          <span className="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse"></span>
                        ) : (
                          `${count} course${count !== 1 ? 's' : ''} available`
                        )}
                      </p>
                      <div className="flex items-center text-red-600 font-medium group-hover:translate-x-2 transition-transform">
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
