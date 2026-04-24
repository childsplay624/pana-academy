import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pageService, Page, PageSection } from '@/services/pageService';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Section Components
const HeroSection = ({ content }: { content: any }) => (
  <section className="relative py-24 overflow-hidden bg-background">
    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
    <div className="container px-4 mx-auto text-center relative z-10">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
        {content.title || 'Hero Title'}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
        {content.description || 'Add a compelling description here.'}
      </p>
      <div className="flex items-center justify-center gap-4">
        {content.buttonText && (
          <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
            {content.buttonText}
          </Button>
        )}
        {content.secondaryButtonText && (
          <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base">
            {content.secondaryButtonText}
          </Button>
        )}
      </div>
    </div>
  </section>
);

const ContentSection = ({ content }: { content: any }) => (
  <section className="py-20 bg-muted/30">
    <div className="container px-4 mx-auto max-w-4xl">
      <div 
        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: content.body || '<p>Edit this content in the page builder.</p>' }} 
      />
    </div>
  </section>
);

const FeaturesSection = ({ content }: { content: any }) => (
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

const TestimonialsSection = ({ content }: { content: any }) => (
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

const FAQSection = ({ content }: { content: any }) => (
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

const CTASection = ({ content }: { content: any }) => (
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
