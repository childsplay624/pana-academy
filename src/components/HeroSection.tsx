import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    backgroundImage: heroSlide1,
    title: "Empowering Talent",
    highlight: "Across Sectors",
    subtitle: "Transform your career with world-class training and certification programs.",
  },
  {
    id: 2,
    backgroundImage: heroSlide2,
    title: "Next-Generation",
    highlight: "Professional Training",
    subtitle: "Advance your expertise with programs bridging traditional skills and future demands.",
  },
  {
    id: 3,
    backgroundImage: heroSlide3,
    title: "Excellence in",
    highlight: "Corporate Learning",
    subtitle: "Partner with us to transform your workforce through corporate training solutions.",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with smooth scroll */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.backgroundImage}
            alt={current.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Boxed Content - left but indented */}
      <div className="relative z-10 flex justify-start w-full px-6 md:px-12 lg:px-20">
        <motion.div
          key={current.id + "-text"}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg max-w-xl ml-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            {current.title}{" "}
            <span className="block text-white">{current.highlight}</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200">{current.subtitle}</p>
          <Button
            size="lg"
            className="mt-8 bg-red-600 text-white hover:bg-red-700"
          >
            Explore Programs
          </Button>
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
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentSlide ? "bg-red-600 scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
