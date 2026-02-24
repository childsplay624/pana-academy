import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteImages } from '@/hooks/useSiteImage';
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images: heroImages, isLoading, error } = useSiteImages('hero');

  // Build slides strictly from database
  const slides = heroImages.map((img, index) => ({
    id: index + 1,
    backgroundImage: img.url,
    title: img.alt_text?.split(' - ')[0] || "PANA Academy",
    highlight: img.alt_text?.split(' - ')[1] || "Professional Training",
    subtitle: img.description || "Advance your career with industry-leading training.",
  }));

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="h-[90vh] bg-black/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden mt-20">
      {/* Background with smooth scroll */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.backgroundImage}
            alt={current.title}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Boxed Content - left but indented */}
      <div className="relative z-10 flex justify-start w-full px-6 md:px-12 lg:px-20">
        <motion.div
          key={current.id + "-text"}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg max-w-xl ml-4 md:ml-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium border border-red-500/30 mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>PANA Academy</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {current.title}{" "}
            <span className="block text-red-400">{current.highlight}</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200 leading-relaxed">{current.subtitle}</p>

          {/* Trust Indicators */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base">Industry-recognized certificates</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base">Expert instructors with 10+ years experience</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base">Job placement support</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/courses">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 px-8 py-6 text-lg font-semibold group"
              >
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

          </div>

          {/* Social Proof */}

        </motion.div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-red-600 rounded-full text-white hover:bg-red-700"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-red-600 rounded-full text-white hover:bg-red-700"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-red-600 scale-125" : "bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
