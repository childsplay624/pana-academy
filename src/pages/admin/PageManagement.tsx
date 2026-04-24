import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FileText, Edit, ExternalLink, Trash2, MoreVertical } from 'lucide-react';
import { pageService, Page } from '@/services/pageService';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function PageManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pageService.getPages();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async () => {
    if (!newPage.title || !newPage.slug) return;
    
    try {
      const created = await pageService.createPage({
        ...newPage,
        status: 'draft'
      });
      setIsNewPageDialogOpen(false);
      navigate(`/dashboard/pages/edit/${created.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    
    try {
      await pageService.deletePage(id);
      setPages(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Page deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete page', variant: 'destructive' });
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Page Builder</h1>
            <p className="text-muted-foreground">Manage your custom site pages and modular sections</p>
          </div>
          <Dialog open={isNewPageDialogOpen} onOpenChange={setIsNewPageDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>Enter the title and path for your new page.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Terms of Service" 
                    value={newPage.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewPage({ title, slug });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Page Slug (URL path)</Label>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted p-2 rounded">
                    <span>/p/</span>
                    <Input 
                      id="slug" 
                      className="h-7 border-none bg-transparent p-0 focus-visible:ring-0" 
                      value={newPage.slug}
                      onChange={(e) => setNewPage(prev => ({ ...prev, slug: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPageDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePage}>Create & Edit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Total Pages ({filteredPages.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading pages...</div>
            ) : filteredPages.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg font-medium">No pages found</p>
                <p className="text-sm text-muted-foreground mt-1">Create your first custom page to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary">
                          {page.page_type === 'static' ? `/${page.slug}` : `/p/${page.slug}`}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={page.page_type === 'static' ? 'border-blue-400 text-blue-600' : 'border-green-400 text-green-600'}>
                          {page.page_type === 'static' ? '⚡ Static' : '🧩 Dynamic'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                          {page.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => window.open(page.page_type === 'static' ? `/${page.slug}` : `/p/${page.slug}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate(`/dashboard/pages/edit/${page.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {page.page_type === 'dynamic' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePage(page.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
