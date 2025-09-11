import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, Lightbulb, BarChart2, Users, Globe, FlaskConical, Rocket, Code2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const RnDServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>R&D Services | PANA Academy - Innovation & Research Solutions</title>
        <meta name="description" content="Transform your ideas into market-ready solutions with PANA Academy's R&D-as-a-Service. We provide comprehensive research, innovation, and development services." />
        <meta name="keywords" content="R&D as a service, research and development, innovation solutions, prototype development, PANA Academy R&D" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        <main>
          {/* Hero Section with Visual Impact */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/img/rnd.jpg)' }}>
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

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center z-10">
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
                  <a href="/contact" className="no-underline">
                    <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                      Start Your Project
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
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
                  <h2 className="text-3xl font-bold text-pana-navy mb-6">R&D-as-a-Service</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    At PANA Academy, we don't just undertake R&D, we render R&D-as-a-Service. Our R&D-as-a-Service empowers businesses, startups, and institutions to transform ideas into market-ready solutions. We route concept validation through to prototype development, and we provide the tools, talent pipeline, and technical expertise.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <FlaskConical className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Multidisciplinary Research</h3>
                        <p className="text-gray-600">Validate ideas fast through expert-led feasibility studies and market analysis.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <Code2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Technology Innovation</h3>
                        <p className="text-gray-600">We use cutting-edge tools and agile development methods to output prototypes and pilot models.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <BarChart2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Policy & Systems Analysis</h3>
                        <p className="text-gray-600">Data-driven insights and interdisciplinary collaboration for impactful decisions.</p>
                      </div>
                    </div>
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
