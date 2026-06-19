import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Settings,
  Plus,
  Upload,
  Download,
  Filter,
  ChevronRight,
  Brain,
  Target,
  BookOpen,
  Loader2,
  ArrowLeft,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Remove the old mock data
const EmployeeLearningProfiles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [skillTemplates, setSkillTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [individualEmployee, setIndividualEmployee] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchIndividualEmployee(id);
    } else {
      fetchEmployees();
    }
    fetchSkillTemplates();
  }, [id]);

  const fetchIndividualEmployee = async (employeeId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_skills (*)
        `)
        .eq('id', employeeId)
        .single();

      if (error) throw error;

      const { data: preferences } = await supabase
        .from('learning_preferences')
        .select('*')
        .eq('user_id', employeeId)
        .single()
        .catch(() => ({ data: null }));

      setIndividualEmployee({
        id: profile.id,
        name: profile.full_name || profile.email,
        email: profile.email,
        department: profile.department || 'Unassigned',
        role: profile.position || 'Not specified',
        fullProfile: profile,
        preferences: preferences,
        skills: profile.user_skills || []
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_skills (*)
        `);

      if (error) throw error;

      // Get learning preferences separately to handle the relationship properly
      const { data: preferences } = await supabase
        .from('learning_preferences')
        .select('*')
        .catch(() => ({ data: [] }));

      const employeesWithStats = profiles.map((profile: any) => {
        const userPrefs = preferences?.find((pref: any) => pref.user_id === profile.id);
        return {
          id: profile.id,
          name: profile.full_name || profile.email,
          email: profile.email,
          department: profile.department || 'Unassigned',
          role: profile.position || 'Not specified',
          profileStatus: userPrefs ? 'Complete' : 'Not Started',
          skillsCount: profile.user_skills?.length || 0,
          learningGoals: userPrefs?.goals_count || 0,
          lastUpdated: userPrefs?.updated_at || null
        };
      });

      setEmployees(employeesWithStats);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setSkillTemplates(data || []);
    } catch (error) {
      console.error('Error fetching skill templates:', error);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDepartment === "all" || emp.department === selectedDepartment)
  );

  const getStatusBadge = (status) => {
    const variants = {
      "Complete": "default",
      "Incomplete": "secondary", 
      "Not Started": "destructive"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employee data...</span>
      </div>
    );
  }

  if (id && individualEmployee) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/users/learning-profiles')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{individualEmployee.name}</h1>
            <p className="text-muted-foreground">{individualEmployee.email}</p>
          </div>
        </div>

        <EmployeeDetailProfile employee={individualEmployee} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Employee Learning Profiles</h1>
            <p className="text-muted-foreground">
              Manage AI-powered learning recommendations for all employees
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Setup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Bulk Learning Profile Setup</DialogTitle>
              </DialogHeader>
              <BulkSetupForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Employee Overview</TabsTrigger>
          <TabsTrigger value="templates">Skill Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Learning Profiles ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Profile Status</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Learning Goals</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{getStatusBadge(employee.profileStatus)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.skillsCount} skills</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.learningGoals} goals</Badge>
                      </TableCell>
                      <TableCell>{employee.lastUpdated || "Never"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Manage Learning Profile - {employee.name}</DialogTitle>
                            </DialogHeader>
                            <EmployeeProfileForm employee={employee} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skill Templates by Role
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Skill Template</DialogTitle>
                  </DialogHeader>
                  <SkillTemplateForm skillTemplates={skillTemplates} setSkillTemplates={setSkillTemplates} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {skillTemplates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Skill Template</DialogTitle>
                        </DialogHeader>
                        <SkillTemplateForm
                          skillTemplates={skillTemplates}
                          setSkillTemplates={setSkillTemplates}
                          initialTemplate={template}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="space-y-2">
                    {(Array.isArray(template.skills) ? template.skills : JSON.parse(template.skills || '[]')).map((skill: any) => (
                      <Badge key={skill.name} variant="secondary" className="mr-2 mb-2">
                        {skill.name} ({skill.level})
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Apply to Selected Employees
                  </Button>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">Active employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profiles Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.filter(emp => emp.profileStatus === 'Complete').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((employees.filter(emp => emp.profileStatus === 'Complete').length / employees.length) * 100)}% completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Skills Recorded</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.reduce((total, emp) => total + emp.skillsCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Skills per Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {employees.length > 0 ? 
                    Math.round(employees.reduce((total, emp) => total + emp.skillsCount, 0) / employees.length * 10) / 10 
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Skills per profile</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Bulk Setup Form Component
const BulkSetupForm = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [skillTemplates, setSkillTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesRes, templatesRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, department'),
        supabase.from('skill_templates').select('*').eq('is_active', true)
      ]);

      setEmployees(employeesRes.data || []);
      setSkillTemplates(templatesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applyTemplate = async () => {
    if (!selectedEmployees.length || !selectedTemplate) return;

    setLoading(true);
    try {
      const template = skillTemplates.find((t: any) => t.id === selectedTemplate);
      if (!template) throw new Error('Template not found');

      const skills = Array.isArray(template.skills) ? template.skills : JSON.parse(template.skills || '[]');

      // Apply skills to selected employees
      const skillInserts = [];
      selectedEmployees.forEach((empId: string) => {
        skills.forEach((skill: any) => {
          skillInserts.push({
            user_id: empId,
            skill_name: skill.name,
            proficiency_level: skill.level,
            confidence_score: 70,
            source: 'admin_assigned'
          });
        });
      });

      // Insert skills, handling conflicts gracefully
      const { error } = await supabase
        .from('user_skills')
        .insert(skillInserts);

      if (error) {
        // If conflict, try to update existing skills
        if (error.code === '23505') {
          for (const skillInsert of skillInserts) {
            await supabase
              .from('user_skills')
              .update({
                proficiency_level: skillInsert.proficiency_level,
                confidence_score: skillInsert.confidence_score,
                source: skillInsert.source
              })
              .eq('user_id', skillInsert.user_id)
              .eq('skill_name', skillInsert.skill_name);
          }
        } else {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: `Applied ${template.name} template to ${selectedEmployees.length} employees`
      });

      setSelectedEmployees([]);
      setSelectedTemplate("");
    } catch (error: any) {
      console.error('Error applying template:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to apply template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Employees</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-4">
        {employees.map((emp) => (
          <label key={emp.id} className="flex items-center space-x-2 cursor-pointer">
            <Checkbox 
              checked={selectedEmployees.includes(emp.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedEmployees([...selectedEmployees, emp.id]);
                } else {
                  setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                }
              }}
            />
            <span className="text-sm">{emp.full_name || emp.email} - {emp.department}</span>
          </label>
        ))}
      </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Apply Skill Template</h3>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select a skill template" />
          </SelectTrigger>
          <SelectContent>
            {skillTemplates.map((template: any) => (
              <SelectItem key={template.id} value={String(template.id)}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button 
          disabled={!selectedEmployees.length || !selectedTemplate || loading}
          onClick={applyTemplate}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Apply to {selectedEmployees.length} Employees
        </Button>
      </div>
    </div>
  );
};

// Skill Template Form Component
const SkillTemplateForm = ({ skillTemplates, setSkillTemplates, initialTemplate = null }: any) => {
  const [formData, setFormData] = useState({
    name: initialTemplate?.name || "",
    description: initialTemplate?.description || "",
    skills: initialTemplate?.skills ? (Array.isArray(initialTemplate.skills) ? initialTemplate.skills : JSON.parse(initialTemplate.skills || '[]')) : []
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Template name is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        name: formData.name.trim(),
        description: formData.description,
        skills: JSON.stringify(formData.skills),
        is_active: true
      };

      if (initialTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('skill_templates')
          .update(templateData)
          .eq('id', initialTemplate.id);

        if (error) throw error;
        toast({ title: "Success", description: "Skill template updated" });
      } else {
        // Create new template
        const { data, error } = await supabase
          .from('skill_templates')
          .insert([templateData])
          .select();

        if (error) throw error;
        toast({ title: "Success", description: "Skill template created" });
      }

      // Refresh templates
      const { data } = await supabase
        .from('skill_templates')
        .select('*')
        .eq('is_active', true);
      setSkillTemplates(data || []);
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Template Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
          placeholder="e.g., Senior Developer Skills"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
          placeholder="Describe this skill template..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
};

// Individual Employee Detail Profile Component
const EmployeeDetailProfile = ({ employee }: any) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{employee.department}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{employee.role}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{employee.skills?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={employee.preferences ? "default" : "secondary"}>
              {employee.preferences ? "Complete" : "Incomplete"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="goals">Learning Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Skills</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Skill</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Skill Name</Label>
                        <Input placeholder="e.g., React" />
                      </div>
                      <div>
                        <Label>Proficiency Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Add Skill</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {employee.skills && employee.skills.length > 0 ? (
                <div className="space-y-3">
                  {employee.skills.map((skill: any) => (
                    <Card key={skill.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{skill.skill_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Level: {skill.proficiency_level} • Confidence: {skill.confidence_score}%
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills recorded yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              {employee.preferences ? (
                <div className="space-y-4">
                  <div>
                    <Label>Preferred Learning Format</Label>
                    <p className="text-sm">{employee.preferences.preferred_format || "Not set"}</p>
                  </div>
                  <div>
                    <Label>Learning Goals</Label>
                    <p className="text-sm">{employee.preferences.career_goals || "Not set"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No learning preferences configured yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Learning goals setup...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Individual Employee Profile Form
const EmployeeProfileForm = ({ employee }: any) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="goals">Learning Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Current Skills</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
          {/* Skills management interface would go here */}
          <p className="text-muted-foreground">Skills management interface for individual employee...</p>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <h3 className="text-lg font-medium">Learning Preferences</h3>
          {/* Preferences interface would go here */}
          <p className="text-muted-foreground">Learning preferences configuration...</p>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <h3 className="text-lg font-medium">Learning Goals</h3>
          {/* Goals interface would go here */}
          <p className="text-muted-foreground">Learning goals setup...</p>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Profile Changes</Button>
      </div>
    </div>
  );
};

export default EmployeeLearningProfiles;