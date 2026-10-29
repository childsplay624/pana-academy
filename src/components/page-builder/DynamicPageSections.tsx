import { useState, useEffect } from 'react';
import { pageService, PageSection } from '@/services/pageService';
import { SectionRenderer } from '@/components/page-builder/SectionRenderer';

export const DynamicPageSections = ({ 
  slug, 
  excludeTypes = ['hero', 'dynamic_hero'] 
}: { 
  slug: string; 
  excludeTypes?: string[];
}) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSections = async () => {
      try {
        const data = await pageService.getPageBySlug(slug);
        if (isMounted && data && (data as any).page_sections) {
          const rawSections: PageSection[] = (data as any).page_sections || [];
          const filtered = rawSections.filter(s => {
            if (s.is_active === false) return false;
            if (excludeTypes.includes(s.section_type)) return false;
            if (
              s.section_type === 'features' &&
              (
                s.content?.title?.toLowerCase().trim() === 'our offices' ||
                s.content?.title?.toLowerCase().trim().startsWith('why choose') ||
                s.content?.features?.some((f: any) =>
                  f?.title?.toLowerCase().includes('d-line') ||
                  f?.description?.toLowerCase().includes('emekuku') ||
                  f?.title?.toLowerCase().includes('expert faculty') ||
                  f?.title?.toLowerCase().includes('global reach')
                )
              )
            ) {
              return false;
            }
            if (
              s.section_type === 'content' &&
              (
                (s.content?.body || '').includes("Africa's leading Competency Hub") ||
                ((s.content?.body || '').includes("Our Vision") && (s.content?.body || '').includes("Our Mission"))
              )
            ) {
              return false;
            }
            if (
              s.section_type === 'cta' &&
              (
                (s.content?.title || '').toLowerCase().includes('ready to start your learning journey') ||
                (s.content?.description || '').toLowerCase().includes('advancing their careers with') ||
                ((s.content?.title || '').toLowerCase().includes('ready to start') && s.content?.buttonText?.toLowerCase().includes('browse courses'))
              )
            ) {
              return false;
            }
            return true;
          });
          setSections(filtered);
        }
      } catch (err) {
        console.error(`Error loading page sections for ${slug}:`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSections();
    return () => { isMounted = false; };
  }, [slug, excludeTypes.join(',')]);

  if (loading || sections.length === 0) return null;

  return (
    <div className="dynamic-page-sections space-y-0">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  );
};
