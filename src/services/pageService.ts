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
  is_active: boolean;
}

export const pageService = {
  // Page CRUD
  async getPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Page[];
  },

  async getPageById(id: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return { data: data as Page, error };
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
    // Delete existing sections to replace them, or update based on ID
    // For simplicity in a builder, we can delete and re-insert or use upsert
    // We'll use a transaction logic via an edge function for complex operations, 
    // but here we can use upsert if they have IDs.
    
    const { data, error } = await supabase
      .from('page_sections')
      .upsert(sections.map(s => ({ ...s, page_id: pageId })))
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
    const { data, error } = await supabase
      .from('page_content')
      .select('content_key, content_value')
      .eq('page_slug', slug);
    if (error) throw error;
    const map: Record<string, string> = {};
    (data || []).forEach(row => { map[row.content_key] = row.content_value || ''; });
    return map;
  },

  async savePageContent(slug: string, content: Record<string, string>) {
    const rows = Object.entries(content).map(([content_key, content_value]) => ({
      page_slug: slug,
      content_key,
      content_value
    }));
    const { error } = await supabase
      .from('page_content')
      .upsert(rows, { onConflict: 'page_slug,content_key' });
    if (error) throw error;
  }
};
