import { useState } from "react";
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
  BookOpen
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

// Mock data for demonstration
const mockEmployees = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    role: "Senior Developer",
    profileStatus: "Complete",
    skillsCount: 8,
    learningGoals: 3,
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    profileStatus: "Incomplete",
    skillsCount: 5,
    learningGoals: 2,
    lastUpdated: "2024-01-10"
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    department: "Engineering",
    role: "Frontend Developer",
    profileStatus: "Not Started",
    skillsCount: 0,
    learningGoals: 0,
    lastUpdated: null
  }
];

const mockSkillTemplates = [
  { id: 1, name: "Software Development", skills: ["JavaScript", "React", "Node.js", "Python", "Git"] },
  { id: 2, name: "Digital Marketing", skills: ["SEO", "Google Analytics", "Content Marketing", "Social Media"] },
  { id: 3, name: "Project Management", skills: ["Agile", "Scrum", "Risk Management", "Stakeholder Management"] },
  { id: 4, name: "Data Analysis", skills: ["Excel", "SQL", "Python", "Tableau", "Statistics"] }
];

const EmployeeLearningProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = mockEmployees.filter(emp => 
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Skill Templates by Role
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockSkillTemplates.map((template) => (
                <Card key={template.id} className="p-4">
                  <h3 className="font-semibold mb-3">{template.name}</h3>
                  <div className="space-y-2">
                    {template.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="mr-2 mb-2">
                        {skill}
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
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profiles Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187</div>
                <p className="text-xs text-muted-foreground">75% completion rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">63% of all employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Skills per Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.2</div>
                <p className="text-xs text-muted-foreground">+0.8 from last month</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Employees</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-4">
          {mockEmployees.map((emp) => (
            <label key={emp.id} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEmployees([...selectedEmployees, emp.id]);
                  } else {
                    setSelectedEmployees(selectedEmployees.filter(id => id !== emp.id));
                  }
                }}
              />
              <span className="text-sm">{emp.name} - {emp.department}</span>
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
            {mockSkillTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button disabled={!selectedEmployees.length || !selectedTemplate}>
          Apply to {selectedEmployees.length} Employees
        </Button>
      </div>
    </div>
  );
};

// Individual Employee Profile Form
const EmployeeProfileForm = ({ employee }) => {
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