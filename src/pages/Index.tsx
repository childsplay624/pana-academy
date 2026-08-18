import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SocialMediaIcons from "@/components/SocialMediaIcons";
import { Loader2 } from "lucide-react";
import { pageService, Page, PageSection } from "@/services/pageService";
import { SectionRenderer } from "@/components/page-builder/SectionRenderer";
import { OurInstitutePage } from "./OurInstitutePage";

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
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-12 h-12 animate-spin text-oxblood" />
      </div>
    );
  }

  const sections = pageData?.sections || [];
  const activeSections = sections.filter((s: any) => s && s.is_active !== false);
  const page = pageData?.page;

  if (activeSections.length === 0) {
    return <OurInstitutePage />;
  }

  return (
    <>
      <Helmet>
        <title>{page?.meta_title || "PANA Institute - Building the standard against which competence is measured"}</title>
        <meta name="description" content={page?.meta_description || "PANA Institute develops and assesses competence for the petroleum, energy and power, and digital industries."} />
      </Helmet>
      <div className="min-h-screen relative bg-paper text-ink">
        <Navigation />
        <SocialMediaIcons />
        
        <main>
          {activeSections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
