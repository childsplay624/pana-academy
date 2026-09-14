import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Save, Loader2, Newspaper, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { blogService, BlogPost, BlogCategory } from '@/services/blogService';
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
