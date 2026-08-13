import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Save, Link as LinkIcon, ChevronDown, MoveUp, MoveDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export interface NavLink {
  name: string;
  href: string;
  desc?: string;
  icon?: string;
}

export interface NavItem {
  id: string;
  name: string;
  type: 'link' | 'dropdown' | 'mega';
  href?: string;
  dropdown?: NavLink[];
  megaMenu?: boolean;
  columns?: any[];
  callout?: any;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: NavLink[];
}

const DEFAULT_NAV: NavItem[] = [
  { id: '1', name: 'Home', type: 'link', href: '/' },
  {
    id: '2',
    name: 'About',
    type: 'mega',
    href: '/about',
    megaMenu: true,
    columns: [
      {
        heading: "Company",
        links: [
          { name: "About Us", href: "/about", desc: "Our mission, vision & values", icon: "Sparkles" },
          { name: "Leadership Team", href: "/team", desc: "Meet our industry experts", icon: "Users" },
          { name: "Our Journey", href: "/our-journey", desc: "Milestones & history", icon: "Compass" },
          { name: "Testimonials", href: "/testimonials", desc: "Client success stories", icon: "Award" },
        ]
      }
    ],
    callout: {
      title: "About PANA Institute",
      desc: "Africa's leading competency hub for Oil & Gas professionals.",
      cta: "Learn More",
      href: "/about",
    }
  },
  {
    id: '3',
    name: 'Solutions',
    type: 'mega',
    href: '/training-delivery',
    megaMenu: true,
    columns: [
      {
        heading: "Our Services",
        links: [
          { name: "Training Delivery", href: "/training-delivery", desc: "Competency-based programs", icon: "BookOpen" },
          { name: "Consulting", href: "/consulting-services", desc: "Strategic energy advisory", icon: "Layers" },
          { name: "R&D Services", href: "/research-development", desc: "Innovation & technical R&D", icon: "Zap" },
        ]
      }
    ],
    callout: {
      title: "Capacity Building",
      desc: "Customized workforce training and manpower development programs.",
      cta: "Explore Solutions",
      href: "/training-delivery",
    }
  },
  { id: '4', name: 'Courses', type: 'link', href: '/courses' },
  { id: '5', name: 'Contact', type: 'link', href: '/contact' },
];

const DEFAULT_FOOTER: FooterColumn[] = [
  {
    id: 'col-1',
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Leadership Team', href: '/team' },
    ]
  },
  {
    id: 'col-2',
    title: 'Services',
    links: [
      { name: 'Training Programs', href: '/training-delivery' },
      { name: 'Consulting', href: '/consulting-services' },
    ]
  },
  {
    id: 'col-3',
    title: 'Quick Links',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
    ]
  }
];

export default function NavigationManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Navbar Layout
      const { data: navData } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'navbar_layout')
        .maybeSingle();

      if (navData && navData.value) {
        let parsed = navData.value;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        setNavItems(parsed);
      } else {
        setNavItems(DEFAULT_NAV);
      }

      // Fetch Footer Layout
      const { data: footerData } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'footer_layout')
        .maybeSingle();

      if (footerData && footerData.value) {
        let parsed = footerData.value;
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        setFooterColumns(parsed);
      } else {
        setFooterColumns(DEFAULT_FOOTER);
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: 'navbar' | 'footer') => {
    try {
      setSaving(true);
      
      const key = type === 'navbar' ? 'navbar_layout' : 'footer_layout';
      const value = type === 'navbar' ? navItems : footerColumns;

      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          key,
          value,
          category: 'appearance',
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
      
      toast({
        title: "Saved successfully",
        description: `Your ${type} layout has been updated.`,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error saving",
        description: "Could not save settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Navbar Methods ---
  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    if (direction === 'up' && index > 0) {
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    }
    setNavItems(newItems);
  };

  const addNavTopLevel = (type: 'link' | 'dropdown') => {
    const newItem: NavItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Item',
      type,
      ...(type === 'link' ? { href: '/' } : { dropdown: [] })
    };
    setNavItems([...navItems, newItem]);
  };

  const addNavSubLink = (parentIndex: number) => {
    const newItems = [...navItems];
    if (!newItems[parentIndex].dropdown) newItems[parentIndex].dropdown = [];
    newItems[parentIndex].dropdown!.push({ name: 'New Link', href: '/' });
    setNavItems(newItems);
  };

  const removeNavTopLevel = (index: number) => {
    const newItems = [...navItems];
    newItems.splice(index, 1);
    setNavItems(newItems);
  };

  const removeNavSubLink = (parentIndex: number, subIndex: number) => {
    const newItems = [...navItems];
    newItems[parentIndex].dropdown!.splice(subIndex, 1);
    setNavItems(newItems);
  };

  const updateNavItem = (index: number, field: string, value: any) => {
    const newItems = [...navItems];
    (newItems[index] as any)[field] = value;
    setNavItems(newItems);
  };

  const updateNavSubLink = (parentIndex: number, subIndex: number, field: string, value: any) => {
    const newItems = [...navItems];
    (newItems[parentIndex].dropdown![subIndex] as any)[field] = value;
    setNavItems(newItems);
  };

  // --- Footer Methods ---
  const addFooterColumn = () => {
    setFooterColumns([...footerColumns, {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Column',
      links: []
    }]);
  };

  const removeFooterColumn = (index: number) => {
    const newCols = [...footerColumns];
    newCols.splice(index, 1);
    setFooterColumns(newCols);
  };

  const updateFooterColumnTitle = (index: number, title: string) => {
    const newCols = [...footerColumns];
    newCols[index].title = title;
    setFooterColumns(newCols);
  };

  const moveFooterColumn = (index: number, direction: 'up' | 'down') => {
    const newCols = [...footerColumns];
    if (direction === 'up' && index > 0) {
      [newCols[index - 1], newCols[index]] = [newCols[index], newCols[index - 1]];
    } else if (direction === 'down' && index < newCols.length - 1) {
      [newCols[index + 1], newCols[index]] = [newCols[index], newCols[index + 1]];
    }
    setFooterColumns(newCols);
  };

  const addFooterLink = (colIndex: number) => {
    const newCols = [...footerColumns];
    newCols[colIndex].links.push({ name: 'New Link', href: '/' });
    setFooterColumns(newCols);
  };

  const removeFooterLink = (colIndex: number, linkIndex: number) => {
    const newCols = [...footerColumns];
    newCols[colIndex].links.splice(linkIndex, 1);
    setFooterColumns(newCols);
  };

  const updateFooterLink = (colIndex: number, linkIndex: number, field: string, value: string) => {
    const newCols = [...footerColumns];
    (newCols[colIndex].links[linkIndex] as any)[field] = value;
    setFooterColumns(newCols);
  };

  if (loading) return <DashboardLayout><div className="p-8">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Navigation & Menus</h1>
          <p className="text-muted-foreground mt-1">Configure your site's main header and footer navigation.</p>
        </div>

        <Tabs defaultValue="navbar" className="w-full">
          <TabsList className="mb-6 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 w-full justify-start h-auto p-1 rounded-lg">
            <TabsTrigger value="navbar" className="px-6 py-2">Main Navbar</TabsTrigger>
            <TabsTrigger value="footer" className="px-6 py-2">Footer Links</TabsTrigger>
          </TabsList>

          {/* NAVBAR TAB */}
          <TabsContent value="navbar" className="space-y-6">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Are you sure you want to reset the navigation to its default layout? This cannot be undone.')) {
                    setNavItems(DEFAULT_NAV);
                    // We don't save immediately to let them preview, or we can just save it.
                    // Let's just set the state and let them click Save.
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('navbar')} disabled={saving} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Navbar'}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Navbar Items</CardTitle>
                <CardDescription>Drag or use arrows to reorder. Add simple links or dropdown menus.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {navItems.map((item, index) => (
                  <div key={item.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-1 mt-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveNavItem(index, 'up')} disabled={index === 0}>
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveNavItem(index, 'down')} disabled={index === navItems.length - 1}>
                          <MoveDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1 grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-3">
                          <Label className="text-xs mb-1 block">Display Name</Label>
                          <Input value={item.name} onChange={(e) => updateNavItem(index, 'name', e.target.value)} className="bg-white dark:bg-zinc-950 h-9" />
                        </div>
                        <div className="col-span-3">
                          <Label className="text-xs mb-1 block">Item Type</Label>
                          <Select value={item.type} onValueChange={(val) => updateNavItem(index, 'type', val)}>
                            <SelectTrigger className="bg-white dark:bg-zinc-950 h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="link">Simple Link</SelectItem>
                              <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                              <SelectItem value="mega">Mega Menu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {(item.type === 'link' || item.type === 'mega') && (
                          <div className="col-span-5">
                            <Label className="text-xs mb-1 block">URL or Page</Label>
                            <Input value={item.href || ''} onChange={(e) => updateNavItem(index, 'href', e.target.value)} placeholder="e.g. /about" className="bg-white dark:bg-zinc-950 h-9" />
                          </div>
                        )}
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon" onClick={() => removeNavTopLevel(index)} className="text-red-500 hover:text-red-700 h-9 w-9">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {item.type === 'dropdown' && (
                      <div className="ml-10 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-3">
                        <Label className="text-xs font-semibold text-zinc-500 uppercase">Sub Links</Label>
                        {(item.dropdown || []).map((sub, sIndex) => (
                          <div key={sIndex} className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-100 dark:border-zinc-800">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <Input placeholder="Link Name" value={sub.name} onChange={(e) => updateNavSubLink(index, sIndex, 'name', e.target.value)} className="h-8 text-sm" />
                              <Input placeholder="URL" value={sub.href} onChange={(e) => updateNavSubLink(index, sIndex, 'href', e.target.value)} className="h-8 text-sm" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeNavSubLink(index, sIndex)} className="text-zinc-400 hover:text-red-500 h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addNavSubLink(index)} className="text-xs h-8">
                          <Plus className="w-3 h-3 mr-1" /> Add Sub-link
                        </Button>
                      </div>
                    )}

                    {item.type === 'mega' && (
                      <div className="ml-10 pl-4 border-l-2 border-amber-200 dark:border-amber-900/50 space-y-3">
                        <p className="text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                          <strong>Note:</strong> Mega Menus are pre-configured complex layouts (like the "About" or "Solutions" menus). You can change their display name and main URL above, but their internal structure cannot be edited here to prevent breaking the layout. If you change the item type, the mega menu structure will be lost.
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Button variant="outline" onClick={() => addNavTopLevel('link')} className="border-dashed">
                    <LinkIcon className="w-4 h-4 mr-2" /> Add Simple Link
                  </Button>
                  <Button variant="outline" onClick={() => addNavTopLevel('dropdown')} className="border-dashed">
                    <ChevronDown className="w-4 h-4 mr-2" /> Add Dropdown Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FOOTER TAB */}
          <TabsContent value="footer" className="space-y-6">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Are you sure you want to reset the footer to its default layout? This cannot be undone.')) {
                    setFooterColumns(DEFAULT_FOOTER);
                  }
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Reset to Defaults
              </Button>
              <Button onClick={() => handleSave('footer')} disabled={saving} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Footer'}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {footerColumns.map((col, colIndex) => (
                <Card key={col.id} className="relative group">
                  <div className="absolute -top-3 -right-3 hidden group-hover:flex gap-1 z-10">
                    <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm rounded-full" onClick={() => moveFooterColumn(colIndex, 'up')} disabled={colIndex === 0}>
                      <MoveUp className="w-3 h-3" />
                    </Button>
                    <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm rounded-full" onClick={() => moveFooterColumn(colIndex, 'down')} disabled={colIndex === footerColumns.length - 1}>
                      <MoveDown className="w-3 h-3" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm rounded-full" onClick={() => removeFooterColumn(colIndex)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 rounded-t-xl">
                    <Label className="text-xs mb-1">Column Title</Label>
                    <Input 
                      value={col.title} 
                      onChange={(e) => updateFooterColumnTitle(colIndex, e.target.value)}
                      className="font-bold bg-white dark:bg-zinc-950"
                    />
                  </CardHeader>

                  <CardContent className="pt-4 space-y-3">
                    {col.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex flex-col gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] uppercase font-bold text-zinc-500">Link {linkIndex + 1}</Label>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-400 hover:text-red-500" onClick={() => removeFooterLink(colIndex, linkIndex)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Input 
                          placeholder="Display Name" 
                          value={link.name} 
                          onChange={(e) => updateFooterLink(colIndex, linkIndex, 'name', e.target.value)}
                          className="h-8 text-xs bg-white dark:bg-zinc-950"
                        />
                        <Input 
                          placeholder="URL (/about)" 
                          value={link.href} 
                          onChange={(e) => updateFooterLink(colIndex, linkIndex, 'href', e.target.value)}
                          className="h-8 text-xs bg-white dark:bg-zinc-950"
                        />
                      </div>
                    ))}
                    
                    <Button variant="outline" size="sm" onClick={() => addFooterLink(colIndex)} className="w-full border-dashed mt-2">
                      <Plus className="w-3 h-3 mr-2" /> Add Link
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {footerColumns.length < 4 && (
                <Button variant="outline" onClick={addFooterColumn} className="h-full min-h-[200px] border-dashed border-2 text-zinc-500 flex flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  <span>Add Footer Column</span>
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground pt-2">Note: A maximum of 4 columns is recommended for best display on desktop devices.</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
