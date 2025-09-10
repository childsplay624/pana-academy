import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, CheckCircle, Target, TrendingUp, Lightbulb, BarChart2, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConsultingServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Consulting Services | PANA Academy - Strategic Business Solutions</title>
        <meta name="description" content="Transform your organization with PANA Academy's expert consulting services. We provide strategic solutions to help businesses navigate complexity and drive growth." />
        <meta name="keywords" content="business consulting, strategic planning, organizational development, PANA Academy consulting" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        <main>
          {/* Hero Section with Visual Impact */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/hero-consulting.jpg)' }}>
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
                  <span>Strategic Business Solutions</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                  <span className="text-white">Consulting</span>
                  <span className="block text-red-600">
                    Services
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto">
                  Transform your organization with our expert consulting services designed to drive growth, innovation, and sustainable success.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <a href="/contact" className="no-underline">
                    <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                  <a href="#our-approach" className="no-underline">
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
                  <h2 className="text-3xl font-bold text-pana-navy mb-6">Our Approach</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    At PANA Academy, we don't just advise, we transform. Our consultancy services are designed to help organizations navigate complexity, unlock growth, and build resilient strategies. Whether you're a startup seeking market entry, an NGO refining impact models, or a government agency driving policy innovation, PANA Academy delivers actionable insights, and we turn challenges into opportunities and ideas into results.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Diagnose</h3>
                        <p className="text-gray-600">Problems using data-driven analysis and sector expertise.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Design</h3>
                        <p className="text-gray-600">Solutions that work, from business models to operational frameworks.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Drive</h3>
                        <p className="text-gray-600">Measurable impact with strategies tailored to your goals and context.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">Develop</h3>
                        <p className="text-gray-600">Internal capacity through tailored training and workshops.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                  <div className="space-y-6">
                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <Target className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Our Mission</h3>
                      </div>
                      <p className="text-gray-600">
                        To empower organizations with strategic insights and practical solutions that drive sustainable growth and innovation.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <Globe className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Global Reach</h3>
                      </div>
                      <p className="text-gray-600">
                        With experience across multiple industries and regions, we bring a global perspective to local challenges.
                      </p>
                    </div>
                    
                    <div className="p-6 bg-pana-navy/5 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-pana-gold/10 rounded-full">
                          <BarChart2 className="h-8 w-8 text-pana-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-pana-navy">Proven Results</h3>
                      </div>
                      <p className="text-gray-600">
                        Our data-driven approach ensures measurable outcomes and a clear return on your investment.
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Organization?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Partner with PANA Academy's expert consultants to turn your challenges into opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" className="no-underline">
                  <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold group">
                    Schedule a Consultation
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

export default ConsultingServicesPage;
