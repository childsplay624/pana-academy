import { useCallback, useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
    onUpload: (file: File, metadata: { alt_text?: string; description?: string; customKey?: string }) => Promise<void>;
    category: string;
    disabled?: boolean;
    showCustomKey?: boolean;
}

export function ImageUploader({ onUpload, category, disabled, showCustomKey = false }: ImageUploaderProps) {
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [altText, setAltText] = useState('');
    const [description, setDescription] = useState('');
    const [customKey, setCustomKey] = useState('');
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please select an image smaller than 5MB',
                variant: 'destructive',
            });
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid file type',
                description: 'Please select an image file',
                variant: 'destructive',
            });
            return;
        }

        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'],
        },
        maxFiles: 1,
        disabled: disabled || uploading,
    });

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            await onUpload(selectedFile, {
                alt_text: altText,
                description: description,
                customKey: showCustomKey ? customKey : undefined,
            });

            // Reset form
            setSelectedFile(null);
            setPreview(null);
            setAltText('');
            setDescription('');
            setCustomKey('');

            toast({
                title: 'Image uploaded',
                description: 'The image has been uploaded successfully.',
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Upload failed',
                description: 'Failed to upload image. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreview(null);
        setAltText('');
        setDescription('');
        setCustomKey('');
    };

    return (
        <div className="space-y-4">
            {!preview ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50'
                        } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                        {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                        or click to browse files
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PNG, JPG, JPEG, WebP or SVG (max 5MB)
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative border rounded-lg overflow-hidden bg-muted/20">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-contain"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleCancel}
                            disabled={uploading}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                        {showCustomKey && (
                            <div className="space-y-2">
                                <Label htmlFor="custom-key">Image Key *</Label>
                                <Input
                                    id="custom-key"
                                    placeholder="e.g., header_training, header_about"
                                    value={customKey}
                                    onChange={(e) => setCustomKey(e.target.value)}
                                    disabled={uploading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use specific key for header images (e.g., header_training)
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="alt-text">Alt Text *</Label>
                            <Input
                                id="alt-text"
                                placeholder="Descriptive text for the image"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                disabled={uploading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                placeholder="Additional image context"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={uploading}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleUpload}
                                disabled={!altText || (showCustomKey && !customKey) || uploading}
                                className="flex-1"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
