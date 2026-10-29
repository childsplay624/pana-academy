import { supabase } from '@/integrations/supabase/client';

export type BlogCategory = 'news' | 'media' | 'resources';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  published: boolean;
  published_at?: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
  category: BlogCategory;
  gallery: string[];
  pdf_url?: string;
  pdf_name?: string;
  pdf_size?: string;
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  news: 'News & Press',
  media: 'Media & Gallery',
  resources: 'Resources & Policies',
};

export function extractCategory(content?: string, dbCategory?: string): BlogCategory {
  if (dbCategory && ['news', 'media', 'resources'].includes(dbCategory)) {
    return dbCategory as BlogCategory;
  }
  if (!content) return 'news';
  const match = content.match(/<!--category:(news|media|resources)-->/);
  if (match && match[1]) {
    return match[1] as BlogCategory;
  }
  return 'news';
}

export function extractGallery(content?: string): string[] {
  if (!content) return [];
  const match = content.match(/<!--gallery:(.*?)-->/);
  if (match && match[1]) {
    try {
      const decoded = decodeURIComponent(match[1]);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
    } catch {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export function extractPdf(content?: string): { url?: string; name?: string; size?: string } {
  if (!content) return {};
  const match = content.match(/<!--pdf:(.*?)-->/);
  if (match && match[1]) {
    try {
      const decoded = decodeURIComponent(match[1]);
      return JSON.parse(decoded);
    } catch {
      try {
        return JSON.parse(match[1]);
      } catch {
        return {};
      }
    }
  }
  return {};
}

export function stripCategoryTag(content?: string): string {
  if (!content) return '';
  return content.replace(/<!--category:(news|media|resources)-->/g, '').trim();
}

export function stripMetadataTags(content?: string): string {
  if (!content) return '';
  return content
    .replace(/<!--category:(news|media|resources)-->/g, '')
    .replace(/<!--gallery:.*?-->/g, '')
    .replace(/<!--pdf:.*?-->/g, '')
    .trim();
}

export function embedMetadataTags(
  content?: string,
  category: BlogCategory = 'news',
  gallery: string[] = [],
  pdf?: { url?: string; name?: string; size?: string }
): string {
  const clean = stripMetadataTags(content);
  const galleryTag = gallery && gallery.length > 0 
    ? `<!--gallery:${encodeURIComponent(JSON.stringify(gallery))}-->` 
    : '';
  const pdfTag = pdf && pdf.url
    ? `<!--pdf:${encodeURIComponent(JSON.stringify(pdf))}-->`
    : '';
  return `<!--category:${category}-->${galleryTag}${pdfTag}${clean}`;
}

export function embedCategoryTag(content?: string, category: BlogCategory = 'news'): string {
  return embedMetadataTags(content, category, [], undefined);
}

const formatPost = (post: any): BlogPost => {
  if (!post) return post;
  const category = extractCategory(post.content, post.category);
  const gallery = extractGallery(post.content);
  const pdf = extractPdf(post.content);
  return {
    ...post,
    category,
    gallery,
    pdf_url: post.pdf_url || pdf.url,
    pdf_name: post.pdf_name || pdf.name,
    pdf_size: post.pdf_size || pdf.size,
    content: stripMetadataTags(post.content),
  };
};

export const blogService = {
  // Public facing: Get all published posts, optionally filtered by category
  getPublishedPosts: async (category?: BlogCategory) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name, avatar_url)')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    const formatted = (data || []).map(formatPost);
    if (category) {
      return formatted.filter((p) => p.category === category);
    }
    return formatted;
  },

  // Public facing: Get a single published post by slug
  getPostBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name, avatar_url)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    return data ? formatPost(data) : null;
  },

  // Admin: Get all posts
  getAllPosts: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(formatPost);
  },

  // Admin: Get a single post by ID
  getPostById: async (id: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? formatPost(data) : null;
  },

  // Admin: Create a new post
  createPost: async (postData: Partial<BlogPost>) => {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) throw new Error('Not authenticated');

    const category = postData.category || 'news';
    const gallery = postData.gallery || [];
    const pdf = postData.pdf_url ? { url: postData.pdf_url, name: postData.pdf_name, size: postData.pdf_size } : undefined;
    const content = embedMetadataTags(postData.content, category, gallery, pdf);

    // Omit category, gallery, and pdf columns to prevent schema mismatch if column doesn't exist
    const { category: _c, gallery: _g, pdf_url: _pu, pdf_name: _pn, pdf_size: _ps, ...restPostData } = postData;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...restPostData,
        content,
        author_id: userId,
        published_at: postData.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  // Admin: Update a post
  updatePost: async (id: string, postData: Partial<BlogPost>) => {
    const category = postData.category || 'news';
    const gallery = postData.gallery || [];
    const pdf = postData.pdf_url ? { url: postData.pdf_url, name: postData.pdf_name, size: postData.pdf_size } : undefined;
    let content = postData.content;
    if (content !== undefined || postData.gallery !== undefined || postData.pdf_url !== undefined) {
      content = embedMetadataTags(content, category, gallery, pdf);
    }

    const { category: _c, gallery: _g, pdf_url: _pu, pdf_name: _pn, pdf_size: _ps, ...restPostData } = postData;
    const updatePayload: any = { ...restPostData };
    if (content !== undefined) {
      updatePayload.content = content;
    }

    // Auto set published_at when published
    if (updatePayload.published === true && !updatePayload.published_at) {
      updatePayload.published_at = new Date().toISOString();
    } else if (updatePayload.published === false) {
      updatePayload.published_at = null;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return formatPost(data);
  },

  // Admin: Delete a post
  deletePost: async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
