import { supabase } from '@/integrations/supabase/client';

export type ImageCategory = 'hero' | 'team' | 'logo' | 'values' | 'other';

export interface SiteImage {
    id: string;
    key: string;
    category: ImageCategory;
    url: string;
    alt_text?: string;
    description?: string;
    width?: number;
    height?: number;
    file_size?: number;
    mime_type?: string;
    is_active: boolean;
    display_order: number;
    metadata?: Record<string, any>;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Register an external URL (e.g. YouTube or direct video link) in the database
 */
export async function saveExternalUrl(
    url: string,
    metadata: ImageMetadata
): Promise<SiteImage> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('site_images')
        .insert({
            key: metadata.key,
            category: metadata.category,
            url,
            alt_text: metadata.alt_text,
            description: metadata.description,
            display_order: metadata.display_order || 0,
            is_active: true,
            created_by: user?.id,
            metadata: metadata.metadata
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export interface ImageMetadata {
    key: string;
    category: ImageCategory;
    alt_text?: string;
    description?: string;
    width?: number;
    height?: number;
    display_order?: number;
    metadata?: Record<string, any>;
}

export interface ImageInsights {
    totalImages: number;
    totalSize: number;
    imagesByCategory: Record<ImageCategory, number>;
    largeImages: SiteImage[];
    missingAltText: SiteImage[];
    inactiveImages: SiteImage[];
}

/**
 * Fetch all images, optionally filtered by category
 */
export async function fetchSiteImages(category?: ImageCategory): Promise<SiteImage[]> {
    let query = supabase
        .from('site_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching site images:', error);
        throw error;
    }

    return data || [];
}

/**
 * Fetch a single image by key
 */
export async function fetchImageByKey(key: string): Promise<SiteImage | null> {
    const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .eq('key', key)
        .eq('is_active', true)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // Not found
            return null;
        }
        console.error('Error fetching image by key:', error);
        throw error;
    }

    return data;
}

/**
 * Upload an image file to Supabase Storage and create database record
 */
export async function uploadImage(
    file: File,
    metadata: ImageMetadata
): Promise<SiteImage> {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${metadata.key}-${Date.now()}.${fileExt}`;
        const filePath = `${metadata.category}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('site-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('site-images')
            .getPublicUrl(filePath);

        // Create database record
        const { data, error } = await supabase
            .from('site_images')
            .insert({
                ...metadata,
                url: urlData.publicUrl,
                file_size: file.size,
                mime_type: file.type,
                width: metadata.width,
                height: metadata.height,
            })
            .select()
            .single();

        if (error) {
            // Clean up uploaded file if database insert fails
            await supabase.storage.from('site-images').remove([filePath]);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Update image metadata
 */
export async function updateImage(
    id: string,
    updates: Partial<SiteImage>
): Promise<SiteImage> {
    const { data, error } = await supabase
        .from('site_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating image:', error);
        throw error;
    }

    return data;
}

/**
 * Delete an image (marks as inactive and removes from storage)
 */
export async function deleteImage(id: string): Promise<void> {
    // Get image details first
    const { data: image, error: fetchError } = await supabase
        .from('site_images')
        .select('url')
        .eq('id', id)
        .single();

    if (fetchError) {
        throw fetchError;
    }

    // Mark as inactive in database
    const { error: updateError } = await supabase
        .from('site_images')
        .update({ is_active: false })
        .eq('id', id);

    if (updateError) {
        throw updateError;
    }

    // Extract path from URL and delete from storage
    if (image?.url && image.url.includes('site-images')) {
        const urlParts = image.url.split('site-images/');
        if (urlParts[1]) {
            const filePath = urlParts[1];
            await supabase.storage.from('site-images').remove([filePath]);
        }
    }
}

/**
 * Reorder images within a category
 */
export async function reorderImages(
    category: ImageCategory,
    orderedIds: string[]
): Promise<void> {
    const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index + 1,
    }));

    for (const update of updates) {
        await supabase
            .from('site_images')
            .update({ display_order: update.display_order })
            .eq('id', update.id);
    }
}

/**
 * Get image insights and statistics
 */
export async function getImageInsights(): Promise<ImageInsights> {
    const { data: allImages, error } = await supabase
        .from('site_images')
        .select('*');

    if (error) {
        throw error;
    }

    const images = allImages || [];
    const activeImages = images.filter((img) => img.is_active);

    // Calculate statistics
    const totalSize = activeImages.reduce((sum, img) => sum + (img.file_size || 0), 0);

    const imagesByCategory = activeImages.reduce((acc, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
    }, {} as Record<ImageCategory, number>);

    // Images larger than 500KB
    const largeImages = activeImages.filter((img) => (img.file_size || 0) > 500 * 1024);

    // Images without alt text
    const missingAltText = activeImages.filter((img) => !img.alt_text);

    // Inactive images
    const inactiveImages = images.filter((img) => !img.is_active);

    return {
        totalImages: activeImages.length,
        totalSize,
        imagesByCategory,
        largeImages,
        missingAltText,
        inactiveImages,
    };
}

/**
 * Replace an existing image with a new file
 */
export async function replaceImage(
    id: string,
    file: File
): Promise<SiteImage> {
    // Get existing image
    const { data: existingImage, error: fetchError } = await supabase
        .from('site_images')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) {
        throw fetchError;
    }

    // Delete old file from storage
    if (existingImage.url.includes('site-images')) {
        const urlParts = existingImage.url.split('site-images/');
        if (urlParts[1]) {
            await supabase.storage.from('site-images').remove([urlParts[1]]);
        }
    }

    // Upload new file
    const fileExt = file.name.split('.').pop();
    const fileName = `${existingImage.key}-${Date.now()}.${fileExt}`;
    const filePath = `${existingImage.category}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

    if (uploadError) {
        throw uploadError;
    }

    // Get new public URL
    const { data: urlData } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

    // Update database record
    const { data, error: updateError } = await supabase
        .from('site_images')
        .update({
            url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
        })
        .eq('id', id)
        .select()
        .single();

    if (updateError) {
        throw updateError;
    }

    return data;
}
