import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, ArrowRight, BookOpen, Tag, Quote, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Card3D } from '@/components/ui/Card3D';
import { usePageContent } from "@/hooks/usePageContent";
import { DynamicPageSections } from "@/components/page-builder/DynamicPageSections";

const heroSlides = [
  {
    image: '/images/hero_slide_1.png',
    tagline: 'PANA Institute · Energy & Infrastructure',
    headline: 'Building the standard against which competence is measured.',
    description: 'PANA Institute develops and assesses competence for the petroleum, energy and power, and digital industries, and publishes research that informs the decisions taken in them.'
  },
  {
    image: '/images/hero_slide_2.png',
    tagline: 'PANA Institute · Digital Labs & R&D',
    headline: 'Pioneering research and high-performance workforce capabilities.',
    description: 'Operating five specialized Centres of Excellence across Port Harcourt and Abuja, delivering applied R&D and experiential learning on live plant simulators.'
  },
  {
    image: '/images/hero_slide_3.png',
    tagline: 'PANA Institute · Sustainability & Climate',
    headline: 'Driving net-zero transition and global energy governance.',
    description: 'Integrating ESG frameworks, carbon reduction strategies, and international regulatory alignment across 9 countries on four continents.'
  }
];

const defaultTestimonials = [
  {
    id: 't1',
    name: 'Engr. Olanrewaju Fadeyi',
    position: 'General Manager, Facilities & Process Engineering',
    company: 'PE Energy Group',
    content: 'PANA Institute delivered customized asset integrity and process safety training for our field engineers. The experiential simulator training resulted in zero downtime during our major shutdown.',
    rating: 5,
    image_initials: 'OF',
    avatar_url: '',
    metric: 'Zero Downtime Execution',
    verified: 'VERIFIED CORPORATE PARTNER'
  },
  {
    id: 't2',
    name: 'Dr. Tariye Briggs',
    position: 'Director of Human Capital Development',
    company: 'Chevron HCD Project Partner',
    content: 'The independent assessment integrity under ISO 21001 guidelines provided our technical leadership with confidence that every certified candidate met international energy standards.',
    rating: 5,
    image_initials: 'TB',
    avatar_url: '',
    metric: '100% ISO 21001 Audit Pass',
    verified: 'VERIFIED HCD PROJECT'
  },
  {
    id: 't3',
    name: 'Aminu Bello',
    position: 'Head of Quality & Compliance',
    company: 'Sub-Saharan Energy Advisory',
    content: 'PANA Institute is setting the benchmark for competency development across Africa. Their applied research and faculty expertise are second to none in the regional energy sector.',
    rating: 5,
    image_initials: 'AB',
    avatar_url: '',
    metric: 'Top Regional Benchmark',
    verified: 'INDEPENDENT ADVISORY'
  }
];

const upcomingCourses = [
  {
    id: 'c1',
    title: 'Petroleum Process Safety & Asset Integrity Management',
    category: 'Energy & Petroleum',
    date: 'Sept 15 – 19, 2026',
    startDateTimestamp: new Date('2026-09-15').getTime(),
    duration: '5 Days Experiential',
    location: 'Port Harcourt Campus & Virtual',
    status: 'Enrollment Open',
    badge: 'TECHNICAL CERTIFICATION',
    image: '/images/hero_slide_1.png'
  },
  {
    id: 'c2',
    title: 'ISO 21001:2025 Lead Auditor & Educational Management',
    category: 'Quality & Governance',
    date: 'Oct 02 – 05, 2026',
    startDateTimestamp: new Date('2026-10-02').getTime(),
    duration: '4 Days Intensive',
    location: 'Abuja Hub',
    status: 'Limited Seats',
    badge: 'AUDITOR PATHWAY',
    image: '/images/hero_slide_2.png'
  },
  {
    id: 'c3',
    title: 'ESG Decarbonisation & Green Hydrogen Technologies',
    category: 'Sustainability & ESG',
    date: 'Oct 20 – 24, 2026',
    startDateTimestamp: new Date('2026-10-20').getTime(),
    duration: '5 Days Hybrid',
    location: 'Abuja & Virtual Live',
    status: 'Enrollment Open',
    badge: 'EXECUTIVE DIPLOMA',
    image: '/images/hero_slide_3.png'
  }
];

const latestArticles = [
  {
    id: 'a1',
    title: 'The 2026 Sub-Saharan Energy Capability & Competency Benchmark',
    excerpt: 'An empirical analysis of technical workforce readiness across West African offshore production assets and power utilities.',
    category: 'Applied Research',
    date: 'August 14, 2026',
    readTime: '6 min read',
    image: '/images/hero_slide_1.png',
    center: 'Centre for Energy Transition'
  },
  {
    id: 'a2',
    title: 'Independent Assessment Integrity under ISO 21001 Governance',
    excerpt: 'How separating delivery from assessment outcome builds international trust and employer confidence in regional technical grading.',
    category: 'Governance & Standards',
    date: 'July 29, 2026',
    readTime: '5 min read',
    image: '/images/hero_slide_2.png',
    center: 'Academic & Research Council'
  },
  {
    id: 'a3',
    title: 'Digital Twin Simulators in Experiential Technical Training',
    excerpt: 'Leveraging real-time process simulation to accelerate candidate competency without operational risk on live plant equipment.',
    category: 'Digital Innovation',
    date: 'June 18, 2026',
    readTime: '8 min read',
    image: '/images/hero_slide_3.png',
    center: 'Centre for Digital Innovation'
  }
];

export const OurInstitutePage: React.FC = () => {
  const { get } = usePageContent('our-institute');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const [activeGovTab, setActiveGovTab] = useState<'council' | 'committees' | 'exec'>('council');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [dbTestimonials, setDbTestimonials] = useState<any[]>(defaultTestimonials);
  const [dbArticles, setDbArticles] = useState<any[]>(latestArticles);
  const [dbCourses, setDbCourses] = useState<any[]>([...upcomingCourses].sort((a, b) => a.startDateTimestamp - b.startDateTimestamp));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (dbTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % dbTestimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [dbTestimonials.length]);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const { data: testData } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (testData && testData.length > 0) {
          setDbTestimonials(testData);
        }

        // Query upcoming courses sorted chronologically by start_date ascending
        let { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .order('start_date', { ascending: true })
          .limit(3);

        if (!courseData || courseData.length === 0) {
          const { data: fallbackCourses } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
          courseData = fallbackCourses;
        }

        if (courseData && courseData.length > 0) {
          const mappedCourses = courseData.map((c: any, idx: number) => {
            const startTs = c.start_date ? new Date(c.start_date).getTime() : Number.MAX_SAFE_INTEGER;
            return {
              id: c.id,
              title: c.title,
              description: c.description || 'Accredited training solution designed to build verifiable competence for energy and technology professionals.',
              category: c.category_name || (c.category ? (c.category as string).replace('_', ' ') : 'Competency Training'),
              startDateTimestamp: startTs,
              date: c.start_date ? new Date(c.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Based on Request',
              duration: c.duration || `${c.duration_hours || 40} hours`,
              location: c.location || 'Port Harcourt Hub & Virtual',
              status: 'Enrollment Open',
              badge: c.level ? c.level.toUpperCase() : 'BESTSELLER',
              price: c.price ? `₦${c.price.toLocaleString()}` : '₦7,900',
              originalPrice: c.original_price ? `₦${c.original_price.toLocaleString()}` : '₦12,900',
              image: c.thumbnail_url || c.image_url || (idx % 3 === 0 ? '/images/hero_slide_1.png' : idx % 3 === 1 ? '/images/hero_slide_2.png' : '/images/hero_slide_3.png')
            };
          });

          // Ensure sorted chronologically by start date ascending (earliest starting course first)
          mappedCourses.sort((a: any, b: any) => a.startDateTimestamp - b.startDateTimestamp);
          setDbCourses(mappedCourses);
        }

        const { data: postData } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(3);
        if (postData && postData.length > 0) {
          setDbArticles(postData.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt || 'Read the latest insight from PANA Institute research faculty.',
            category: 'Research & News',
            date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            readTime: '5 min read',
            image: p.cover_image || '/images/hero_slide_1.png',
            center: 'PANA Think Tank'
          })));
        }
      } catch (err) {
        console.warn('Backend tables query fallback:', err);
      }
    };

    fetchBackendData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const timelineSteps = [
    {
      year: '2020',
      badge: 'FOUNDATION',
      title: 'The Capability Arm',
      description: 'Set up as the training and capability development arm of PANA Holdings, delivering technical and professional programmes aligned with corporate objectives.',
      stat: 'PANA Holdings',
      detail: 'Core technical training programs launched'
    },
    {
      year: '2022',
      badge: 'REGIONAL REACH',
      title: 'Port Harcourt & Abuja Campuses',
      description: 'Operating across two permanent institutional bases in Port Harcourt and Abuja, giving the Academy regional reach and industrial equipment access.',
      stat: '2 Hubs',
      detail: 'Permanent facilities established'
    },
    {
      year: '2024',
      badge: 'BROADENED MANDATE',
      title: 'Expanded Capabilities',
      description: 'Elevated scope taking on competency assessment and cultivation, applied R&D, international partnerships, consulting, and ESG sustainability.',
      stat: '5 Verticals',
      detail: 'Multi-disciplinary mandate'
    },
    {
      year: '2026',
      badge: 'INSTITUTE ELEVATION',
      title: 'A Centre of Excellence',
      description: 'Elevated from Academy to Institute. Serving industry, government and community across Africa and beyond under ISO 21001:2025 integrated governance.',
      stat: 'ISO 21001',
      detail: '9 Countries reached across 4 continents'
    }
  ];

  const councilMembers = [
    { name: 'Dr Daere Afonya-a Akobo', role: 'Chairman and Chief Executive', badge: 'Board Chair', initial: 'DA' },
    { name: 'Iyenemi Akobo', role: 'Executive Director, Research & Advisory', badge: 'Executive Director', initial: 'IA' },
    { name: 'Callista Azogu', role: 'Global Business Services', badge: 'Board Member', initial: 'CA' },
    { name: 'Kennedy Dike', role: 'Acting Vice President (VP) - HR, Talent Management & Business Services', badge: 'Acting VP', initial: 'KD' }
  ];

  const committeesList = [
    { title: 'Academic and Research Council', category: 'CURRICULA & STANDARDS', desc: 'Approves curricula, competence frameworks, academic standards, research agendas and research ethics, and clears every think tank publication.' },
    { title: 'Assessment Integrity Committee', category: 'ASSESSMENT INTEGRITY', desc: 'Employers, practitioners, regulators and learners. Owns assessment design, examiner calibration and appeals, and can stop a result being released.' },
    { title: 'Fellows Council', category: 'FELLOWSHIP & CHAIRS', desc: 'Governs the fellowship, the professorial chairs and the thought leadership mandate.' },
    { title: 'Risk, Audit and Ethics Committee', category: 'ASSURANCE & ETHICS', desc: 'Assurance over hub governance, joint financing, research integrity and conflict of interest.' }
  ];

  const execTeam = [
    { role: 'Founder and GCEO', desc: 'Sets direction for the Institute and holds the relationship with the Governing Council and the group.' },
    { role: 'Senior Vice President', desc: 'Oversees global strategic partnerships and the growth pipeline across the divisions.' },
    { role: 'Chief of Administration', desc: 'Registry, finance, legal, human resources, ICT, the learning platform and facilities.' },
    { role: 'Head, Programmes & Strategy', desc: 'The five delivery divisions, the growth pipeline and strategic planning.' },
    { role: 'Head, Research & Development', desc: 'The five centres of excellence, the chairs, laboratories, grants and licensing.' },
    { role: 'Head, Quality & Standards', desc: 'The management system, curriculum design, internal audit programme and accreditation.' }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans antialiased selection:bg-oxblood selection:text-white">
      <Navigation />

      <main className="pt-[70px]">
        {/* HERO SECTION - 100% FULL-WIDTH, FULLSCREEN & 3-IMAGE SLIDER */}
        <section className="min-h-[calc(100vh-70px)] flex flex-col justify-between relative overflow-hidden bg-paper w-full group">
          {/* Background Image Carousel Layer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].tagline}
                className="w-full h-full object-cover"
              />
              {/* Editorial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/92 to-paper/60 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>

          {/* Hero Foreground Content - Contained Boxed Text Layout */}
          <div className="max-w-[1320px] w-full mx-auto px-7 flex-1 flex flex-col justify-center py-10 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block">
                {heroSlides[currentSlide].tagline}
              </span>
              {/* Slide Counter */}
              <span className="font-mono text-xs text-oxblood font-semibold">
                0{currentSlide + 1} / 0{heroSlides.length}
              </span>
            </div>

            <motion.h1
              key={`head-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-ink leading-[1.25] py-2 tracking-tight max-w-4xl mb-7 min-h-[140px]"
            >
              {heroSlides[currentSlide].headline}
            </motion.h1>

            <motion.p
              key={`desc-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-xl sm:text-2xl md:text-3xl text-ink-soft leading-relaxed max-w-3xl font-normal mb-6 min-h-[80px]"
            >
              {heroSlides[currentSlide].description}
            </motion.p>

            {/* Slide Navigation Dots & Arrows */}
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-xs border border-line bg-paper-soft hover:bg-oxblood hover:text-white transition-colors flex items-center justify-center text-oxblood"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-8 bg-oxblood' : 'w-2 bg-line hover:bg-oxblood/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-xs border border-line bg-paper-soft hover:bg-oxblood hover:text-white transition-colors flex items-center justify-center text-oxblood"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4 STATS GRID - 100% EDGE-TO-EDGE FULL WIDTH */}
          <div className="border-t border-line bg-paper/90 backdrop-blur-xs w-full relative z-10 px-8 lg:px-16 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 w-full divide-y sm:divide-y-0 sm:divide-x divide-line">
              <div className="py-6 sm:pr-8">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl text-oxblood font-medium block mb-1">2020</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Founded as the capability arm of PANA Holdings</span>
              </div>
              <div className="py-6 sm:px-8">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl text-oxblood font-medium block mb-1">5</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Integrated verticals under one mandate</span>
              </div>
              <div className="py-6 sm:px-8">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl text-oxblood font-medium block mb-1">9</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Countries reached across four continents</span>
              </div>
              <div className="py-6 sm:pl-8">
                <span className="font-serif text-4xl sm:text-5xl lg:text-6xl text-oxblood font-medium block mb-1">2026</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Elevated from Academy to Institute</span>
              </div>
            </div>
          </div>

          {/* 5-PILLARS STRIP AT BOTTOM OF FULLSCREEN HERO - 100% EDGE-TO-EDGE FULL WIDTH */}
          <div className="border-t border-line bg-paper w-full relative z-10">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-line">
              <Link to="/competency" className="p-7 hover:bg-paper-soft transition-colors group">
                <div className="font-serif text-xl font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Competency Assessment</div>
                <div className="text-xs text-muted-foreground">Assess, then cultivate.</div>
              </Link>
              <Link to="/research" className="p-7 hover:bg-paper-soft transition-colors group">
                <div className="font-serif text-xl font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Research & Development</div>
                <div className="text-xs text-muted-foreground">Five centres of excellence.</div>
              </Link>
              <Link to="/consultancy" className="p-7 hover:bg-paper-soft transition-colors group">
                <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Consultancy & Advisory</div>
                <div className="text-xs text-muted-foreground">Industry and government.</div>
              </Link>
              <Link to="/sustainability" className="p-7 hover:bg-paper-soft transition-colors group">
                <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Sustainability & Climate</div>
                <div className="text-xs text-muted-foreground">Decarbonisation and ESG.</div>
              </Link>
              <Link to="/global" className="p-7 hover:bg-paper-soft transition-colors group">
                <div className="font-serif text-lg font-medium text-ink group-hover:text-oxblood transition-colors leading-tight mb-2">Global Engagements</div>
                <div className="text-xs text-muted-foreground">Partnerships and reach.</div>
              </Link>
            </div>
          </div>
        </section>

        {/* MEASUREMENT SCALE SIGNATURE */}
        <div className="scale tall"></div>

        {/* ─── CREATIVE SECTION 1: INTERACTIVE STEP TIMELINE WITH SCROLL REVEAL ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper border-b border-line relative overflow-hidden"
          id="our-journey"
        >
          <div className="max-w-[1320px] mx-auto px-7 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
                  Our Institute · Institutional Evolution
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">From Academy to Institute</h2>
              </div>
              <p className="font-serif text-lg text-ink-soft max-w-xl leading-relaxed">
                A structured journey from corporate capability arm to a multi-disciplinary centre of excellence across Africa and four continents.
              </p>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line mb-8 rounded-xs overflow-hidden">
              {timelineSteps.map((step, idx) => (
                <button
                  key={step.year}
                  onClick={() => setActiveTimelineStep(idx)}
                  className={`p-6 text-left transition-all duration-300 relative ${
                    activeTimelineStep === idx 
                      ? 'bg-paper-soft text-oxblood border-b-2 border-oxblood' 
                      : 'bg-paper text-ink-soft hover:bg-paper-soft/60'
                  }`}
                >
                  <span className="font-mono text-xs font-semibold text-oxblood tracking-widest block mb-1">{step.badge}</span>
                  <div className="font-serif text-2xl font-medium mb-1">{step.year}</div>
                  <div className="text-xs text-muted-foreground truncate">{step.title}</div>
                </button>
              ))}
            </div>

            {/* Selected Timeline Step Showcase Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimelineStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="bg-paper-soft border border-line p-8 md:p-12 rounded-xs flex flex-col md:flex-row items-start justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-oxblood/10 text-oxblood font-mono text-xs uppercase tracking-widest rounded-xs">
                    {timelineSteps[activeTimelineStep].badge}
                  </div>
                  <h3 className="font-serif text-3xl font-medium text-ink">
                    {timelineSteps[activeTimelineStep].year} · {timelineSteps[activeTimelineStep].title}
                  </h3>
                  <p className="text-base text-ink-soft leading-relaxed font-serif">
                    {timelineSteps[activeTimelineStep].description}
                  </p>
                </div>

                <div className="bg-paper border border-line p-6 rounded-xs shrink-0 w-full md:w-72 space-y-3">
                  <span className="font-mono text-[10px] text-brass uppercase tracking-[0.2em] font-semibold block">Key Milestone</span>
                  <div className="font-serif text-3xl text-oxblood font-medium">{timelineSteps[activeTimelineStep].stat}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{timelineSteps[activeTimelineStep].detail}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 2: WHO WE ARE WITH VISUAL FEATURED IMAGE CARD ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper"
          id="who-we-are"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="anchor-head mb-14">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                Who We Are · Mandate & Excellence
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">Human capital for the industries that power the region</h2>
            </div>

            {/* Featured Visual Image Banner */}
            <div className="mb-16 relative rounded-xs overflow-hidden border border-line group shadow-xl">
              <div className="aspect-[21/9] sm:aspect-[24/9] w-full relative overflow-hidden bg-ink">
                <img
                  src="/images/hero_slide_2.png"
                  alt="PANA Institute Digital Labs & R&D Facility"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10">
                  <div className="max-w-2xl">
                    <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block mb-2">CAMPUS & LABS</span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-paper font-medium mb-1">Port Harcourt & Abuja Centres of Excellence</h3>
                    <p className="text-xs sm:text-sm text-zinc-300">Experiential learning on live simulators, digital labs, and industrial plant equipment.</p>
                  </div>
                  <span className="font-mono text-xs text-paper bg-oxblood/80 px-3 py-1.5 rounded-xs shrink-0 font-semibold tracking-wider uppercase">
                    5 Active Hubs
                  </span>
                </div>
              </div>
            </div>

            {/* Vision, Mission, Purpose Dark Luxury Cards with 3D Spatial Depth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                <div className="bg-ink text-paper p-8 rounded-xs border border-brass/30 relative group overflow-hidden shadow-3d-dark h-full preserve-3d">
                  <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] block mb-4 translate-z-10">01 · VISION</span>
                  <h3 className="font-serif text-2xl font-medium mb-3 translate-z-10">Africa's Competency Partner</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed translate-z-10">
                    To be Africa's premier competency solutions partner for the petroleum, energy, power, and digital industries.
                  </p>
                </div>
              </Card3D>

              <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                <div className="bg-ink text-paper p-8 rounded-xs border border-brass/30 relative group overflow-hidden shadow-3d-dark h-full preserve-3d">
                  <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] block mb-4 translate-z-10">02 · MISSION</span>
                  <h3 className="font-serif text-2xl font-medium mb-3 translate-z-10">Practical Upskilling</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed translate-z-10">
                    To develop and upskill the workforce through experiential training that cultivates competencies directly applicable to real job roles.
                  </p>
                </div>
              </Card3D>

              <Card3D intensity={14} depth={20} glowColor="rgba(220, 38, 38, 0.15)">
                <div className="bg-ink text-paper p-8 rounded-xs border border-brass/30 relative group overflow-hidden shadow-3d-dark h-full preserve-3d">
                  <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] block mb-4 translate-z-10">03 · PURPOSE</span>
                  <h3 className="font-serif text-2xl font-medium mb-3 translate-z-10">Talent Pool Creation</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed translate-z-10">
                    To drive competency assessment and development, building a pool of certified talent across energy, power, and digital domains.
                  </p>
                </div>
              </Card3D>
            </div>

            {/* Accreditations & Legacy Contracts Showcase */}
            <span className="font-mono text-xs uppercase tracking-widest text-oxblood font-semibold block mb-6">Industry Recognition & Legacy Contracts</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line shadow-sm">
              <div className="bg-paper p-7 hover:bg-paper-soft transition-colors">
                <span className="font-mono text-xs text-brass uppercase tracking-widest block mb-2">OGTAN LIFE MEMBER</span>
                <h4 className="font-serif text-xl font-medium mb-2">Oil & Gas Trainers</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Life member of OGTAN and active lead presence at the Sub-Saharan Africa International Petroleum Exhibition.</p>
              </div>

              <div className="bg-paper p-7 hover:bg-paper-soft transition-colors">
                <span className="font-mono text-xs text-brass uppercase tracking-widest block mb-2">CHEVRON HCD WIN</span>
                <h4 className="font-serif text-xl font-medium mb-2">Makaraba Utonana</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Executed Chevron Human Capital Development program for the Makaraba Utonana gas flare elimination project.</p>
              </div>

              <div className="bg-paper p-7 hover:bg-paper-soft transition-colors">
                <span className="font-mono text-xs text-brass uppercase tracking-widest block mb-2">TOTALENERGIES HCD</span>
                <h4 className="font-serif text-xl font-medium mb-2">PIDWAL Programme</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Delivered Total and PIDWAL workforce capability programmes for technical field operators.</p>
              </div>

              <div className="bg-paper p-7 hover:bg-paper-soft transition-colors">
                <span className="font-mono text-xs text-brass uppercase tracking-widest block mb-2">PANA HOLDINGS GROUP</span>
                <h4 className="font-serif text-xl font-medium mb-2">PE Energy & AKD</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Standing training & assessment alliance across PE Energy and AKD group subsidiaries.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 4: ISO SAFETY WITH FEATURED OPERATIONAL IMAGE CARD ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper"
          id="safety"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
                  Safety & Integrated Management Systems
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium mb-6">Safety Built Into Every Operations Site</h2>
                <p className="text-base text-ink-soft leading-relaxed font-serif mb-6">
                  Health, safety and environment standards are built directly into every programme, from curriculum design through to delivery on live equipment. Safety is taught the way it is practised on a working site.
                </p>
                <div className="p-5 bg-paper-soft border-l-2 border-oxblood text-sm text-muted-foreground leading-relaxed font-mono">
                  ISO 21001:2025 requires assessment to be traceable, secure against malpractice and open to appeal, with grades tied back to verified evidence.
                </div>
              </div>

              {/* Featured Operational Site Image Card */}
              <div className="relative rounded-xs overflow-hidden border border-line shadow-xl group">
                <div className="aspect-[16/10] w-full relative">
                  <img
                    src="/images/hero_slide_1.png"
                    alt="PANA Institute Energy & Power Site Safety Operations"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <span className="font-mono text-[11px] text-brass uppercase tracking-widest block mb-1">LIVE PLANT SAFETY</span>
                    <h4 className="font-serif text-xl text-paper font-medium">Energy & Petroleum Infrastructure Safety</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* ISO Certification Badge Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-paper-soft p-8 border border-line rounded-xs relative group hover:border-brass transition-colors shadow-sm">
                <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block mb-2">CERTIFICATION</span>
                <h3 className="font-serif text-3xl font-medium text-oxblood mb-2">ISO 14001</h3>
                <p className="text-sm font-semibold text-ink mb-2">Environmental Management</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Integrated environmental management across all training laboratories and operational centers.</p>
              </div>

              <div className="bg-paper-soft p-8 border border-line rounded-xs relative group hover:border-brass transition-colors shadow-sm">
                <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block mb-2">CERTIFICATION</span>
                <h3 className="font-serif text-3xl font-medium text-oxblood mb-2">ISO 45001</h3>
                <p className="text-sm font-semibold text-ink mb-2">Occupational Health & Safety</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Worker and candidate safety management, in progress targeted for full completion across all hubs.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 5: "THE 5 PS" CULTURE GRID & CAREERS BG IMAGE CARD ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper-soft border-t border-b border-line"
          id="careers"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="anchor-head mb-14">
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-2">
                People & Culture · The Operating Maxim
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">The Five Ps of PANA Institute</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
              {[
                { p: '01 · PURPOSE', title: 'Sustainable Enterprise', desc: 'Purpose for a sustainable enterprise aligned with long-term regional development.' },
                { p: '02 · PROCESS', title: 'Technology Powered', desc: 'Philosophy and process supported by modern digital platforms and live simulators.' },
                { p: '03 · PRODUCTS', title: 'Real Problem Solvers', desc: 'Products and platforms that solve real operational problems in energy and digital.' },
                { p: '04 · PEOPLE', title: 'Performance Measured', desc: 'People and talent measured strictly by verified real-world performance.' },
                { p: '05 · PROSPERITY', title: 'Shared Value', desc: 'Prosperity shared equitably with employees, partners, and shareholders.' }
              ].map((item) => (
                <div key={item.p} className="bg-paper p-6 border border-line rounded-xs hover:border-oxblood transition-colors flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="font-mono text-[10px] text-oxblood font-semibold tracking-widest block mb-3">{item.p}</span>
                    <h4 className="font-serif text-lg font-medium text-ink mb-2">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Careers Box With Vivid Background Image Showcase */}
            <div className="bg-ink text-paper p-8 md:p-12 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8 border border-brass/30 relative overflow-hidden shadow-2xl">
              <img src="/images/hero_slide_3.png" alt="PANA Institute Global Sustainability" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs text-brass uppercase tracking-[0.2em] font-semibold block mb-2">Join Our Team</span>
                <h3 className="font-serif text-3xl sm:text-4xl font-medium mb-3">Build the Institute With Us</h3>
                <p className="text-sm text-zinc-200 leading-relaxed font-serif">
                  Appointing principal officers, centre directors, faculty, and certified assessors. Send your profile and CV to <a href="mailto:info@pana-institute.com" className="text-brass underline font-mono font-semibold">info@pana-institute.com</a>.
                </p>
              </div>
              <a
                href="mailto:info@pana-institute.com"
                className="relative z-10 bg-oxblood hover:bg-oxblood-deep text-white font-mono text-xs uppercase tracking-widest px-8 py-4 rounded-xs shrink-0 transition-colors font-semibold shadow-xl border border-oxblood-light"
              >
                Apply / Contact Us
              </a>
            </div>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 6: UPCOMING COURSES & COMPETENCY ASSESSMENTS ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper border-b border-line"
          id="upcoming-courses"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
                  Academic Calendar · Programmes
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">Upcoming Courses & Assessments</h2>
              </div>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-oxblood font-semibold hover:text-oxblood-deep transition-colors group"
              >
                View Full Course Catalogue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dbCourses.map((course) => {
                const targetUrl = course.id && course.id.length > 5 ? `/course/${course.id}` : '/courses';
                return (
                  <div key={course.id} className="bg-paper border border-line rounded-xs overflow-hidden flex flex-col justify-between hover:border-oxblood/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                    <div>
                      {/* Featured Course Thumbnail Image */}
                      <Link to={targetUrl} className="block aspect-video w-full relative overflow-hidden bg-ink">
                        <img
                          src={course.image || '/images/hero_slide_1.png'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute top-3 left-3 bg-oxblood text-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest font-semibold rounded-xs shadow-md">
                          {course.badge}
                        </div>
                      </Link>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                          <span className="text-brass uppercase tracking-wider font-semibold">{course.category}</span>
                          <span className="text-oxblood font-semibold uppercase tracking-wider">{course.status}</span>
                        </div>

                        <Link to={targetUrl} className="block">
                          <h3 className="font-serif text-xl font-medium text-ink group-hover:text-oxblood transition-colors leading-snug line-clamp-2">
                            {course.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-serif">
                          {course.description}
                        </p>

                        <div className="space-y-2 pt-3 border-t border-line text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-oxblood shrink-0" />
                            <span className="font-medium text-ink-soft">{course.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-brass shrink-0" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-oxblood shrink-0" />
                            <span>{course.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 border-t border-line/50 mt-4 flex items-center justify-between">
                      <div>
                        <div className="font-serif text-lg font-bold text-ink">{course.price}</div>
                        {course.originalPrice && (
                          <div className="font-mono text-[10px] text-muted-foreground line-through">{course.originalPrice}</div>
                        )}
                      </div>
                      <Link
                        to={targetUrl}
                        className="bg-oxblood hover:bg-oxblood-deep text-white px-5 py-2.5 rounded-xs font-mono text-xs uppercase tracking-widest transition-colors font-semibold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        Enrol Now
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 7: NEWS, RESEARCH & BLOG SECTION ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper-soft border-b border-line"
          id="news-blog"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
                  PANA Think Tank · Publications & News
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">Research Insights & Media</h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-oxblood font-semibold hover:text-oxblood-deep transition-colors group"
              >
                Explore All Publications
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dbArticles.map((art) => {
                const articleUrl = art.slug ? `/blog/${art.slug}` : '/blog';
                return (
                  <div key={art.id} className="bg-paper border border-line rounded-xs overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all group">
                    <div>
                      {/* Featured Image */}
                      <Link to={articleUrl} className="block aspect-[16/10] w-full relative overflow-hidden bg-ink">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute top-4 left-4 bg-paper/90 backdrop-blur-xs px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-oxblood font-semibold border border-line rounded-xs">
                          {art.category}
                        </div>
                      </Link>

                      <div className="p-7">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 font-mono">
                          <span>{art.date}</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-brass" />
                            {art.readTime}
                          </span>
                        </div>

                        <Link to={articleUrl} className="block">
                          <h3 className="font-serif text-xl font-medium text-ink group-hover:text-oxblood transition-colors mb-3 leading-snug">
                            {art.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-muted-foreground leading-relaxed font-serif line-clamp-3 mb-4">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-7 pb-7 pt-0 flex items-center justify-between border-t border-line/40 pt-4 mt-auto">
                      <span className="font-mono text-[10px] text-brass uppercase tracking-wider truncate max-w-[60%]">
                        {art.center}
                      </span>
                      <Link
                        to={articleUrl}
                        className="inline-flex items-center gap-1 font-mono text-xs text-oxblood font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                      >
                        Read
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ─── CREATIVE SECTION 8: REDESIGNED LUXURY EXECUTIVE TESTIMONIAL SPOTLIGHT ─── */}
        <motion.section
          initial={{ opacity: 0, y: 55, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="py-24 bg-paper border-b border-line overflow-hidden"
          id="testimonials"
        >
          <div className="max-w-[1320px] mx-auto px-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="font-mono text-xs tracking-[0.22em] uppercase text-oxblood font-semibold block mb-3">
                  Client Endorsements · Industry Trust
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">Trusted by Industry & Government Leaders</h2>
              </div>

              {/* Prev / Next Spotlight Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev - 1 + dbTestimonials.length) % dbTestimonials.length)}
                  className="w-11 h-11 rounded-xs bg-paper-soft border border-line flex items-center justify-center text-ink hover:bg-oxblood hover:text-white transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTestimonial((prev) => (prev + 1) % dbTestimonials.length)}
                  className="w-11 h-11 rounded-xs bg-paper-soft border border-line flex items-center justify-center text-ink hover:bg-oxblood hover:text-white transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Featured Executive Spotlight Banner */}
            {dbTestimonials.length > 0 && (
              <div className="bg-ink text-paper rounded-xs p-8 md:p-14 border border-brass/30 shadow-2xl relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Quote className="w-48 h-48 text-brass" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={dbTestimonials[activeTestimonial % dbTestimonials.length]?.id || activeTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
                  >
                    {/* Left Quote Block */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-ink-soft px-3 py-1 border border-brass/20 rounded-xs">
                          {[...Array(dbTestimonials[activeTestimonial % dbTestimonials.length]?.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-brass text-brass" />
                          ))}
                        </div>
                        <span className="font-mono text-[10px] text-brass uppercase tracking-widest font-semibold">
                          {dbTestimonials[activeTestimonial % dbTestimonials.length]?.verified || 'VERIFIED ENDORSEMENT'}
                        </span>
                      </div>

                      <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-paper font-normal leading-relaxed">
                        "{dbTestimonials[activeTestimonial % dbTestimonials.length]?.content}"
                      </p>
                    </div>

                    {/* Right Executive Profile Card */}
                    <div className="lg:col-span-4 bg-ink-soft p-6 border border-brass/30 rounded-xs space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-oxblood text-white font-serif text-xl font-bold flex items-center justify-center shrink-0 border-2 border-brass/40 shadow-lg">
                          {dbTestimonials[activeTestimonial % dbTestimonials.length]?.image_initials || (dbTestimonials[activeTestimonial % dbTestimonials.length]?.name ? dbTestimonials[activeTestimonial % dbTestimonials.length]?.name[0] : 'P')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xl font-medium text-paper truncate">
                            {dbTestimonials[activeTestimonial % dbTestimonials.length]?.name}
                          </h4>
                          <p className="text-xs text-zinc-300 truncate">
                            {dbTestimonials[activeTestimonial % dbTestimonials.length]?.position}
                          </p>
                          <span className="font-mono text-xs text-brass uppercase font-semibold block mt-1">
                            {dbTestimonials[activeTestimonial % dbTestimonials.length]?.company}
                          </span>
                        </div>
                      </div>

                      {dbTestimonials[activeTestimonial % dbTestimonials.length]?.metric && (
                        <div className="pt-3 border-t border-brass/20 flex items-center justify-between font-mono text-xs text-zinc-300">
                          <span className="uppercase text-[10px] text-brass">Key Outcome</span>
                          <span className="font-semibold text-paper">{dbTestimonials[activeTestimonial % dbTestimonials.length]?.metric}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="flex items-center gap-2 mt-8 justify-center lg:justify-start">
                  {dbTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeTestimonial ? 'w-8 bg-brass' : 'w-2 bg-zinc-600 hover:bg-zinc-400'
                      }`}
                      aria-label={`Jump to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Endorsement Cards Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {dbTestimonials.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`text-left bg-paper-soft p-6 border rounded-xs transition-all relative ${
                    idx === activeTestimonial ? 'border-oxblood shadow-lg bg-paper' : 'border-line hover:border-oxblood/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                    <span className="text-brass uppercase font-semibold">{item.company}</span>
                    <span className="text-oxblood font-semibold">0{idx + 1}</span>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-ink mb-1 truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 italic">"{item.content}"</p>
                </button>
              ))}
            </div>

            {/* Corporate & Regulatory Trust Strip */}
            <div className="pt-10 border-t border-line">
              <span className="font-mono text-[10px] text-oxblood uppercase tracking-[0.2em] font-semibold block text-center mb-6">
                PROUDLY TRUSTED BY REGIONAL & GLOBAL ENERGY LEADERS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-items-center opacity-80 font-mono text-xs text-ink-soft font-semibold text-center uppercase tracking-wider">
                <div className="p-4 bg-paper-soft border border-line rounded-xs w-full">PE Energy Group</div>
                <div className="p-4 bg-paper-soft border border-line rounded-xs w-full">Chevron HCD</div>
                <div className="p-4 bg-paper-soft border border-line rounded-xs w-full">TotalEnergies PIDWAL</div>
                <div className="p-4 bg-paper-soft border border-line rounded-xs w-full">OGTAN Life Member</div>
                <div className="p-4 bg-paper-soft border border-line rounded-xs w-full">NNPCL Alliance</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DARK QUOTE & 6 COMMITMENTS SECTION - FULL WIDTH WITH SCROLL REVEAL */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="py-20 bg-ink text-paper w-full"
        >
          <div className="max-w-[1320px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-tight">
              Six things the Institute is set up to do, and nothing else.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">01</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Accelerated competency</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Experiential learning on live equipment, workshops, plant and simulators.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">02</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Assessment & profiling</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Evidence based statements of what a person can do, judged independently.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">03</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Customised learning</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Client and product specific programmes, local content and executive education.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">04</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Applied research</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Five centres of excellence, funded chairs, labs and working pilots.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">05</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Sustainability & Climate</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Value driven through decarbonisation, ESG and green innovation.</p>
              </div>
              <div className="bg-ink-soft p-6">
                <span className="font-mono text-xs text-brass tracking-widest block mb-2">06</span>
                <h3 className="font-serif text-lg font-medium text-zinc-100 mb-2">Capability advisory</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Long term workforce planning and operating model implementation support.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Modular Sections from Page Builder */}
        <DynamicPageSections slug="our-institute" />
      </main>

      <Footer />
    </div>
  );
};
