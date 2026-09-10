import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring } from "framer-motion";
import heroTraining from "@/assets/hero-training.jpg";
import { Target } from "lucide-react";

const TestimonialsSection = () => {
  // Verified Client Logos from Public Folder
  const companies = [
    { name: 'Shell', logo: '/shell.png' },
    { name: 'Total', logo: '/total.png' },
    { name: 'Chevron', logo: '/chevron.png' },
    { name: 'NNPC', logo: '/nnpc.png' },
    { name: 'Access Bank', logo: '/access-bank.png' },
    { name: 'MTN', logo: '/mtn.png' }
  ];



  return (
    <section id="testimonials" className="py-24 relative bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${heroTraining})` }}>
      {/* Black overlay for consistency */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      <div className="relative z-10">
        {/* Standard Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-pana-gold/20 px-4 py-2 rounded-full text-white font-medium mb-4">
              <Target className="w-4 h-4 text-pana-gold" />
              Clients and Partners
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
               Trusted Industry Partners
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the global energy and technology giants we collaborate with.
            </p>
          </motion.div>
        </div>

        {/* INFINITE AUTO SLIDING LOGO CAROUSEL */}
        <div className="relative py-12 w-full overflow-hidden">
          {/* Subtle edge fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/90 to-transparent z-20 pointer-events-none" />

          <div className="flex w-full overflow-hidden select-none">
            <motion.div 
              className="flex gap-8 items-center flex-nowrap pr-8 min-w-full"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
            >
              {[...companies, ...companies, ...companies, ...companies].map((company, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 flex items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all transform hover:scale-105"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-32 md:h-20 md:w-40 object-contain brightness-110 drop-shadow-lg"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Standard CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase">Join Our Success Stories</h3>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your career and/or organization? Get in touch with us to discuss how PANA Institute can facilitate your growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/courses">
                <Button
                  size="lg"
                  className="bg-red-600 text-white hover:bg-white hover:text-red-600 px-10 h-14 rounded-xl font-bold text-lg shadow-xl shadow-red-600/20"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white hover:text-black bg-white/5 backdrop-blur-sm h-14 px-10 rounded-xl font-bold text-lg transition-all"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;