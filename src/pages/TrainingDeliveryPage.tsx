import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Monitor, Users, Award, ArrowRight, CheckCircle, Zap, Globe, Target, TrendingUp } from "lucide-react";

const TrainingDelivery = () => {
  return (
    <>
      <Helmet>
        <title>Training Delivery | PANA Academy - Excellence in Learning</title>
        <meta name="description" content="Discover PANA Academy's comprehensive training delivery methods, modern technology platforms, and international standard learning environments designed for maximum impact." />
        <meta name="keywords" content="training delivery, learning management system, virtual classroom, training methods, PANA Academy" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        
        <main>
          {/* Hero Section with Visual Impact */}
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

          {/* Value Proposition Section */}
          <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="max-w-5xl mx-auto bg-white dark:bg-card rounded-3xl shadow-2xl p-10 md:p-16 -mt-20 relative z-10 border border-gray-100 dark:border-gray-800">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-pana-gold/10 px-4 py-2 rounded-full text-pana-gold font-medium mb-4">
                    <Target className="w-4 h-4" />
                    Our Mission
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Transforming Learning Through Innovation
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none text-center">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    At PANA Academy, training delivery refers to the sophisticated methods and cutting-edge approaches we use to present learning content and facilitate competency development. We meticulously design our training delivery methods to maximize impact, effectiveness, and measurable outcomes for enhanced employee performance and sustainable organizational success.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-pana-blue to-pana-navy rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Global Standards</h3>
                    <p className="text-muted-foreground text-sm">International best practices and certifications</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-pana-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Proven Results</h3>
                    <p className="text-muted-foreground text-sm">Measurable impact on performance metrics</p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-pana-navy to-pana-blue rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Innovation Focus</h3>
                    <p className="text-muted-foreground text-sm">Latest technology and methodologies</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Training Excellence Pillars */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Four Pillars of Excellence
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our comprehensive training delivery framework is built on four fundamental pillars that ensure exceptional learning outcomes
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-10">
                {/* Pillar 1: Training Methods */}
                <article className="group relative">
                  <div className="bg-white dark:bg-card rounded-3xl shadow-xl p-10 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pana-gold/10 to-transparent rounded-bl-3xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-pana-gold to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-pana-gold bg-pana-gold/10 px-3 py-1 rounded-lg">01</span>
                            <div className="w-12 h-px bg-gradient-to-r from-pana-gold to-transparent"></div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Training Methods</h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        Our comprehensive training methods are meticulously designed to accommodate diverse learning styles and professional requirements, employing a sophisticated blend of traditional and innovative approaches.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-gold" />
                          <span className="text-foreground font-medium">Interactive Learning Modules</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-gold" />
                          <span className="text-foreground font-medium">Hands-on Practical Sessions</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-gold" />
                          <span className="text-foreground font-medium">Case Study Analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Pillar 2: Training Approach */}
                <article className="group relative">
                  <div className="bg-white dark:bg-card rounded-3xl shadow-xl p-10 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pana-blue/10 to-transparent rounded-bl-3xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-pana-blue to-pana-navy rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Users className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-pana-blue bg-pana-blue/10 px-3 py-1 rounded-lg">02</span>
                            <div className="w-12 h-px bg-gradient-to-r from-pana-blue to-transparent"></div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Training Approach</h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        We adopt a revolutionary learner-centered approach that emphasizes practical application, interactive engagement, and continuous assessment to ensure immediate real-world application.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-blue" />
                          <span className="text-foreground font-medium">Personalized Learning Paths</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-blue" />
                          <span className="text-foreground font-medium">Continuous Assessment</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-blue" />
                          <span className="text-foreground font-medium">Real-world Application</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Pillar 3: Technology & Platforms */}
                <article className="group relative">
                  <div className="bg-white dark:bg-card rounded-3xl shadow-xl p-10 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pana-navy/10 to-transparent rounded-bl-3xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-pana-navy to-slate-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Monitor className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-pana-navy bg-pana-navy/10 px-3 py-1 rounded-lg">03</span>
                            <div className="w-12 h-px bg-gradient-to-r from-pana-navy to-transparent"></div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Technology & Platforms</h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        Advanced digital ecosystem featuring cutting-edge Learning Management Systems, immersive virtual classrooms, and mobile-first applications for flexible, accessible learning experiences.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-navy" />
                          <span className="text-foreground font-medium">AI-Powered LMS</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-navy" />
                          <span className="text-foreground font-medium">Virtual Reality Training</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-pana-navy" />
                          <span className="text-foreground font-medium">Mobile Learning Apps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                {/* Pillar 4: Learning Environment */}
                <article className="group relative">
                  <div className="bg-white dark:bg-card rounded-3xl shadow-xl p-10 h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pana-gold/10 to-transparent rounded-bl-3xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Award className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-lg">04</span>
                            <div className="w-12 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-foreground">Learning Environment</h3>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                        World-class physical and virtual learning environments engineered to international standards, featuring optimal ergonomics, climate control, and flexible configurations for enhanced engagement.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-foreground font-medium">International Standards</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-foreground font-medium">Expert Facilitators</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                          <span className="text-foreground font-medium">Flexible Spaces</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Dynamic Call to Action */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-300 to-red-500"></div>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pana-gold rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
              </div>
            </div>
            
            <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white border border-white/20">
                  <Zap className="w-5 h-5 text-pana-gold" />
                  Transform Your Organization Today
                </div>
                
                <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Ready to Experience
                  <span className="block bg-gradient-to-r from-pana-gold to-yellow-300 bg-clip-text text-transparent">
                    <span className="text-red-500">Training Excellence?</span>
                  </span>
                </h3>
                
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Join over 10,000 professionals who have transformed their careers through our revolutionary training delivery methods and achieved measurable success.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <a 
                    href="#contact" 
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-pana-gold text-white font-bold rounded-2xl hover:bg-pana-gold/90 transition-all duration-300 hover:scale-105 shadow-2xl shadow-pana-gold/25"
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a 
                    href="#courses" 
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Explore Courses
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-12 border-t border-white/20">
                  <p className="text-white/60 text-sm mb-6">Trusted by leading organizations worldwide</p>
                  <div className="flex justify-center items-center gap-8 opacity-60">
                    <div className="text-white font-semibold">Fortune 500</div>
                    <div className="w-px h-6 bg-white/30"></div>
                    <div className="text-white font-semibold">ISO Certified</div>
                    <div className="w-px h-6 bg-white/30"></div>
                    <div className="text-white font-semibold">Global Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TrainingDelivery;