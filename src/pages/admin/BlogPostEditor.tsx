import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Save, Loader2, Newspaper, Image as ImageIcon, FileText, Images, Trash2, Plus, Star, FileUp, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { blogService, BlogPost, BlogCategory } from '@/services/blogService';
import { supabase } from '@/integrations/supabase/client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function BlogPostEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogCategory>('news');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pdfSize, setPdfSize] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await blogService.getPostById(id!);
      if (post) {
        setTitle(post.title || '');
        setSlug(post.slug || '');
        setCategory(post.category || 'news');
        setExcerpt(post.excerpt || '');
        setContent(post.content || '');
        setCoverImage(post.cover_image || '');
        setGallery(post.gallery || []);
        setPdfUrl(post.pdf_url || '');
        setPdfName(post.pdf_name || '');
        setPdfSize(post.pdf_size || '');
        setPublished(post.published || false);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({ title: 'Error', description: 'Failed to load post', variant: 'destructive' });
      navigate('/dashboard/blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!id) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    if (gallery.includes(url)) {
      toast({ title: 'Already Added', description: 'This image is already in the gallery.' });
      return;
    }
    setGallery([...gallery, url]);
    // Auto-set cover image if none is selected yet
    if (!coverImage) {
      setCoverImage(url);
    }
    toast({ title: 'Photo Added', description: 'Photo added to activity gallery.' });
  };

  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return;
    handleAddGalleryImage(customImageUrl.trim());
    setCustomImageUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGallery(gallery.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsCover = (url: string) => {
    setCoverImage(url);
    toast({ title: 'Cover Updated', description: 'Selected photo set as the main cover image.' });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a valid PDF document (.pdf)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum PDF file size is 25MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploadingPdf(true);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `documents/${Date.now()}-${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setPdfUrl(publicUrl);
      setPdfName(file.name);
      setPdfSize(sizeFormatted);

      toast({
        title: 'PDF Uploaded',
        description: `"${file.name}" attached successfully.`,
      });
    } catch (error: any) {
      console.error('Error uploading PDF:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Could not upload PDF document.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPdf(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const handleRemovePdf = () => {
    setPdfUrl('');
    setPdfName('');
    setPdfSize('');
    toast({ title: 'PDF Removed', description: 'Document attachment cleared.' });
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast({ title: 'Validation Error', description: 'Title and Slug are required.', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      const postData: Partial<BlogPost> = {
        title,
        slug,
        category,
        excerpt,
        content,
        cover_image: coverImage,
        gallery,
        pdf_url: pdfUrl,
        pdf_name: pdfName,
        pdf_size: pdfSize,
        published
      };

      if (id) {
        await blogService.updatePost(id, postData);
        toast({ title: 'Saved', description: 'Post updated successfully.' });
      } else {
        await blogService.createPost(postData);
        toast({ title: 'Created', description: 'Post created successfully.' });
        navigate('/dashboard/blog');
      }
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to save post', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate('/dashboard/blog')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{id ? 'Edit Post' : 'New Post'}</h1>
              <p className="text-sm text-muted-foreground">{id ? 'Update your article content' : 'Create a new blog or news article'}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="px-6 shadow-md">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={handleTitleChange} placeholder="Article Title" className="text-lg font-semibold" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-url-slug" className="font-mono text-sm bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Article Body</Label>
                  <div className="bg-background rounded-md overflow-hidden border">
                    <ReactQuill 
                      theme="snow" 
                      value={content} 
                      onChange={setContent} 
                      modules={modules}
                      className="h-[400px] mb-12" // mb-12 to account for toolbar/footer overlap in some themes
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Activity Photo Gallery (Only appears when Media & Gallery is selected) */}
            {category === 'media' && (
              <Card className="border-blue-300 ring-2 ring-blue-500/20 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                      <Images className="w-5 h-5 text-blue-600" />
                      Media Activity Photo Gallery
                    </CardTitle>
                    <CardDescription>
                      Upload and manage the photo collection for this event, workshop, site visit, or training activity.
                    </CardDescription>
                  </div>
                  <Badge variant={category === 'media' ? "default" : "secondary"} className={category === 'media' ? "bg-blue-600 self-start sm:self-auto" : "self-start sm:self-auto"}>
                    {gallery.length} {gallery.length === 1 ? 'Photo' : 'Photos'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Picker / Upload action bar */}
                <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-gray-300 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <ImagePicker 
                      compact
                      onSelect={handleAddGalleryImage}
                      category="facilities"
                      label="Choose or Upload Photo"
                      buttonVariant="default"
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <Input 
                        placeholder="Or paste direct image URL (https://...)" 
                        value={customImageUrl} 
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomUrl(); } }}
                        className="text-sm bg-white"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleAddCustomUrl}
                        disabled={!customImageUrl.trim()}
                        className="px-4 shrink-0 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add URL
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload live plant exercises, inspections, workshop photos, or choose existing assets from the institute library.
                  </p>
                </div>

                {/* Gallery Grid */}
                {gallery.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed rounded-xl bg-gray-50/50">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <Images className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">No Gallery Photos Yet</p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                      Add photos of live plant exercises, facility inspections, student assessments, or ceremonies to build an interactive photo album.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {gallery.map((imgUrl, index) => {
                      const isCover = coverImage === imgUrl;
                      return (
                        <div 
                          key={index}
                          className="relative group rounded-xl overflow-hidden border border-gray-200 bg-muted aspect-[4/3] shadow-sm hover:shadow-md transition-all"
                        >
                          <img 
                            src={imgUrl} 
                            alt={`Gallery item ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                          
                          {/* Number & Cover Badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </span>
                            {isCover && (
                              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current" /> Cover
                              </span>
                            )}
                          </div>

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="w-7 h-7 rounded-full shadow"
                                onClick={() => handleRemoveGalleryImage(index)}
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            
                            {!isCover && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="w-full text-xs h-7 bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-sm"
                                onClick={() => handleSetAsCover(imgUrl)}
                              >
                                Set as Cover
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {/* PDF Document Attachment Card (Prominently displayed for resources, but available for any document attachment) */}
            <Card className={category === 'resources' ? "border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300" : "border-gray-200 shadow-sm"}>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      PDF Document Attachment {category === 'resources' && <Badge className="bg-emerald-600 text-white ml-2 text-xs">Primary for Resources & Policies</Badge>}
                    </CardTitle>
                    <CardDescription>
                      Upload institutional policies, compliance codes, brochures, charters, or research documents in PDF format for users to view and download.
                    </CardDescription>
                  </div>
                  {pdfUrl && (
                    <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                      PDF Attached
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pdfUrl ? (
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{pdfName || 'Attached Document.pdf'}</p>
                        <p className="text-xs text-muted-foreground">{pdfSize ? `${pdfSize} • ` : ''}Ready for download & viewing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <a 
                        href={pdfUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 mr-1 text-emerald-600" /> View/Test
                      </a>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemovePdf}
                        className="text-xs h-8"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors rounded-xl bg-gray-50/50 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                      {uploadingPdf ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileUp className="w-6 h-6" />}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {uploadingPdf ? 'Uploading PDF Document...' : 'Upload Official PDF Document'}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
                      Select brochures, institutional policies, governance manuals, or guidelines (PDF only, up to 25MB).
                    </p>
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-colors">
                      <FileUp className="w-4 h-4 mr-1.5" />
                      Browse PDF File
                      <input 
                        type="file" 
                        accept="application/pdf,.pdf" 
                        onChange={handlePdfUpload} 
                        disabled={uploadingPdf} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Section & Category</CardTitle>
                <CardDescription className="text-xs">Choose which page this post is published to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="post-category" className="text-sm font-medium">Category</Label>
                  <Select value={category} onValueChange={(val: BlogCategory) => setCategory(val)}>
                    <SelectTrigger id="post-category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-red-600" />
                          <span>News & Press (/news)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="media">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                          <span>Media & Gallery (/media)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="resources">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>Resources & Policies (/resources)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground pt-1">
                    {category === 'news' && 'This post will appear on the News & Press page.'}
                    {category === 'media' && 'This post will appear on the Media & Gallery page.'}
                    {category === 'resources' && 'This post will appear on the Resources & Policies page.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Published</Label>
                    <p className="text-xs text-muted-foreground">Make visible to public</p>
                  </div>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meta Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <ImagePicker 
                    value={coverImage}
                    onSelect={setCoverImage}
                    category="other"
                    label="Upload cover image"
                    title="Cover Image"
                    description="Recommended: 1200x630px or 16:9 banner"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Excerpt</Label>
                  <Textarea 
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary for blog listing..."
                    className="h-24 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
