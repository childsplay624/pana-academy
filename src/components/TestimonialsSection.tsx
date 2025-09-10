import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Testimonial } from "@/types/testimonial.types";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Fallback to empty array - component will show fallback message
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (loading) {
    return (
      <section id="testimonials" className="py-20 relative bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/hero-training.jpg)' }}>
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pana-gold mx-auto"></div>
            <p className="text-white mt-4">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-20 relative bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/hero-training.jpg)' }}>
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-200">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 relative bg-cover bg-center" style={{ backgroundImage: 'url(/src/assets/hero-training.jpg)' }}>
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Hear from industry leaders who have transformed their organizations through PANA Academy's programs.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start space-x-6">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-pana-gold flex-shrink-0 mt-2" />
                
                {/* Testimonial Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-pana-gold text-pana-gold" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-white leading-relaxed mb-6">
                    "{currentTestimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pana-gold rounded-full flex items-center justify-center text-pana-navy font-bold">
                      {currentTestimonial.image_initials || currentTestimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{currentTestimonial.name}</div>
                      <div className="text-gray-300 text-sm">{currentTestimonial.position}</div>
                      <div className="text-pana-gold text-sm font-medium">{currentTestimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-pana-gold' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Client Logos Grid */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-8">Trusted Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {[
              { name: 'Shell', logo: '/shell.png' },
              { name: 'Total', logo: '/total.png' },
              { name: 'Chevron', logo: '/chevron.png' },
              { name: 'NNPC', logo: '/nnpc.png' },
              { name: 'Access Bank', logo: '/access-bank.png' },
              { name: 'MTN', logo: '/mtn.png' }
            ].map((company, index) => (
              <div key={index} className="flex justify-center p-2">
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-4 w-full h-24 flex items-center justify-center transition-all duration-300">
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="max-h-12 max-w-full object-contain opacity-100 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Success Stories</h3>
          <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
            Ready to transform your organization? Let's discuss how PANA Academy can help you achieve your goals.
          </p>
          <Button 
            size="lg"
            className="bg-red-600 text-white hover:bg-white hover:text-red-600 transition-colors"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;