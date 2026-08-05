import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { Loader2 } from "lucide-react";
import { pageService, Page, PageSection } from "@/services/pageService";
import {
  HeroSection, ContentSection, FeaturesSection, TestimonialsSection, FAQSection, CTASection,
  StatsSection, TeamSection, BannerSection,
  DynamicHeroSection, DynamicStatsSection, DynamicHowItWorksSection,
  DynamicCategoriesSection, DynamicPlatformFeaturesSection, DynamicTopCoursesSection,
  DynamicUpcomingCoursesSection, DynamicNewsSection, DynamicTestimonialsSection
} from "@/components/page-builder/SectionRenderer";

const Index = () => {
  const [pageData, setPageData] = useState<{ page: Page, sections: PageSection[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pageService.getPageBySlug('home');
        if (data) {
          setPageData({ page: data as unknown as Page, sections: (data as any).page_sections || [] });
        }
      } catch (err) {
        console.error('Error fetching home page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const sections = pageData?.sections || [];
  const page = pageData?.page;

  return (
    <>
      <Helmet>
        <title>{page?.meta_title || "PANA Institute - Professional Training & Development"}</title>
        <meta name="description" content={page?.meta_description || "Transform your career with PANA Institute's world-class professional training programs."} />
      </Helmet>
      <div className="min-h-screen relative">
        <Navigation />
        <SocialMediaIcons />
        
        <main>
          {sections.length === 0 ? (
            <div className="py-32 text-center text-muted-foreground">
              Please setup the 'home' page in the Page Builder.
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
                default: return null;
              }
            })
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
