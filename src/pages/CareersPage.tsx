import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, Target, Users, Globe, Rocket, BookOpen, Briefcase, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Card3D from "@/components/ui/Card3D";
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
                                    <span>Our Institute · Join Our Team</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
                                    Build the Institute <span className="text-red-600">with us</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                                    The Institute is appointing principal officers, directors, centre directors, faculty and assessors as it builds out its five pillars. Open roles are posted here as each is confirmed.
                                </p>

                                <div className="flex justify-center mt-8">
                                    <a href="#register-interest">
                                        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold group">
                                            Register Your Interest
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>



                    {/* Registration Instructions Section */}
                    <section id="register-interest" className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8">
                            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center max-w-4xl mx-auto">
                                <Rocket className="h-16 w-16 text-red-600 mx-auto mb-6" />
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Register Your Interest</h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                    The Institute is appointing principal officers, directors, centre directors, faculty and assessors as it builds out its five pillars.
                                </p>

                                <div className="bg-zinc-900 p-8 rounded-2xl text-white max-w-2xl mx-auto shadow-xl">
                                    <p className="text-zinc-300 text-base leading-relaxed mb-6">
                                        To register your interest, send a short profile and CV with the domain or centre you want to work in:
                                    </p>
                                    <a 
                                        href="mailto:careers@pana-institute.com" 
                                        className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-lg md:text-xl py-3 px-8 rounded-xl transition-colors shadow-lg"
                                    >
                                        careers@pana-institute.com
                                    </a>
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
