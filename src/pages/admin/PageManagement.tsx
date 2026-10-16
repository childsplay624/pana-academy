import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Edit, ExternalLink, Trash2, MoreVertical, Layout, Sparkles, Layers, Globe } from 'lucide-react';
import { pageService, Page, getPageUrl } from '@/services/pageService';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

const STARTER_LAYOUTS: Record<string, { label: string; desc: string; sections: { section_type: string; content: any }[] }> = {
  blank: {
    label: 'Blank Canvas',
    desc: 'Starts completely empty. You choose which visual blocks to add.',
    sections: []
  },
  landing: {
    label: 'Standard Landing Page',
    desc: 'Pre-loaded with Hero Banner, Feature Highlights, and Call to Action.',
    sections: [
      {
        section_type: 'hero',
        content: {
          badge: 'New Initiative',
          title: 'Empower Your Career with World-Class Skills',
          description: 'Join industry-recognized programmes designed and delivered by veteran practitioners.',
          buttonText: 'Explore Programmes',
          secondaryButtonText: 'Learn More',
          bgImage: '',
          overlayOpacity: 60
        }
      },
      {
        section_type: 'features',
        content: {
          title: 'Why Choose This Programme',
          subtitle: 'World-class training built for tangible career outcomes',
          features: [
            { title: 'Industry-Standard Labs', description: 'Hands-on practice using operational equipment and simulators.' },
            { title: 'Expert Practitioners', description: 'Learn directly from certified specialists with field experience.' },
            { title: 'Verifiable Certification', description: 'Internationally recognized credentials and digital badges.' }
          ]
        }
      },
      {
        section_type: 'cta',
        content: {
          title: 'Ready to Take the Next Step?',
          description: 'Speak with our admissions counselors or register directly today.',
          buttonText: 'Get Started Today'
        }
      }
    ]
  },
  informative: {
    label: 'Informational & FAQ Page',
    desc: 'Pre-loaded with Hero, Rich Text Body, FAQ Accordion, and CTA.',
    sections: [
      {
        section_type: 'hero',
        content: {
          badge: 'Information Hub',
          title: 'Comprehensive Guide & Information',
          description: 'Detailed insights, requirements, and answers to all your questions.',
          buttonText: 'Read Guidelines',
          secondaryButtonText: 'Contact Us',
          bgImage: '',
          overlayOpacity: 50
        }
      },
      {
        section_type: 'content',
        content: {
          body: '<h2>Overview & Methodologies</h2><p>Our programmes are structured to bridge theoretical principles with live operational application. We collaborate closely with international standards bodies and industry regulators to ensure compliance and practical relevance.</p>'
        }
      },
      {
        section_type: 'faq',
        content: {
          title: 'Frequently Asked Questions',
          faqs: [
            { question: 'Who is eligible to participate?', answer: 'Our courses cater to working professionals, graduates, and corporate teams looking to upskill.' },
            { question: 'Are certificates verifiable online?', answer: 'Yes, all credentials issued by PANA Institute can be instantly verified on our verification portal.' },
            { question: 'Do you offer customized corporate cohorts?', answer: 'Yes, our Advisory team designs tailored training schedules for corporate teams across Africa and internationally.' }
          ]
        }
      },
      {
        section_type: 'cta',
        content: {
          title: 'Have More Questions?',
          description: 'Our advisory desk is available to assist you with curriculum details and enrollment.',
          buttonText: 'Contact Our Team'
        }
      }
    ]
  },
  showcase: {
    label: 'High-Impact Showcase',
    desc: 'Hero, Live Platform Stats, Reviews, and Conversion Banner.',
    sections: [
      {
        section_type: 'hero',
        content: {
          badge: 'Excellence in Training',
          title: 'Setting the Standard in Technical Competence',
          description: 'Delivering verified skills for critical infrastructure, energy, and digital industries.',
          buttonText: 'View All Courses',
          secondaryButtonText: 'Watch Video',
          bgImage: '',
          overlayOpacity: 60
        }
      },
      {
        section_type: 'stats',
        content: {
          title: 'Our Impact Across Africa',
          subtitle: 'Proven outcomes measured in workforce competence',
          stats: [
            { value: '5,000+', label: 'Professionals Trained', icon: 'users' },
            { value: '98%', label: 'Industry Satisfaction', icon: 'star' },
            { value: '120+', label: 'Active Programmes', icon: 'award' },
            { value: '15+', label: 'Years of Excellence', icon: 'trending' }
          ]
        }
      },
      {
        section_type: 'testimonials',
        content: {
          title: 'What Leaders Say About Us',
          testimonials: [
            { name: 'Engr. D. Adeleke', role: 'Operations Director', text: 'PANA Institute delivered practical simulator training that immediately reduced our onboarding cycle.', avatar: '' },
            { name: 'Dr. M. Nwosu', role: 'HSE Manager', text: 'The safety standards and competency assessments are thorough, rigorous, and completely audit-proof.', avatar: '' }
          ]
        }
      },
      {
        section_type: 'cta',
        content: {
          title: 'Accelerate Your Organization Today',
          description: 'Partner with PANA Institute for verifiable capability development.',
          buttonText: 'Partner With Us'
        }
      }
    ]
  }
};

export default function PageManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'dynamic' | 'static'>('all');
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    page_type: 'dynamic' as 'dynamic' | 'static',
    description: '',
    starter_layout: 'landing',
    show_in_navbar: false,
    show_in_footer: true,
  });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pageService.getPages();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async () => {
    if (!newPage.title.trim() || !newPage.slug.trim()) {
      toast({ title: 'Validation Error', description: 'Please provide both a title and URL slug', variant: 'destructive' });
      return;
    }
    
    try {
      setCreating(true);
      const cleanSlug = newPage.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const created = await pageService.createPage({
        title: newPage.title.trim(),
        slug: cleanSlug,
        page_type: newPage.page_type,
        description: newPage.description.trim() || null,
        meta_title: `${newPage.title.trim()} | PANA Institute`,
        meta_description: newPage.description.trim() || null,
        show_in_navbar: newPage.show_in_navbar,
        show_in_footer: newPage.show_in_footer,
        status: 'draft'
      });

      // If dynamic page and starter layout selected, seed sections
      if (newPage.page_type === 'dynamic' && newPage.starter_layout && STARTER_LAYOUTS[newPage.starter_layout]) {
        const layout = STARTER_LAYOUTS[newPage.starter_layout];
        if (layout.sections.length > 0) {
          await pageService.saveSections(created.id, layout.sections);
        }
      }

      toast({
        title: 'Page Created!',
        description: `Successfully created "${created.title}". Opening editor...`,
      });

      setIsNewPageDialogOpen(false);
      navigate(`/dashboard/pages/edit/${created.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await pageService.deletePage(id);
      setPages(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Page deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete page', variant: 'destructive' });
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || page.page_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Page Builder</h1>
            <p className="text-muted-foreground text-sm">
              Create, architect, and customize dynamic modular landing pages and institutional static pages.
            </p>
          </div>
          <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20">
                <Plus className="w-4 h-4 mr-2" />
                Create New Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Create New Website Page</DialogTitle>
                <DialogDescription>
                  Configure page title, route URL, architecture model, and starting visual layout.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="page-title" className="text-xs font-bold uppercase tracking-wide">Page Title</Label>
                    <Input 
                      id="page-title" 
                      placeholder="e.g. Executive Masterclass" 
                      value={newPage.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setNewPage(prev => ({ ...prev, title, slug }));
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="page-slug" className="text-xs font-bold uppercase tracking-wide">URL Path (Slug)</Label>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted p-2 rounded-xl border border-border">
                      <span className="font-mono font-bold text-foreground">
                        {newPage.page_type === 'static' ? '/' : '/p/'}
                      </span>
                      <Input 
                        id="page-slug" 
                        className="h-6 border-none bg-transparent p-0 focus-visible:ring-0 font-mono text-xs text-primary" 
                        value={newPage.slug}
                        onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="executive-masterclass"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wide">Page Architecture</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div 
                      onClick={() => setNewPage(p => ({ ...p, page_type: 'dynamic' }))}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        newPage.page_type === 'dynamic' 
                          ? 'border-red-600 bg-red-500/5 shadow-sm' 
                          : 'border-border/60 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Layers className="w-4 h-4 text-red-600" />
                        <h4 className="font-bold text-sm">Dynamic Modular Page</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Build visually with drag-and-drop hero sliders, course grids, stats, FAQs, and testimonials. Route: <code>/p/:slug</code>
                      </p>
                    </div>

                    <div 
                      onClick={() => setNewPage(p => ({ ...p, page_type: 'static' }))}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        newPage.page_type === 'static' 
                          ? 'border-blue-600 bg-blue-500/5 shadow-sm' 
                          : 'border-border/60 hover:border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <h4 className="font-bold text-sm">Static Editorial Page</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Structured key-value fields for headers, rich copy, and editorial overrides. Maps directly to root route: <code>/:slug</code>
                      </p>
                    </div>
                  </div>
                </div>

                {newPage.page_type === 'dynamic' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wide">Starter Layout Template</Label>
                    <Select
                      value={newPage.starter_layout}
                      onValueChange={(v) => setNewPage(p => ({ ...p, starter_layout: v }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select starting blocks" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STARTER_LAYOUTS).map(([k, layout]) => (
                          <SelectItem key={k} value={k}>
                            <div className="flex flex-col text-left py-0.5">
                              <span className="font-bold">{layout.label}</span>
                              <span className="text-[11px] text-muted-foreground">{layout.desc}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="page-desc" className="text-xs font-bold uppercase tracking-wide">Page Description (SEO)</Label>
                  <Textarea 
                    id="page-desc"
                    placeholder="Brief description for search engines and site navigation..."
                    value={newPage.description}
                    onChange={(e) => setNewPage(p => ({ ...p, description: e.target.value }))}
                    className="h-16 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold">Menu Navigation</Label>
                    <p className="text-[11px] text-muted-foreground">Automatically link in site header or footer</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <Switch 
                        checked={newPage.show_in_navbar} 
                        onCheckedChange={(v) => setNewPage(p => ({ ...p, show_in_navbar: v }))} 
                      />
                      <span>Navbar</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <Switch 
                        checked={newPage.show_in_footer} 
                        onCheckedChange={(v) => setNewPage(p => ({ ...p, show_in_footer: v }))} 
                      />
                      <span>Footer</span>
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsNewPageDialogOpen(false)} disabled={creating}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePage} disabled={creating} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  {creating ? 'Creating...' : 'Create & Launch Editor'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border">
          <CardHeader className="border-b border-border bg-muted/10 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">All Registered Pages ({filteredPages.length})</CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {pages.length} Total
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
                  <Button
                    variant={typeFilter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 text-xs rounded-lg ${typeFilter === 'all' ? 'bg-background shadow-xs text-foreground' : ''}`}
                    onClick={() => setTypeFilter('all')}
                  >
                    All ({pages.length})
                  </Button>
                  <Button
                    variant={typeFilter === 'dynamic' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 text-xs rounded-lg ${typeFilter === 'dynamic' ? 'bg-background shadow-xs text-foreground' : ''}`}
                    onClick={() => setTypeFilter('dynamic')}
                  >
                    Dynamic ({pages.filter(p => p.page_type === 'dynamic').length})
                  </Button>
                  <Button
                    variant={typeFilter === 'static' ? 'default' : 'ghost'}
                    size="sm"
                    className={`h-7 text-xs rounded-lg ${typeFilter === 'static' ? 'bg-background shadow-xs text-foreground' : ''}`}
                    onClick={() => setTypeFilter('static')}
                  >
                    Static ({pages.filter(p => p.page_type === 'static').length})
                  </Button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pages or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 text-xs h-9 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">Loading platform pages...</div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-16 p-6">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-foreground text-base font-semibold">No pages match your filter</p>
                <p className="text-xs text-muted-foreground mt-1">Adjust search query or create a new page.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase">Page Title & Summary</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Route Path</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Architecture</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Status</TableHead>
                    <TableHead className="font-bold text-xs uppercase">Last Updated</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-foreground">{page.title}</span>
                          {page.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-sm">{page.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded-md text-xs font-mono text-primary font-bold">
                          {getPageUrl(page)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-[11px] font-semibold ${
                            page.page_type === 'static' 
                              ? 'border-blue-300 text-blue-700 bg-blue-50/50 dark:bg-blue-950/30 dark:text-blue-300' 
                              : 'border-emerald-300 text-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 dark:text-emerald-300'
                          }`}
                        >
                          {page.page_type === 'static' ? '⚡ Static Content' : '🧩 Dynamic Modular'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={page.status === 'published' ? 'default' : 'secondary'}
                          className={`text-[11px] ${
                            page.status === 'published' 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : ''
                          }`}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Preview Live Page"
                            onClick={() => window.open(getPageUrl(page), '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-xs font-bold gap-1 bg-background"
                            onClick={() => navigate(`/dashboard/pages/edit/${page.id}`)}
                          >
                            <Edit className="w-3.5 h-3.5 text-red-600" /> Edit
                          </Button>
                          {page.slug !== 'home' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive font-medium cursor-pointer" 
                                  onClick={() => handleDeletePage(page.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Page
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
