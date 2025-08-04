import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Building2, Users, Plus, Edit, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  Id: string;
  Name: string;
  Designation: string;
  ReportingPerson: string | null;
  ImageUrl: string;
  Department: string;
}

interface OrganizationChartProps {
  isEditing: boolean;
  onSave: () => void;
}

export const OrganizationChart = ({ isEditing, onSave }: OrganizationChartProps) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      Id: "1",
      Name: "John CEO",
      Designation: "Managing Director",
      ReportingPerson: null,
      ImageUrl: "/placeholder.svg",
      Department: "Executive"
    },
    {
      Id: "2",
      Name: "John Smith",
      Designation: "Engineering Manager",
      ReportingPerson: "1",
      ImageUrl: "/placeholder.svg", 
      Department: "Engineering"
    },
    {
      Id: "3",
      Name: "Sarah Johnson",
      Designation: "Marketing Manager",
      ReportingPerson: "1",
      ImageUrl: "/placeholder.svg",
      Department: "Marketing"
    },
    {
      Id: "4",
      Name: "Mike Davis",
      Designation: "HR Manager",
      ReportingPerson: "1",
      ImageUrl: "/placeholder.svg",
      Department: "Human Resources"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    Name: "",
    Designation: "",
    Department: "",
    ReportingPerson: ""
  });

  // Organization chart configuration based on provided code
  const layoutConfig = {
    type: 'OrganizationalChart',
    margin: { top: 20 },
    horizontalSpacing: 70,
    verticalSpacing: 80,
    getLayoutInfo: function (node: any, tree: any) {
      if (!tree.hasSubTree) {
        tree.orientation = 'Vertical';
        tree.type = 'Right';
      }
    },
  };

  const dataSourceSettings = {
    id: 'Id',
    parentId: 'ReportingPerson',
    dataSource: employees,
  };

  const getNodeDefaults = (employee: Employee) => {
    let backgroundColor = '#DADAD8';
    if (employee.Designation === 'Managing Director' || employee.ReportingPerson === null) {
      backgroundColor = 'lightblue';
    } else if (employee.ReportingPerson === '1') {
      backgroundColor = 'lightgreen';
    }
    return backgroundColor;
  };

  const handleAddEmployee = () => {
    if (!newEmployee.Name.trim() || !newEmployee.Designation.trim()) {
      toast({
        title: "Error",
        description: "Please fill in name and designation",
        variant: "destructive"
      });
      return;
    }

    const employee: Employee = {
      Id: (employees.length + 1).toString(),
      Name: newEmployee.Name.trim(),
      Designation: newEmployee.Designation.trim(),
      ReportingPerson: newEmployee.ReportingPerson || "1",
      ImageUrl: "/placeholder.svg",
      Department: newEmployee.Department.trim()
    };

    setEmployees(prev => [...prev, employee]);
    setNewEmployee({ Name: "", Designation: "", Department: "", ReportingPerson: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Employee added to organization chart"
    });
  };

  const handleDeleteEmployee = (id: string) => {
    if (id === "1") {
      toast({
        title: "Error",
        description: "Cannot delete the CEO position",
        variant: "destructive"
      });
      return;
    }
    
    setEmployees(prev => prev.filter(emp => emp.Id !== id));
    toast({
      title: "Success",
      description: "Employee removed from organization chart"
    });
  };

  const handleUpdateEmployee = (id: string, field: keyof Employee, value: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.Id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const renderEmployeeNode = (employee: Employee) => {
    const backgroundColor = getNodeDefaults(employee);
    
    return (
      <div 
        key={employee.Id}
        className="border rounded-lg p-4 text-center relative group"
        style={{ 
          backgroundColor,
          width: '200px',
          minHeight: '100px'
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <img 
            src={employee.ImageUrl} 
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          {isEditing ? (
            <div className="space-y-1 w-full">
              <Input
                value={employee.Name}
                onChange={(e) => handleUpdateEmployee(employee.Id, 'Name', e.target.value)}
                className="text-center text-sm h-8"
                placeholder="Name"
              />
              <Input
                value={employee.Designation}
                onChange={(e) => handleUpdateEmployee(employee.Id, 'Designation', e.target.value)}
                className="text-center text-xs h-6"
                placeholder="Designation"
              />
            </div>
          ) : (
            <div>
              <div className="font-medium text-sm">{employee.Name}</div>
              <div className="text-xs text-muted-foreground">{employee.Designation}</div>
            </div>
          )}
          <Badge variant="outline" className="text-xs">
            {employee.Department}
          </Badge>
          {isEditing && employee.Id !== "1" && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive"
              onClick={() => handleDeleteEmployee(employee.Id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const rootEmployees = employees.filter(emp => emp.ReportingPerson === null);
  const getSubordinates = (managerId: string) => employees.filter(emp => emp.ReportingPerson === managerId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Organization Structure
          {isEditing && (
            <div className="flex gap-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newEmployee.Name}
                        onChange={(e) => setNewEmployee(prev => ({...prev, Name: e.target.value}))}
                        placeholder="Enter employee name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={newEmployee.Designation}
                        onChange={(e) => setNewEmployee(prev => ({...prev, Designation: e.target.value}))}
                        placeholder="Enter designation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newEmployee.Department}
                        onChange={(e) => setNewEmployee(prev => ({...prev, Department: e.target.value}))}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reporting">Reporting To</Label>
                      <select
                        value={newEmployee.ReportingPerson}
                        onChange={(e) => setNewEmployee(prev => ({...prev, ReportingPerson: e.target.value}))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select Manager</option>
                        {employees.map(emp => (
                          <option key={emp.Id} value={emp.Id}>
                            {emp.Name} - {emp.Designation}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddEmployee}>
                        Add Employee
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={onSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Structure
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* CEO Level */}
          {rootEmployees.map(ceo => (
            <div key={ceo.Id} className="flex flex-col items-center space-y-6">
              {renderEmployeeNode(ceo)}
              
              {/* Department Managers */}
              <div className="flex flex-wrap justify-center gap-8">
                {getSubordinates(ceo.Id).map(manager => (
                  <div key={manager.Id} className="flex flex-col items-center space-y-4">
                    {renderEmployeeNode(manager)}
                    
                    {/* Team Members */}
                    <div className="flex flex-wrap justify-center gap-4">
                      {getSubordinates(manager.Id).map(employee => (
                        <div key={employee.Id} className="scale-90">
                          {renderEmployeeNode(employee)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {isEditing && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Editing Mode:</strong> Click on employee cards to edit details, add new employees, or remove them. The organizational structure follows the hierarchy defined by reporting relationships.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationChart;