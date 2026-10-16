import { supabase } from "@/integrations/supabase/client";

export type PageStatus = 'draft' | 'published' | 'archived';

export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: PageStatus;
  meta_title: string | null;
  meta_description: string | null;
  show_in_navbar: boolean;
  show_in_footer: boolean;
  page_type: 'static' | 'dynamic';
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  content: any;
  order_index: number;
  is_active?: boolean;
}

export const DEFAULT_PAGES: Partial<Page>[] = [
  { title: 'Home Page', slug: 'home', page_type: 'dynamic', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Homepage with hero banner, top courses, and stats.' },
  { title: 'About Us', slug: 'about', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Company vision, mission, and highlights.' },
  { title: 'Contact Us', slug: 'contact', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Office locations, email, phone numbers, and inquiry form.' },
  { title: 'Careers', slug: 'careers', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Career opportunities and vision.' },
  { title: 'Consulting Services', slug: 'consulting-services', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Expert consulting services.' },
  { title: 'Research & Development', slug: 'rnd-services', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'R&D services and methodologies.' },
  { title: 'Training Delivery', slug: 'training-delivery', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Training methodologies and delivery options.' },
  { title: 'Sustainability Solutions', slug: 'sustainability-solutions', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Decarbonisation, ESG, and climate services.' },
  { title: 'Global Engagements', slug: 'global-engagements', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'International partnerships, cross-border workforce development, and global hubs.' },
  { title: 'Safety Standards & HSE', slug: 'safety', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Health, safety, and environment standards, ISO framework, and safety culture.' },
  { title: 'Our Journey & Milestones', slug: 'our-journey', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Evolution from Academy to Institute, timeline, and accreditations.' },
  { title: 'Training Calendar', slug: 'training-calendar', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Interactive schedule of upcoming course sessions and intake dates.' },
  { title: 'Client Testimonials', slug: 'testimonials', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Success stories, corporate endorsements, and client reviews.' },
  { title: 'Our Institute', slug: 'our-institute', page_type: 'static', status: 'published', show_in_navbar: false, show_in_footer: false, description: 'Institutional evolution, governance council, executive leadership, and research chairs.' },
];

export const getPageUrl = (page?: { slug?: string | null; page_type?: string | null } | null): string => {
  if (!page || !page.slug) return '/';
  if (page.slug === 'home') return '/';
  if (page.page_type === 'static') return `/${page.slug}`;
  return `/p/${page.slug}`;
};

export const pageService = {
  // Page CRUD
  async getPages() {
    const { data: existing, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const existingSlugs = new Set((existing || []).map(p => p.slug));
    const missingDefaults = DEFAULT_PAGES.filter(p => !existingSlugs.has(p.slug!));

    if (missingDefaults.length > 0) {
      try {
        const { data: inserted, error: insertErr } = await supabase
          .from('pages')
          .insert(missingDefaults)
          .select();
        if (!insertErr && inserted) {
          return [...(existing || []), ...inserted] as Page[];
        }
      } catch (err) {
        console.warn('Default pages seed warning:', err);
      }
    }

    return (existing || []) as Page[];
  },

  async getPageById(idOrSlug: string) {
    if (!idOrSlug) throw new Error('Page identifier is required');
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = supabase.from('pages').select('*');
    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    
    if (data) {
      return { data: data as Page, error: null };
    }

    // Auto-seed default page if exists in registry
    const defaultPage = DEFAULT_PAGES.find(p => p.slug === idOrSlug || p.id === idOrSlug);
    if (defaultPage) {
      try {
        const { data: created, error: createErr } = await supabase
          .from('pages')
          .insert(defaultPage)
          .select()
          .single();
        if (!createErr && created) {
          return { data: created as Page, error: null };
        }
      } catch (e) {
        console.warn('Auto-create default page fallback error:', e);
      }
    }

    throw new Error(`Page not found: ${idOrSlug}`);
  },

  async getPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*, page_sections(*)')
      .eq('slug', slug)
      .eq('page_sections.is_active', true)
      .order('order_index', { foreignTable: 'page_sections', ascending: true })
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async createPage(page: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .insert(page)
      .select()
      .single();
    if (error) throw error;
    return data as Page;
  },

  async updatePage(id: string, updates: Partial<Page>) {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Page;
  },

  async deletePage(id: string) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Section CRUD
  async getPageSections(pageId: string) {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as PageSection[];
  },

  async saveSections(pageId: string, sections: Partial<PageSection>[]) {
    // Delete existing sections first, then insert the full new set.
    // This prevents "zombie rows" when sections are removed or reordered.
    const { error: deleteError } = await supabase
      .from('page_sections')
      .delete()
      .eq('page_id', pageId);
    if (deleteError) throw deleteError;

    if (sections.length === 0) return [];

    // Strip existing IDs so Supabase generates fresh ones on insert
    const rows = sections.map((s, idx) => ({
      page_id: pageId,
      section_type: s.section_type,
      content: s.content,
      order_index: idx,
      is_active: s.is_active ?? true,
    }));

    const { data, error } = await supabase
      .from('page_sections')
      .insert(rows)
      .select();
    
    if (error) throw error;
    return data;
  },

  async deleteSection(id: string) {
    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Page Content (key-value overrides for static pages)
  async getPageContent(slug: string): Promise<Record<string, string>> {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('content_key, content_value')
        .eq('page_slug', slug);
      if (error) {
        console.warn(`getPageContent warning for ${slug}:`, error.message);
        return {};
      }
      const map: Record<string, string> = {};
      (data || []).forEach(row => { map[row.content_key] = row.content_value || ''; });
      return map;
    } catch (err) {
      console.warn(`getPageContent exception for ${slug}:`, err);
      return {};
    }
  },

  async savePageContent(slug: string, content: Record<string, string>) {
    const rows = Object.entries(content).map(([content_key, content_value]) => ({
      page_slug: slug,
      content_key,
      content_value
    }));
    if (rows.length === 0) return;
    const { error } = await supabase
      .from('page_content')
      .upsert(rows, { onConflict: 'page_slug,content_key' });
    if (error) throw error;
  }
};
