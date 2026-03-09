import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Image as ImageIcon, Upload, Check, X, Loader2 } from 'lucide-react';
import { fetchSiteImages, ImageCategory, SiteImage } from '@/services/imageService';
import { supabase } from '@/integrations/supabase/client';
import { ImageUploader } from './ImageUploader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImagePickerProps {
    value?: string;
    onSelect: (url: string) => void;
    category?: ImageCategory;
    label?: string;
}

export function ImagePicker({ value, onSelect, category = 'other', label = 'Select Image' }: ImagePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<SiteImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('gallery');

    useEffect(() => {
        if (isOpen && activeTab === 'gallery') {
            loadImages();
        }
    }, [isOpen, activeTab]);

    const loadImages = async () => {
        setLoading(true);
        try {
            const data = await fetchSiteImages();
            setImages(data);
        } catch (error) {
            console.error('Error loading images for picker:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredImages = images.filter(img =>
        img.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (url: string) => {
        onSelect(url);
        setIsOpen(false);
    };

    const handleUpload = async (file: File, metadata: { alt_text?: string; description?: string }) => {
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

            // Upload directly to the site-images storage bucket
            const { error: uploadError } = await supabase.storage
                .from('site-images')
                .upload(filePath, file, { upsert: false, cacheControl: '3600' });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('site-images')
                .getPublicUrl(filePath);

            onSelect(publicUrl);
            setIsOpen(false);
        } catch (error) {
            console.error('Error in ImagePicker upload:', error);
            throw error; // Let ImageUploader show the error toast
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative group w-32 h-32 rounded-lg overflow-hidden border flex-shrink-0">
                        <img src={value} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setIsOpen(true)}>
                                <Upload className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => onSelect('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-32 h-32 border-dashed flex flex-col gap-2 flex-shrink-0"
                        onClick={() => setIsOpen(true)}
                    >
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{label}</span>
                    </Button>
                )}

                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Course Thumbnail</p>
                    <p className="text-xs text-muted-foreground">Recommended size: 800x600px</p>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                {value ? 'Change image' : 'Choose from gallery'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-[700px] w-full h-[85vh] sm:h-[600px] flex flex-col">
                            <DialogHeader>
                                <DialogTitle>Image Picker</DialogTitle>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                                    <TabsTrigger value="upload">Upload New</TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="gallery"
                                    className="flex-1 flex flex-col pt-4 min-h-0 data-[state=active]:flex"
                                >
                                    <div className="relative mb-4">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search images..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-8"
                                        />
                                    </div>

                                    <ScrollArea className="flex-1">
                                        {loading ? (
                                            <div className="flex items-center justify-center h-40">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : filteredImages.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                                                {filteredImages.map((img) => (
                                                    <Card
                                                        key={img.id}
                                                        className={`cursor-pointer overflow-hidden group hover:ring-2 hover:ring-primary transition-all ${value === img.url ? 'ring-2 ring-primary' : ''}`}
                                                        onClick={() => handleSelect(img.url)}
                                                    >
                                                        <CardContent className="p-0 relative aspect-video">
                                                            <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover" />
                                                            {value === img.url && (
                                                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                                    <div className="bg-primary text-white rounded-full p-1 shadow-lg">
                                                                        <Check className="h-4 w-4" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="absolute bottom-0 inset-x-0 p-1 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform">
                                                                <p className="text-[10px] text-white truncate">{img.key}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-10 text-muted-foreground">
                                                No images found.
                                            </div>
                                        )}
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="upload" className="flex-1 pt-4">
                                    <ImageUploader
                                        onUpload={handleUpload}
                                        category={category}
                                    />
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
