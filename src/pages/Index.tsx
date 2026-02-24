import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import UpcomingCoursesSection from "@/components/UpcomingCoursesSection";
import { TopRatedCourses } from "@/components/course/TopRatedCourses";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, BookOpen, TrendingUp, Award, Shield, Globe, Briefcase, Zap, Target, ArrowRight, Gauge, Cpu,
  CheckCircle, Video, Clock, Smartphone, MessageSquare, Download, FileText, Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAllCourses } from "@/services/courseService";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const stats = [
    { value: "200+", label: "Trained Professionals", icon: Users },
    { value: "200+", label: "Expert Courses", icon: BookOpen },
    { value: "95%", label: "Success Rate", icon: TrendingUp },
    { value: "50+", label: "Industry Partners", icon: Award },
  ];

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

  const howItWorksSteps = [
    {
      number: "1",
      title: "Choose Your Path",
      description: "Browse 200+ expert courses across 8 specializations tailored to your career goals",
      icon: BookOpen,
    },
    {
      number: "2",
      title: "Learn & Practice",
      description: "Engage with video lessons, live sessions, and hands-on projects guided by industry experts",
      icon: Video,
    },
    {
      number: "3",
      title: "Get Certified",
      description: "Earn industry-recognized credentials and advance your career with our job placement support",
      icon: Award,
    },
  ];

  const platformFeatures = [
    {
      icon: Video,
      title: "Live Instructor Sessions",
      description: "Interactive classes with real-time Q&A and expert guidance",
    },
    {
      icon: Download,
      title: "Downloadable Resources",
      description: "Access course materials, templates, and tools offline anytime",
    },
    {
      icon: Smartphone,
      title: "Mobile App Access: Coming Soon",
      description: "Learn on-the-go with our iOS and Android mobile applications",
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with peers, share insights, and collaborate on projects",
    },
    {
      icon: CheckCircle,
      title: "Lifetime Access",
      description: "Unlimited access to all course materials and future updates",
    },
    {
      icon: Target,
      title: "Career Support",
      description: "Resume reviews, interview prep, and job placement assistance",
    },
  ];

  // Helper function to normalize category strings for comparison
  const normalizeCategory = (category: string): string => {
    return category
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')  // Replace spaces, dashes, special chars with underscore
      .replace(/_courses$/i, '')     // Remove "_courses" suffix if present
      .replace(/^_+|_+$/g, '');      // Remove leading/trailing underscores
  };

  // Fetch course counts by category
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
    <>
      <Helmet>
        <title>PANA Academy - Professional Training & Development</title>
        <meta name="description" content="Transform your career with PANA Academy's world-class professional training programs. Expert-led courses in energy, digital transformation, leadership, and technical skills." />
        <meta name="keywords" content="PANA Academy, professional training, career development, technical courses, leadership programs, energy sector training" />
      </Helmet>
      <div className="min-h-screen relative">
        <Navigation />
        <SocialMediaIcons />
        <HeroSection />

        {/* Stats Bar - Fixed overlap */}
        <section className="py-12 bg-white border-b relative z-20" style={{ marginTop: '-4rem' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <Icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                      <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How PANA Academy Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your journey to career excellence in 3 simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative text-center"
                  >
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white text-2xl font-bold rounded-full mb-6">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <Icon className="w-12 h-12 text-red-600 mx-auto mb-4" />

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>

                    {/* Connector Arrow (except for last step) */}
                    {index < howItWorksSteps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-8 -right-6 w-8 h-8 text-gray-300" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link to="/courses">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Learning Categories */}
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

        {/* Platform Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose PANA Academy
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A comprehensive learning platform built for your success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <Icon className="w-12 h-12 text-red-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

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
        <section className="py-20 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                From Our Students to Industry Leaders
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real career transformations powered by PANA Academy
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Emmanuel O.",
                  company: "Shell Nigeria",
                  before: "Junior Technician",
                  after: "Senior Flow Specialist",
                  duration: "18 months",
                },
                {
                  name: "Chioma A.",
                  company: "TotalEnergies",
                  before: "Field Engineer",
                  after: "Operations Manager",
                  duration: "24 months",
                },
                {
                  name: "Tunde M.",
                  company: "Chevron",
                  before: "Safety Officer",
                  after: "HSE Manager",
                  duration: "15 months",
                }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl border-2 border-red-600">
                      {story.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-gray-900">{story.name}</p>
                      <p className="text-sm text-gray-600">{story.company}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Before</p>
                      <p className="font-semibold text-gray-900">{story.before}</p>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">After ({story.duration})</p>
                      <p className="font-semibold text-red-600">{story.after}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
