import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pageService, Page, PageSection } from '@/services/pageService';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import {
  HeroSection,
  ContentSection,
  FeaturesSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading your page...</p>
      </div>
    );
  }

  if (error === 'not_found' || !pageData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4 italic">404</h1>
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Oops! Page not found</h2>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          The page you are looking for doesn't exist or hasn't been published yet.
        </p>
        <Button onClick={() => navigate('/')} variant="outline" className="rounded-full px-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Homepage
        </Button>
      </div>
    );
  }

  const { page, sections } = pageData;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.meta_title || `${page.title} | Pana Academy`}</title>
        <meta name="description" content={page.meta_description || page.description || ''} />
      </Helmet>

      <main>
        {sections.length === 0 ? (
          <div className="container mx-auto py-32 text-center">
            <h1 className="text-5xl font-bold mb-4">{page.title}</h1>
            <p className="text-xl text-muted-foreground italic">Coming soon: We're still building this masterpiece.</p>
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
                  Section concept: {section.section_type} (Coming soon)
                </div>
              );
            }
          })
        )}
      </main>
    </div>
  );
}
