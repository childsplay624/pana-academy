import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, MessageSquare, Award, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Testimonial } from "@/types/testimonial.types";
import { useSiteImage } from "@/hooks/useSiteImage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { imageUrl: heroImage } = useSiteImage('header_testimonials');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await (supabase
        .from('testimonials' as any)
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }) as any);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Satisfied Clients", value: "200+", icon: Users },
    { label: "Success Stories", value: "100%", icon: Award },
    { label: "Expert Trainers", value: "50+", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Success Stories | PANA Institute - Client Testimonials</title>
        <meta
          name="description"
          content="Hear from our clients who have transformed their careers and improved their organizational performance through PANA Institute's Solutions and Services."
        />
      </Helmet>

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-pana-navy">
        <div className="absolute inset-0 opacity-20">
          {heroImage ? (
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pana-navy via-slate-900 to-red-900" />
          )}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pana-gold/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-pana-gold text-sm font-medium border border-white/20 mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Real Stories, Real Results</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.25] pb-2">
              Voices of <span className="text-red-600">Excellence</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Discover how PANA Institute has empowered professionals and organizations across the globe to achieve unprecedented growth and technical mastery.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                  <stat.icon className="w-8 h-8 text-pana-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Testimonial Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-slate-600 font-medium">Loading success stories...</p>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-red-100" />

                    <CardContent className="p-8 flex flex-col h-full pt-10">
                      <Quote className="w-10 h-10 text-red-600/10 mb-6 group-hover:text-red-600/20 transition-colors" />

                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? 'fill-pana-gold text-pana-gold' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>

                      <blockquote className="text-slate-700 leading-relaxed mb-8 flex-grow italic">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pana-navy to-slate-800 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {testimonial.image_initials || testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-pana-navy">{testimonial.name}</div>
                          <div className="text-sm text-slate-500">{testimonial.position}</div>
                          <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">{testimonial.company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No testimonials yet</h3>
              <p className="text-slate-500">Be the first to share your PANA Institute success story!</p>
              <Button className="mt-8 bg-red-600 hover:bg-red-700">Contact Us to Share</Button>
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-pana-navy mb-6">
                Why Our Graduates <span className="text-red-600">Stand Out</span>
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                We don't just teach theories; we cultivate real-world competencies. Our training is designed to bridge the gap between classroom learning and industrial application.
              </p>

              <ul className="space-y-4">
                {[
                  "Practical, hands-on exposure to industry tools",
                  "Mentorship from seasoned Oil & Gas veterans",
                  "Nationally and internationally recognized certifications",
                  "Lifetime access to professional networking alumni"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <Link to="/courses" className="no-underline">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white group font-bold shadow-lg">
                    Explore Programmes
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-red-600 opacity-5 blur-2xl rounded-full" />
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="space-y-4 pt-12">
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <img src="/shell.png" alt="Shell" className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <img src="/total.png" alt="Total" className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <img src="/nnpc.png" alt="NNPC" className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <img src="/chevron.png" alt="Chevron" className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl shadow-sm border border-slate-100">
                    <img src="/access-bank.png" alt="Access Bank" className="h-12 w-auto mx-auto grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-700 -skew-x-12 translate-x-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Join Our Success Stories</h2>
          <p className="text-xl text-red-50 max-w-2xl mx-auto mb-10 opacity-90">
            Ready to transform your career or organization? Get in touch with us today to discuss your goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-red-600 hover:bg-slate-100 px-8 h-14 text-lg font-bold">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
