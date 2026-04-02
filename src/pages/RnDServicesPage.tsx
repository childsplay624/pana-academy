import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, Lightbulb, Users, Globe, Rocket, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteImage } from "@/hooks/useSiteImage";

const RnDServicesPage = () => {
  // Fetch header image from centralized system
  const { imageUrl: headerImage } = useSiteImage('header_rnd');

  return (
    <>
      <Helmet>
        <title>R&D Services | PANA Academy</title>
        <meta name="description" content="Research and Development services for innovation, technology development, and cutting-edge solutions." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />

        <main className="flex-grow">
          {/* Page Header with Image */}
          <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-[400px] md:min-h-[500px]">
            <div className="absolute inset-0">
              {headerImage ? (
                <img
                  src={headerImage}
                  alt="R&D Services"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pana-navy to-pana-red"></div>
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
              <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-pana-blue/30 rounded-full animate-pulse"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10 mt-16">
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  <span>Innovation & Research Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                  <span className="text-white">Research</span>
                  <span className="block text-red-600">
                    & Development
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
                  Transform your ideas into market-ready solutions with our comprehensive R&D services.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <a href="#rnd-services" className="no-underline">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-pana-navy mb-6">Research and Development (R&D)</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    From concept validation to prototype development, PANA Academy bridges critical gaps in research and development. We empower organizations across all sectors to innovate, grow, and transform ideas into impactful, market-ready solutions through practical insights, technical expertise, and a strong talent pipeline.
                  </p>

                  <div className="space-y-4">
                    <p className="text-gray-800 font-semibold text-lg">To highlight the following R&D Services areas:</p>
                    <ul className="space-y-3">
                      {[
                        "Applied research: Workforce Performance and Project Readiness Analysis.",
                        "Intervention Impact Analysis",
                        "Competence/Skill Gap Evaluation.",
                        "R&D Company Institutionalization",
                        "Policy Impact Analysis",
                        "Technology Innovation and Prototyping",
                        "Innovation Strategy Development and Analysis",
                        "Products and Process Innovation Planning",
                        "Feasibility and Prove of Concept (POC) Studies",
                        "R&D Roadmap Development",
                        "R&D Portfolio Management"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-pana-gold mt-2.5 mr-3"></span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                  <div className="space-y-6">
                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <Rocket className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Strategic Partnerships</h3>
                      </div>
                      <p className="text-gray-600">
                        We leverage industry members and global strategic partnerships to accelerate innovation and development.
                      </p>
                    </div>

                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <Users className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Talent Pipeline</h3>
                      </div>
                      <p className="text-gray-600">
                        Access to top-tier talent and experts in various fields to support your R&D initiatives.
                      </p>
                    </div>

                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <BookOpen className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Knowledge Transfer</h3>
                      </div>
                      <p className="text-gray-600">
                        Comprehensive documentation and training to ensure smooth knowledge transfer and implementation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gray-50 text-pana-navy py-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Bring Your Ideas to Life?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Partner with PANA Academy's R&D experts to transform your concepts into reality.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" className="no-underline">
                  <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                    Start Your R&D Project
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
                <a href="/team" className="no-underline">
                  <Button variant="outline" className="bg-transparent border-pana-navy text-pana-navy hover:bg-pana-navy/10 px-8 py-6 text-lg group">
                    Contact Our Team
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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

export default RnDServicesPage;
