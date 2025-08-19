import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Award, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    id: 1,
    backgroundImage: heroSlide1,
    title: "Empowering Talent",
    titleHighlight: "Across Sectors",
    subtitle: "Transform your career with world-class training, consulting, and certification programs designed for today's professionals.",
    stats: [
      { icon: Users, number: "10K+", label: "Professionals Trained" },
      { icon: Award, number: "500+", label: "Certifications Issued" },
      { icon: Globe, number: "50+", label: "Corporate Partners" }
    ],
    features: [
      {
        title: "Energy Sector Excellence",
        description: "Specialized training in oil & gas, renewable energy, and technical operations.",
      },
      {
        title: "Digital Transformation", 
        description: "Stay ahead with cutting-edge digital skills and technology leadership.",
      },
      {
        title: "Leadership Development",
        description: "Build exceptional leadership skills for the modern workplace.",
      }
    ]
  },
  {
    id: 2,
    backgroundImage: heroSlide2,
    title: "Next-Generation",
    titleHighlight: "Professional Training",
    subtitle: "Advance your expertise with industry-leading programs that bridge the gap between traditional skills and future demands.",
    stats: [
      { icon: Users, number: "15K+", label: "Active Learners" },
      { icon: Award, number: "95%", label: "Success Rate" },
      { icon: Globe, number: "30+", label: "Countries Served" }
    ],
    features: [
      {
        title: "AI & Technology Integration",
        description: "Master artificial intelligence and emerging technologies in your field.",
      },
      {
        title: "Sustainability Focus",
        description: "Learn sustainable practices and environmental stewardship principles.",
      },
      {
        title: "Global Certification",
        description: "Earn internationally recognized credentials that open doors worldwide.",
      }
    ]
  },
  {
    id: 3,
    backgroundImage: heroSlide3,
    title: "Excellence in",
    titleHighlight: "Corporate Learning",
    subtitle: "Partner with us to transform your workforce through comprehensive corporate training solutions and strategic consulting.",
    stats: [
      { icon: Users, number: "200+", label: "Corporate Clients" },
      { icon: Award, number: "98%", label: "Client Retention" },
      { icon: Globe, number: "24/7", label: "Learning Support" }
    ],
    features: [
      {
        title: "Custom Training Programs",
        description: "Tailored learning solutions designed specifically for your organization's needs.",
      },
      {
        title: "Performance Analytics",
        description: "Track progress and measure ROI with comprehensive learning analytics.",
      },
      {
        title: "Expert Consultation",
        description: "Access to industry experts for strategic guidance and mentorship.",
      }
    ]
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={currentSlideData.backgroundImage} 
          alt="Professional training environment" 
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pana-navy/90 via-pana-navy/70 to-pana-blue/60"></div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {currentSlideData.title}
                <span className="block text-pana-gold">{currentSlideData.titleHighlight}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-lg">
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8">
              {currentSlideData.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-pana-gold/20 rounded-lg mb-2">
                    <stat.icon className="w-6 h-6 text-pana-gold" />
                  </div>
                  <div className="text-2xl font-bold">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Explore Programs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 border-t border-white/20">
              <p className="text-sm text-gray-300 mb-4">Trusted by industry leaders</p>
              <div className="flex items-center space-x-6 opacity-70">
                <div className="text-sm font-medium">Shell</div>
                <div className="text-sm font-medium">Total</div>
                <div className="text-sm font-medium">Chevron</div>
                <div className="text-sm font-medium">NNPC</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-slide-in-right">
            {currentSlideData.features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-200 mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" className="bg-transparent border-pana-gold text-pana-gold hover:bg-pana-gold hover:text-pana-navy">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-pana-gold scale-125' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-pana-gold transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-pana-gold/20 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-pana-blue/20 rounded-full animate-float animation-delay-1000 hidden lg:block"></div>
    </section>
  );
};

export default HeroSection;