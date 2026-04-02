import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteImages } from '@/hooks/useSiteImage';
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images: heroImages, isLoading, error } = useSiteImages('hero');

  const fallbackSlides = [
    {
      title: "Leading Competency Hub",
      highlight: "for Global Professionals",
      subtitle: "Empowering individuals and organizations with world-class training and practical competencies to excel in any industry."
    },
    {
      title: "Elevate Your Career",
      highlight: "With Expert-Led Training",
      subtitle: "Join industry leaders and gain the practical skills needed to thrive in today's competitive landscape."
    },
    {
      title: "Transform Your Future",
      highlight: "Through Innovative Learning",
      subtitle: "Discover cutting-edge courses designed to bridge the gap between theoretical knowledge and practical application."
    }
  ];

  // Build slides with custom video support
  const slides = [
    // Specifically added YouTube video from user
    {
      id: 'yt-1',
      mediaUrl: 'https://www.youtube.com/embed/r-C0gPsmyvE?autoplay=1&mute=1&controls=0&loop=1&playlist=r-C0gPsmyvE&rel=0&showinfo=0',
      type: 'youtube',
      title: "PANA Academy",
      highlight: "Excellence in Training",
      subtitle: "Bridging the gap between knowledge and practical application through world-class instruction.",
    },
    ...heroImages.map((img, index) => {
      const fallback = fallbackSlides[index % fallbackSlides.length];
      const isVideo = img.url?.toLowerCase().endsWith('.mp4') || img.url?.toLowerCase().endsWith('.webm');
      const isYouTube = img.url?.includes('youtube.com') || img.url?.includes('youtu.be');
      
      let finalUrl = img.url;
      if (isYouTube) {
        const videoId = img.url.split('/').pop()?.split('?')[0].replace('watch?v=', '');
        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&showinfo=0`;
      }

      return {
        id: index + 1,
        mediaUrl: finalUrl,
        type: isYouTube ? 'youtube' : isVideo ? 'video' : 'image',
        title: img.alt_text?.includes(' - ') ? img.alt_text.split(' - ')[0] : fallback.title,
        highlight: img.alt_text?.includes(' - ') ? img.alt_text.split(' - ')[1] : fallback.highlight,
        subtitle: (img.description && img.description.length > 5 && !img.description.includes("Empowering") && !img.description.toLowerCase().includes("hero slide")) ? img.description : fallback.subtitle,
      };
    })
  ];

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds for video content
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="h-[75vh] bg-black/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (slides.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <section className="relative h-[75vh] flex items-center overflow-hidden mt-10">
      {/* Background with smooth scroll */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            {current.type === 'youtube' ? (
              <iframe
                src={current.mediaUrl}
                className="w-full h-full object-cover scale-[1.3] pointer-events-none"
                frameBorder="0"
                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            ) : current.type === 'video' ? (
              <video
                src={current.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={current.mediaUrl}
                alt={current.title}
                className="w-full h-full object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-black/50"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-12 h-full text-center">
        <motion.div
          key={current.id + "-text"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white drop-shadow-md">
            {current.title}{" "}
            <span className="block font-bold text-white mt-1">{current.highlight}</span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-gray-200 opacity-90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            {current.subtitle}
          </p>

          {/* Simple Clean CTA */}
          <div className="mt-12 flex justify-center">
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-red-600 text-white hover:bg-red-700 border-none px-10 py-7 text-lg rounded-full shadow-2xl transition-all hover:scale-105 font-medium"
              >
                Explore Courses
              </Button>
            </Link>
          </div>
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
