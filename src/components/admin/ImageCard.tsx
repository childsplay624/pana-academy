import { useState, useRef } from 'react';
import { Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SiteImage } from '@/services/imageService';

interface ImageCardProps {
    image: SiteImage;
    onUpdate: (id: string, updates: Partial<SiteImage>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onReplace?: (id: string, file: File) => Promise<void>;
}

export function ImageCard({ image, onUpdate, onDelete, onReplace }: ImageCardProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showReplaceDialog, setShowReplaceDialog] = useState(false);
    const [altText, setAltText] = useState(image.alt_text || '');
    const [description, setDescription] = useState(image.description || '');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [replacing, setReplacing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onUpdate(image.id, {
                alt_text: altText,
                description: description,
            });
            setShowEditDialog(false);
        } catch (error) {
            console.error('Error updating image:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(image.id);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting image:', error);
        } finally {
            setDeleting(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setShowReplaceDialog(true);
        }
    };

    const handleReplace = async () => {
        if (!selectedFile || !onReplace) return;

        setReplacing(true);
        try {
            await onReplace(image.id, selectedFile);
            setShowReplaceDialog(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error replacing image:', error);
        } finally {
            setReplacing(false);
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted/20 relative group">
                    <img
                        src={image.url}
                        alt={image.alt_text || 'Site image'}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {onReplace && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => fileInputRef.current?.click()}
                                title="Replace image"
                            >
                                <Upload className="w-4 h-4" />
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowEditDialog(true)}
                            title="Edit metadata"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            title="Delete image"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{image.key}</h4>
                            {image.alt_text && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {image.alt_text}
                                </p>
                            )}
                        </div>
                        {image.is_active ? (
                            <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                                <Eye className="w-3 h-3" />
                                Active
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                                <EyeOff className="w-3 h-3" />
                                Inactive
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(image.file_size)}</span>
                        {image.width && image.height && (
                            <span>
                                {image.width} × {image.height}
                            </span>
                        )}
                    </div>

                    {!image.alt_text && (
                        <Badge variant="destructive" className="text-xs">
                            Missing alt text
                        </Badge>
                    )}
                </CardContent>
            </Card >

            {/* Edit Dialog */}
            < Dialog open={showEditDialog} onOpenChange={setShowEditDialog} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Image Metadata</DialogTitle>
                        <DialogDescription>
                            Update the alt text and description for this image.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.alt_text || 'Preview'}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-alt-text">Alt Text *</Label>
                            <Input
                                id="edit-alt-text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Descriptive text for the image"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Additional context about the image"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEditDialog(false)}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!altText || saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* Delete Dialog */}
            < Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Image</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this image? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden mb-4">
                            <img
                                src={image.url}
                                alt={image.alt_text || 'Preview'}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-sm font-medium">{image.key}</p>
                        {image.alt_text && (
                            <p className="text-sm text-muted-foreground">{image.alt_text}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Image'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Replace Image Dialog */}
            <Dialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Replace Image</DialogTitle>
                        <DialogDescription>
                            Upload a new file to replace this image. The metadata and key will be preserved.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Current Image */}
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Current Image</Label>
                            <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                                <img
                                    src={image.url}
                                    alt={image.alt_text || 'Current'}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* New Image Preview */}
                        {previewUrl && (
                            <div>
                                <Label className="text-sm font-medium mb-2 block">New Image Preview</Label>
                                <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="New preview"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {selectedFile && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        File: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowReplaceDialog(false);
                                setSelectedFile(null);
                                setPreviewUrl(null);
                            }}
                            disabled={replacing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReplace}
                            disabled={!selectedFile || replacing}
                        >
                            {replacing ? 'Replacing...' : 'Replace Image'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
