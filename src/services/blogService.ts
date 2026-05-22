import { supabase } from '@/integrations/supabase/client';

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
}

export const blogService = {
  // Public facing: Get all published posts
  getPublishedPosts: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name, avatar_url)')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
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
    return data;
  },

  // Admin: Get all posts
  getAllPosts: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Admin: Get a single post by ID
  getPostById: async (id: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Admin: Create a new post
  createPost: async (postData: Partial<BlogPost>) => {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        ...postData,
        author_id: userId,
        published_at: postData.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update a post
  updatePost: async (id: string, postData: Partial<BlogPost>) => {
    const updatePayload = { ...postData };
    
    // Auto set published_at when published
    if (updatePayload.published === true && !updatePayload.published_at) {
      updatePayload.published_at = new Date().toISOString();
    } else if (updatePayload.published === false) {
      updatePayload.published_at = null; // optional logic, maybe we want to keep it
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
