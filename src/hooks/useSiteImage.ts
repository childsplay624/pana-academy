import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchImageByKey, fetchSiteImages, ImageCategory } from '@/services/imageService';

/**
 * Hook to fetch a single image by key with caching
 */
export function useSiteImage(key: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['site-image', key],
        queryFn: async () => {
            console.log('Fetching image with key:', key);
            const { data, error } = await supabase
                .from('site_images')
                .select('*')
                .eq('key', key)
                .eq('is_active', true)
                .single();
            
            if (error) {
                console.error('Supabase error:', error);
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw error;
            }
            
            console.log('Image data from Supabase:', data);
            return data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        enabled: !!key,
    });

    return {
        imageUrl: data?.url,
        altText: data?.alt_text || '',
        image: data,
        isLoading,
        error,
    };
}

/**
 * Hook to fetch images by category with caching
 */
export function useSiteImages(category?: ImageCategory) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['site-images', category],
        queryFn: () => fetchSiteImages(category),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    return {
        images: data || [],
        isLoading,
        error,
        refetch,
    };
}
