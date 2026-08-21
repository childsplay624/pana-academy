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

            <div className="min-h-screen bg-paper text-ink">
                <Navigation />

                {/* Hero Section with Editorial Frontpage Styling */}
                <section className="relative pt-36 pb-24 overflow-hidden bg-ink text-paper border-b border-line">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        {headerImage ? (
                            <img
                                src={headerImage}
                                alt="About PANA Institute"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        ) : (
                            <img
                                src="/images/hero_slide_2.png"
                                alt="About PANA Institute"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
                    </div>

                    <div className="max-w-[1320px] mx-auto px-7 relative z-10">
                        <div className="max-w-4xl space-y-6">
                            <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block">
                                ABOUT PANA INSTITUTE · MANDATE & HERITAGE
                            </span>

                            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-paper leading-tight">
                                Building the standard against which competence is measured.
                            </h1>

                            <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
                                {get('hero_description', 'Founded as the capability arm of PANA Holdings, elevated to Institute status to develop certified talent, assess competence, and drive applied research across 9 countries on four continents.')}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link to="/courses">
                                    <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs border border-oxblood-light shadow-xl font-semibold">
                                        Explore Programmes
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="outline" className="bg-transparent border-brass/50 text-paper hover:bg-brass/20 font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs font-semibold">
                                        Contact Advisory
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision, Mission, Purpose Section */}
                <section className="py-24 bg-paper">
                    <div className="max-w-[1320px] mx-auto px-7">
                        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                            {/* Left Column - Featured Visual Image */}
                            <div className="relative rounded-xs overflow-hidden border border-line shadow-2xl group">
                                <img
                                    src={trainingImg || heroTraining || "/images/hero_slide_1.png"}
                                    alt="Professional Training at PANA Institute"
                                    className="w-full h-[36rem] object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-paper/90 backdrop-blur-xs border border-line rounded-xs">
                                    <span className="font-mono text-[10px] text-oxblood uppercase tracking-widest font-semibold block mb-1">EXPERIENTIAL LEARNING</span>
                                    <h4 className="font-serif text-xl font-medium text-ink">Port Harcourt & Abuja Operational Labs</h4>
                                </div>
                            </div>

                            {/* Right Column - Vision & Mission Luxury Cards */}
                            <div className="space-y-6">
                                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                                    OUR OPERATING PHILOSOPHY
                                </span>
                                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium mb-8">
                                    Developing Africa's Technical & Digital Leadership
                                </h2>

                                <div className="bg-ink text-paper p-8 rounded-xs border border-brass/30 space-y-3 shadow-xl">
                                    <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block">01 · VISION</span>
                                    <h3 className="font-serif text-2xl font-medium">Africa's Premier Competency Partner</h3>
                                    <p className="text-sm text-zinc-300 leading-relaxed font-serif">
                                        {get('vision_body', "To be Africa's premier competency solutions partner for the petroleum, energy, power, and digital industries.")}
                                    </p>
                                </div>

                                <div className="bg-ink text-paper p-8 rounded-xs border border-brass/30 space-y-3 shadow-xl">
                                    <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block">02 · MISSION</span>
                                    <h3 className="font-serif text-2xl font-medium">Practical Workforce Upskilling</h3>
                                    <p className="text-sm text-zinc-300 leading-relaxed font-serif">
                                        {get('mission_body', "To develop and upskill the workforce through experiential training that cultivates competencies directly applicable to real job roles.")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Highlights Grid */}
                        <div className="pt-16 border-t border-line">
                            <span className="font-mono text-xs uppercase tracking-widest text-oxblood font-semibold block mb-8 text-center">
                                WHY INDUSTRY LEADERS CHOOSE PANA INSTITUTE
                            </span>
                            <div className="grid md:grid-cols-3 gap-8">
                                {highlights.map((highlight, index) => {
                                    const Icon = highlight.icon;
                                    return (
                                        <div key={index} className="bg-paper-soft p-8 border border-line rounded-xs hover:border-oxblood/40 transition-all group shadow-xs">
                                            <Icon className="w-10 h-10 text-oxblood mb-6 group-hover:scale-110 transition-transform" />
                                            <h3 className="font-serif text-2xl font-medium text-ink mb-3">{highlight.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed font-serif">{highlight.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <ValuesSection />
                <ServicesSection />

                {/* Frontpage Editorial CTA */}
                <section className="py-24 bg-ink text-paper border-t border-line relative overflow-hidden">
                    <div className="max-w-[1320px] mx-auto px-7 text-center relative z-10">
                        <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block mb-4">READY TO ELEVATE COMPETENCE?</span>
                        <h2 className="font-serif text-4xl sm:text-5xl font-medium mb-6 max-w-3xl mx-auto">
                            Join Thousands of Certified Energy & Tech Professionals
                        </h2>
                        <p className="text-base text-zinc-300 mb-8 max-w-2xl mx-auto font-serif">
                            Explore our accredited training calendar or consult with our competency assessors.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/courses">
                                <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs font-semibold shadow-xl border border-oxblood-light">
                                    Browse Course Catalogue
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" className="bg-transparent border-brass/50 text-paper hover:bg-brass/20 font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs font-semibold">
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
