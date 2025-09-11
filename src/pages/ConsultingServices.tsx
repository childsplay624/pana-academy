import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ConsultingServices() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
      {/* Page Header with Image */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/hero-training.jpg)' }}>
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
                  <span className="text-red-500">World-Class Training Excellence</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                  <span className="text-red-500">Training</span>
                  <span className="block bg-gradient-to-r from-pana-gold to-yellow-300 bg-clip-text text-transparent">
                    <span className="text-red-500">Delivery</span>
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                  Revolutionary methods and cutting-edge approaches designed to 
                  <span className="text-pana-gold font-semibold"> maximize learning impact</span> and drive 
                  <span className="text-pana-gold font-semibold"> organizational transformation</span>
                </p>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pana-gold">200+</div>
                    <div className="text-white/70 text-sm">Professionals Trained</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pana-gold">95%</div>
                    <div className="text-white/70 text-sm">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pana-gold">50+</div>
                    <div className="text-white/70 text-sm">Global Partners</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </section>

      {/* Main Content Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-pana-navy mb-6">Our Approach</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're a startup seeking market entry, an NGO refining impact models, or a government agency driving policy innovation, PANA Academy delivers actionable insights, and we turn challenges into opportunities and ideas into results.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Diagnose</h3>
                    <p className="text-gray-600">Problems using data-driven analysis and sector expertise.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Design</h3>
                    <p className="text-gray-600">Solutions that work, from business models to operational frameworks.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Drive</h3>
                    <p className="text-gray-600">Measurable impact with strategies tailored to your goals and context.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-pana-gold mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Develop</h3>
                    <p className="text-gray-600">Internal capacity through tailored training and workshops.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Button className="bg-pana-gold hover:bg-pana-gold/90 text-white px-8 py-6 text-lg">
                  Get in Touch
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-pana-navy mb-6">Why Choose PANA Academy?</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our consultants are practitioners, and we work across industries, sectors, and borders, helping our clients achieve competitive advantage. Whatever your business focus, PANA Academy is your strategic ally.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-pana-gold mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Industry-experienced consultants</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-pana-gold mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Data-driven decision making</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-pana-gold mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Customized solutions for your needs</p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-pana-gold mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-700">Proven track record of success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-pana-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Organization?</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Partner with PANA Academy's expert consultants to turn your challenges into opportunities.
          </p>
          <Button className="bg-pana-gold hover:bg-pana-gold/90 text-pana-navy px-8 py-6 text-lg font-semibold">
            Schedule a Consultation
          </Button>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
