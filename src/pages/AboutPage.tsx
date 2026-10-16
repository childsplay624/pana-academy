import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Globe, BookOpen, ChevronRight, Award, Target, Heart, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import ValuesSection from "@/components/ValuesSection";
import ServicesSection from "@/components/ServicesSection";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";
import heroTraining from "@/assets/hero-training.jpg";

const AboutPage = () => {
    // Fetch images from centralized system
    const { imageUrl: defaultHeaderImage } = useSiteImage('header_about');
    const { imageUrl: trainingImg } = useSiteImage('training_main');

    // Fetch CMS content overrides (falls back to hardcoded defaults)
    const { get } = usePageContent('about');
    const headerImage = get('header_image') || defaultHeaderImage;

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
                <title>{get('title', 'About Us | PANA Institute - Our Mission & Vision')}</title>
                <meta
                    name="description"
                    content={get('meta_description', 'Learn about PANA Institute\'s mission to empower Oil & Gas professionals. Discover our vision, values, and commitment to excellence in training and development.')}
                />
            </Helmet>

            <div className="min-h-screen">
                <Navigation />

                {/* Hero Section with Visual Impact */}
                <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        {headerImage ? (
                            <img
                                src={headerImage}
                                alt="About PANA Institute"
                                className="w-full h-full object-cover object-top"
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
                                <span>{get('hero_badge', "Africa's Leading Oil & Gas Competency Hub")}</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                                <span className="text-white">{get('hero_title', 'About')}</span>
                                <span className="block text-red-600">
                                    {get('hero_subtitle', 'PANA Institute')}
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
                                {get('hero_description', 'Dedicated to empowering talent across sectors through world-class training, consulting, and research excellence.')}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                                <Link to="/courses" className="no-underline">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group shadow-lg">
                                        Explore Programmes
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link to="/contact" className="no-underline">
                                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-red-700 px-8 py-6 text-lg transition-all duration-300 shadow-lg group">
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
                        {/* Who We Are & Core Identity */}
                        <div className="text-center max-w-4xl mx-auto mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider bg-red-100 text-red-700 uppercase mb-4">
                                {get('who_we_are_badge', 'Who We Are')}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-pana-navy mb-6">
                                {get('who_we_are_title', 'Human capital for the industries that power the region')}
                            </h2>
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                {get('who_we_are_description', 'PANA Institute builds human capital for the petroleum, energy, power, and digital sectors. It delivers customised, experiential programmes on modern facilities, led by instructors who have run the jobs they teach.')}
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            {/* Left Column - Image */}
                            <div className="relative">
                                {trainingImg ? (
                                    <img
                                        src={trainingImg}
                                        alt="Professional Training at PANA Institute"
                                        className="rounded-2xl shadow-lg w-full h-[40rem] object-cover object-center"
                                        loading="lazy"
                                    />
                                ) : (
                                    <img
                                        src={heroTraining}
                                        alt="Professional Training at PANA Institute"
                                        className="rounded-2xl shadow-lg w-full h-[40rem] object-cover object-center"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-pana-navy/20 to-transparent rounded-2xl"></div>
                            </div>

                            {/* Right Column - Content */}
                            <div className="space-y-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-600">
                                    <h3 className="text-2xl font-bold text-pana-navy mb-2">Vision</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {get('vision_body', "To be Africa's competency solutions partner for the energy, power, and digital industries.")}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600">
                                    <h3 className="text-2xl font-bold text-pana-navy mb-2">Mission</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {get('mission_body', 'To develop and upskill the workforce of these industries through training that cultivates practical competencies directly applicable to real job roles.')}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-amber-500">
                                    <h3 className="text-2xl font-bold text-pana-navy mb-2">Purpose</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {get('purpose_body', 'To drive competency assessment and development, and to create a pool of relevant talent for the energy, power, and digital industries.')}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <Link to="/courses" className="no-underline">
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="bg-red-600 hover:bg-red-700 font-bold text-white shadow-lg"
                                        >
                                            {get('programmes_button_text', 'Explore Programmes')}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Six Core Mandates Section */}
                        <div className="pt-12 pb-16">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {get('mandates_title', 'Six things the Institute is set up to do, and nothing else.')}
                                </h2>
                                <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        code: '01',
                                        title: 'Accelerated competency development',
                                        desc: 'Experiential learning on live equipment, workshops, plant and simulators.'
                                    },
                                    {
                                        code: '02',
                                        title: 'Competency assessment and profiling',
                                        desc: 'Evidence based statements of what a named person can do, judged independently of who trained them.'
                                    },
                                    {
                                        code: '03',
                                        title: 'Customised learning solutions',
                                        desc: 'Client and product specific programmes, local content development, executive education and hybrid delivery.'
                                    },
                                    {
                                        code: '04',
                                        title: 'Applied research and technology',
                                        desc: 'Five centres of excellence, funded chairs, laboratories and research that reaches a licence or a working pilot.'
                                    },
                                    {
                                        code: '05',
                                        title: 'Sustainability Solutions and Climate Services',
                                        desc: 'Value driven through decarbonisation, ESG and green innovation.'
                                    },
                                    {
                                        code: '06',
                                        title: 'Capability caretaker and advisory',
                                        desc: 'Long term workforce planning, operating model design and implementation support.'
                                    }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                                        <div className="text-4xl font-black text-red-100 group-hover:text-red-200 transition-colors mb-4">
                                            {item.code}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recognition, Accreditation, Legacy Wins & Partners */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Recognition</div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">OGTAN Life Member</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    A life member of the Oil and Gas Trainers Association of Nigeria, and a presence at the Sub Saharan Africa International Petroleum Exhibition and Conference.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Accreditation</div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Accredited Service Provider</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Guided by subject matter specialists and by experienced links across academia and industry.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Legacy Wins</div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">Total, PIDWAL & Chevron</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Delivered the Total and PIDWAL programmes and the Chevron Human Capital Development programme for the Makaraba Utonana gas flare project.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-red-600 font-bold text-xs uppercase tracking-wider mb-2">Group Partners</div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">PE Energy & AKD Consulting</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    A standing training partnership across the PANA Holdings group for a range of competency development work.
                                </p>
                            </div>
                        </div>


                    </div>
                </section>

                {/* Highlights Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {get('highlights_title', 'Why Choose PANA Institute')}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {get('highlights_subtitle', 'Committed to excellence in every aspect of our training delivery')}
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
                            {get('cta_title', 'Ready to Start Your Learning Journey?')}
                        </h2>
                        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                            {get('cta_subtitle', 'Join thousands of professionals advancing their careers with PANA Institute')}
                        </p>
                        <div className="flex justify-center">
                            <Link to="/courses">
                                <Button
                                    size="lg"
                                    className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                                >
                                    Browse Courses
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Modular Sections Added via Page Builder (Disabled on About to prevent duplicate legacy sections) */}
                {/* <DynamicPageSections slug="about" /> */}

                <Footer />
            </div>
        </>
    );
};

export default AboutPage;
