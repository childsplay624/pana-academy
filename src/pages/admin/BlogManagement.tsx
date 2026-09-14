import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, ExternalLink, Loader2, Newspaper, Image as ImageIcon, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { blogService, BlogPost, BlogCategory } from '@/services/blogService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Error', description: 'Failed to load blog posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await blogService.deletePost(deleteId);
      toast({ title: 'Deleted', description: 'Post has been deleted successfully.' });
      setPosts(posts.filter(p => p.id !== deleteId));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const newsCount = posts.filter(p => (p.category || 'news') === 'news').length;
  const mediaCount = posts.filter(p => p.category === 'media').length;
  const resourcesCount = posts.filter(p => p.category === 'resources').length;

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'all') return true;
    return (post.category || 'news') === selectedCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog & Media Management</h1>
            <p className="text-muted-foreground">Manage articles, trainee media gallery, news releases, and institutional resources.</p>
          </div>
          <Button onClick={() => navigate('/dashboard/blog/new')} className="font-bold shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl h-auto p-1 bg-muted/60">
            <TabsTrigger value="all" className="text-xs sm:text-sm py-2">
              All ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm py-2 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-red-600" />
              News ({newsCount})
            </TabsTrigger>
            <TabsTrigger value="media" className="text-xs sm:text-sm py-2 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              Media ({mediaCount})
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm py-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Resources ({resourcesCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory === 'all' && 'All Published & Draft Posts'}
              {selectedCategory === 'news' && 'News & Press Posts'}
              {selectedCategory === 'media' && 'Media & Gallery Posts'}
              {selectedCategory === 'resources' && 'Resources & Policy Posts'}
            </CardTitle>
            <CardDescription>
              {selectedCategory === 'all' && 'Showing all posts across News, Media, and Resources.'}
              {selectedCategory === 'news' && 'Posts appearing on the /news page.'}
              {selectedCategory === 'media' && 'Photo & documentation posts appearing on the /media page.'}
              {selectedCategory === 'resources' && 'Documents & compliance publications appearing on the /resources page.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground mb-4">
                  {posts.length === 0 ? 'No posts found. Start writing!' : 'No posts found in this category.'}
                </p>
                <Button onClick={() => navigate('/dashboard/blog/new')} variant="outline">
                  Create Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-card hover:shadow-md transition-shadow gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {post.cover_image ? (
                        <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-md flex-shrink-0 bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg line-clamp-1">{post.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {/* Category Badge */}
                          {post.category === 'media' && (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-blue-50 text-blue-700 border-blue-200">
                              Media & Gallery
                            </Badge>
                          )}
                          {post.category === 'resources' && (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                              Resources & Policies
                            </Badge>
                          )}
                          {(post.category === 'news' || !post.category) && (
                            <Badge variant="outline" className="text-[10px] font-semibold bg-red-50 text-red-700 border-red-200">
                              News & Press
                            </Badge>
                          )}

                          <Badge variant={post.published ? 'default' : 'secondary'} className="text-[10px]">
                            {post.published ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${post.slug}`, '_blank')} title="View Live">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/blog/edit/${post.id}`)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the post and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-white">
                Delete Post
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
