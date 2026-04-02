import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageIcon, Users, Images, Award, MoreHorizontal, AlertTriangle, HardDrive } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ImageCard } from '@/components/admin/ImageCard';
import { useSiteImages } from '@/hooks/useSiteImage';
import { uploadImage, updateImage, deleteImage, replaceImage, getImageInsights, ImageCategory, saveExternalUrl } from '@/services/imageService';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function ImageManagement() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<ImageCategory>('hero');

    // Fetch images for active category
    const { images, isLoading, refetch } = useSiteImages(activeTab);

    // Fetch insights
    const { data: insights, refetch: refetchInsights } = useQuery({
        queryKey: ['image-insights'],
        queryFn: getImageInsights,
    });

    const handleUpload = async (file: File, metadata: { alt_text?: string; description?: string; customKey?: string }) => {
        try {
            // Get next display order
            const maxOrder = images.reduce((max, img) => Math.max(max, img.display_order), 0);

            // Use custom key if provided, otherwise generate default
            const imageKey = metadata.customKey || `${activeTab}_${Date.now()}`;

            await uploadImage(file, {
                key: imageKey,
                category: activeTab,
                alt_text: metadata.alt_text,
                description: metadata.description,
                display_order: maxOrder + 1,
            });

            await refetch();
            await refetchInsights();
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleUpdate = async (id: string, updates: any) => {
        try {
            await updateImage(id, updates);
            await refetch();
            await refetchInsights();

            toast({
                title: 'Image updated',
                description: 'Image metadata has been updated successfully.',
            });
        } catch (error) {
            console.error('Update error:', error);
            toast({
                title: 'Update failed',
                description: 'Failed to update image. Please try again.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteImage(id);
            await refetch();
            await refetchInsights();

            toast({
                title: 'Image deleted',
                description: 'The image has been deleted successfully.',
            });
        } catch (error) {
            console.error('Delete error:', error);
            toast({
                title: 'Delete failed',
                description: 'Failed to delete image. Please try again.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const handleReplace = async (id: string, file: File) => {
        try {
            await replaceImage(id, file);
            await refetch();
            await refetchInsights();

            toast({
                title: 'Image replaced',
                description: 'The image has been replaced successfully.',
            });
        } catch (error) {
            console.error('Replace error:', error);
            toast({
                title: 'Replace failed',
                description: 'Failed to replace image. Please try again.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const handleUrlUpload = async (url: string, metadata: { alt_text?: string; description?: string; customKey?: string }) => {
        try {
            const maxOrder = images.reduce((max, img) => Math.max(max, img.display_order), 0);
            const imageKey = metadata.customKey || `${activeTab}_${Date.now()}`;

            await saveExternalUrl(url, {
                key: imageKey,
                category: activeTab,
                alt_text: metadata.alt_text,
                description: metadata.description || '',
                display_order: maxOrder + 1,
            });

            await refetch();
            await refetchInsights();
            toast({
                title: 'URL Saved',
                description: 'The media link has been saved successfully.',
            });
        } catch (error) {
            console.error('URL error:', error);
            toast({
                title: 'Save failed',
                description: 'Failed to save URL. Please try again.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getCategoryIcon = (category: ImageCategory) => {
        switch (category) {
            case 'hero': return ImageIcon;
            case 'team': return Users;
            case 'logo': return Images;
            case 'values': return Award;
            default: return MoreHorizontal;
        }
    };

    const getCategoryLabel = (category: ImageCategory) => {
        switch (category) {
            case 'hero': return 'Hero Slides';
            case 'team': return 'Team Members';
            case 'logo': return 'Logos';
            case 'values': return 'Values';
            case 'other': return 'Other';
            default: return category;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Image Management</h1>
                    <p className="text-muted-foreground">
                        Manage all site images from one centralized location
                    </p>
                </div>

                {/* Insights Panel */}
                {insights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insights.totalImages}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Active images across all categories
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatBytes(insights.totalSize)}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total size of all images
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    Large Images
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insights.largeImages.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Images over 500KB
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    Missing Alt Text
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{insights.missingAltText.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    SEO/Accessibility issue
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Image Library</CardTitle>
                        <CardDescription>Upload and manage images by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ImageCategory)}>
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="hero" className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Hero</span>
                                </TabsTrigger>
                                <TabsTrigger value="team" className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span className="hidden sm:inline">Team</span>
                                </TabsTrigger>
                                <TabsTrigger value="logo" className="flex items-center gap-2">
                                    <Images className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logos</span>
                                </TabsTrigger>
                                <TabsTrigger value="values" className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span className="hidden sm:inline">Values</span>
                                </TabsTrigger>
                                <TabsTrigger value="other" className="flex items-center gap-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                    <span className="hidden sm:inline">Other</span>
                                </TabsTrigger>
                            </TabsList>

                            {(['hero', 'team', 'logo', 'values', 'other'] as ImageCategory[]).map((category) => (
                                <TabsContent key={category} value={category} className="space-y-6 mt-6">
                                    {/* Header Image Instructions for Hero Category */}
                                    {category === 'hero' && (
                                        <Card className="border-blue-500/20 bg-blue-500/5">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                    Header Images
                                                </CardTitle>
                                                <CardDescription>
                                                    Upload header images for specific pages using custom keys
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="text-sm">
                                                    <p className="font-medium mb-2">Required Header Images:</p>
                                                    <ul className="space-y-1 text-muted-foreground">
                                                        <li>• <code className="bg-muted px-1 rounded">header_training</code> - Training Delivery page</li>
                                                        <li>• <code className="bg-muted px-1 rounded">header_about</code> - About page</li>
                                                        <li>• <code className="bg-muted px-1 rounded">header_team</code> - Team page</li>
                                                        <li>• <code className="bg-muted px-1 rounded">header_rnd</code> - R&D Services page</li>
                                                        <li>• <code className="bg-muted px-1 rounded">header_consultancy</code> - Consulting Services page</li>
                                                        <li>• <code className="bg-muted px-1 rounded">header_careers</code> - Careers page</li>
                                                    </ul>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Use the exact key name when uploading header images to ensure they appear on the correct pages.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Upload Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Upload New Asset</h3>
                                        <ImageUploader onUpload={handleUpload} onUrlUpload={handleUrlUpload} category={category} showCustomKey={category === 'hero' || category === 'logo'} />
                                    </div>

                                    <Separator />

                                    {/* Images Grid */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold">
                                                {getCategoryLabel(category)}
                                            </h3>
                                            <Badge variant="secondary">
                                                {images.length} {images.length === 1 ? 'image' : 'images'}
                                            </Badge>
                                        </div>

                                        {isLoading ? (
                                            <div className="text-center py-12">
                                                <HardDrive className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                                                <p className="text-muted-foreground">Loading images...</p>
                                            </div>
                                        ) : images.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                                <p className="text-muted-foreground">
                                                    No images in this category yet
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Upload your first image to get started
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {images.map((image) => (
                                                    <ImageCard
                                                        key={image.id}
                                                        image={image}
                                                        onUpdate={handleUpdate}
                                                        onDelete={handleDelete}
                                                        onReplace={handleReplace}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Optimization Tips */}
                {insights && (insights.largeImages.length > 0 || insights.missingAltText.length > 0) && (
                    <Card className="border-yellow-500/20 bg-yellow-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                                <AlertTriangle className="w-5 h-5" />
                                Optimization Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {insights.largeImages.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium">Large Images Detected</p>
                                    <p className="text-sm text-muted-foreground">
                                        {insights.largeImages.length} image{insights.largeImages.length !== 1 ? 's' : ''} exceed 500KB.
                                        Consider compressing these images for better page load performance.
                                    </p>
                                </div>
                            )}
                            {insights.missingAltText.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium">Missing Alt Text</p>
                                    <p className="text-sm text-muted-foreground">
                                        {insights.missingAltText.length} image{insights.missingAltText.length !== 1 ? 's' : ''} missing alt text.
                                        Add alt text to improve SEO and accessibility.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
