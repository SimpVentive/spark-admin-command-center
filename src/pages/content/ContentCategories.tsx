import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Folder, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const ContentCategories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Leadership",
      description: "Leadership development and management training",
      contentCount: 15,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    },
    {
      id: 2,
      name: "Safety",
      description: "Workplace safety procedures and protocols",
      contentCount: 8,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    },
    {
      id: 3,
      name: "Technical Skills",
      description: "Technical training and skill development",
      contentCount: 22,
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    },
    {
      id: 4,
      name: "Compliance",
      description: "Regulatory compliance and legal requirements",
      contentCount: 12,
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    },
    {
      id: 5,
      name: "Human Resources",
      description: "HR policies, procedures, and employee relations",
      contentCount: 6,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    },
    {
      id: 6,
      name: "Customer Service",
      description: "Customer interaction and service excellence",
      contentCount: 9,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    }
  ]);

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: ""
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const colors = [
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      ];
      
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: newCategory.name,
          description: newCategory.description,
          contentCount: 0,
          color: colors[Math.floor(Math.random() * colors.length)]
        }
      ]);
      
      setNewCategory({ name: "", description: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Categories</h1>
          <p className="text-muted-foreground">Organize your learning content into categories</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <Badge className={category.color}>
                  {category.contentCount} items
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View Content
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Total Categories</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {categories.reduce((sum, cat) => sum + cat.contentCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Content Items</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {Math.round(categories.reduce((sum, cat) => sum + cat.contentCount, 0) / categories.length)}
              </div>
              <div className="text-sm text-muted-foreground">Average Items per Category</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCategories;