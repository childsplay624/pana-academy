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
  CheckSquare, MessageSquare, HelpCircle, X, ChevronDown, ChevronUp, ChevronRight, Loader2, TrendingUp
} from 'lucide-react';
import { pageService, Page, PageSection, getPageUrl } from '@/services/pageService';
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
  DialogFooter,
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
import { ImagePicker } from '@/components/admin/ImagePicker';

export interface StaticFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'image';
}

// Maps a static page slug to its editable content field definitions
const STATIC_PAGE_FIELDS: Record<string, StaticFieldDef[]> = {
  'about': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'title', label: 'Page Title (Browser Tab)', type: 'text' },
    { key: 'meta_description', label: 'Meta Description (SEO)', type: 'textarea' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'who_we_are_badge', label: 'Who We Are Badge', type: 'text' },
    { key: 'who_we_are_title', label: 'Who We Are Title', type: 'text' },
    { key: 'who_we_are_description', label: 'Who We Are Description', type: 'textarea' },
    { key: 'vision_body', label: 'Vision Body Text', type: 'textarea' },
    { key: 'mission_body', label: 'Mission Body Text', type: 'textarea' },
    { key: 'purpose_body', label: 'Purpose Body Text', type: 'textarea' },
    { key: 'programmes_button_text', label: 'Programmes Button Label', type: 'text' },
    { key: 'mandates_title', label: 'Core Mandates Title', type: 'text' },
    { key: 'highlights_title', label: 'Highlights Section Title', type: 'text' },
    { key: 'highlights_subtitle', label: 'Highlights Section Subtitle', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_text', label: 'CTA Button Label', type: 'text' },
  ],
  'training-delivery': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'section_badge', label: 'Programmes Section Badge', type: 'text' },
    { key: 'section_title', label: 'Programmes Section Title', type: 'text' },
    { key: 'section_description', label: 'Programmes Section Description', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Section Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Section Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'contact': [
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Page Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Page Tagline / Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Page Introduction Text', type: 'textarea' },
    { key: 'offices_badge', label: 'Offices Section Badge', type: 'text' },
    { key: 'offices_heading', label: 'Offices Section Heading', type: 'text' },
    { key: 'address_ph', label: 'Port Harcourt Centre of Excellence Address', type: 'textarea' },
    { key: 'phone_ph', label: 'Port Harcourt Phone', type: 'text' },
    { key: 'address_abuja', label: 'Abuja Office Address', type: 'textarea' },
    { key: 'phone_abuja', label: 'Abuja Phone', type: 'text' },
    { key: 'address_kampala', label: 'Kampala Office Address', type: 'textarea' },
    { key: 'address_dubai', label: 'Dubai Office Address', type: 'textarea' },
    { key: 'email', label: 'Central Direct Contact Email', type: 'text' },
    { key: 'map_url', label: 'Google Maps Embed URL', type: 'url' },
  ],
  'careers': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle (Highlight text)', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'hero_button_text', label: 'Hero Button Label', type: 'text' },
    { key: 'register_title', label: 'Registration Section Title', type: 'text' },
    { key: 'register_description', label: 'Registration Section Description', type: 'textarea' },
    { key: 'register_instructions', label: 'Registration Instructions Text', type: 'textarea' },
    { key: 'register_email', label: 'Recruitment Email Address', type: 'text' },
    { key: 'cta_title', label: 'CTA Section Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_text', label: 'CTA Button Label', type: 'text' },
    { key: 'cta_button_link', label: 'CTA Button Link URL', type: 'url' },
  ],
  'consulting-services': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'button_deliver_text', label: 'Hero Button 1 Label', type: 'text' },
    { key: 'button_work_text', label: 'Hero Button 2 Label', type: 'text' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'rnd-services': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'button_centres_text', label: 'Hero Button Label', type: 'text' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'sustainability-solutions': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'global-engagements': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'safety': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_1_text', label: 'CTA Primary Button Label', type: 'text' },
    { key: 'cta_button_2_text', label: 'CTA Secondary Button Label', type: 'text' },
  ],
  'our-journey': [
    { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
  ],
  'training-calendar': [
    { key: 'header_image', label: 'Header Banner Background Image', type: 'image' },
    { key: 'hero_title', label: 'Page Hero Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle & Description', type: 'textarea' },
    { key: 'section_heading', label: 'Calendar Section Heading', type: 'text' },
    { key: 'section_subheading', label: 'Calendar Subheading / Instructions', type: 'text' },
  ],
  'testimonials': [
    { key: 'header_image', label: 'Header Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Main Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle Description', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_text', label: 'CTA Button Label', type: 'text' },
  ],
  'our-institute': [
    { key: 'header_image', label: 'Header Background Image', type: 'image' },
    { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
    { key: 'hero_title', label: 'Hero Main Title', type: 'text' },
    { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'charter_title', label: 'Charter Section Title', type: 'text' },
    { key: 'charter_body', label: 'Charter Section Body', type: 'textarea' },
    { key: 'cta_title', label: 'CTA Title', type: 'text' },
    { key: 'cta_subtitle', label: 'CTA Subtitle', type: 'textarea' },
    { key: 'cta_button_text', label: 'CTA Button Label', type: 'text' },
  ],
};

const DEFAULT_STATIC_FIELDS: StaticFieldDef[] = [
  { key: 'header_image', label: 'Header Hero Background Image', type: 'image' },
  { key: 'hero_badge', label: 'Hero Badge Text', type: 'text' },
  { key: 'hero_title', label: 'Page Hero Title', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Subtitle / Tagline', type: 'text' },
  { key: 'hero_description', label: 'Main Introduction / Description', type: 'textarea' },
  { key: 'main_content', label: 'Body Content (Text / HTML)', type: 'textarea' },
  { key: 'cta_title', label: 'Call To Action Title', type: 'text' },
  { key: 'cta_button', label: 'Call To Action Button Label', type: 'text' },
];

const SECTION_TEMPLATES = {
  hero: { 
    badge: 'Welcome to PANA Institute',
    title: 'Master Your Future with World-Class Skills', 
    description: 'Empowering professionals and organizations through practical, competency-based training.', 
    buttonText: 'Explore Programs',
    secondaryButtonText: 'Contact Us',
    bgImage: '',
    overlayOpacity: 50,
  },
  content: { 
    body: '<h2>Empowering Excellence</h2><p>Our practical training methodologies bridge theoretical knowledge and hands-on skills.</p>',
    imageUrl: '',
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
    badge: 'New Cohort',
    title: 'Upcoming Training Programme',
    description: 'Register now to secure your spot in our next cohort.',
    buttonText: 'Register Now',
    bgColor: 'linear-gradient(135deg, #1e40af, #7c3aed)',
    bgImage: '',
  },
  dynamic_hero: {},
  dynamic_stats: {},
  dynamic_how_it_works: {},
  dynamic_categories: {},
  dynamic_features: {},
  dynamic_top_courses: {},
  dynamic_upcoming_courses: {},
  dynamic_news: {},
  dynamic_testimonials: {},
};

export default function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [staticContent, setStaticContent] = useState<Record<string, string>>({});
  const [customFields, setCustomFields] = useState<StaticFieldDef[]>([]);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newFieldData, setNewFieldData] = useState<{ key: string; label: string; type: 'text' | 'textarea' | 'image' | 'url' }>({
    key: '',
    label: '',
    type: 'text'
  });
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

      const content = await pageService.getPageContent(data.slug);
      setStaticContent(content || {});

      // Auto-discover any custom keys stored in database that aren't in predefined schemas
      const baseFields = STATIC_PAGE_FIELDS[data.slug] || DEFAULT_STATIC_FIELDS;
      const baseKeys = new Set(baseFields.map(f => f.key));
      const extraFields: StaticFieldDef[] = Object.keys(content || {})
        .filter(k => !baseKeys.has(k))
        .map(k => ({
          key: k,
          label: k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: k.includes('image') ? 'image' : (k.includes('body') || k.includes('content') || k.includes('description') ? 'textarea' : 'text')
        }));
      setCustomFields(extraFields);
      
      const sectionData = await pageService.getPageSections(data.id);
      setSections(sectionData || []);
      
      const initialExpanded: Record<string, boolean> = {};
      (sectionData || []).forEach(s => initialExpanded[s.id] = true);
      setExpandedSections(initialExpanded);
    } catch (error) {
      console.error('Error fetching page:', error);
      toast({ title: 'Error', description: 'Failed to load page data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomField = () => {
    if (!newFieldData.key.trim()) return;
    const cleanKey = newFieldData.key.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const newDef: StaticFieldDef = {
      key: cleanKey,
      label: newFieldData.label.trim() || cleanKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: newFieldData.type
    };
    setCustomFields(prev => [...prev.filter(f => f.key !== cleanKey), newDef]);
    setIsAddFieldOpen(false);
    setNewFieldData({ key: '', label: '', type: 'text' });
    toast({ title: 'Field Added', description: `Added custom field: ${newDef.label}` });
  };

  const handleRemoveCustomField = (key: string) => {
    setCustomFields(prev => prev.filter(f => f.key !== key));
    setStaticContent(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSave = async () => {
    if (!page) return;
    try {
      setSaving(true);
      await pageService.updatePage(page.id, page);

      if (page.page_type === 'static') {
        await pageService.savePageContent(page.slug, staticContent);
      }
      
      const updatedSections = sections.map((s, idx) => ({ ...s, order_index: idx }));
      await pageService.saveSections(page.id, updatedSections);

      toast({ title: 'Saved!', description: 'All changes have been synced to the database.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save page', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: string) => {
    const template = (SECTION_TEMPLATES as Record<string, any>)[type] || {};
    const newId = crypto.randomUUID();
    const newSection: any = {
      id: newId,
      page_id: page?.id || '',
      section_type: type,
      content: JSON.parse(JSON.stringify(template)),
      order_index: sections.length,
      is_active: true
    };
    setSections(prev => [...prev, newSection]);
    setExpandedSections(prev => ({ ...prev, [newId]: true }));
    setIsAddSectionOpen(false);
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
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

  if (!page) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
          <p className="text-lg font-semibold text-muted-foreground">The requested page could not be found or loaded.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard/pages')}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Pages
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
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
                  {page?.page_type === 'static' ? '⚡ Static Content' : '🧩 Dynamic Modular'}
                </Badge>
                <code className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-mono">
                  {getPageUrl(page)}
                </code>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:flex" onClick={() => window.open(getPageUrl(page), '_blank')}>
              <Eye className="w-4 h-4 mr-2" /> Preview Live
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
              {page?.page_type === 'static' && (
                <TabsTrigger value="content" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 h-auto text-sm font-bold uppercase tracking-wider">
                  Content Fields
                </TabsTrigger>
              )}
              <TabsTrigger value="sections" className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-2 h-auto text-sm font-bold uppercase tracking-wider">
                Page Outline (Sections)
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
                        <p className="text-sm text-blue-700/80">
                          Edit headers, text blocks, banners, and media overrides. You can also append dynamic modular blocks in the &ldquo;Page Outline (Sections)&rdquo; tab.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <div>
                        <CardTitle className="text-lg">Editable Content & Media</CardTitle>
                        <CardDescription>Configure copy, hero imagery, and custom data blocks</CardDescription>
                      </div>
                      <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Custom Field
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Custom Content Field</DialogTitle>
                            <DialogDescription>Define a new editable field key for this page.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold">Field Key (database identifier)</Label>
                              <Input
                                placeholder="e.g. director_quote or notice_banner"
                                value={newFieldData.key}
                                onChange={e => setNewFieldData(p => ({ ...p, key: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold">Display Label</Label>
                              <Input
                                placeholder="e.g. Director's Quote"
                                value={newFieldData.label}
                                onChange={e => setNewFieldData(p => ({ ...p, label: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold">Field Type</Label>
                              <Select
                                value={newFieldData.type}
                                onValueChange={(v: any) => setNewFieldData(p => ({ ...p, type: v }))}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Single Line Text</SelectItem>
                                  <SelectItem value="textarea">Multi-line Paragraph / HTML</SelectItem>
                                  <SelectItem value="image">Image Asset Picker</SelectItem>
                                  <SelectItem value="url">External Link URL</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddFieldOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddCustomField}>Add Field</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        ...(page ? (STATIC_PAGE_FIELDS[page.slug] || DEFAULT_STATIC_FIELDS) : DEFAULT_STATIC_FIELDS),
                        ...customFields
                      ].map(field => {
                        const isCustom = customFields.some(cf => cf.key === field.key);
                        return (
                          <div key={field.key} className="space-y-2 p-3 rounded-xl bg-card border border-border/40 relative group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Label className="text-xs font-bold text-foreground uppercase tracking-wide">{field.label}</Label>
                                <code className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                  {field.key}
                                </code>
                              </div>
                              {isCustom && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleRemoveCustomField(field.key)}
                                  title="Remove custom field"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                            {field.type === 'image' ? (
                              <ImagePicker 
                                value={staticContent[field.key] || ''} 
                                onSelect={url => setStaticContent(p => ({ ...p, [field.key]: url }))}
                                label={`Select ${field.label}`}
                              />
                            ) : field.type === 'textarea' ? (
                              <Textarea 
                                value={staticContent[field.key] || ''} 
                                onChange={e => setStaticContent(p => ({ ...p, [field.key]: e.target.value }))}
                                className="min-h-[120px] focus-visible:ring-primary text-sm leading-relaxed"
                              />
                            ) : (
                              <Input 
                                value={staticContent[field.key] || ''} 
                                onChange={e => setStaticContent(p => ({ ...p, [field.key]: e.target.value }))}
                                className="focus-visible:ring-primary text-sm"
                              />
                            )}
                          </div>
                        );
                      })}
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
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* Section Builder Tab (Available for All Pages) */}
          <TabsContent value="sections" className="mt-0 w-full">
             <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-190px)] w-full">
                
                {/* Left Panel: Sidebar Controls (Inspector) */}
                <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar border-r border-border/50 bg-background/50 backdrop-blur-sm z-20 shadow-xl lg:shadow-none h-full pb-10">
                  
                  {!activeSectionId ? (
                    // OUTLINE MODE
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <div>
                          <h3 className="font-black text-lg tracking-tight">Page Sections</h3>
                          <p className="text-xs text-muted-foreground">Reorder or add new blocks</p>
                        </div>
                        <Button variant="default" size="sm" className="h-9 shadow-md hover:scale-105 transition-transform" onClick={() => setIsAddSectionOpen(true)}>
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                      </div>

                      {sections.length === 0 ? (
                        <div className="text-center p-8 bg-muted/20 rounded-2xl border-2 border-dashed mx-2">
                          <Layout className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-4">No sections added yet.</p>
                          <Button onClick={() => setIsAddSectionOpen(true)} variant="outline">Browse Library</Button>
                        </div>
                      ) : (
                        <div className="space-y-2 px-2">
                          {sections.map((section, index) => (
                            <div 
                              key={section.id} 
                              className="group flex items-center justify-between bg-card hover:bg-primary/5 border border-border/50 hover:border-primary/30 p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                              onClick={() => setActiveSectionId(section.id)}
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 cursor-grab active:cursor-grabbing flex-shrink-0" />
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Layout className="w-4 h-4 text-primary" />
                                </div>
                                <div className="truncate">
                                  <h4 className="font-bold text-sm truncate">{section.content.title || section.section_type.replace(/_/g, ' ')}</h4>
                                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider mt-0.5">{section.section_type}</Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                  <MoveUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                  <MoveDown className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => deleteSection(section.id)}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // INSPECTOR MODE
                    <div className="space-y-6 pt-2 px-2 pb-10">
                      {(() => {
                        const section = sections.find(s => s.id === activeSectionId);
                        if (!section) return null;
                        
                        return (
                          <AnimatePresence mode="wait">
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }} 
                              animate={{ opacity: 1, x: 0 }} 
                              exit={{ opacity: 0, x: -20 }}
                              key={section.id}
                            >
                              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted shrink-0" onClick={() => setActiveSectionId(null)}>
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="truncate">
                                  <h3 className="font-bold text-lg capitalize truncate">{section.section_type.replace(/_/g, ' ')}</h3>
                                  <p className="text-xs text-muted-foreground">Editing section properties</p>
                                </div>
                              </div>

                              <CardContent className="p-0 border-none shadow-none bg-transparent">
                                <div className="grid grid-cols-1 gap-4">
                                       {/* Common Logic Based on Type */}
                                       {section.section_type === 'hero' && (
                                         <>
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hero Background Image</Label>
                                             <ImagePicker 
                                               value={section.content.bgImage || ''} 
                                               onSelect={url => updateSectionContent(section.id, 'bgImage', url)}
                                               label="Select Background Image"
                                             />
                                           </div>
                                           {section.content.bgImage && (
                                             <div className="space-y-1.5">
                                               <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Overlay Dark Opacity ({section.content.overlayOpacity ?? 50}%)</Label>
                                               <Input type="range" min="0" max="90" step="5" value={section.content.overlayOpacity ?? 50} onChange={e => updateSectionContent(section.id, 'overlayOpacity', Number(e.target.value))} />
                                             </div>
                                           )}
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Badge Text (Optional)</Label>
                                             <Input className="h-8 text-sm" value={section.content.badge || ''} onChange={e => updateSectionContent(section.id, 'badge', e.target.value)} placeholder="e.g. Africa's Leading Hub" />
                                           </div>
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
                                         <>
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Visual Image (Optional)</Label>
                                             <ImagePicker 
                                               value={section.content.imageUrl || ''} 
                                               onSelect={url => updateSectionContent(section.id, 'imageUrl', url)}
                                               label="Select Section Image"
                                             />
                                           </div>
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">HTML / Formatted Content</Label>
                                             <Textarea value={section.content.body || ''} onChange={e => updateSectionContent(section.id, 'body', e.target.value)} className="min-h-[200px] font-mono text-xs leading-relaxed" />
                                           </div>
                                         </>
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

                                       {section.section_type === 'testimonials' && (
                                         <>
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Section Title</Label>
                                             <Input className="h-8 text-sm" value={section.content.title || ''} onChange={e => updateSectionContent(section.id, 'title', e.target.value)} />
                                           </div>
                                           <div className="space-y-3 mt-2">
                                             <div className="flex items-center justify-between">
                                                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Testimonials</Label>
                                                <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => addArrayItem(section.id, 'testimonials', { name: '', role: '', text: '', avatar: '' })}>
                                                  <Plus className="w-3 h-3 mr-1" /> Add
                                                </Button>
                                             </div>
                                             {(section.content.testimonials || []).map((t: any, tIdx: number) => (
                                               <div key={tIdx} className="p-3 bg-background rounded-lg border shadow-sm relative group/item space-y-2">
                                                 <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity shadow-sm" onClick={() => removeArrayItem(section.id, 'testimonials', tIdx)}>
                                                   <X className="w-3 h-3" />
                                                 </Button>
                                                 <Input className="h-7 text-xs font-bold" value={t.name || ''} onChange={e => handleArrayItemUpdate(section.id, 'testimonials', tIdx, 'name', e.target.value)} placeholder="Name" />
                                                 <Input className="h-7 text-xs" value={t.role || ''} onChange={e => handleArrayItemUpdate(section.id, 'testimonials', tIdx, 'role', e.target.value)} placeholder="Role / Organization" />
                                                 <Textarea className="h-16 text-xs" value={t.text || ''} onChange={e => handleArrayItemUpdate(section.id, 'testimonials', tIdx, 'text', e.target.value)} placeholder="Testimonial quote" />
                                                 <div className="space-y-1">
                                                   <Label className="text-[9px] uppercase font-bold text-muted-foreground">Avatar Photo</Label>
                                                   <ImagePicker 
                                                     value={t.avatar || ''} 
                                                     onSelect={url => handleArrayItemUpdate(section.id, 'testimonials', tIdx, 'avatar', url)}
                                                     label="Choose Avatar"
                                                   />
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
                                                 <div className="space-y-1">
                                                   <Label className="text-[9px] uppercase font-bold text-muted-foreground">Member Photo</Label>
                                                   <ImagePicker 
                                                     value={m.avatar || ''} 
                                                     onSelect={url => handleArrayItemUpdate(section.id, 'members', mIdx, 'avatar', url)}
                                                     label="Choose Photo"
                                                   />
                                                 </div>
                                               </div>
                                             ))}
                                           </div>
                                         </>
                                       )}

                                       {section.section_type === 'banner' && (
                                         <>
                                           <div className="space-y-1.5">
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Background Image (Optional)</Label>
                                             <ImagePicker 
                                               value={section.content.bgImage || ''} 
                                               onSelect={url => updateSectionContent(section.id, 'bgImage', url)}
                                               label="Select Background Image"
                                             />
                                           </div>
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
                                             <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Background Color / Gradient (fallback)</Label>
                                             <Input className="h-8 text-xs font-mono" value={section.content.bgColor || ''} onChange={e => updateSectionContent(section.id, 'bgColor', e.target.value)} placeholder="linear-gradient(135deg, #1e40af, #7c3aed)" />
                                           </div>
                                         </>
                                       )}

                                       {section.section_type === 'dynamic_hero' && (
                                         <div className="space-y-4 p-4 bg-card rounded-xl border shadow-sm">
                                           <div className="flex items-center gap-2 text-primary font-bold text-sm">
                                             <Layout className="w-5 h-5" />
                                             <span>Dynamic Homepage Hero Slider</span>
                                           </div>
                                           <p className="text-xs text-muted-foreground leading-relaxed">
                                             This block renders the main animated hero slider with high-resolution background images, videos, headlines, and call-to-actions.
                                           </p>
                                           <div className="pt-2 space-y-2">
                                             <Button 
                                               onClick={() => navigate('/dashboard/images')} 
                                               variant="default" 
                                               size="sm" 
                                               className="w-full justify-start text-xs font-bold shadow-sm"
                                             >
                                               <FileCode className="w-4 h-4 mr-2" />
                                               Manage & Upload Hero Slider Images
                                             </Button>
                                             <p className="text-[10px] text-muted-foreground italic">
                                               Tip: Upload images with category <strong>Hero</strong> to customize slides instantly.
                                             </p>
                                           </div>
                                         </div>
                                       )}

                                       {section.section_type.startsWith('dynamic_') && section.section_type !== 'dynamic_hero' && (
                                         <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-200">
                                           <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                                             <Layout className="w-4 h-4 text-blue-600" />
                                             <span className="capitalize">{section.section_type.replace(/_/g, ' ')}</span>
                                           </div>
                                           <p className="text-xs text-blue-700/80 leading-relaxed">
                                             This component dynamically renders live platform data (courses, stats, testimonials, or news) from your database.
                                           </p>
                                         </div>
                                       )}
                                     </div>
                              </CardContent>
                            </motion.div>
                          </AnimatePresence>
                        );
                      })()}
                    </div>
                  )}

                  <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                    <DialogContent className="max-w-4xl sm:rounded-[2rem] h-[80vh] flex flex-col">
                      <DialogHeader className="pb-2 flex-shrink-0">
                         <DialogTitle className="text-2xl font-black italic">Section Library</DialogTitle>
                         <DialogDescription>Add high-conversion blocks to build your custom page.</DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="basic">Standard Blocks</TabsTrigger>
                            <TabsTrigger value="dynamic">Dynamic Platform Blocks</TabsTrigger>
                          </TabsList>

                          <TabsContent value="basic" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { type: 'hero', title: 'Hero Section', desc: 'Large banner with titles, buttons, and background image' },
                              { type: 'content', title: 'Rich Text Content', desc: 'Formatted HTML body with an optional side image' },
                              { type: 'features', title: 'Feature Grid', desc: 'List of features with icons and descriptions' },
                              { type: 'testimonials', title: 'Testimonial Carousel', desc: 'Grid/Carousel of user feedback and avatars' },
                              { type: 'faq', title: 'FAQ Accordion', desc: 'Frequently asked questions and detailed answers' },
                              { type: 'cta', title: 'Call To Action', desc: 'High-conversion banner with action button' },
                              { type: 'stats', title: 'Impact Metrics', desc: 'Grid of numerical achievements and stats' },
                              { type: 'team', title: 'Team Showcase', desc: 'Grid of team members, roles, and photos' },
                              { type: 'banner', title: 'Promo Banner', desc: 'Eye-catching announcement card with gradient background' },
                            ].map(item => (
                              <Card key={item.type} className="cursor-pointer hover:border-primary transition-all group" onClick={() => addSection(item.type)}>
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base flex items-center justify-between group-hover:text-primary">
                                    {item.title}
                                    <Plus className="w-4 h-4" />
                                  </CardTitle>
                                  <CardDescription className="text-xs">{item.desc}</CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                          </TabsContent>

                          <TabsContent value="dynamic" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { type: 'dynamic_hero', title: 'Dynamic Hero Slider', desc: 'Full-bleed animated slider populated from Media Manager' },
                              { type: 'dynamic_stats', title: 'Live Platform Stats', desc: 'Real-time stats loaded dynamically from database' },
                              { type: 'dynamic_how_it_works', title: 'How It Works', desc: 'Step-by-step training process card' },
                              { type: 'dynamic_categories', title: 'Course Categories', desc: 'Live grid of program categories' },
                              { type: 'dynamic_features', title: 'Platform Pillars', desc: 'Key advantages of PANA Institute' },
                              { type: 'dynamic_top_courses', title: 'Top Featured Courses', desc: 'Live carousel of popular training courses' },
                              { type: 'dynamic_upcoming_courses', title: 'Upcoming Schedules', desc: 'Live list of upcoming training dates' },
                              { type: 'dynamic_news', title: 'Latest Insights', desc: 'Live feed of latest blog posts and news' },
                              { type: 'dynamic_testimonials', title: 'Verified Reviews', desc: 'Live feedback from enrolled students' },
                            ].map(item => (
                              <Card key={item.type} className="cursor-pointer hover:border-primary transition-all group bg-primary/5 border-primary/20" onClick={() => addSection(item.type)}>
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base flex items-center justify-between group-hover:text-primary">
                                    {item.title}
                                    <Plus className="w-4 h-4" />
                                  </CardTitle>
                                  <CardDescription className="text-xs">{item.desc}</CardDescription>
                                </CardHeader>
                              </Card>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Right Panel: Live Visual Canvas */}
                <div className="flex-1 w-full bg-card/30 dark:bg-muted/10 rounded-2xl border-2 border-border shadow-inner overflow-y-auto relative h-full">
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
                            {section.section_type === 'dynamic_hero' && <DynamicHeroSection />}
                            {section.section_type === 'dynamic_stats' && <DynamicStatsSection />}
                            {section.section_type === 'dynamic_how_it_works' && <DynamicHowItWorksSection />}
                            {section.section_type === 'dynamic_categories' && <DynamicCategoriesSection />}
                            {section.section_type === 'dynamic_features' && <DynamicPlatformFeaturesSection />}
                            {section.section_type === 'dynamic_top_courses' && <DynamicTopCoursesSection />}
                            {section.section_type === 'dynamic_upcoming_courses' && <DynamicUpcomingCoursesSection />}
                            {section.section_type === 'dynamic_news' && <DynamicNewsSection />}
                            {section.section_type === 'dynamic_testimonials' && <DynamicTestimonialsSection />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <Card className="rounded-3xl shadow-sm border-border">
                    <CardHeader>
                      <CardTitle>Page Configuration & Architecture</CardTitle>
                      <CardDescription>Manage routing, page model, and search engine optimization</CardDescription>
                    </CardHeader>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Page Architecture</Label>
                          <Select 
                            value={page?.page_type} 
                            onValueChange={(v: 'static' | 'dynamic') => setPage(p => p ? { ...p, page_type: v } : null)}
                          >
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dynamic">🧩 Dynamic Modular (Drag-and-drop sections)</SelectItem>
                              <SelectItem value="static">⚡ Static Page (Custom content keys & template)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[11px] text-muted-foreground">
                            Dynamic pages render at <code>/p/{page?.slug}</code>. Static pages map directly to root routes <code>/{page?.slug}</code>.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Publication Status</Label>
                          <Select 
                            value={page?.status} 
                            onValueChange={(v: any) => setPage(p => p ? { ...p, status: v } : null)}
                          >
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft (Admin preview only)</SelectItem>
                              <SelectItem value="published">Published (Live public access)</SelectItem>
                              <SelectItem value="archived">Archived (Unlisted)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Internal Description / Notes</Label>
                        <Input 
                          value={page?.description || ''} 
                          onChange={e => setPage(p => p ? { ...p, description: e.target.value } : null)} 
                          placeholder="Purpose of this page..." 
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Meta Title (Browser Tab & Google)</Label>
                          <Input value={page?.meta_title || ''} onChange={e => setPage(p => p ? { ...p, meta_title: e.target.value } : null)} placeholder={page?.title ? `${page.title} | PANA Institute` : ''} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Meta Description (SEO snippet)</Label>
                          <Textarea value={page?.meta_description || ''} onChange={e => setPage(p => p ? { ...p, meta_description: e.target.value } : null)} placeholder="Concise summary for search engine results..." className="h-24" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 py-3 text-[10px] text-muted-foreground flex justify-between">
                       <span>Created {page ? new Date(page.created_at).toLocaleString() : 'N/A'}</span>
                       <span className="font-mono">Live Route: {getPageUrl(page)}</span>
                    </CardFooter>
                  </Card>
               </div>

               <div className="space-y-6">
                 <Card className="shadow-sm border-border overflow-hidden">
                   <CardHeader className="bg-muted/30 py-3">
                     <CardTitle className="text-sm font-bold uppercase italic">Site Visibility</CardTitle>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label htmlFor="set-nav" className="text-sm font-medium">Show in Navbar</Label>
                         <p className="text-[11px] text-muted-foreground">Display link in main site header</p>
                       </div>
                       <Switch id="set-nav" checked={page?.show_in_navbar} onCheckedChange={v => setPage(p => p ? { ...p, show_in_navbar: v } : null)} />
                     </div>
                     <Separator />
                     <div className="flex items-center justify-between">
                       <div>
                         <Label htmlFor="set-footer" className="text-sm font-medium">Show in Footer</Label>
                         <p className="text-[11px] text-muted-foreground">Display in footer links columns</p>
                       </div>
                       <Switch id="set-footer" checked={page?.show_in_footer} onCheckedChange={v => setPage(p => p ? { ...p, show_in_footer: v } : null)} />
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
