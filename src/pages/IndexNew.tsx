import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { TopRatedCourses } from "@/components/course/TopRatedCourses";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Users,
    GraduationCap,
    TrendingUp,
    Award,
    BookOpen,
    Video,
    Clock,
    CheckCircle,
    Globe,
    Smartphone,
    MessageSquare,
    ArrowRight,
    Play,
    Star,
    Briefcase,
    Shield,
    Zap,
    Target,
} from "lucide-react";

const IndexNew = () => {
    const stats = [
        { value: "5,000+", label: "Active Students", icon: Users },
        { value: "200+", label: "Expert Courses", icon: BookOpen },
        { value: "95%", label: "Success Rate", icon: TrendingUp },
        { value: "50+", label: "Industry Partners", icon: Award },
    ];

    const categories = [
        { name: "Soft Skills", count: 28, icon: Users, color: "from-blue-500 to-blue-600" },
        { name: "Safety", count: 32, icon: Shield, color: "from-red-500 to-red-600" },
        { name: "Sustainability", count: 25, icon: Globe, color: "from-green-500 to-green-600" },
        { name: "General Technical", count: 35, icon: Briefcase, color: "from-purple-500 to-purple-600" },
        { name: "Flow Drives", count: 45, icon: Zap, color: "from-orange-500 to-orange-600" },
        { name: "Flow Control", count: 38, icon: Target, color: "from-cyan-500 to-cyan-600" },
    ];

    const platformFeatures = [
        {
            icon: Video,
            title: "Live Classes",
            description: "Interactive sessions with industry experts",
        },
        {
            icon: BookOpen,
            title: "Hands-on Projects",
            description: "Real-world applications and case studies",
        },
        {
            icon: Award,
            title: "Industry Certificates",
            description: "Recognized credentials for career growth",
        },
        {
            icon: Smartphone,
            title: "Mobile Learning",
            description: "Learn anywhere, anytime on any device",
        },
        {
            icon: CheckCircle,
            title: "Lifetime Access",
            description: "Unlimited access to all course materials",
        },
        {
            icon: MessageSquare,
            title: "Community Support",
            description: "Connect with peers and mentors",
        },
    ];

    const successStories = [
        {
            name: "Emmanuel O.",
            company: "Shell Nigeria",
            before: "Junior Technician",
            after: "Senior Flow Specialist",
            duration: "18 months",
            image: "/testimonials/default-avatar.png",
        },
        {
            name: "Chioma A.",
            company: "TotalEnergies",
            before: "Field Engineer",
            after: "Operations Manager",
            duration: "24 months",
            image: "/testimonials/default-avatar.png",
        },
        {
            name: "Tunde M.",
            company: "Chevron",
            before: "Safety Officer",
            after: "HSE Manager",
            duration: "15 months",
            image: "/testimonials/default-avatar.png",
        },
    ];

    return (
        <>
            <Helmet>
                <title>PANA Academy | Transform Your Oil & Gas Career</title>
                <meta
                    name="description"
                    content="Join 5,000+ professionals advancing their careers with PANA Academy. Expert-led courses in Oil & Gas, Safety, and Technical Skills with industry-recognized certificates."
                />
            </Helmet>

            <div className="min-h-screen relative">
                <Navigation />
                <SocialMediaIcons />

                {/* Enhanced Hero Section */}
                <section className="relative min-h-[600px] md:min-h-[700px] flex items-center bg-gradient-to-br from-pana-navy via-gray-900 to-black overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }} />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="inline-block px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
                                    🎓 Nigeria's Leading Oil & Gas Training Platform
                                </span>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    Transform Your
                                    <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                                        Oil & Gas Career
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    Join 5,000+ professionals mastering industry skills with expert-led courses,
                                    hands-on projects, and recognized certifications.
                                </p>

                                {/* Search Bar */}
                                <div className="mb-8">
                                    <div className="relative max-w-xl">
                                        <Input
                                            type="text"
                                            placeholder="What do you want to learn?"
                                            className="pl-12 pr-4 py-6 text-base bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                                        />
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    </div>
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-wrap gap-4">
                                    <Link to="/courses">
                                        <Button
                                            size="lg"
                                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold"
                                        >
                                            Browse Courses
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                                    >
                                        <Play className="mr-2 h-5 w-5" />
                                        Watch Demo
                                    </Button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>Free Trial Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>No Credit Card Required</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero Image/Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="hidden lg:block"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
                                    <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                                                <GraduationCap className="w-12 h-12 text-red-400 mb-4" />
                                                <p className="text-white font-semibold text-lg">Expert Instructors</p>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                                                <Award className="w-12 h-12 text-red-400 mb-4" />
                                                <p className="text-white font-semibold text-lg">Certified Learning</p>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                                                <Clock className="w-12 h-12 text-red-400 mb-4" />
                                                <p className="text-white font-semibold text-lg">Flexible Schedule</p>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                                                <Users className="w-12 h-12 text-red-400 mb-4" />
                                                <p className="text-white font-semibold text-lg">Active Community</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-12 bg-white border-b relative -mt-16 z-20">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category, index) => {
                                const Icon = category.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link to={`/courses?category=${category.name.toLowerCase().replace(' ', '_')}`}>
                                            <div className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                                <div className="relative">
                                                    <Icon className="w-12 h-12 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                                                    <p className="text-gray-600 mb-4">{category.count} courses available</p>
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

                {/* Top Rated Courses */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Top Rated Courses
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Join thousands of students learning from our highest-rated programs
                            </p>
                        </div>
                        <TopRatedCourses />
                        <div className="text-center mt-12">
                            <Link to="/courses">
                                <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                                    View All Courses
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Platform Features */}
                <section className="py-20 bg-gradient-to-br from-pana-navy to-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Why Choose PANA Academy
                            </h2>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                                A comprehensive learning platform built for your success
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {platformFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                                    >
                                        <Icon className="w-12 h-12 text-red-400 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-gray-300">{feature.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Success Stories */}
                <section className="py-20 bg-gray-50">
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {successStories.map((story, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                                >
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={story.image}
                                            alt={story.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
                                        />
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

                {/* Testimonials */}
                <TestimonialsSection />

                {/* Final CTA */}
                <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Advance Your Career?
                            </h2>
                            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                                Join 5,000+ professionals transforming their careers with PANA Academy
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/courses">
                                    <Button
                                        size="lg"
                                        className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                                    >
                                        Get Started Today
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                                    >
                                        Talk to an Advisor
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default IndexNew;
