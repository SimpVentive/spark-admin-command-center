import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_hours: number;
  faculty: string;
  venue: string;
  outline: string;
  prerequisites: string[];
  skills_covered: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProgramManagement() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Managerial",
    level: "",
    duration_hours: 0,
    faculty: "",
    venue: "",
    outline: "",
    prerequisites: [] as string[],
    skills_covered: [] as string[]
  });

  const categories = ["Managerial", "Behavioral", "Functional", "Technical"];

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, selectedCategory, searchTerm]);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch programs",
        variant: "destructive"
      });
    }
  };

  const filterPrograms = () => {
    let filtered = programs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Managerial",
      level: "",
      duration_hours: 0,
      faculty: "",
      venue: "",
      outline: "",
      prerequisites: [],
      skills_covered: []
    });
    setEditingProgram(null);
  };

  const handleEdit = (program: TrainingProgram) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description || "",
      category: program.category,
      level: program.level || "",
      duration_hours: program.duration_hours || 0,
      faculty: program.faculty || "",
      venue: program.venue || "",
      outline: program.outline || "",
      prerequisites: program.prerequisites || [],
      skills_covered: program.skills_covered || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('training_programs')
          .update(formData)
          .eq('id', editingProgram.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Program updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('training_programs')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Program created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPrograms();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingProgram ? 'update' : 'create'} program`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (programId: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      const { error } = await supabase
        .from('training_programs')
        .update({ is_active: false })
        .eq('id', programId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Program deleted successfully"
      });
      
      fetchPrograms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive"
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Managerial': 'bg-blue-500',
      'Behavioral': 'bg-green-500',
      'Functional': 'bg-purple-500',
      'Technical': 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Program Management</h1>
          <p className="text-muted-foreground">
            Manage training programs across all categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? "Edit Program" : "Add New Program"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Program title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Program description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                    placeholder="e.g., Beginner, Mid, Senior"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    value={formData.faculty}
                    onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Training venue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outline">Course Outline</Label>
                <Textarea
                  id="outline"
                  value={formData.outline}
                  onChange={(e) => setFormData(prev => ({ ...prev, outline: e.target.value }))}
                  placeholder="Course topics and outline"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingProgram ? "Update" : "Create"} Program
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Programs by Category */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Programs</TabsTrigger>
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                        <Badge variant="secondary" className={`text-white ${getCategoryColor(program.category)}`}>
                          {program.category}
                        </Badge>
                      </div>
                      {program.description && (
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(program.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {program.level && (
                      <div>
                        <span className="font-medium">Level:</span> {program.level}
                      </div>
                    )}
                    {program.duration_hours && (
                      <div>
                        <span className="font-medium">Duration:</span> {program.duration_hours}h
                      </div>
                    )}
                    {program.faculty && (
                      <div>
                        <span className="font-medium">Faculty:</span> {program.faculty}
                      </div>
                    )}
                    {program.venue && (
                      <div>
                        <span className="font-medium">Venue:</span> {program.venue}
                      </div>
                    )}
                  </div>
                  {program.outline && (
                    <div className="mt-3">
                      <span className="font-medium text-sm">Outline:</span>
                      <p className="text-sm text-muted-foreground mt-1">{program.outline}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {filteredPrograms
                .filter(p => p.category === category)
                .map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          {program.description && (
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(program.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {program.level && (
                          <div>
                            <span className="font-medium">Level:</span> {program.level}
                          </div>
                        )}
                        {program.duration_hours && (
                          <div>
                            <span className="font-medium">Duration:</span> {program.duration_hours}h
                          </div>
                        )}
                        {program.faculty && (
                          <div>
                            <span className="font-medium">Faculty:</span> {program.faculty}
                          </div>
                        )}
                        {program.venue && (
                          <div>
                            <span className="font-medium">Venue:</span> {program.venue}
                          </div>
                        )}
                      </div>
                      {program.outline && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Outline:</span>
                          <p className="text-sm text-muted-foreground mt-1">{program.outline}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}