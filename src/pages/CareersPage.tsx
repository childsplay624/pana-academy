import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Target, Rocket, Heart, Award, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";
import { usePageContent } from "@/hooks/usePageContent";
import ScrollReveal from "@/components/ui/ScrollReveal";

const CareersPage = () => {
    // Fetch header image from centralized system
    const { imageUrl: defaultHeaderImage } = useSiteImage('header_careers');
    const { get } = usePageContent('careers');
    const headerImage = get('header_image') || defaultHeaderImage;

    const values = [
        {
            icon: Heart,
            title: "Passionate Culture",
            description: "We are a team of dedicated professionals passionate about transforming energy and technology competency standards."
        },
        {
            icon: Target,
            title: "Mission Driven",
            description: "Every role at PANA Institute contributes directly to our mandate of closing technical competency gaps."
        },
        {
            icon: Award,
            title: "Excellence & Governance",
            description: "We uphold supreme standards in everything we do, from curriculum design to live-plant assessment delivery."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Careers & Talent | PANA Institute</title>
                <meta name="description" content="Build your career at PANA Institute. Explore opportunities to join a team of experts dedicated to competency cultivation and innovation in the energy sector." />
            </Helmet>

            <div className="min-h-screen bg-paper text-ink flex flex-col">
                <Navigation />

                <main className="flex-1 w-full">
                    {/* Editorial Dark Hero Section */}
                    <section className="relative pt-36 pb-24 bg-ink text-paper border-b border-zinc-800 overflow-hidden">
                        <div className="max-w-[1320px] mx-auto px-7 relative z-10">
                            <div className="max-w-4xl space-y-6">
                                <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block">
                                    CAREERS & TALENT RECRUITMENT · PANA INSTITUTE
                                </span>

                                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-paper leading-tight">
                                    Build the Future of Industrial Competency With Us
                                </h1>

                                <p className="font-serif text-lg sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
                                    Join a world-class team of certified assessors, researchers, and technical educators defining the standards against which competence is measured across Africa and global markets.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a href="#open-positions">
                                        <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-none border border-oxblood-light font-semibold shadow-xl">
                                            View Open Positions
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Why PANA section */}
                    <section className="py-24 bg-paper">
                        <div className="max-w-[1320px] mx-auto px-7">
                            <ScrollReveal direction="up" delay={0.1}>
                                <div className="mb-16 border-b border-line pb-6">
                                    <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-2">
                                        01 · OUR WORK CULTURE
                                    </span>
                                    <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">Why Join PANA Institute?</h2>
                                    <p className="font-serif text-base text-muted-foreground max-w-2xl mt-2 leading-relaxed">
                                        We offer more than just a role; we offer the opportunity to shape industrial standards and research innovation across global energy sectors.
                                    </p>
                                </div>
                            </ScrollReveal>

                            <div className="grid md:grid-cols-3 gap-8">
                                {values.map((value, index) => (
                                    <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                                        <div className="p-8 bg-paper-soft border border-line rounded-none hover:border-oxblood/40 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="w-12 h-12 rounded-none bg-paper border border-line flex items-center justify-center text-oxblood mb-6">
                                                    <value.icon className="h-6 w-6" />
                                                </div>
                                                <h3 className="font-serif text-2xl font-bold text-ink mb-3">{value.title}</h3>
                                                <p className="font-serif text-xs text-muted-foreground leading-relaxed">{value.description}</p>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Opportunities Section */}
                    <section id="open-positions" className="py-24 bg-paper-soft border-t border-line">
                        <div className="max-w-[1320px] mx-auto px-7">
                            <ScrollReveal direction="up" delay={0.1}>
                                <div className="bg-paper rounded-none p-8 md:p-14 border border-line shadow-sm space-y-8">
                                    <div className="max-w-3xl">
                                        <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block mb-3">
                                            02 · TALENT DIRECTORY
                                        </span>
                                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink mb-4">Current Opportunities & Assessor Panel</h2>
                                        <p className="font-serif text-base text-muted-foreground leading-relaxed mb-4">
                                            We are continuously seeking domain experts, certified assessors, and research directors in Oil & Gas Engineering, Digital Transformation, and Sustainability.
                                        </p>
                                        <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-8">
                                            If your area of expertise aligns with our 5 Mandate Verticals, we invite you to submit your credentials to our Talent Acquisition Directorate.
                                        </p>

                                        <div className="bg-ink text-paper p-8 rounded-none border border-zinc-800 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-brass" />
                                                <h3 className="font-serif text-xl font-medium text-paper">Submit Your Credentials / CV</h3>
                                            </div>
                                            <p className="font-serif text-xs text-zinc-300 leading-relaxed">
                                                Send your executive bio and detailed CV directly to our institutional recruitment team:
                                            </p>
                                            <a href="mailto:info@pana-institute.com" className="font-mono text-sm text-brass font-semibold hover:underline block pt-2">
                                                info@pana-institute.com
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 bg-ink text-paper border-t border-zinc-800 text-center">
                        <div className="max-w-[1320px] mx-auto px-7 space-y-6">
                            <span className="font-mono text-xs text-brass uppercase tracking-[0.22em] font-semibold block">
                                TALENT ACQUISITION · PANA INSTITUTE
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-paper">Ready to Shape Technical Excellence?</h2>
                            <p className="font-serif text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                                Join an elite network of educators and researchers dedicated to advancing competency standards.
                            </p>
                            <div className="pt-2">
                                <a href="/contact">
                                    <Button className="bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-none font-semibold border border-oxblood-light shadow-xl">
                                        Contact Talent Directorate
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
};

export default CareersPage;
