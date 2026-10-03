import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, ChevronRight, Star, Users, TrendingUp, Award } from 'lucide-react';
import DOMPurify from 'dompurify';

// Dynamic Components for Homepage Migration
import CustomHeroSection from '@/components/HeroSection';
import { HomeStats } from '@/components/home/HomeStats';
import { HowItWorks } from '@/components/home/HowItWorks';
import { LearningCategories } from '@/components/home/LearningCategories';
import { PlatformFeatures } from '@/components/home/PlatformFeatures';
import { TopRatedCourses } from '@/components/course/TopRatedCourses';
import UpcomingCoursesSection from '@/components/UpcomingCoursesSection';
import LatestNewsSection from '@/components/LatestNewsSection';
import CustomTestimonialsSection from '@/components/TestimonialsSection';



export const HeroSection = ({ content }: { content: any }) => {
  const bgImage = content.bgImage;
  const overlayOpacity = content.overlayOpacity ?? (bgImage ? 60 : 0);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background min-h-[450px] flex items-center justify-center">
      {bgImage ? (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt={content.title || 'Hero'} className="w-full h-full object-cover object-center" />
          <div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: overlayOpacity / 100 }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      )}

      <div className={`container px-4 mx-auto relative z-10 ${bgImage ? 'text-white' : ''} text-center`}>
        {content.badge && (
          <span className="inline-block bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm border border-primary/30">
            {content.badge}
          </span>
        )}
        <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.25] pb-2 ${bgImage ? 'text-white' : 'text-foreground'}`}>
          {content.title || 'Hero Title'}
        </h1>
        <p className={`text-xl ${bgImage ? 'text-gray-200' : 'text-muted-foreground'} max-w-3xl mx-auto mb-10 leading-relaxed`}>
          {content.description || 'Add a compelling description here.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {content.buttonText && (
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
              {content.buttonText}
            </Button>
          )}
          {content.secondaryButtonText && (
            <Button size="lg" variant="outline" className={`rounded-full px-8 h-12 text-base ${bgImage ? 'bg-transparent border-white text-white hover:bg-white/20' : ''}`}>
              {content.secondaryButtonText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export const ContentSection = ({ content }: { content: any }) => (
  <section className="py-20 bg-muted/30">
    <div className="container px-4 mx-auto max-w-5xl">
      {content.imageUrl && (
        <div className="mb-10 overflow-hidden rounded-3xl shadow-xl max-h-[450px]">
          <img src={content.imageUrl} alt="Content visual" className="w-full h-full object-cover" />
        </div>
      )}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.body || '<p>Edit this content in the page builder.</p>') }} 
      />
    </div>
  </section>
);

export const FeaturesSection = ({ content }: { content: any }) => (
  <section className="py-24 bg-background">
    <div className="container px-4 mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title || 'Key Features'}</h2>
        <p className="text-muted-foreground text-lg">{content.subtitle || ''}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(content.features || []).map((feature: any, i: number) => (
          <Card key={i} className="border-2 hover:border-primary/50 transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title || 'Feature Title'}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description || 'Feature description goes here.'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export const TestimonialsSection = ({ content }: { content: any }) => (
  <section className="py-24 bg-muted/50 overflow-hidden">
    <div className="container px-4 mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title || 'What People Say'}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(content.testimonials || []).map((t: any, i: number) => (
          <div key={i} className="bg-background p-8 rounded-3xl shadow-sm border border-border relative">
            <div className="text-4xl text-primary/20 absolute top-4 left-4 font-serif">"</div>
            <p className="text-lg italic mb-6 relative z-10 leading-relaxed text-foreground/80">
              {t.text || 'Testimonial text goes here.'}
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary/10" />}
              </div>
              <div>
                <h4 className="font-bold">{t.name || 'John Doe'}</h4>
                <p className="text-xs text-muted-foreground">{t.role || 'CEO at Company'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FAQSection = ({ content }: { content: any }) => (
  <section className="py-24 bg-background">
    <div className="container px-4 mx-auto max-w-3xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title || 'Common Questions'}</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {(content.faqs || []).map((faq: any, i: number) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border last:border-0">
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
              {faq.question || 'Question here?'}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
              {faq.answer || 'Answer goes here.'}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export const CTASection = ({ content }: { content: any }) => (
  <section className="py-20">
    <div className="container px-4 mx-auto">
      <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{content.title || 'Ready to Start?'}</h2>
          <p className="text-xl opacity-90 mb-10 leading-relaxed">{content.description || 'Join thousands of students and start your learning journey today.'}</p>
          <Button variant="secondary" size="lg" className="rounded-full px-10 h-14 text-lg font-bold shadow-2xl hover:scale-105 transition-transform">
            {content.buttonText || 'Contact Us'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  </section>
);

// ── NEW SECTION TYPES ───────────────────────────────────────────────

const STAT_ICONS: Record<string, any> = {
  trending: TrendingUp,
  users: Users,
  award: Award,
  star: Star,
};

export const StatsSection = ({ content }: { content: any }) => (
  <section className="py-20 bg-background border-y border-border">
    <div className="container px-4 mx-auto">
      {content.title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
          {content.subtitle && <p className="text-muted-foreground">{content.subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {(content.stats || []).map((stat: any, i: number) => {
          const Icon = STAT_ICONS[stat.icon] || TrendingUp;
          return (
            <div key={i} className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="text-4xl font-black text-foreground mb-1">{stat.value || '0'}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label || 'Metric'}</div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const TeamSection = ({ content }: { content: any }) => (
  <section className="py-24 bg-muted/20">
    <div className="container px-4 mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.title || 'Meet Our Team'}</h2>
        <p className="text-muted-foreground text-lg">{content.subtitle || ''}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {(content.members || []).map((member: any, i: number) => (
          <div key={i} className="text-center group">
            <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden bg-muted border-4 border-background shadow-md group-hover:border-primary transition-all duration-300">
              {member.avatar
                ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Users className="w-10 h-10 text-primary/40" />
                  </div>
              }
            </div>
            <h3 className="font-bold text-lg">{member.name || 'Team Member'}</h3>
            <p className="text-sm text-primary font-medium">{member.role || 'Role'}</p>
            {member.bio && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const BannerSection = ({ content }: { content: any }) => {
  const bgImage = content.bgImage;
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{ background: bgImage ? undefined : (content.bgColor || 'linear-gradient(135deg, #1e40af, #7c3aed)') }}
    >
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt={content.title || 'Banner'} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
      <div className="container px-4 mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-white text-center md:text-left">
          {content.badge && (
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
              {content.badge}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-black mb-3">{content.title || 'Announcement Title'}</h2>
          <p className="text-white/80 text-lg max-w-xl">{content.description || 'Add a description for this banner.'}</p>
        </div>
        {content.buttonText && (
          <Button size="lg" variant="secondary" className="flex-shrink-0 rounded-full px-8 h-12 font-bold shadow-xl hover:scale-105 transition-transform">
            {content.buttonText}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
};

// ── DYNAMIC SECTION WRAPPERS (For mapping complex components to the page builder) ──

export const DynamicHeroSection = () => <CustomHeroSection />;
export const DynamicStatsSection = () => <HomeStats />;
export const DynamicHowItWorksSection = () => <HowItWorks />;
export const DynamicCategoriesSection = () => <LearningCategories />;
export const DynamicPlatformFeaturesSection = () => <PlatformFeatures />;
export const DynamicTopCoursesSection = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Rated Courses</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our highest rated professional development programs
        </p>
      </div>
      <TopRatedCourses />
    </div>
  </section>
);
export const DynamicUpcomingCoursesSection = () => <UpcomingCoursesSection />;
export const DynamicNewsSection = () => <LatestNewsSection />;
export const DynamicTestimonialsSection = () => <CustomTestimonialsSection />;

export const SectionRenderer = ({ section }: { section: any }) => {
  if (!section || !section.is_active) return null;

  switch (section.section_type) {
    case 'hero': return <HeroSection content={section.content} />;
    case 'content': return <ContentSection content={section.content} />;
    case 'features': return <FeaturesSection content={section.content} />;
    case 'testimonials': return <TestimonialsSection content={section.content} />;
    case 'faq': return <FAQSection content={section.content} />;
    case 'cta': return <CTASection content={section.content} />;
    case 'stats': return <StatsSection content={section.content} />;
    case 'team': return <TeamSection content={section.content} />;
    case 'banner': return <BannerSection content={section.content} />;
    case 'dynamic_hero': return <DynamicHeroSection />;
    case 'dynamic_stats': return <DynamicStatsSection />;
    case 'dynamic_how_it_works': return <DynamicHowItWorksSection />;
    case 'dynamic_categories': return <DynamicCategoriesSection />;
    case 'dynamic_features': return <DynamicPlatformFeaturesSection />;
    case 'dynamic_top_courses': return <DynamicTopCoursesSection />;
    case 'dynamic_upcoming_courses': return <DynamicUpcomingCoursesSection />;
    case 'dynamic_news': return <DynamicNewsSection />;
    case 'dynamic_testimonials': return <DynamicTestimonialsSection />;
    default: return null;
  }
};
