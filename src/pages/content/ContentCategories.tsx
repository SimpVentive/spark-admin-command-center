import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Folder, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  content_count?: number;
}

const ContentCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await (supabase as any).from('content_categories').select('*').eq('is_active', true).order('name');
      if (error) throw error;

      // Get content counts
      const categoriesWithCounts = await Promise.all((data || []).map(async (cat: any) => {
        const { count } = await (supabase as any).from('content_items').select('*', { count: 'exact', head: true }).eq('category_id', cat.id).eq('is_active', true);
        return { ...cat, content_count: count || 0 };
      }));
      setCategories(categoriesWithCounts);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    try {
      const colors = ['#3B82F6', '#22C55E', '#EF4444', '#EAB308', '#A855F7', '#F97316'];
      const { error } = await (supabase as any).from('content_categories').insert([{
        name: newCategory.name.trim(),
        description: newCategory.description || null,
        color: colors[Math.floor(Math.random() * colors.length)],
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Category created" });
      setNewCategory({ name: "", description: "" });
      setIsAddOpen(false);
      fetchCategories();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('content_categories').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Category deleted" });
      fetchCategories();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const totalItems = categories.reduce((sum, cat) => sum + (cat.content_count || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-foreground">Content Categories</h1><p className="text-muted-foreground">Organize your learning content into categories</p></div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Category Name *</Label><Input value={newCategory.name} onChange={(e) => setNewCategory(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" /></div>
              <div><Label>Description</Label><Textarea value={newCategory.description} onChange={(e) => setNewCategory(p => ({ ...p, description: e.target.value }))} placeholder="Enter description" /></div>
              <Button onClick={handleAddCategory} className="w-full">Create Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2"><Folder className="h-5 w-5 text-muted-foreground" /><CardTitle className="text-lg">{category.name}</CardTitle></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{category.description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: (category.color || '#888') + '20', color: category.color || '#888' }}>{category.content_count || 0} items</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Category Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg"><div className="text-2xl font-bold text-foreground">{categories.length}</div><div className="text-sm text-muted-foreground">Total Categories</div></div>
            <div className="text-center p-4 bg-muted rounded-lg"><div className="text-2xl font-bold text-foreground">{totalItems}</div><div className="text-sm text-muted-foreground">Total Content Items</div></div>
            <div className="text-center p-4 bg-muted rounded-lg"><div className="text-2xl font-bold text-foreground">{categories.length > 0 ? Math.round(totalItems / categories.length) : 0}</div><div className="text-sm text-muted-foreground">Average per Category</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCategories;
