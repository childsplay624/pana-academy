import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  fetchCategoriesWithSubcategories,
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  Category 
} from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Search,
  Grid,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CourseCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    display_order: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategoriesWithSubcategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        display_order: category.display_order
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        display_order: categories.length
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast({ title: "Success", description: "Category updated successfully" });
      } else {
        await createCategory(formData);
        toast({ title: "Success", description: "Category created successfully" });
      }
      setIsDialogOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "Failed to save category. Make sure the slug is unique.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect courses assigned to it.')) {
      try {
        await deleteCategory(id);
        toast({ title: "Success", description: "Category deleted successfully" });
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive"
        });
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Course Categories</h1>
            <p className="text-muted-foreground">Manage the taxonomy used to organize courses across the platform.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3 px-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Grid className="w-5 h-5 text-primary" />
                Existing Categories
                <Badge variant="secondary" className="ml-2">{categories.length}</Badge>
              </CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search categories..." 
                  className="pl-9 bg-muted/50 border-none focus-visible:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-20 bg-muted/10 rounded-xl mx-6 mb-6">
                <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold">No categories found</h3>
                <p className="text-muted-foreground">Try adjusting your search or add a new category.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="w-[80px] font-bold uppercase text-[10px] tracking-wider italic">Order</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-wider italic">Category Name</TableHead>
                      <TableHead className="font-bold uppercase text-[10px] tracking-wider italic">Slug</TableHead>
                      <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-wider italic">Description</TableHead>
                      <TableHead className="text-right font-bold uppercase text-[10px] tracking-wider italic">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors border-b-muted/50">
                        <TableCell className="font-medium text-center">
                          <Badge variant="outline" className="font-mono">{category.display_order}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-xs text-primary">
                              {category.code_prefix || <Tag className="w-4 h-4 text-primary" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                {category.domain_no && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-bold">
                                    Domain {category.domain_no}
                                  </Badge>
                                )}
                                <span className="font-bold">{category.name}</span>
                              </div>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <span className="text-xs text-muted-foreground block mt-0.5">
                                  {category.subcategories.length} Course Areas (Sub-categories)
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{category.slug}</code>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground text-sm italic">
                          {category.description || 'No description provided'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleOpenDialog(category)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => handleDelete(category.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg sm:rounded-[2rem]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black italic">{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                <DialogDescription>
                  Fill in the details below to organize your courses effectively.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest italic">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Technology" 
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({...formData, name: e.target.value});
                        if (!editingCategory) {
                          setFormData(prev => ({...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}));
                        }
                      }}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest italic">Slug (URL)</Label>
                    <Input 
                      id="slug" 
                      placeholder="e.g. technology" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-xs font-black uppercase tracking-widest italic">Icon Name (Lucide)</Label>
                    <Input 
                      id="icon" 
                      placeholder="e.g. Cpu, Book, Activity" 
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-xs font-black uppercase tracking-widest italic">Display Order</Label>
                    <Input 
                      id="order" 
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest italic">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Short summary of what this category covers..." 
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full px-6">Cancel</Button>
                <Button type="submit" disabled={saving} className="rounded-full px-8 bg-primary shadow-lg shadow-primary/20">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
