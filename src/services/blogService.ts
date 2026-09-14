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

export function stripCategoryTag(content?: string): string {
  if (!content) return '';
  return content.replace(/<!--category:(news|media|resources)-->/g, '').trim();
}

export function embedCategoryTag(content?: string, category: BlogCategory = 'news'): string {
  const clean = stripCategoryTag(content);
  return `<!--category:${category}-->${clean}`;
}

const formatPost = (post: any): BlogPost => {
  if (!post) return post;
  const category = extractCategory(post.content, post.category);
  return {
    ...post,
    category,
    content: stripCategoryTag(post.content),
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
    const content = embedCategoryTag(postData.content, category);

    // Omit category column to prevent schema mismatch if column doesn't exist
    const { category: _c, ...restPostData } = postData;

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
    const content = postData.content !== undefined ? embedCategoryTag(postData.content, category) : undefined;

    const { category: _c, ...restPostData } = postData;
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
