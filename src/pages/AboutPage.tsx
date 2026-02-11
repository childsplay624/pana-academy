import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Globe, BookOpen, ChevronRight, Award, Target, Heart, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImage";
import ValuesSection from "@/components/ValuesSection";
import ServicesSection from "@/components/ServicesSection";
import heroTraining from "@/assets/hero-training.jpg";

const AboutPage = () => {
    // Fetch images from centralized system
    const { imageUrl: headerImage } = useSiteImage('header_about');
    const { imageUrl: trainingImg } = useSiteImage('training_main');

    const highlights = [
        {
            icon: Users,
            title: "Expert Faculty",
            description: "Industry veterans and academic leaders"
        },
        {
            icon: Globe,
            title: "Global Reach",
            description: "Training professionals across Africa and beyond"
        },
        {
            icon: BookOpen,
            title: "Comprehensive Programs",
            description: "From technical skills to leadership development"
        }
    ];

    const values = [
        {
            icon: Target,
            title: "Excellence",
            description: "We maintain the highest standards in everything we do, from course content to delivery."
        },
        {
            icon: Heart,
            title: "Integrity",
            description: "We operate with honesty, transparency, and ethical practices in all our engagements."
        },
        {
            icon: TrendingUp,
            title: "Innovation",
            description: "We continuously evolve our methodologies to meet the changing needs of the industry."
        },
        {
            icon: Award,
            title: "Quality",
            description: "We are committed to delivering world-class training that drives real results."
        }
    ];

    return (
        <>
            <Helmet>
                <title>About Us | PANA Academy - Our Mission & Vision</title>
                <meta
                    name="description"
                    content="Learn about PANA Academy's mission to empower Oil & Gas professionals. Discover our vision, values, and commitment to excellence in training and development."
                />
            </Helmet>

            <div className="min-h-screen">
                <Navigation />

                {/* Hero Section with Visual Impact */}
                <section className="relative pt-0 pb-20 md:pb-28 overflow-hidden mt-20">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {headerImage ? (
                            <img
                                src={headerImage}
                                alt="About PANA Academy"
                                className="w-full h-full object-cover object-center"
                                loading="eager"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-gold"></div>
                        )}
                    </div>
                    {/* Black overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Subtle animated elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pana-gold/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-20 w-6 h-6 bg-pana-gold/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-40 right-32 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                        <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-red-600/30 rounded-full animate-pulse"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
                        <div className="space-y-8 animate-fade-in">
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                                <Zap className="w-5 h-5 text-pana-gold" />
                                <span>Africa's Leading Oil & Gas Competency Hub</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                                <span className="text-white">About</span>
                                <span className="block text-red-600">
                                    PANA Academy
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
                                Dedicated to empowering talent across sectors through world-class training, consulting, and research excellence.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                                <Link to="/courses" className="no-underline">
                                    <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                                        Explore Our Programs
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link to="/contact" className="no-underline">
                                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                                        Get in Touch
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content - Mission, Vision, Purpose */}
                <section className="py-20 bg-pana-light-gray">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            {/* Left Column - Image */}
                            <div className="relative">
                                {trainingImg ? (
                                    <img
                                        src={trainingImg}
                                        alt="Professional Training at PANA Academy"
                                        className="rounded-2xl shadow-lg w-full h-[40rem] object-cover object-center"
                                        loading="lazy"
                                    />
                                ) : (
                                    <img
                                        src={heroTraining}
                                        alt="Professional Training at PANA Academy"
                                        className="rounded-2xl shadow-lg w-full h-[40rem] object-cover object-center"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-pana-navy/20 to-transparent rounded-2xl"></div>
                            </div>

                            {/* Right Column - Content */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-pana-navy mb-4">Our Mission</h3>
                                    <p className="text-black leading-relaxed">
                                        To empower individuals and organizations with the knowledge, skills, and capabilities
                                        needed to excel in today's dynamic business environment. We bridge the gap between
                                        theoretical knowledge and practical application through innovative training methodologies.
                                    </p>
                                </div>

                                <p className="text-black leading-relaxed">
                                    To holistically develop and upskill Oil and Gas Industry workforce by providing training
                                    opportunities that facilitate the cultivation of real-world practical competences/skills
                                    directly applicable to relevant job roles in the industry.
                                </p>

                                <div>
                                    <h3 className="text-2xl font-bold text-pana-navy mb-4">Our Vision</h3>
                                    <p className="text-black leading-relaxed">
                                        To be Africa's leading Competency Hub for the Oil and Gas Industry.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-pana-navy mb-4">Purpose</h3>
                                    <p className="text-black leading-relaxed">
                                        To drive competency development to create a pool of relevant workforce for the
                                        oil and gas industry.
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <Link to="/courses">
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="bg-red-600 hover:bg-red-700 transition-colors duration-200 text-white"
                                        >
                                            Our Programs
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose PANA Academy
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Committed to excellence in every aspect of our training delivery
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {highlights.map((highlight, index) => {
                                const Icon = highlight.icon;
                                return (
                                    <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                        <Icon className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{highlight.title}</h3>
                                        <p className="text-gray-600">{highlight.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Values Section */}


                {/* Values Section - Company Values with Images */}
                <ValuesSection />

                {/* Services Section */}
                <ServicesSection />

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals advancing their careers with PANA Academy
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/courses">
                                <Button
                                    size="lg"
                                    className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                                >
                                    Browse Courses
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                                >
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default AboutPage;
