
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, User, Building, Award, BookOpen, Clock, 
  CheckCircle, AlertCircle, Users, Filter, Plus
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  manager: string;
  joinDate: string;
  lastTNIDate?: string;
}

interface TrainingNeed {
  id: string;
  category: string;
  skill: string;
  priority: "High" | "Medium" | "Low";
  currentLevel: number;
  targetLevel: number;
  businessJustification: string;
  identifiedBy: string;
  identifiedDate: string;
  status: "pending" | "approved" | "in_progress" | "completed";
}

interface JobRole {
  id: string;
  title: string;
  description?: string;
  department_id?: string;
  level: string;
  is_active: boolean;
}

interface NewRoleFormData {
  title: string;
  description: string;
  level: string;
  department_id: string;
}

export default function EnhancedEmployeeTNI() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"search" | "department">("search");
  const [isNewRoleDialogOpen, setIsNewRoleDialogOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState<NewRoleFormData>({
    title: "",
    description: "",
    level: "mid",
    department_id: ""
  });

  // Fetch organizational units (departments)
  const { data: departments } = useQuery({
    queryKey: ['organizational-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizational_units')
        .select('*')
        .eq('is_active', true)
        .eq('level', 'department');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch job roles
  const { data: jobRoles } = useQuery({
    queryKey: ['job-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_roles')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as JobRole[];
    }
  });

  // Create new job role mutation
  const createJobRoleMutation = useMutation({
    mutationFn: async (roleData: NewRoleFormData) => {
      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('job_roles')
        .select('id')
        .eq('title', roleData.title)
        .eq('department_id', roleData.department_id)
        .maybeSingle();

      if (existingRole) {
        throw new Error(`Job role "${roleData.title}" already exists in this department`);
      }

      const { data, error } = await supabase
        .from('job_roles')
        .insert([{
          title: roleData.title,
          description: roleData.description,
          level: roleData.level,
          department_id: roleData.department_id || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ['job-roles'] });
      toast({
        title: "Job Role Created",
        description: `"${newRole.title}" has been added to the organizational structure`,
      });
      setIsNewRoleDialogOpen(false);
      setNewRoleForm({ title: "", description: "", level: "mid", department_id: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Check if employee's position exists as a job role
  const checkEmployeeRole = (employee: Employee) => {
    if (!jobRoles) return null;
    return jobRoles.find(role => 
      role.title.toLowerCase() === employee.position.toLowerCase()
    );
  };

  // Create job role from employee position
  const handleCreateRoleFromEmployee = (employee: Employee) => {
    const deptId = departments?.find(d => 
      d.name.toLowerCase() === employee.department.toLowerCase()
    )?.id;

    setNewRoleForm({
      title: employee.position,
      description: `Role for ${employee.position} in ${employee.department}`,
      level: "mid", // Default level, can be adjusted
      department_id: deptId || ""
    });
    setIsNewRoleDialogOpen(true);
  };

  // Mock data
  const employees: Employee[] = [
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      position: "Senior Developer",
      manager: "Sarah Johnson",
      joinDate: "2022-03-15",
      lastTNIDate: "2024-01-10"
    },
    {
      id: "EMP002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Sales",
      position: "Account Manager",
      manager: "Mike Chen",
      joinDate: "2021-08-22",
      lastTNIDate: "2024-01-05"
    },
    {
      id: "EMP003",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      department: "Engineering",
      position: "Frontend Developer",
      manager: "Sarah Johnson",
      joinDate: "2023-01-10"
    },
    {
      id: "EMP004",
      name: "Bob Wilson",
      email: "bob.wilson@company.com",
      department: "Marketing",
      position: "Marketing Specialist",
      manager: "Lisa Rodriguez",
      joinDate: "2022-11-30",
      lastTNIDate: "2023-12-20"
    }
  ];

  const trainingNeeds: Record<string, TrainingNeed[]> = {
    "EMP001": [
      {
        id: "TN001",
        category: "Technical",
        skill: "Cloud Architecture",
        priority: "High",
        currentLevel: 3,
        targetLevel: 5,
        businessJustification: "Leading cloud migration project",
        identifiedBy: "Self & Manager",
        identifiedDate: "2024-01-10",
        status: "approved"
      },
      {
        id: "TN002",
        category: "Leadership",
        skill: "Team Management",
        priority: "Medium",
        currentLevel: 2,
        targetLevel: 4,
        businessJustification: "Promotion to team lead role",
        identifiedBy: "Manager",
        identifiedDate: "2024-01-10",
        status: "pending"
      }
    ],
    "EMP002": [
      {
        id: "TN003",
        category: "Sales",
        skill: "Enterprise Sales",
        priority: "High",
        currentLevel: 3,
        targetLevel: 5,
        businessJustification: "Handling enterprise accounts",
        identifiedBy: "Self",
        identifiedDate: "2024-01-05",
        status: "in_progress"
      }
    ],
    "EMP003": [
      {
        id: "TN004",
        category: "Technical",
        skill: "React Advanced Patterns",
        priority: "Medium",
        currentLevel: 2,
        targetLevel: 4,
        businessJustification: "Working on complex UI components",
        identifiedBy: "Manager",
        identifiedDate: "2024-01-15",
        status: "pending"
      }
    ]
  };

  const departmentNames = ["Engineering", "Sales", "Marketing", "HR", "Finance"];

  const handleSearchEmployee = () => {
    const employee = employees.find(emp => emp.id.toLowerCase() === searchEmployeeId.toLowerCase());
    if (employee) {
      setSelectedEmployee(employee);
      
      // Check if employee's role exists in organizational structure
      const existingRole = checkEmployeeRole(employee);
      if (!existingRole) {
        toast({
          title: "Employee Found",
          description: `Loaded profile for ${employee.name}. Position "${employee.position}" not found in org structure.`,
        });
      } else {
        toast({
          title: "Employee Found",
          description: `Loaded profile for ${employee.name}`,
        });
      }
    } else {
      toast({
        title: "Employee Not Found",
        description: `No employee found with ID: ${searchEmployeeId}`,
        variant: "destructive"
      });
    }
  };

  const getDepartmentEmployees = () => {
    if (selectedDepartment === "all") return employees;
    return employees.filter(emp => emp.department === selectedDepartment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "in_progress": return "outline";
      case "completed": return "destructive";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Training Needs Identification</h1>
          <p className="text-muted-foreground">
            Search and manage individual employee training needs
          </p>
        </div>
      </div>

      {/* Search Methods */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "search" | "department")}>
        <TabsList>
          <TabsTrigger value="search">Search by Employee ID</TabsTrigger>
          <TabsTrigger value="department">Browse by Department</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Employee Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Employee ID (e.g., EMP001)"
                  value={searchEmployeeId}
                  onChange={(e) => setSearchEmployeeId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearchEmployee}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Department Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentNames.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid gap-3">
                {getDepartmentEmployees().map((employee) => (
                  <div 
                    key={employee.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {employee.id} • {employee.position}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{employee.department}</div>
                        <div className="text-xs text-muted-foreground">
                          Manager: {employee.manager}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Profile & Training Needs */}
      {selectedEmployee && (
        <div className="space-y-6">
          {/* Employee Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Name:</span>
                    <div className="text-lg">{selectedEmployee.name}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Employee ID:</span>
                    <div>{selectedEmployee.id}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <div>{selectedEmployee.email}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Department:</span>
                    <div>{selectedEmployee.department}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Position:</span>
                    <div>{selectedEmployee.position}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Reporting Manager:</span>
                    <div>{selectedEmployee.manager}</div>
                  </div>
                </div>
              </div>
              
              
              {/* Job Role Status - Show if position exists in org structure */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Position in Org Structure:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {checkEmployeeRole(selectedEmployee) ? (
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          ✓ Exists in Structure
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-200 text-orange-700">
                          Not in Structure
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!checkEmployeeRole(selectedEmployee) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCreateRoleFromEmployee(selectedEmployee)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Org Structure
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Needs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Training Needs Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trainingNeeds[selectedEmployee.id] ? (
                <div className="space-y-4">
                  {trainingNeeds[selectedEmployee.id].map((need) => (
                    <div key={need.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{need.skill}</h4>
                          <p className="text-sm text-muted-foreground">{need.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getPriorityColor(need.priority)}>
                            {need.priority} Priority
                          </Badge>
                          <Badge variant={getStatusColor(need.status)}>
                            {need.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium">Skill Level Progress:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">Level {need.currentLevel}</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${(need.currentLevel / need.targetLevel) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">Target: {need.targetLevel}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Identified by:</span>
                          <div className="text-sm">{need.identifiedBy} on {need.identifiedDate}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-sm font-medium">Business Justification:</span>
                        <p className="text-sm text-muted-foreground mt-1">{need.businessJustification}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium">No Training Needs Identified</h3>
                  <p className="text-sm text-muted-foreground">
                    This employee hasn't completed their training needs identification yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manager Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Manager Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve All Needs
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Request TNI Update
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule 1:1 Discussion
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Manager Comments:</label>
                <Textarea placeholder="Add comments about the employee's training needs..." />
                <Button size="sm">Save Comments</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Job Role Dialog */}
      <Dialog open={isNewRoleDialogOpen} onOpenChange={setIsNewRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Job Role to Organizational Structure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Title</label>
              <Input
                value={newRoleForm.title}
                onChange={(e) => setNewRoleForm({...newRoleForm, title: e.target.value})}
                placeholder="e.g., Senior Developer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm({...newRoleForm, description: e.target.value})}
                placeholder="Describe the responsibilities and requirements..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select 
                  value={newRoleForm.level} 
                  onValueChange={(value) => setNewRoleForm({...newRoleForm, level: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select 
                  value={newRoleForm.department_id} 
                  onValueChange={(value) => setNewRoleForm({...newRoleForm, department_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Department</SelectItem>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsNewRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => createJobRoleMutation.mutate(newRoleForm)}
                disabled={!newRoleForm.title || createJobRoleMutation.isPending}
              >
                {createJobRoleMutation.isPending ? "Creating..." : "Create Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
