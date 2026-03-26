import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useCompanyScope } from "@/hooks/useCompanyScope";

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

interface ProgramManagementSectionProps {
  showAddButton?: boolean;
  showHeader?: boolean;
  compact?: boolean;
}

export default function ProgramManagementSection({ 
  showAddButton = true, 
  showHeader = true,
  compact = false 
}: ProgramManagementSectionProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scopeData } = useCompanyScope();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<TrainingProgram[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TrainingProgram | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objective: "",
    outline: "",
    duration_days: 0,
    level: "Basic",
    category: "Managerial",
    faculty: "",
    venue: "",
    departments: [] as string[],
    locations: [] as string[],
    roles: [] as string[],
    prerequisites: [] as string[],
    skills_covered: [] as string[]
  });

  const categories = ["Managerial", "Behavioral", "Functional", "Technical", "Mandatory"];
  const levels = ["Basic", "Intermediate", "Advanced"];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
  const roles = ['Manager', 'Senior Manager', 'Assistant Manager', 'Executive', 'Senior Executive'];

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
      objective: "",
      outline: "",
      duration_days: 0,
      level: "Basic",
      category: "Managerial",
      faculty: "",
      venue: "",
      departments: [],
      locations: [],
      roles: [],
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
      objective: program.description || "",
      outline: program.outline || "",
      duration_days: Math.ceil((program.duration_hours || 0) / 8),
      level: program.level || "Basic",
      category: program.category,
      faculty: program.faculty || "",
      venue: program.venue || "",
      departments: (program as any).departments || [],
      locations: (program as any).locations || [],
      roles: (program as any).roles || [],
      prerequisites: program.prerequisites || [],
      skills_covered: program.skills_covered || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Program Title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const submissionData = {
        title: formData.title,
        description: formData.objective,
        category: formData.category,
        level: formData.level,
        duration_hours: formData.duration_days * 8,
        faculty: formData.faculty,
        venue: formData.venue,
        outline: formData.outline,
        prerequisites: formData.prerequisites,
        skills_covered: formData.skills_covered,
        departments: formData.departments,
        locations: formData.locations,
        roles: formData.roles
      };

      if (editingProgram) {
        const { error } = await supabase
          .from('training_programs')
          .update(submissionData)
          .eq('id', editingProgram.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Program updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('training_programs')
          .insert([scopeData(submissionData)]);
        
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
      'Technical': 'bg-orange-500',
      'Mandatory': 'bg-red-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Program Management</h1>
            <p className="text-muted-foreground">
              Manage training programs across all categories
            </p>
          </div>
          {showAddButton && (
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
                      <Label htmlFor="title">Program Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter program title"
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
                    <Label htmlFor="objective">Program Objective</Label>
                    <Textarea
                      id="objective"
                      value={formData.objective}
                      onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                      placeholder="Enter program objective and description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outline">Program Outline</Label>
                    <Textarea
                      id="outline"
                      value={formData.outline}
                      onChange={(e) => setFormData(prev => ({ ...prev, outline: e.target.value }))}
                      placeholder="Enter detailed program outline and topics"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Typical Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }))}
                        placeholder="e.g., 3"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select 
                        value={formData.level} 
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, level: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      placeholder="Training venue or location"
                    />
                  </div>

                  {/* Department, Location, Role Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Departments</Label>
                      <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                        {departments.map(dept => (
                          <div key={dept} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`dept-${dept}`}
                              checked={formData.departments.includes(dept)}
                              onChange={(e) => {
                                const newDepts = e.target.checked 
                                  ? [...formData.departments, dept]
                                  : formData.departments.filter(d => d !== dept);
                                setFormData(prev => ({ ...prev, departments: newDepts }));
                              }}
                              className="rounded"
                            />
                            <label htmlFor={`dept-${dept}`} className="text-sm">{dept}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Locations</Label>
                      <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                        {locations.map(location => (
                          <div key={location} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`loc-${location}`}
                              checked={formData.locations.includes(location)}
                              onChange={(e) => {
                                const newLocs = e.target.checked 
                                  ? [...formData.locations, location]
                                  : formData.locations.filter(l => l !== location);
                                setFormData(prev => ({ ...prev, locations: newLocs }));
                              }}
                              className="rounded"
                            />
                            <label htmlFor={`loc-${location}`} className="text-sm">{location}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Roles</Label>
                      <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                        {roles.map(role => (
                          <div key={role} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`role-${role}`}
                              checked={formData.roles.includes(role)}
                              onChange={(e) => {
                                const newRoles = e.target.checked 
                                  ? [...formData.roles, role]
                                  : formData.roles.filter(r => r !== role);
                                setFormData(prev => ({ ...prev, roles: newRoles }));
                              }}
                              className="rounded"
                            />
                            <label htmlFor={`role-${role}`} className="text-sm">{role}</label>
                          </div>
                        ))}
                      </div>
                    </div>
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
          )}
        </div>
      )}

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
          <div className={`grid gap-4 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
            {filteredPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className={compact ? "text-base" : "text-lg"}>{program.title}</CardTitle>
                        <Badge variant="secondary" className={`text-white ${getCategoryColor(program.category)}`}>
                          {program.category}
                        </Badge>
                        <Badge variant="outline">{program.level}</Badge>
                      </div>
                      {program.description && (
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      )}
                    </div>
                    {showAddButton && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(program.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {Math.ceil((program.duration_hours || 0) / 8)} days
                    </div>
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
          {filteredPrograms.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No programs found. {showAddButton && "Click 'Add Program' to create your first program."}
            </div>
          )}
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className={`grid gap-4 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
              {filteredPrograms
                .filter(p => p.category === category)
                .map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className={compact ? "text-base" : "text-lg"}>{program.title}</CardTitle>
                            <Badge variant="outline">{program.level}</Badge>
                          </div>
                          {program.description && (
                            <p className="text-sm text-muted-foreground">{program.description}</p>
                          )}
                        </div>
                        {showAddButton && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(program)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(program.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span> {Math.ceil((program.duration_hours || 0) / 8)} days
                        </div>
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
            {filteredPrograms.filter(p => p.category === category).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No {category.toLowerCase()} programs found.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}