import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, Target, Users, Globe, Rocket, BookOpen, Briefcase, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";

const CareersPage = () => {
    // Fetch header image from centralized system
    const { imageUrl: defaultHeaderImage } = useSiteImage('header_careers');
    const { get } = usePageContent('careers');
    const headerImage = get('header_image') || defaultHeaderImage;

    const values = [
        {
            icon: Heart,
            title: "Passionate Culture",
            description: "We are a team of dedicated professionals who are passionate about transforming the energy sector."
        },
        {
            icon: Target,
            title: "Mission Driven",
            description: "Every role at PANA Institute contributes directly to our mission of closing competency gaps."
        },
        {
            icon: Award,
            title: "Excellence",
            description: "We strive for excellence in everything we do, from training delivery to research innovation."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Careers | PANA Institute - Join Our Team</title>
                <meta name="description" content="Build your career at PANA Institute. Explore opportunities to join a team of experts dedicated to competency cultivation and innovation in the energy sector." />
            </Helmet>

            <div className="min-h-screen bg-gradient-subtle">
                <Navigation />

                <main>
                    {/* Hero Section */}
                    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
                        <div className="absolute inset-0">
                            {headerImage ? (
                                <img
                                    src={headerImage}
                                    alt="Careers at PANA Institute"
                                    className="w-full h-full object-cover object-center"
                                    loading="eager"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pana-gold to-pana-red"></div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/60"></div>

                        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
                            <div className="space-y-8 animate-fade-in">
                                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                                    <Briefcase className="w-5 h-5 text-pana-gold" />
                                    <span>Join Our Growing Team</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                                    <span className="text-white">{get('hero_title', 'Build Your')}</span>
                                    <span className="block text-red-600">{get('hero_subtitle', 'Future With Us')}</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
                                    {get('hero_description', 'At PANA Institute, we are always looking for visionary educators, industry experts, and innovative thinkers.')}
                                </p>

                                <div className="flex justify-center mt-8">
                                    <a href="#open-positions">
                                        <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                                            View Opportunities
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why PANA section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-pana-navy mb-4">Why PANA Institute?</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    We offer more than just a job; we offer a chance to make a real impact in the energy industry across Africa.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {values.map((value, index) => (
                                    <div key={index} className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                        <div className="p-3 bg-red-600/10 rounded-xl w-fit mb-6">
                                            <value.icon className="h-8 w-8 text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-pana-navy mb-4">{value.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Opportunities Section */}
                    <section id="open-positions" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                                <div className="max-w-3xl mx-auto">
                                    <Rocket className="h-16 w-16 text-pana-gold mx-auto mb-8" />
                                    <h2 className="text-4xl font-bold text-pana-navy mb-6">Current Opportunities</h2>
                                    <p className="text-xl text-gray-600 mb-8">
                                        While we may not have specific openings listed at this moment, we are always eager to meet talented individuals who share our vision.
                                    </p>
                                    <p className="text-lg text-gray-600 mb-12">
                                        Are you an industry expert in Oil & Gas, Digital Transformation, or Leadership Development? We want to hear from you.
                                    </p>

                                    <div className="bg-pana-navy p-8 rounded-2xl text-white">
                                        <h3 className="text-2xl font-bold mb-4">Send Us Your CV</h3>
                                        <p className="text-gray-300 mb-6">
                                            Send your resume and a brief introduction to our talent acquisition team.
                                        </p>
                                        <a href="mailto:careers@pana-institute.com" className="text-pana-gold text-xl font-bold hover:underline">
                                            info@pana-institute.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 bg-pana-navy text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600 skew-x-12 transform translate-x-20 opacity-10"></div>
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to Shape the Future?</h2>
                            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                                Join a community of professionals dedicated to creating excellence through knowledge and innovation.
                            </p>
                            <a href="/contact">
                                <Button className="bg-red-600 hover:bg-red-700 text-white px-10 py-7 text-xl font-bold rounded-full">
                                    Contact Talent Acquisition
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </a>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default CareersPage;
