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
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
        <div className="space-y-2 w-full">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {value ? (
                    <div className="relative group w-32 h-32 rounded-lg overflow-hidden border flex-shrink-0 bg-muted mx-auto sm:mx-0">
                        <img src={value} alt="Selected" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="h-8 w-8 shadow-lg" onClick={() => setIsOpen(true)}>
                                <Upload className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8 shadow-lg" onClick={() => onSelect('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-32 h-32 border-dashed flex flex-col gap-2 flex-shrink-0 mx-auto sm:mx-0"
                        onClick={() => setIsOpen(true)}
                    >
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{label}</span>
                    </Button>
                )}

                <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                    <p className="text-sm font-semibold">Course Thumbnail</p>
                    <p className="text-xs text-muted-foreground">Best for display: 800x600px square or 4:3</p>
                    <div className="flex justify-center sm:justify-start">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="link" className="p-0 h-auto text-sm text-primary font-medium hover:no-underline group">
                                    <span className="border-b border-primary/30 group-hover:border-primary transition-colors">
                                        {value ? 'Change image' : 'Choose from gallery'}
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] sm:max-w-[900px] w-full h-[90vh] sm:h-[750px] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                                <div className="flex flex-col h-full relative">
                                    {/* Header Section */}
                                    <div className="p-6 pb-2 border-b bg-muted/30 backdrop-blur-md sticky top-0 z-10">
                                        <DialogHeader className="mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <ImageIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-xl font-bold tracking-tight">Media Library</DialogTitle>
                                                    <p className="text-xs text-muted-foreground">Select or upload assets for your course</p>
                                                </div>
                                            </div>
                                        </DialogHeader>

                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <TabsList className="bg-muted/50 p-1 mb-2 inline-flex w-auto border">
                                                <TabsTrigger value="gallery" className="rounded-md px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                                    Gallery
                                                </TabsTrigger>
                                                <TabsTrigger value="upload" className="rounded-md px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                                    Upload New
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <div className="flex-1 min-h-0 bg-transparent">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'gallery' ? (
                                                <motion.div
                                                    key="gallery"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-full flex flex-col p-6"
                                                >
                                                    <div className="relative mb-6 group">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="Search in media library..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            className="pl-10 h-11 bg-white ring-offset-background transition-all focus-visible:ring-primary/20 focus-visible:ring-4 border-muted-foreground/20 rounded-xl"
                                                        />
                                                    </div>

                                                    <ScrollArea className="flex-1 -mr-2 pr-2">
                                                        {loading ? (
                                                            <div className="flex flex-col items-center justify-center h-64 gap-3">
                                                                <div className="relative">
                                                                    <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                                                </div>
                                                                <p className="text-sm font-medium text-muted-foreground animate-pulse">Scanning server assets...</p>
                                                            </div>
                                                        ) : filteredImages.length > 0 ? (
                                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-8">
                                                                {filteredImages.map((img, index) => (
                                                                    <motion.div
                                                                        key={img.id}
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: index * 0.03, duration: 0.2 }}
                                                                    >
                                                                        <Card
                                                                            className={`group relative cursor-pointer overflow-hidden border-2 transition-all duration-300 rounded-xl h-full ${value === img.url ? 'border-primary ring-4 ring-primary/10 bg-primary/5' : 'border-transparent hover:border-primary/50 hover:shadow-xl bg-muted/20'}`}
                                                                            onClick={() => handleSelect(img.url)}
                                                                        >
                                                                            <CardContent className="p-0 relative aspect-[4/3]">
                                                                                <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                                                
                                                                                {/* Selection Overlay */}
                                                                                {value === img.url && (
                                                                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                                                                                        <motion.div 
                                                                                            initial={{ scale: 0 }}
                                                                                            animate={{ scale: 1 }}
                                                                                            className="bg-primary text-white rounded-full p-2 shadow-xl ring-4 ring-white"
                                                                                        >
                                                                                            <Check className="h-5 w-5 stroke-[3px]" />
                                                                                        </motion.div>
                                                                                    </div>
                                                                                )}

                                                                                {/* Hover Info Overlay */}
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                                                                    <p className="text-[11px] font-bold text-white truncate drop-shadow-lg">{img.key}</p>
                                                                                    {img.alt_text && (
                                                                                        <p className="text-[10px] text-gray-200 truncate opacity-80">{img.alt_text}</p>
                                                                                    )}
                                                                                </div>

                                                                                {/* Size/Type Badge (UI Polish) */}
                                                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                                    <Badge variant="secondary" className="bg-black/40 backdrop-blur-md text-white border-none text-[9px] h-5 py-0 px-1.5 font-medium">
                                                                                        IMAGE
                                                                                    </Badge>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-muted-foreground/10">
                                                                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                                                                <p className="text-base font-semibold text-muted-foreground">No media found</p>
                                                                <p className="text-sm text-muted-foreground/60 max-w-[200px] mx-auto">Try a different search or upload a new image.</p>
                                                            </div>
                                                        )}
                                                    </ScrollArea>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="upload"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-full flex flex-col pt-0"
                                                >
                                                    <ScrollArea className="flex-1">
                                                        <div className="p-8 max-w-2xl mx-auto w-full pb-12">
                                                            <div className="mb-8 text-center">
                                                                <div className="inline-flex p-3 bg-primary/5 rounded-2xl mb-4 ring-1 ring-primary/20">
                                                                    <Upload className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <h3 className="text-xl font-bold">Upload New Content</h3>
                                                                <p className="text-sm text-muted-foreground mt-1">Add images to your library to use them in your courses.</p>
                                                            </div>
                                                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                                                <ImageUploader
                                                                    onUpload={handleUpload}
                                                                    category={category}
                                                                />
                                                            </div>
                                                        </div>
                                                    </ScrollArea>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Action Bar (Optional but Premium) */}
                                    <div className="p-4 border-t bg-muted/30 flex items-center justify-between backdrop-blur-md">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pana Academy Media Library v2.0</p>
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => setIsOpen(false)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
