import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pageService, Page, PageSection } from '@/services/pageService';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SocialMediaIcons from '@/components/SocialMediaIcons';

import {
  HeroSection,
  ContentSection,
  FeaturesSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
  StatsSection,
  TeamSection,
  BannerSection,
  DynamicHeroSection,
  DynamicStatsSection,
  DynamicHowItWorksSection,
  DynamicCategoriesSection,
  DynamicPlatformFeaturesSection,
  DynamicTopCoursesSection,
  DynamicUpcomingCoursesSection,
  DynamicNewsSection,
  DynamicTestimonialsSection
} from '@/components/page-builder/SectionRenderer';

export default function PublicPageRenderer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<{ page: Page, sections: PageSection[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  const fetchPage = async (pageSlug: string) => {
    try {
      setLoading(true);
      const data = await pageService.getPageBySlug(pageSlug);
      
      if (!data) {
        setError('not_found');
        return;
      }

      setPageData({
        page: data as unknown as Page,
        sections: (data as any).page_sections || []
      });
    } catch (err) {
      console.error('Error fetching page:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading page...</p>
      </div>
    );
  }

  if (error === 'not_found' || !pageData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navigation />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center font-black text-3xl mb-6 shadow-inner">
            404
          </div>
          <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-slate-900">Page Not Found</h1>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm">
            The page you are looking for does not exist or may currently be in draft mode.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => navigate('/')} variant="default" className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
            <Button onClick={() => navigate('/courses')} variant="outline" className="rounded-xl px-6">
              Browse Courses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { page, sections } = pageData;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{page.meta_title || `${page.title} | PANA Institute`}</title>
        <meta name="description" content={page.meta_description || page.description || "PANA Institute - Leading the standard in professional competence and industrial skills."} />
      </Helmet>

      <Navigation />
      <SocialMediaIcons />

      <main className="flex-grow">
        {sections.length === 0 ? (
          <div className="container mx-auto py-32 px-4 text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Under Construction
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">{page.title}</h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {page.description || "This page has been created in the CMS and is awaiting modular block layout. Check back soon for full updates."}
            </p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
                Back to Home <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          sections.map((section) => {
            if (!section.is_active) return null;
            
            switch (section.section_type) {
              case 'hero': return <HeroSection key={section.id} content={section.content} />;
              case 'content': return <ContentSection key={section.id} content={section.content} />;
              case 'features': return <FeaturesSection key={section.id} content={section.content} />;
              case 'testimonials': return <TestimonialsSection key={section.id} content={section.content} />;
              case 'faq': return <FAQSection key={section.id} content={section.content} />;
              case 'cta': return <CTASection key={section.id} content={section.content} />;
              case 'stats': return <StatsSection key={section.id} content={section.content} />;
              case 'team': return <TeamSection key={section.id} content={section.content} />;
              case 'banner': return <BannerSection key={section.id} content={section.content} />;
              case 'dynamic_hero': return <DynamicHeroSection key={section.id} />;
              case 'dynamic_stats': return <DynamicStatsSection key={section.id} />;
              case 'dynamic_how_it_works': return <DynamicHowItWorksSection key={section.id} />;
              case 'dynamic_categories': return <DynamicCategoriesSection key={section.id} />;
              case 'dynamic_features': return <DynamicPlatformFeaturesSection key={section.id} />;
              case 'dynamic_top_courses': return <DynamicTopCoursesSection key={section.id} />;
              case 'dynamic_upcoming_courses': return <DynamicUpcomingCoursesSection key={section.id} />;
              case 'dynamic_news': return <DynamicNewsSection key={section.id} />;
              case 'dynamic_testimonials': return <DynamicTestimonialsSection key={section.id} />;
              default: return (
                <div key={section.id} className="py-20 text-center border-y bg-muted/20 italic text-muted-foreground">
                  Section: {section.section_type}
                </div>
              );
            }
          })
        )}
      </main>

      <Footer />
    </div>
  );
}
