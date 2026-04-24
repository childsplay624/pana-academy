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
  }
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

          {/* Dynamic Pages Section Builder */}
          {page?.page_type !== 'static' && (
            <TabsContent value="sections" className="mt-0">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  {sections.length === 0 ? (
                    <div className="border-4 border-dashed rounded-[2rem] p-24 text-center group hover:bg-muted/20 hover:border-primary/20 transition-all duration-500 cursor-pointer" onClick={() => setIsAddSectionOpen(true)}>
                      <div className="w-20 h-20 bg-muted group-hover:bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-colors">
                        <Plus className="w-10 h-10 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Build your page</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">Start by adding a Hero section to welcome your visitors.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section, index) => {
                        const isExpanded = expandedSections[section.id];
                        return (
                          <Card key={section.id} className={`group overflow-hidden border-2 transition-all duration-300 ${isExpanded ? 'border-border shadow-md' : 'border-transparent hover:border-muted shadow-none bg-muted/20'}`}>
                            {/* Section Header Bar */}
                            <div className="px-5 py-3 flex items-center justify-between bg-muted/40 border-b select-none">
                              <div className="flex items-center gap-4 flex-grow cursor-pointer" onClick={() => toggleSectionExpansion(section.id)}>
                                <div className="flex items-center gap-2">
                                  <GripVertical className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="uppercase text-[10px] bg-background font-black tracking-widest px-2 py-0.5 border-primary/20 text-primary">
                                    {section.section_type}
                                  </Badge>
                                  <span className="font-bold text-sm truncate max-w-[200px]">
                                    {section.content.title || (section.section_type === 'content' ? 'Text Block' : 'Section Untitled')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                  <MoveUp className="w-3.5 h-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                  <MoveDown className="w-3.5 h-3.5" />
                                </Button>
                                <Separator orientation="vertical" className="h-4 mx-2" />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteSection(section.id)}>
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Section Editor Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <CardContent className="p-6">
                                    <div className="grid grid-cols-1 gap-6">
                                      {/* Common Logic Based on Type */}
                                      {section.section_type === 'hero' && (
                                        <>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Catchy Headline</Label>
                                            <Input value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} placeholder="e.g. Master Your Future" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Sub-description</Label>
                                            <Textarea value={section.content.description || ''} onChange={e => updateSectionContent(section.id, 'description', e.target.value)} className="h-24" />
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Primary Button</Label>
                                              <Input value={section.content.buttonText || ''} onChange={e => updateSectionContent(section.id, 'buttonText', e.target.value)} placeholder="Btn Label" />
                                            </div>
                                            <div className="space-y-2">
                                              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Secondary Button</Label>
                                              <Input value={section.content.secondaryButtonText || ''} onChange={e => updateSectionContent(section.id, 'secondaryButtonText', e.target.value)} placeholder="Btn Label" />
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'content' && (
                                        <div className="space-y-2">
                                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">HTML / Markdown Content</Label>
                                          <Textarea value={section.content.body || ''} onChange={e => updateSectionContent(section.id, 'body', e.target.value)} className="min-h-[300px] font-mono text-sm leading-relaxed" />
                                        </div>
                                      )}

                                      {section.section_type === 'features' && (
                                        <>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                              <Input value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Section Subtitle</Label>
                                              <Input value={section.content.subtitle || ''} onChange={e => updateSectionContent(section.id, 'subtitle', e.target.value)} />
                                            </div>
                                          </div>
                                          <Separator />
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-sm font-bold italic">Feature Items</Label>
                                               <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id, 'features', { title: '', description: '' })}>
                                                 <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
                                               </Button>
                                            </div>
                                            {(section.content.features || []).map((feature: any, fIdx: number) => (
                                              <div key={fIdx} className="p-4 bg-muted/30 rounded-xl relative group/item border border-transparent hover:border-primary/20 transition-all">
                                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/item:opacity-100" onClick={() => removeArrayItem(section.id, 'features', fIdx)}>
                                                  <X className="w-3 h-3" />
                                                </Button>
                                                <div className="grid grid-cols-1 gap-3">
                                                  <Input value={feature.title || ''} onChange={e => handleArrayItemUpdate(section.id, 'features', fIdx, 'title', e.target.value)} placeholder="Feature Title" className="bg-background font-bold text-sm" />
                                                  <Input value={feature.description || ''} onChange={e => handleArrayItemUpdate(section.id, 'features', fIdx, 'description', e.target.value)} placeholder="Brief description" className="bg-background text-xs" />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                      {section.section_type === 'faq' && (
                                        <>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                            <Input value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <Separator />
                                          <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                               <Label className="text-sm font-bold italic">Questions & Answers</Label>
                                               <Button variant="outline" size="sm" onClick={() => addArrayItem(section.id, 'faqs', { question: '', answer: '' })}>
                                                 <Plus className="w-3.5 h-3.5 mr-1" /> Add FAQ
                                               </Button>
                                            </div>
                                            {(section.content.faqs || []).map((faq: any, fIdx: number) => (
                                              <div key={fIdx} className="space-y-3 p-4 bg-muted/20 rounded-xl border border-border">
                                                <div className="flex justify-between gap-4">
                                                  <Input value={faq.question || ''} onChange={e => handleArrayItemUpdate(section.id, 'faqs', fIdx, 'question', e.target.value)} placeholder="The Question" className="bg-background font-bold" />
                                                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive" onClick={() => removeArrayItem(section.id, 'faqs', fIdx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                                <Textarea value={faq.answer || ''} onChange={e => handleArrayItemUpdate(section.id, 'faqs', fIdx, 'answer', e.target.value)} placeholder="The Answer" className="bg-background h-20 text-sm" />
                                              </div>
                                            ))}
                                          </div>
                                        </>
                                      )}

                                       {section.section_type === 'cta' && (
                                        <>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">CTA Headline</Label>
                                            <Input value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Contextual Text</Label>
                                            <Input value={section.content.description || ''} onChange={e => updateSectionContent(section.id, 'description', e.target.value)} />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Button label</Label>
                                            <Input value={section.content.buttonText || ''} onChange={e => updateSectionContent(section.id, 'buttonText', e.target.value)} />
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
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-2 border-dashed h-24 rounded-3xl bg-muted/10 hover:bg-primary/5 hover:border-primary/30 transition-all group">
                         <div className="flex flex-col items-center">
                            <Plus className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="font-bold text-muted-foreground group-hover:text-primary">Insert New Page Section</span>
                         </div>
                      </Button>
                    </DialogTrigger>
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
                          { type: 'cta', icon: MousePointer2, title: 'Action Bridge', desc: 'Closing conversion' }
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

                {/* Sidebar Controls */}
                <div className="space-y-6">
                  <Card className="rounded-3xl shadow-sm border-border overflow-hidden">
                    <CardHeader className="bg-muted/30 py-4"><CardTitle className="text-xs font-black uppercase tracking-widest italic">Visibility</CardTitle></CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="d-nav" className="text-sm font-medium">Show in Navbar</Label>
                          <Switch id="d-nav" checked={page?.show_in_navbar} onCheckedChange={v => setPage(p => p ? { ...p, show_in_navbar: v } : null)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="d-footer" className="text-sm font-medium">Show in Footer</Label>
                          <Switch id="d-footer" checked={page?.show_in_footer} onCheckedChange={v => setPage(p => p ? { ...p, show_in_footer: v } : null)} />
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">Publish Status</Label>
                        <Select value={page?.status} onValueChange={(v: any) => setPage(p => p ? { ...p, status: v } : null)}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                   <Card className="rounded-3xl shadow-sm border-border overflow-hidden bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary rounded-xl text-white"><Eye className="w-5 h-5" /></div>
                        <h4 className="font-bold">Live Preview</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Changes are saved to draft locally. Click "Sync Changes" to update the live production page.</p>
                      <Button variant="outline" className="w-full bg-background font-bold" onClick={() => window.open(`/p/${page?.slug}`, '_blank')}>
                        Open Page <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
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
