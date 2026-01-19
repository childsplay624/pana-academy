import { useQuery } from '@tanstack/react-query';
import { fetchImageByKey, fetchSiteImages, ImageCategory } from '@/services/imageService';

/**
 * Hook to fetch a single image by key with caching
 */
export function useSiteImage(key: string, fallbackUrl?: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['site-image', key],
        queryFn: () => fetchImageByKey(key),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        enabled: !!key,
    });

    return {
        imageUrl: data?.url || fallbackUrl || '/placeholder.svg',
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
