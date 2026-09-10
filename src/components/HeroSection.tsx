import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@/components/ui/FontAwesomeIcon';
import { Link } from 'react-router-dom';
import { useSiteImages } from '@/hooks/useSiteImage';

const formatPanaInstituteName = (text: string) => {
  if (!text) return text;
  return text
    .replace(/\bPANA INSTITUTE\b/g, 'PANA Institute')
    .replace(/\bPANA ACADEMY\b/g, 'PANA Institute')
    .replace(/\bPana Academy\b/g, 'PANA Institute')
    .replace(/\bPana Institute\b/g, 'PANA Institute');
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { images: heroImages, isLoading } = useSiteImages('hero');

  const fallbackSlides = [
    {
      kicker: "PANA Institute · Competency & Advisory",
      title: "Africa's Premier Competency Hub",
      highlight: "for Energy & Industry Solutions",
      subtitle: "Delivering accredited technical training, operational consultancy, R&D excellence, and climate services across global markets."
    },
    {
      kicker: "Human Capital Development",
      title: "Elevate Operational Performance",
      highlight: "Through Evidence-Based Assessment",
      subtitle: "Hands-on instruction on live equipment, practical workforce development, and NCDMB-aligned competence frameworks."
    },
    {
      kicker: "Research & Climate Innovation",
      title: "Pioneering Sustainable Transition",
      highlight: "Driven by 5 Centres of Excellence",
      subtitle: "Connecting laboratory insights directly to corporate decarbonisation, smart grid tech, and ESG strategy."
    }
  ];

  const defaultImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1920&auto=format&fit=crop"
  ];

  // Build slides with custom video/image support
  const slides = heroImages.length > 0
    ? heroImages.map((img, index) => {
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
          kicker: formatPanaInstituteName(fallback.kicker),
          title: formatPanaInstituteName(img.alt_text?.includes(' - ') ? img.alt_text.split(' - ')[0] : fallback.title),
          highlight: formatPanaInstituteName(img.alt_text?.includes(' - ') ? img.alt_text.split(' - ')[1] : fallback.highlight),
          subtitle: formatPanaInstituteName((img.description && img.description.length > 5 && !img.description.includes("Empowering") && !img.description.toLowerCase().includes("hero slide")) ? img.description : fallback.subtitle),
        };
      })
    : fallbackSlides.map((fallback, index) => ({
        id: index + 1,
        mediaUrl: defaultImages[index % defaultImages.length],
        type: 'image' as const,
        kicker: formatPanaInstituteName(fallback.kicker),
        title: formatPanaInstituteName(fallback.title),
        highlight: formatPanaInstituteName(fallback.highlight),
        subtitle: formatPanaInstituteName(fallback.subtitle),
      }));

  // Auto-play timer
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="h-[85vh] bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const current = slides[currentSlide];

  return (
    <section className="relative min-h-screen h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 pt-20">
      {/* Background Media Container */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
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

            {/* Gradient Overlays for Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/40"></div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 pointer-events-none"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ambient 3D Depth Grid Matrix */}
      <div className="absolute inset-0 bg-grid-3d opacity-25 pointer-events-none z-[5] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]"></div>

      {/* Hero Foreground Content with 3D Perspective */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-12 max-w-7xl mx-auto text-center py-20 perspective-1000 preserve-3d">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-text"}
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: -10 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto flex flex-col items-center preserve-3d"
          >
            {/* Top Glass 3D Badge */}
            <motion.div
              whileHover={{ translateZ: 30, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider mb-8 shadow-3d-dark preserve-3d cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]"></span>
              <span className="translate-z-10">{current.kicker}</span>
            </motion.div>

            {/* Main 3D Perspective Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] drop-shadow-2xl preserve-3d">
              <span className="inline-block transition-transform duration-300 hover:translate-z-20">
                {current.title}
              </span>{" "}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 drop-shadow-[0_10px_20px_rgba(220,38,38,0.4)]">
                {current.highlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-200 font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              {current.subtitle}
            </p>

            {/* Value Pillar Chips - 3D Floating Glass Cards */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs font-semibold text-white/90 preserve-3d">
              <motion.div
                whileHover={{ translateZ: 25, scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center gap-2 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 px-4 py-2.5 rounded-xl border border-white/15 shadow-3d-glass backdrop-blur-md cursor-default"
              >
                <FontAwesomeIcon name="fa-solid fa-shield-halved" className="text-red-500 text-sm" />
                <span>NCDMB & OGTAN Accredited</span>
              </motion.div>
              <motion.div
                whileHover={{ translateZ: 25, scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center gap-2 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 px-4 py-2.5 rounded-xl border border-white/15 shadow-3d-glass backdrop-blur-md cursor-default"
              >
                <FontAwesomeIcon name="fa-solid fa-wand-magic-sparkles" className="text-amber-400 text-sm" />
                <span>5 R&D Centres of Excellence</span>
              </motion.div>
              <motion.div
                whileHover={{ translateZ: 25, scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center gap-2 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 px-4 py-2.5 rounded-xl border border-white/15 shadow-3d-glass backdrop-blur-md cursor-default"
              >
                <FontAwesomeIcon name="fa-solid fa-award" className="text-emerald-400 text-sm" />
                <span>ISO 14001 & ISO 45001 Aligned</span>
              </motion.div>
            </div>

            {/* Dual CTAs with 3D Depth */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md preserve-3d">
              <Link to="/courses" className="no-underline w-full sm:w-auto">
                <motion.div whileHover={{ translateZ: 30, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-none px-8 py-7 text-base font-bold rounded-xl shadow-3d-red transition-all group flex items-center justify-center gap-2.5"
                  >
                    <span>Explore Programmes</span>
                    <FontAwesomeIcon name="fa-solid fa-arrow-right" className="text-sm transition-transform group-hover:translate-x-1.5" />
                  </Button>
                </motion.div>
              </Link>

              <Link to="/about" className="no-underline w-full sm:w-auto">
                <motion.div whileHover={{ translateZ: 20, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/30 px-8 py-7 text-base font-semibold rounded-xl transition-all shadow-3d-glass"
                  >
                    Our Institute
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrow Buttons */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 bg-black/40 hover:bg-red-600 backdrop-blur-md rounded-full text-white border border-white/20 transition-all shadow-xl hover:scale-110 hidden sm:flex items-center justify-center"
      >
        <FontAwesomeIcon name="fa-solid fa-chevron-left" className="text-lg" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 bg-black/40 hover:bg-red-600 backdrop-blur-md rounded-full text-white border border-white/20 transition-all shadow-xl hover:scale-110 hidden sm:flex items-center justify-center"
      >
        <FontAwesomeIcon name="fa-solid fa-chevron-right" className="text-lg" />
      </button>

      {/* Modern Slide Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === currentSlide ? "w-10 bg-red-600 shadow-lg shadow-red-600/50" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
