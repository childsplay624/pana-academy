import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { Loader2 } from "lucide-react";
import { pageService, Page, PageSection } from "@/services/pageService";
import {
  SectionRenderer,
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
      <SEO
        title={page?.meta_title || "PANA Institute Limited - Empowering Talent Across Sectors"}
        description={page?.meta_description || "Professional training, consulting, and research excellence. Transform your career with PANA Institute's world-class programs in energy, digital transformation, and leadership development."}
        canonical="/"
      />
      <div className="min-h-screen relative">
        <Navigation />
        <SocialMediaIcons />
        
        <main>
          {sections.length === 0 ? (
            <>
              <DynamicHeroSection />
              <DynamicStatsSection />
              <DynamicHowItWorksSection />
              <DynamicCategoriesSection />
              <DynamicPlatformFeaturesSection />
              <DynamicTopCoursesSection />
              <DynamicUpcomingCoursesSection />
              <DynamicNewsSection />
              <DynamicTestimonialsSection />
            </>
          ) : (
            sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
