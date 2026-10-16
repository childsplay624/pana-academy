import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContentMap {
  [key: string]: string;
}

/**
 * Hook to fetch and use database-driven content for a page.
 * Falls back to a provided default value if no override exists in the DB.
 *
 * Usage:
 *   const { get, loading } = usePageContent('about');
 *   <h1>{get('hero_title', 'Default Title')}</h1>
 */
export function usePageContent(slug: string) {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('content_key, content_value')
          .eq('page_slug', slug);

        if (error) {
          console.warn(`Could not load page content overrides for "${slug}":`, error.message);
          return;
        }

        const map: ContentMap = {};
        (data || []).forEach(row => {
          map[row.content_key] = row.content_value || '';
        });
        setContent(map);
      } catch (err) {
        console.warn(`Failed to load content for page "${slug}":`, err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  /**
   * Get a content value by key, with a fallback default.
   */
  const get = useCallback(
    (key: string, defaultValue: string = '') => {
      return content[key] !== undefined && content[key] !== '' 
        ? content[key] 
        : defaultValue;
    },
    [content]
  );

  return { get, content, loading };
}
