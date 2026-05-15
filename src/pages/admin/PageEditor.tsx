import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, Save, Plus, Trash2, GripVertical, Eye, Layout, Type, 
  MousePointer2, MoveUp, MoveDown, FileCode, AlertCircle, 
  CheckSquare, MessageSquare, HelpCircle, X, ChevronDown, ChevronUp, ChevronRight, Loader2
} from 'lucide-react';
import { pageService, Page, PageSection } from '@/services/pageService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeroSection,
  ContentSection,
  FeaturesSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
  StatsSection,
  TeamSection,
  BannerSection
} from '@/components/page-builder/SectionRenderer';

// Maps a static page slug to its editable content field definitions
const STATIC_PAGE_FIELDS: Record<string, { key: string; label: string; type: 'text' | 'textarea' | 'url' }[]> = {
  'about': [
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    { key: 'mission_title', label: 'Mission Section Title', type: 'text' },
    { key: 'mission_body', label: 'Mission Body Text', type: 'textarea' },
    { key: 'vision_title', label: 'Vision Section Title', type: 'text' },
    { key: 'vision_body', label: 'Vision Body Text', type: 'textarea' },
  ],
  'training-delivery': [
    { key: 'hero_title', label: 'Page Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Page Subtitle', type: 'textarea' },
    { key: 'intro_body', label: 'Introduction Text', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Section Title', type: 'text' },
    { key: 'cta_button', label: 'CTA Button Label', type: 'text' },
  ],
  'contact': [
    { key: 'hero_title', label: 'Page Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Page Subtitle', type: 'textarea' },
    { key: 'address', label: 'Office Address', type: 'textarea' },
    { key: 'phone', label: 'Phone Number', type: 'text' },
    { key: 'email', label: 'Contact Email', type: 'text' },
  ],
};

const SECTION_TEMPLATES = {
  hero: { 
    title: 'New Hero Section', 
    description: 'Welcome to our platform. We provide world-class excellence.', 
    buttonText: 'Get Started',
    secondaryButtonText: 'Learn More' 
  },
  content: { 
    body: '<h2>Your Content Here</h2><p>Start writing your page content...</p>' 
  },
  features: {
    title: 'Our Key Features',
    subtitle: 'Why choose us for your professional development?',
    features: [
      { title: 'Expert Instruction', description: 'Learn from industry veterans.' },
      { title: 'Flexible Learning', description: 'Study at your own pace.' }
    ]
  },
  testimonials: {
    title: 'Student Testimonials',
    testimonials: [
      { name: 'John Doe', role: 'Graduate', text: 'This was a life-changing experience!', avatar: '' }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    faqs: [
      { question: 'How do I enroll?', answer: 'Simply click the enroll button on any course page.' }
    ]
  },
  cta: { 
    title: 'Ready to Transform Your Career?', 
    description: 'Join thousands of professionals already learning with us.', 
    buttonText: 'Enroll Now' 
  },
  stats: {
    title: 'Our Impact in Numbers',
    subtitle: 'Trusted by professionals across Africa',
    stats: [
      { value: '5,000+', label: 'Trained Professionals', icon: 'users' },
      { value: '98%', label: 'Satisfaction Rate', icon: 'star' },
      { value: '120+', label: 'Courses Delivered', icon: 'award' },
      { value: '15+', label: 'Years Experience', icon: 'trending' },
    ]
  },
  team: {
    title: 'Meet Our Expert Team',
    subtitle: 'Passionate professionals dedicated to your growth.',
    members: [
      { name: 'Dr. Ada Obi', role: 'Lead Trainer', bio: 'PhD in Education with 15+ years experience.', avatar: '' },
      { name: 'Engr. Kola Balogun', role: 'Technical Director', bio: 'Expert in infrastructure & project management.', avatar: '' },
    ]
  },
  banner: {
    badge: 'New',
    title: 'Upcoming Training Programme',
    description: 'Register now to secure your spot in our next cohort.',
    buttonText: 'Register Now',
    bgColor: 'linear-gradient(135deg, #1e40af, #7c3aed)',
  },
};

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [staticContent, setStaticContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPageData(id);
    }
  }, [id]);

  const fetchPageData = async (pageId: string) => {
    try {
      setLoading(true);
      const { data, error } = await pageService.getPageById(pageId);
      if (error) throw error;
      setPage(data);

      if (data.page_type === 'static') {
        const content = await pageService.getPageContent(data.slug);
        setStaticContent(content);
      } else {
        const sectionData = await pageService.getPageSections(pageId);
        setSections(sectionData);
        // Expand all sections by default
        const initialExpanded: Record<string, boolean> = {};
        sectionData.forEach(s => initialExpanded[s.id] = true);
        setExpandedSections(initialExpanded);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast({ title: 'Error', description: 'Failed to load page data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    try {
      setSaving(true);
      await pageService.updatePage(page.id, page);

      if (page.page_type === 'static') {
        await pageService.savePageContent(page.slug, staticContent);
      } else {
        const updatedSections = sections.map((s, idx) => ({ ...s, order_index: idx }));
        await pageService.saveSections(page.id, updatedSections);
      }

      toast({ title: 'Saved!', description: 'All changes have been synced to the database.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: keyof typeof SECTION_TEMPLATES) => {
    const newId = crypto.randomUUID();
    const newSection: any = {
      id: newId,
      page_id: page?.id || '',
      section_type: type,
      content: JSON.parse(JSON.stringify(SECTION_TEMPLATES[type])), // Deep clone
      order_index: sections.length,
      is_active: true
    };
    setSections([...sections, newSection]);
    setExpandedSections(prev => ({ ...prev, [newId]: true }));
    setIsAddSectionOpen(false);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  };

  const updateSectionContent = (id: string, key: string, value: any) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s
    ));
  };

  const toggleSectionExpansion = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleArrayItemUpdate = (sectionId: string, arrayKey: string, index: number, field: string, value: string) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayKey] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...s, content: { ...s.content, [arrayKey]: newArray } };
    }));
  };

  const addArrayItem = (sectionId: string, arrayKey: string, defaultValue: any) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = [...(s.content[arrayKey] || []), defaultValue];
      return { ...s, content: { ...s.content, [arrayKey]: newArray } };
    }));
  };

  const removeArrayItem = (sectionId: string, arrayKey: string, index: number) => {
    setSections(sections.map(s => {
      if (s.id !== sectionId) return s;
      const newArray = (s.content[arrayKey] || []).filter((_: any, i: number) => i !== index);
      return { ...s, content: { ...s.content, [arrayKey]: newArray } };
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => navigate('/dashboard/pages')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{page?.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-[10px] h-5 ${page?.page_type === 'static' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                  {page?.page_type === 'static' ? '⚡ Static' : '🧩 Dynamic'}
                </Badge>
                <code className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                  {page?.page_type === 'static' ? `/${page?.slug}` : `/p/${page?.slug}`}
                </code>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex" onClick={() => window.open(page?.page_type === 'static' ? `/${page?.slug}` : `/p/${page?.slug}`, '_blank')}>
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 px-6 font-bold shadow-lg shadow-primary/20">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? 'Saving...' : 'Sync Changes'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue={page?.page_type === 'static' ? 'content' : 'sections'} className="w-full">
          <div className="flex items-center justify-between mb-4 border-b pb-1">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              <TabsTrigger value={page?.page_type === 'static' ? 'content' : 'sections'} className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 h-auto text-sm font-bold uppercase tracking-wider">
                {page?.page_type === 'static' ? 'Content Fields' : 'Page Outline'}
              </TabsTrigger>
              <TabsTrigger value="settings" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 h-auto text-sm font-bold uppercase tracking-wider">
                SEO & Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Static Pages Content */}
          {page?.page_type === 'static' && (
            <TabsContent value="content" className="mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-0 bg-blue-500/5 ring-1 ring-blue-500/20">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="p-2 bg-blue-500 rounded-lg text-white"><AlertCircle className="w-5 h-5" /></div>
                      <div>
                        <h4 className="font-bold text-blue-900 leading-none mb-2">Static Page Mode</h4>
                        <p className="text-sm text-blue-700/80">You are editing a hardcoded page. You can update specific text blocks, but the overall structure is fixed in code.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border">
                    <CardHeader><CardTitle className="text-lg">Editable Content</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      {(STATIC_PAGE_FIELDS[page.slug] || []).map(field => (
                        <div key={field.key} className="space-y-2">
                          <Label className="text-xs font-bold text-muted-foreground uppercase">{field.label}</Label>
                          {field.type === 'textarea' ? (
                            <Textarea 
                              value={staticContent[field.key] || ''} 
                              onChange={e => setStaticContent(p => ({ ...p, [field.key]: e.target.value }))}
                              className="min-h-[120px] focus-visible:ring-primary"
                            />
                          ) : (
                            <Input 
                              value={staticContent[field.key] || ''} 
                              onChange={e => setStaticContent(p => ({ ...p, [field.key]: e.target.value }))}
                              className="focus-visible:ring-primary"
                            />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="shadow-sm border-border overflow-hidden">
                    <CardHeader className="bg-muted/30 py-3"><CardTitle className="text-sm font-bold uppercase italic">Quick Visibility</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-6">
                       <div className="flex items-center justify-between">
                        <Label htmlFor="s-nav" className="text-sm font-medium">Show in Navbar</Label>
                        <Switch id="s-nav" checked={page?.show_in_navbar} onCheckedChange={v => setPage(p => p ? { ...p, show_in_navbar: v } : null)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="s-footer" className="text-sm font-medium">Show in Footer</Label>
                        <Switch id="s-footer" checked={page?.show_in_footer} onCheckedChange={v => setPage(p => p ? { ...p, show_in_footer: v } : null)} />
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Status</Label>
                        <Select value={page?.status} onValueChange={(v: any) => setPage(p => p ? { ...p, status: v } : null)}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Dynamic Pages Section Builder (Elementor Style) */}
          {page?.page_type !== 'static' && (
            <TabsContent value="sections" className="mt-0">
               <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-250px)]">
                
                {/* Left Panel: Sidebar Controls (Inspector) */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar border-r border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Page Elements</h3>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setIsAddSectionOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Add Section
                    </Button>
                  </div>

                  {sections.length === 0 ? (
                    <div className="text-center p-8 bg-muted/20 rounded-2xl border-2 border-dashed">
                      <p className="text-sm text-muted-foreground mb-4">No sections added yet.</p>
                      <Button onClick={() => setIsAddSectionOpen(true)}>Add Your First Section</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section, index) => {
                        const isExpanded = activeSectionId === section.id || expandedSections[section.id];
                        return (
                          <Card key={section.id} className={`group overflow-hidden border-2 transition-all duration-300 ${isExpanded ? 'border-primary/50 shadow-md' : 'border-transparent hover:border-muted shadow-none bg-muted/20'}`}>
                            {/* Section Header Bar */}
                            <div className={`px-4 py-3 flex items-center justify-between cursor-pointer select-none ${isExpanded ? 'bg-primary/5 border-b border-primary/10' : 'bg-transparent'}`} 
                                 onClick={() => {
                                   setActiveSectionId(section.id);
                                   toggleSectionExpansion(section.id);
                                 }}>
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Badge variant="outline" className="uppercase text-[10px] bg-background font-black tracking-widest px-2 py-0.5 border-primary/20 text-primary">
                                  {section.section_type}
                                </Badge>
                                <span className="font-bold text-xs truncate max-w-[120px]">
                                  {section.content.title || 'Untitled'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                  <MoveUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                  <MoveDown className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSection(section.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Section Editor Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <CardContent className="p-4 bg-muted/5">
                                    <div className="grid grid-cols-1 gap-4">
                                      {/* Common Logic Based on Type */}
                                      {section.section_type === 'hero' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Catchy Headline</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} placeholder="e.g. Master Your Future" />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Sub-description</Label>
                                            <Textarea className="h-20 text-sm" value={section.content.description || ''} onChange={e => updateSectionContent(section.id, 'description', e.target.value)} />
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1.5">
                                              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Primary Button</Label>
                                              <Input className="h-8 text-sm" value={section.content.buttonText || ''} onChange={e => updateSectionContent(section.id, 'buttonText', e.target.value)} placeholder="Btn Label" />
                                            </div>
                                            <div className="space-y-1.5">
                                              <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Secondary Button</Label>
                                              <Input className="h-8 text-sm" value={section.content.secondaryButtonText || ''} onChange={e => updateSectionContent(section.id, 'secondaryButtonText', e.target.value)} placeholder="Btn Label" />
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'content' && (
                                        <div className="space-y-1.5">
                                          <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">HTML / Markdown Content</Label>
                                          <Textarea value={section.content.body || ''} onChange={e => updateSectionContent(section.id, 'body', e.target.value)} className="min-h-[200px] font-mono text-xs leading-relaxed" />
                                        </div>
                                      )}

                                      {section.section_type === 'features' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Subtitle</Label>
                                            <Input className="h-8 text-sm" value={section.content.subtitle || ''} onChange={e => updateSectionContent(section.id, 'subtitle', e.target.value)} />
                                          </div>
                                          <div className="space-y-3 mt-2">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Feature Items</Label>
                                               <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => addArrayItem(section.id, 'features', { title: '', description: '' })}>
                                                 <Plus className="w-3 h-3 mr-1" /> Add
                                               </Button>
                                            </div>
                                            {(section.content.features || []).map((feature: any, fIdx: number) => (
                                              <div key={fIdx} className="p-3 bg-background rounded-lg relative group/item border shadow-sm">
                                                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm" onClick={() => removeArrayItem(section.id, 'features', fIdx)}>
                                                  <X className="w-3 h-3" />
                                                </Button>
                                                <div className="space-y-2">
                                                  <Input className="h-7 text-xs font-bold" value={feature.title || ''} onChange={e => handleArrayItemUpdate(section.id, 'features', fIdx, 'title', e.target.value)} placeholder="Title" />
                                                  <Input className="h-7 text-xs" value={feature.description || ''} onChange={e => handleArrayItemUpdate(section.id, 'features', fIdx, 'description', e.target.value)} placeholder="Description" />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'faq' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-3 mt-2">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Questions</Label>
                                               <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => addArrayItem(section.id, 'faqs', { question: '', answer: '' })}>
                                                 <Plus className="w-3 h-3 mr-1" /> Add FAQ
                                               </Button>
                                            </div>
                                            {(section.content.faqs || []).map((faq: any, fIdx: number) => (
                                              <div key={fIdx} className="space-y-2 p-3 bg-background rounded-lg border shadow-sm relative group/item">
                                                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm" onClick={() => removeArrayItem(section.id, 'faqs', fIdx)}>
                                                  <X className="w-3 h-3" />
                                                </Button>
                                                <Input className="h-7 text-xs font-bold" value={faq.question || ''} onChange={e => handleArrayItemUpdate(section.id, 'faqs', fIdx, 'question', e.target.value)} placeholder="Question" />
                                                <Textarea className="h-16 text-xs" value={faq.answer || ''} onChange={e => handleArrayItemUpdate(section.id, 'faqs', fIdx, 'answer', e.target.value)} placeholder="Answer" />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                       {section.section_type === 'cta' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">CTA Headline</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Contextual Text</Label>
                                            <Input className="h-8 text-sm" value={section.content.description || ''} onChange={e => updateSectionContent(section.id, 'description', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Button label</Label>
                                            <Input className="h-8 text-sm" value={section.content.buttonText || ''} onChange={e => updateSectionContent(section.id, 'buttonText', e.target.value)} />
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'stats' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Subtitle</Label>
                                            <Input className="h-8 text-sm" value={section.content.subtitle || ''} onChange={e => updateSectionContent(section.id, 'subtitle', e.target.value)} />
                                          </div>
                                          <div className="space-y-3 mt-2">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Stats</Label>
                                               <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => addArrayItem(section.id, 'stats', { value: '0', label: 'Metric', icon: 'trending' })}>
                                                 <Plus className="w-3 h-3 mr-1" /> Add Stat
                                               </Button>
                                            </div>
                                            {(section.content.stats || []).map((stat: any, sIdx: number) => (
                                              <div key={sIdx} className="p-3 bg-background rounded-lg border shadow-sm relative group/item space-y-2">
                                                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm" onClick={() => removeArrayItem(section.id, 'stats', sIdx)}>
                                                  <X className="w-3 h-3" />
                                                </Button>
                                                <Input className="h-7 text-sm font-black" value={stat.value || ''} onChange={e => handleArrayItemUpdate(section.id, 'stats', sIdx, 'value', e.target.value)} placeholder="e.g. 5,000+" />
                                                <Input className="h-7 text-xs" value={stat.label || ''} onChange={e => handleArrayItemUpdate(section.id, 'stats', sIdx, 'label', e.target.value)} placeholder="Label" />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'team' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Subtitle</Label>
                                            <Input className="h-8 text-sm" value={section.content.subtitle || ''} onChange={e => updateSectionContent(section.id, 'subtitle', e.target.value)} />
                                          </div>
                                          <div className="space-y-3 mt-2">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Members</Label>
                                               <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => addArrayItem(section.id, 'members', { name: '', role: '', bio: '', avatar: '' })}>
                                                 <Plus className="w-3 h-3 mr-1" /> Add Member
                                               </Button>
                                            </div>
                                            {(section.content.members || []).map((m: any, mIdx: number) => (
                                              <div key={mIdx} className="p-3 bg-background rounded-lg border shadow-sm relative group/item space-y-2">
                                                <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm" onClick={() => removeArrayItem(section.id, 'members', mIdx)}>
                                                  <X className="w-3 h-3" />
                                                </Button>
                                                <Input className="h-7 text-xs font-bold" value={m.name || ''} onChange={e => handleArrayItemUpdate(section.id, 'members', mIdx, 'name', e.target.value)} placeholder="Full Name" />
                                                <Input className="h-7 text-xs" value={m.role || ''} onChange={e => handleArrayItemUpdate(section.id, 'members', mIdx, 'role', e.target.value)} placeholder="Role / Title" />
                                                <Input className="h-7 text-xs text-muted-foreground" value={m.avatar || ''} onChange={e => handleArrayItemUpdate(section.id, 'members', mIdx, 'avatar', e.target.value)} placeholder="Avatar URL (optional)" />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'banner' && (
                                        <>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Badge Label</Label>
                                            <Input className="h-8 text-sm" value={section.content.badge || ''} onChange={e => updateSectionContent(section.id, 'badge', e.target.value)} placeholder="e.g. New, Limited" />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Headline</Label>
                                            <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Description</Label>
                                            <Input className="h-8 text-sm" value={section.content.description || ''} onChange={e => updateSectionContent(section.id, 'description', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Button Label</Label>
                                            <Input className="h-8 text-sm" value={section.content.buttonText || ''} onChange={e => updateSectionContent(section.id, 'buttonText', e.target.value)} />
                                          </div>
                                          <div className="space-y-1.5">
                                            <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Background (CSS gradient or hex)</Label>
                                            <Input className="h-8 text-xs font-mono" value={section.content.bgColor || ''} onChange={e => updateSectionContent(section.id, 'bgColor', e.target.value)} placeholder="linear-gradient(135deg, #1e40af, #7c3aed)" />
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </CardContent>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                    <DialogContent className="max-w-3xl sm:rounded-[2rem]">
                      <DialogHeader className="pb-4">
                         <DialogTitle className="text-2xl font-black italic">Section Library</DialogTitle>
                         <DialogDescription>Add high-conversion blocks to build your custom page.</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { type: 'hero', icon: Layout, title: 'Hero Banner', desc: 'Main title & CTA' },
                          { type: 'content', icon: Type, title: 'Text Block', desc: 'Article content' },
                          { type: 'features', icon: CheckSquare, title: 'Features Grid', desc: 'Value propositions' },
                          { type: 'testimonials', icon: MessageSquare, title: 'User Reviews', desc: 'Social proof' },
                          { type: 'faq', icon: HelpCircle, title: 'FAQ Accordion', desc: 'Common questions' },
                          { type: 'cta', icon: MousePointer2, title: 'Action Bridge', desc: 'Closing conversion' },
                          { type: 'stats', icon: Layout, title: 'Stats Counter', desc: 'Impact numbers' },
                          { type: 'team', icon: MessageSquare, title: 'Team Grid', desc: 'Team members' },
                          { type: 'banner', icon: AlertCircle, title: 'Promo Banner', desc: 'Announcement strip' },
                        ].map(item => (
                          <div 
                            key={item.type} 
                            className="bg-muted/30 p-6 rounded-3xl border-2 border-transparent hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group"
                            onClick={() => addSection(item.type as any)}
                          >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                              <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Right Panel: Live Visual Canvas */}
                <div className="w-full lg:w-2/3 bg-muted/10 rounded-2xl border-2 border-border shadow-inner overflow-y-auto relative h-full">
                  <div className="sticky top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b z-50 p-2 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground ml-2">
                       <Eye className="w-4 h-4" /> Live Visual Canvas
                     </div>
                     <Badge variant="secondary" className="text-[10px]">Updating Real-Time</Badge>
                  </div>
                  
                  <div className="min-h-full pb-32">
                    {sections.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full pt-32 text-muted-foreground opacity-50">
                        <Layout className="w-16 h-16 mb-4" />
                        <p>Canvas is empty.</p>
                      </div>
                    ) : (
                      sections.map((section) => (
                        <div 
                          key={section.id} 
                          className={`relative group/canvas border-2 transition-all cursor-pointer ${activeSectionId === section.id ? 'border-primary ring-4 ring-primary/10 z-10' : 'border-transparent hover:border-primary/50'}`}
                          onClick={() => setActiveSectionId(section.id)}
                        >
                          {/* Active Indicator */}
                          {activeSectionId === section.id && (
                            <div className="absolute top-2 right-2 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider">
                              Editing {section.section_type}
                            </div>
                          )}
                          
                          {/* Hover Overlay */}
                          <div className={`absolute inset-0 bg-primary/5 opacity-0 group-hover/canvas:opacity-100 transition-opacity z-10 pointer-events-none ${activeSectionId === section.id ? 'hidden' : ''}`} />
                          
                          <div className="relative z-0 pointer-events-none">
                            {section.section_type === 'hero' && <HeroSection content={section.content} />}
                            {section.section_type === 'content' && <ContentSection content={section.content} />}
                            {section.section_type === 'features' && <FeaturesSection content={section.content} />}
                            {section.section_type === 'testimonials' && <TestimonialsSection content={section.content} />}
                            {section.section_type === 'faq' && <FAQSection content={section.content} />}
                            {section.section_type === 'cta' && <CTASection content={section.content} />}
                            {section.section_type === 'stats' && <StatsSection content={section.content} />}
                            {section.section_type === 'team' && <TeamSection content={section.content} />}
                            {section.section_type === 'banner' && <BannerSection content={section.content} />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-3xl shadow-sm border-border">
                    <CardHeader><CardTitle>Search Optimization (SEO)</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Internal Title</Label>
                          <Input value={page?.title || ''} onChange={e => setPage(p => p ? { ...p, title: e.target.value } : null)} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">URL Slug</Label>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-mono text-muted-foreground">{page?.page_type === 'static' ? '/' : '/p/'}</span>
                            <Input value={page?.slug || ''} onChange={e => setPage(p => p ? { ...p, slug: e.target.value } : null)} className="font-mono text-sm" />
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Meta Title (Browser Tab)</Label>
                          <Input value={page?.meta_title || ''} onChange={e => setPage(p => p ? { ...p, meta_title: e.target.value } : null)} placeholder={page?.title} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Meta Description</Label>
                          <Textarea value={page?.meta_description || ''} onChange={e => setPage(p => p ? { ...p, meta_description: e.target.value } : null)} placeholder="Brief summary of the page..." className="h-24" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 py-3 text-[10px] text-muted-foreground">
                       Created {page ? new Date(page.created_at).toLocaleString() : 'N/A'}
                    </CardFooter>
                  </Card>
               </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
