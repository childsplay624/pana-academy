import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchImageByKey, fetchSiteImages, ImageCategory } from '@/services/imageService';

interface SiteImage {
    id: string;
    key: string;
    url: string;
    alt_text: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface UseSiteImageReturn {
    imageUrl: string | null;
    altText: string;
    image: SiteImage | null;
    isLoading: boolean;
    error: any;
}

/**
 * Hook to fetch a single image by key with caching
 */
export function useSiteImage(key: string): UseSiteImageReturn {
    const { data, isLoading, error } = useQuery({
        queryKey: ['site-image', key],
        queryFn: async () => {
            console.log('Fetching image with key:', key);
            
            // First try to get the single image
            const { data, error } = await supabase
                .from('site_images')
                .select('*')
                .eq('key', key)
                .eq('is_active', true)
                .maybeSingle(); // Use maybeSingle() instead of single() to avoid PGRST116 error
            
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            if (!data) {
                console.log(`No image found for key: ${key}, using fallback`);
                return null; // Return null to trigger fallback
            }
            
            console.log('Image data from Supabase:', data);
            return data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        enabled: !!key,
        retry: 1, // Only retry once for missing images
    });

    // Fallback logic for missing images
    const getFallbackImage = (key: string) => {
        const fallbacks: Record<string, string> = {
            'auth_background': null, // Use CSS gradient fallback
            'logo_pana_why': '/panawhy.png',
            'header_training': null, // Use gradient fallback
            'header_about': null,
            'header_team': null,
            'header_rnd': null,
            'header_consultancy': null,
            'header_careers': null,
            'logo': '/logo.png',
            'hero': '/panawhy.png',
            'values_sands': '/values/sands.PNG',
            'values_maxims': '/values/maxims.jpg',
            'team_ifeyinwa_eucharia': '/team/Ifeyinwa-Eucharia.jpg',
        };
        
        return fallbacks[key] || null;
    };

    const imageUrl = data?.url || getFallbackImage(key);
    const altText = data?.alt_text || 'PANA Institute Image';

    return {
        imageUrl,
        altText,
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
