import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  FileText, Download, Copy, Check, ExternalLink, Server, Database, 
  Code2, Shield, Globe, Layers, ArrowUpRight, Terminal, BookOpen,
  Sparkles, Cpu, CheckCircle2, AlertCircle, HardDrive, LayoutDashboard,
  Users, CreditCard, ImageIcon, MapPin, Mail, MessageSquare, Replace,
  TrendingUp, MessageSquareText, Settings, Tag, ShieldCheck, HelpCircle,
  Clock, CheckCircle, ChevronRight, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { MODULES_DATA, ModuleItem } from '@/data/modulesData';

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Users,
  BookOpen,
  Tag,
  ImageIcon,
  CreditCard,
  FileText,
  MapPin,
  Mail,
  MessageSquare,
  Globe,
  Replace,
  TrendingUp,
  MessageSquareText,
  Settings
};

export default function DocumentationPage() {
  const { toast } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");


  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({
      title: "Copied to Clipboard",
      description: "Code snippet copied successfully.",
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    element.href = "/TECHNICAL_HANDOFF_DOCUMENTATION.md";
    element.download = "PANA_Institute_Technical_Documentation.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Downloading Documentation",
      description: "Markdown documentation file downloaded.",
    });
  };

  const categories = ["all", ...Array.from(new Set(MODULES_DATA.map(m => m.category)))];

  const filteredModules = MODULES_DATA.filter((m: ModuleItem) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.steps.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.detail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || m.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white p-8 sm:p-10 border border-zinc-800 shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Technical Handoff & Operations Package
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Website & LMS Documentation
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
                Comprehensive step-by-step operational manual for all 18 platform modules, architectural blueprints, deployment guides, and CMS management.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                variant="outline"
                onClick={handleDownloadMarkdown}
                className="bg-zinc-900/80 border-zinc-700 text-zinc-100 hover:bg-zinc-800 hover:text-white text-xs font-semibold gap-2 py-5"
              >
                <Download className="w-4 h-4 text-red-400" /> Download Manual (.md)
              </Button>
              <a href="/TECHNICAL_HANDOFF_DOCUMENTATION.md" target="_blank" rel="noopener noreferrer">
                <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold gap-2 py-5 shadow-lg shadow-red-600/20">
                  <ExternalLink className="w-4 h-4" /> View Raw Source
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Navigation Hub */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="bg-muted/80 p-1 rounded-xl flex-wrap h-auto gap-1 border border-border">
            <TabsTrigger value="modules" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-red-600" /> All 18 Modules Guide
            </TabsTrigger>
            <TabsTrigger value="architecture" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Cpu className="w-3.5 h-3.5 mr-1.5" /> Architecture & Tech Stack
            </TabsTrigger>
            <TabsTrigger value="deployment" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Server className="w-3.5 h-3.5 mr-1.5" /> Deployment & Env
            </TabsTrigger>
            <TabsTrigger value="cms" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Globe className="w-3.5 h-3.5 mr-1.5" /> Page Builder (CMS)
            </TabsTrigger>
            <TabsTrigger value="media-docs" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> PDF & Media Guides
            </TabsTrigger>
            <TabsTrigger value="lms" className="rounded-lg text-xs font-semibold py-2 px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> LMS & Certs
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Master 18 Modules Guide with Collapsible Accordion & Step-by-Step */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="border-border">
              <CardHeader className="border-b border-border bg-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5 text-red-600" /> Platform Modules Directory & Step-by-Step Operational Manual
                    </CardTitle>
                    <CardDescription>
                      Click on any module below to expand its full step-by-step operating guide, prerequisites, operational tips, and quick links.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="border-red-500 text-red-600 self-start sm:self-auto font-mono text-xs">
                    18 Active Modules
                  </Badge>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search module or action (e.g. invoice, pdf, course)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(cat)}
                        className={`text-[11px] h-7 rounded-lg capitalize ${
                          activeCategory === cat ? "bg-red-600 hover:bg-red-700 text-white" : ""
                        }`}
                      >
                        {cat === "all" ? "All Modules" : cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {filteredModules.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="text-sm">No modules found matching &ldquo;{searchQuery}&rdquo;.</p>
                  </div>
                ) : (
                  <Accordion type="multiple" defaultValue={["mod-1", "mod-3", "mod-15"]} className="space-y-4">
                    {filteredModules.map((module) => {
                      const IconComponent = ICON_MAP[module.iconName] || LayoutDashboard;
                      return (
                        <AccordionItem
                          key={module.id}
                          value={module.id}
                          className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm transition-all data-[state=open]:border-red-500/50 data-[state=open]:shadow-md"
                        >
                          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30">
                            <div className="flex items-center justify-between w-full pr-4 text-left">
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
                                  <IconComponent className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-mono font-bold text-muted-foreground">{module.num}</span>
                                    <h3 className="font-bold text-sm text-foreground">{module.title}</h3>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{module.summary}</p>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-2 shrink-0">
                                <Badge variant="secondary" className="text-[10px] font-medium">
                                  {module.badge}
                                </Badge>
                                <span className="text-xs text-red-600 font-semibold inline-flex items-center gap-0.5 hover:underline" onClick={(e) => { e.stopPropagation(); window.open(module.url, "_blank"); }}>
                                  Go to module <ArrowUpRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="px-6 pb-6 pt-2 space-y-5 border-t border-border/40 bg-muted/10">
                            {/* Summary & Prerequisites */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              <div className="md:col-span-2 space-y-1.5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Module Overview</h4>
                                <p className="text-xs text-foreground leading-relaxed">{module.summary}</p>
                              </div>
                              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Required Access</h4>
                                <p className="text-xs text-foreground">{module.prereqs}</p>
                              </div>
                            </div>

                            {/* Step-by-Step Instructions */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Step-by-Step How-To Guide:
                              </h4>
                              <div className="space-y-2.5">
                                {module.steps.map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-background/80 hover:border-red-500/30 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-sm">
                                      {idx + 1}
                                    </div>
                                    <div className="space-y-0.5">
                                      <h5 className="text-xs font-bold text-foreground">{step.title}</h5>
                                      <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Operational Tip & Direct Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                              <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                                <div>
                                  <strong className="font-semibold">Administrator Pro-Tip:</strong> {module.tips}
                                </div>
                              </div>
                              <a href={module.url} className="shrink-0 self-end sm:self-auto">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold gap-1.5 h-8">
                                  Open {module.title} <ArrowUpRight className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Architecture & Technology Stack */}
          <TabsContent value="architecture" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-red-600" /> Technology Stack Matrix
                </CardTitle>
                <CardDescription>
                  Core libraries, runtimes, and cloud platforms powering the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="py-3 px-4">Component</th>
                        <th className="py-3 px-4">Technology</th>
                        <th className="py-3 px-4">Version</th>
                        <th className="py-3 px-4">Role & Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Frontend Framework</td>
                        <td className="py-3.5 px-4">React + TypeScript</td>
                        <td className="py-3.5 px-4 font-mono text-xs">v18.3</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Component-driven reactive single page web application</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Bundler & Dev Server</td>
                        <td className="py-3.5 px-4">Vite</td>
                        <td className="py-3.5 px-4 font-mono text-xs">v5.4</td>
                        <td className="py-3.5 px-4 text-muted-foreground">High-speed Rollup compilation and HMR development server</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Styling Framework</td>
                        <td className="py-3.5 px-4">Tailwind CSS + shadcn/ui</td>
                        <td className="py-3.5 px-4 font-mono text-xs">v3.4</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Responsive styling, dark mode tokens, accessible Radix UI primitives</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Client Routing</td>
                        <td className="py-3.5 px-4">React Router DOM</td>
                        <td className="py-3.5 px-4 font-mono text-xs">v6.26</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Client-side navigation and protected role-based dashboard routes</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Cloud Database</td>
                        <td className="py-3.5 px-4">Supabase (PostgreSQL)</td>
                        <td className="py-3.5 px-4 font-mono text-xs">Postgres 15</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Relational tables, foreign keys, and Row-Level Security (RLS)</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Authentication</td>
                        <td className="py-3.5 px-4">Supabase Auth (GoTrue)</td>
                        <td className="py-3.5 px-4 font-mono text-xs">JWT Based</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Encrypted password hashing, session tokens, and role enforcement</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Cloud Asset Storage</td>
                        <td className="py-3.5 px-4">Supabase Storage</td>
                        <td className="py-3.5 px-4 font-mono text-xs">S3 Compatible</td>
                        <td className="py-3.5 px-4 text-muted-foreground">Site images, training gallery albums, and PDF compliance documents</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-semibold text-foreground">Rich Text Editor</td>
                        <td className="py-3.5 px-4">React Quill</td>
                        <td className="py-3.5 px-4 font-mono text-xs">v2.0</td>
                        <td className="py-3.5 px-4 text-muted-foreground">WYSIWYG article formatting, embedded images, and HTML sanitization</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-600" /> Directory Structure Blueprint
                </CardTitle>
                <CardDescription>
                  Organization of source code modules and administrative controllers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
{`pana-academy-main/
├── src/
│   ├── components/
│   │   ├── admin/               # Admin controls (ImagePicker, Document Uploader)
│   │   ├── page-builder/        # SectionRenderer & Dynamic modular blocks
│   │   ├── course-management/   # LMS course curriculum and lesson editors
│   │   ├── Navigation.tsx       # Institutional mega-menu & mobile navigation
│   │   └── Footer.tsx           # Institutional global footer
│   ├── pages/                   # Application route views
│   │   ├── Index.tsx            # PANA Institute homepage
│   │   ├── BlogPage.tsx         # Media, News, and Resources & Policies listing
│   │   ├── BlogPostPage.tsx     # Article reader, Photo Gallery & PDF Viewer
│   │   ├── PublicCoursesPage.tsx# Public catalog of courses and syllabus
│   │   ├── SafetyPage.tsx       # HSE policy and safety standards view
│   │   ├── OurJourneyPage.tsx   # History, milestone timeline & leadership
│   │   └── admin/               # Dashboard module controllers (18 modules)
│   ├── services/                # Supabase Data Access Services
│   │   ├── blogService.ts       # Articles, Media galleries & PDF uploads
│   │   ├── pageService.ts       # Dynamic modular page sections
│   │   ├── courseService.ts     # LMS courses, modules, lessons
│   │   └── siteSettingsService.ts# Branding, social links & metadata
│   ├── context/                 # Global state (Auth, Theme)
│   └── integrations/supabase/   # Supabase client singleton
├── public/                      # Static assets & logos
├── supabase/                    # Schema migrations and seed scripts
├── vite.config.ts               # Vite build configuration
└── tailwind.config.ts           # Design tokens, palette & fonts`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Deployment & Environment */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Server className="w-5 h-5 text-amber-500" /> Environment Variables Configuration
                </CardTitle>
                <CardDescription>
                  Runtime credentials required by Vite for build and browser execution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                        <th className="py-3 px-4">Variable Name</th>
                        <th className="py-3 px-4">Required</th>
                        <th className="py-3 px-4">Description & Safe Handling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-foreground">VITE_SUPABASE_URL</td>
                        <td className="py-3.5 px-4"><Badge variant="default" className="bg-red-600 text-white text-[10px]">Mandatory</Badge></td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">The public REST/GraphQL endpoint of the Supabase project instance (e.g., <code>https://xyz.supabase.co</code>).</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-mono text-xs font-semibold text-foreground">VITE_SUPABASE_ANON_KEY</td>
                        <td className="py-3.5 px-4"><Badge variant="default" className="bg-red-600 text-white text-[10px]">Mandatory</Badge></td>
                        <td className="py-3.5 px-4 text-xs text-muted-foreground">The anonymous public key used for client authentication and Postgres RLS checks. Safe to expose in the browser.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Security Best Practice:</strong>
                    <p className="mt-0.5 leading-relaxed">
                      Never commit a <code>service_role</code> secret key into frontend code or version control repository. The application relies entirely on Row-Level Security (RLS) policies evaluated in Postgres against the caller&apos;s JWT token.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" /> Web Server SPA Rewrite Configurations
                </CardTitle>
                <CardDescription>
                  Prevent 404 HTTP errors on browser refreshes by routing all deep links back to <code>/index.html</code>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Apache (.htaccess)</h4>
                  <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs border border-zinc-800">
{`RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]`}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Nginx (nginx.conf)</h4>
                  <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-xs border border-zinc-800">
{`location / {
  try_files $uri $uri/ /index.html;
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Page Builder (CMS) */}
          <TabsContent value="cms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" /> Visual Page Builder System
                </CardTitle>
                <CardDescription>
                  How content managers can reorder, edit, and publish dynamic and static pages without code modification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                    <h4 className="text-sm font-bold text-foreground">Dynamic Modular Pages</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Custom landing pages built by combining pre-configured section blocks (Hero, Features Grid, Stats, Testimonials, CTA, Media Showcase).
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                      <li>Drag-and-drop or reorder section sequences</li>
                      <li>Customize titles, subtitles, background colors, and action buttons</li>
                      <li>Instant preview and one-click database publishing</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-3">
                    <h4 className="text-sm font-bold text-foreground">Institutional Core Pages</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Dedicated editors for foundational institutional pages including <strong>Home</strong>, <strong>About Us</strong>, <strong>Safety Policy</strong>, and <strong>Our Journey</strong>.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                      <li>Modify mission statements, vision pillars, and milestone chronologies</li>
                      <li>Change safety statistics (LTI, Safe Manhours, Certifications)</li>
                      <li>Direct Supabase image library integration</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <a href="/dashboard/pages">
                    <Button className="font-semibold text-xs gap-1.5">
                      Open Page Builder <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PDF & Media Guides */}
          <TabsContent value="media-docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" /> Resources, Governance & PDF Uploads
                </CardTitle>
                <CardDescription>
                  Workflow for publishing brochures, governance codes, and compliance PDF documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Create New Post</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Go to <strong>Blog & News</strong> in the dashboard and click <strong>New Post</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Select "Resources & Policies" Category</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        In the Section & Category dropdown, pick <strong>Resources & Policies</strong>. The dedicated <strong>PDF Document Attachment</strong> card will appear.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Upload Your PDF Document</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Click <strong>Browse PDF File</strong> and select your policy brochure or report (up to 25MB). The system automatically stores it in Supabase Storage and records file metrics.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">4</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Publish & Verify</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Toggle <strong>Published</strong> to ON and click <strong>Save Post</strong>. The document will appear on <code>/resources</code> with a green PDF badge and direct download trigger.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <a href="/dashboard/blog/new">
                    <Button className="font-semibold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                      Publish a New Resource / PDF <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 6: LMS & Courses */}
          <TabsContent value="lms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" /> Learning Management System (LMS)
                </CardTitle>
                <CardDescription>
                  Managing course tracks, curriculum modules, student progress, and digital certificates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <h4 className="text-sm font-bold text-foreground">1. Curriculum Structuring</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Organize programs across the 13 competency verticals, create multi-week modules, and add video or reading lessons.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <h4 className="text-sm font-bold text-foreground">2. Enrollments & Tracking</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Monitor participant progress, module completions, and quiz submissions in real-time.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-2">
                    <h4 className="text-sm font-bold text-foreground">3. Cryptographic Certificates</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Upon course completion, graduates receive a tamper-proof certificate with an ID verifiable at <code>/verify-certificate</code>.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <a href="/dashboard/courses">
                    <Button className="font-semibold text-xs gap-1.5">
                      Open Course Management <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
