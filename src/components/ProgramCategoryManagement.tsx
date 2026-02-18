import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FolderOpen, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  type: 'functional' | 'technical' | 'leadership' | 'compliance';
  subcategories: string[];
}

interface ProgramCategoryManagementProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange?: (category: string, subcategory?: string) => void;
  showManagement?: boolean;
}

const ProgramCategoryManagement = ({ 
  selectedCategory, 
  selectedSubcategory, 
  onCategoryChange,
  showManagement = false 
}: ProgramCategoryManagementProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Functional",
      type: "functional",
      subcategories: ["Sales", "Marketing", "Customer Service", "Operations", "Finance", "HR"]
    },
    {
      id: "2", 
      name: "Technical",
      type: "technical",
      subcategories: ["Software Development", "Data Science", "Cybersecurity", "Cloud Computing", "AI/ML"]
    },
    {
      id: "3",
      name: "Leadership",
      type: "leadership", 
      subcategories: ["Team Management", "Strategic Planning", "Change Management", "Executive Skills"]
    },
    {
      id: "4",
      name: "Compliance",
      type: "compliance",
      subcategories: ["Safety Training", "Regulatory Compliance", "Ethics", "Legal Requirements"]
    }
  ]);

  const [newCategory, setNewCategory] = useState({ name: "", type: "functional" as const });
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; type: Category['type'] }>({ name: "", type: "functional" });

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      type: newCategory.type,
      subcategories: []
    };
    
    setCategories(prev => [...prev, category]);
    setNewCategory({ name: "", type: "functional" });
    toast({ title: "Success", description: "Category added successfully" });
  };

  const addSubcategory = () => {
    if (!newSubcategory.trim() || !selectedCategoryForSub) return;
    
    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategoryForSub 
        ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
        : cat
    ));
    
    setNewSubcategory("");
    setSelectedCategoryForSub("");
    toast({ title: "Success", description: "Subcategory added successfully" });
  };

  const removeSubcategory = (categoryId: string, subcategory: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, subcategories: cat.subcategories.filter(sub => sub !== subcategory) }
        : cat
    ));
    toast({ title: "Removed", description: `Subcategory "${subcategory}" removed` });
  };

  const deleteCategory = (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({ title: "Deleted", description: "Category deleted successfully" });
  };

  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditForm({ name: category.name, type: category.type });
  };

  const saveEditCategory = () => {
    if (!editingCategory || !editForm.name.trim()) return;
    setCategories(prev => prev.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: editForm.name, type: editForm.type as Category['type'] }
        : cat
    ));
    setEditingCategory(null);
    toast({ title: "Updated", description: "Category updated successfully" });
  };

  if (showManagement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Program Categories Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Category */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add New Category</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Category Type</Label>
                <Select 
                  value={newCategory.type} 
                  onValueChange={(value: any) => setNewCategory(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="functional">Functional</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Add Subcategory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Add Subcategory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Category</Label>
                <Select value={selectedCategoryForSub} onValueChange={setSelectedCategoryForSub}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategory Name</Label>
                <Input
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Enter subcategory name"
                />
              </div>
            </div>
            <Button onClick={addSubcategory} disabled={!selectedCategoryForSub || !newSubcategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subcategory
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Categories</h3>
            <div className="space-y-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {editingCategory?.id === category.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="max-w-xs"
                          />
                          <Select 
                            value={editForm.type} 
                            onValueChange={(value: any) => setEditForm(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="functional">Functional</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="leadership">Leadership</SelectItem>
                              <SelectItem value="compliance">Compliance</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={saveEditCategory}>
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{category.type}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => startEditCategory(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subcategories:</Label>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map(sub => (
                          <Badge key={sub} variant="secondary" className="flex items-center gap-1">
                            {sub}
                            <Trash2 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeSubcategory(category.id, sub)}
                            />
                          </Badge>
                        ))}
                        {category.subcategories.length === 0 && (
                          <span className="text-sm text-muted-foreground">No subcategories yet</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Selection Mode
  const selectedCat = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={(value) => onCategoryChange?.(value)}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Subcategory</Label>
        <Select 
          value={selectedSubcategory} 
          onValueChange={(value) => onCategoryChange?.(selectedCategory || "", value)}
          disabled={!selectedCategory}
        >
          <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
          <SelectContent>
            {selectedCat?.subcategories.map(sub => (
              <SelectItem key={sub} value={sub}>{sub}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProgramCategoryManagement;
