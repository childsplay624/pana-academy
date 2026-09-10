import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Shield, Globe, Briefcase, Zap, Target, Gauge, Cpu, ArrowRight } from "lucide-react";
import { fetchAllCourses, fetchCategories, Category } from "@/services/courseService";
import { Card3D } from "@/components/ui/Card3D";

interface DisplayCategory {
  name: string;
  slug: string;
  icon: any;
  color: string;
}

const defaultCategoryList: DisplayCategory[] = [
  { name: "Power and Drives", slug: "power_and_drives", icon: Zap, color: "from-orange-500 to-orange-600" },
  { name: "Valves and Actuation", slug: "valves_and_actuation", icon: Target, color: "from-cyan-500 to-cyan-600" },
  { name: "Measurements and Management", slug: "measurements_and_management", icon: Gauge, color: "from-teal-500 to-teal-600" },
  { name: "Electrical Instrumentation and Control", slug: "electrical_instrumentation_control", icon: Cpu, color: "from-indigo-500 to-indigo-600" },
  { name: "Safety", slug: "safety", icon: Shield, color: "from-red-500 to-red-600" },
  { name: "Sustainability", slug: "sustainability", icon: Globe, color: "from-green-500 to-green-600" },
  { name: "Soft Skills", slug: "soft_skills", icon: Users, color: "from-blue-500 to-blue-600" },
  { name: "General Technical", slug: "general_technical", icon: Briefcase, color: "from-purple-500 to-purple-600" },
];

const getIconAndColorForCategory = (name: string, slug: string) => {
  const lower = (name + ' ' + slug).toLowerCase();
  if (lower.includes('drive') || lower.includes('power')) return { icon: Zap, color: "from-orange-500 to-orange-600" };
  if (lower.includes('valve') || lower.includes('control')) return { icon: Target, color: "from-cyan-500 to-cyan-600" };
  if (lower.includes('measure') || lower.includes('gauge')) return { icon: Gauge, color: "from-teal-500 to-teal-600" };
  if (lower.includes('instrument') || lower.includes('electric') || lower.includes('automation')) return { icon: Cpu, color: "from-indigo-500 to-indigo-600" };
  if (lower.includes('safety') || lower.includes('hse')) return { icon: Shield, color: "from-red-500 to-red-600" };
  if (lower.includes('sustain') || lower.includes('climate') || lower.includes('env')) return { icon: Globe, color: "from-green-500 to-green-600" };
  if (lower.includes('soft') || lower.includes('skill') || lower.includes('leader')) return { icon: Users, color: "from-blue-500 to-blue-600" };
  return { icon: Briefcase, color: "from-purple-500 to-purple-600" };
};

const mapDomainName = (rawName: string): string => {
  const lower = rawName.toLowerCase().trim();
  if (lower === 'flow drives' || lower === 'flow_drives') return 'Power and Drives';
  if (lower === 'flow control' || lower === 'flow_control') return 'Valves and Actuation';
  if (lower === 'flow measurement' || lower === 'flow_measurement') return 'Measurements and Management';
  if (lower === 'instrumentation & automation' || lower === 'instrumentation_automation') return 'Electrical Instrumentation and Control';
  return rawName;
};

export function LearningCategories() {
  const [categories, setCategories] = useState<DisplayCategory[]>([]);
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/_courses$/i, '')
      .replace(/^_+|_+$/g, '');
  };

  useEffect(() => {
    const loadCategoriesAndCounts = async () => {
      try {
        const [dbCategories, courses] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchAllCourses().catch(() => [])
        ]);

        let displayList: DisplayCategory[] = [];

        if (dbCategories && dbCategories.length > 0) {
          displayList = dbCategories.map((cat: Category) => {
            const mappedName = mapDomainName(cat.name);
            const { icon, color } = getIconAndColorForCategory(mappedName, cat.slug);
            return {
              name: mappedName,
              slug: cat.slug || normalizeCategory(mappedName),
              icon,
              color
            };
          });
        } else {
          displayList = defaultCategoryList;
        }

        // Calculate course counts per category
        const counts: Record<string, number> = {};
        displayList.forEach(cat => {
          const catNormalized = normalizeCategory(cat.slug);
          const catNameNormalized = normalizeCategory(cat.name);

          counts[cat.slug] = courses.filter(course => {
            if (!course.category) return false;
            const courseCatNorm = normalizeCategory(course.category);
            return courseCatNorm === catNormalized || courseCatNorm === catNameNormalized;
          }).length;
        });

        setCategories(displayList);
        setCourseCounts(counts);
      } catch (error) {
        console.error('Error loading database categories:', error);
        setCategories(defaultCategoryList);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoriesAndCounts();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-red-600 font-bold text-xs uppercase tracking-widest block mb-2">Technical Disciplines</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Explore Our Specializations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from industry-accredited technical frameworks designed for Oil & Gas and Energy professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(isLoading ? defaultCategoryList : categories).map((category, index) => {
            const Icon = category.icon;
            const count = courseCounts[category.slug] || 0;
            return (
              <Card3D key={category.slug + index} intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.12)">
                <Link to={`/courses?category=${category.slug}`}>
                  <div className="group relative bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-3d-glass hover:shadow-3d-dark transition-all duration-300 border border-gray-200/80 overflow-hidden cursor-pointer h-full preserve-3d">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative preserve-3d">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-sm translate-z-10">
                        <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 break-words leading-tight min-h-[3.5rem] translate-z-10">{category.name}</h3>
                      <p className="text-gray-500 mb-5 text-sm font-medium translate-z-10">
                        {isLoading ? (
                          <span className="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse"></span>
                        ) : (
                          `${count} course${count !== 1 ? 's' : ''} available`
                        )}
                      </p>
                      <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform text-sm translate-z-10">
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Card3D>
            );
          })}
        </div>
      </div>
    </section>
  );
}
