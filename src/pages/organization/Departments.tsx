import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: number;
  name: string;
  manager: string;
  employees: number;
  location: string;
}

const Departments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Engineering", manager: "John Smith", employees: 45, location: "Building A" },
    { id: 2, name: "Marketing", manager: "Sarah Johnson", employees: 23, location: "Building B" },
    { id: 3, name: "Human Resources", manager: "Mike Davis", employees: 12, location: "Building A" },
    { id: 4, name: "Sales", manager: "Lisa Chen", employees: 34, location: "Building C" },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    manager: "",
    location: ""
  });

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim() || !newDepartment.manager.trim() || !newDepartment.location.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const department: Department = {
      id: Date.now(),
      name: newDepartment.name.trim(),
      manager: newDepartment.manager.trim(),
      employees: 0,
      location: newDepartment.location
    };

    setDepartments(prev => [...prev, department]);
    setNewDepartment({ name: "", manager: "", location: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Department added successfully"
    });
  };

  const handleEditDepartment = (dept: Department) => {
    setEditingDepartment({ ...dept });
    setIsEditDialogOpen(true);
  };

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return;
    
    if (!editingDepartment.name.trim() || !editingDepartment.manager.trim() || !editingDepartment.location.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setDepartments(prev => prev.map(dept => 
      dept.id === editingDepartment.id ? editingDepartment : dept
    ));
    setIsEditDialogOpen(false);
    setEditingDepartment(null);
    
    toast({
      title: "Success",
      description: "Department updated successfully"
    });
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    toast({
      title: "Success",
      description: "Department deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter department name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment(prev => ({...prev, manager: e.target.value}))}
                  placeholder="Enter manager name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newDepartment.location} onValueChange={(value) => setNewDepartment(prev => ({...prev, location: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Building A">Building A</SelectItem>
                    <SelectItem value="Building B">Building B</SelectItem>
                    <SelectItem value="Building C">Building C</SelectItem>
                    <SelectItem value="Building D">Building D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment}>
                  Add Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">Manager: {dept.manager}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {dept.employees} employees
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {dept.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditDepartment(dept)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDepartment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter department name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Manager</Label>
                <Input
                  id="edit-manager"
                  value={editingDepartment.manager}
                  onChange={(e) => setEditingDepartment(prev => prev ? {...prev, manager: e.target.value} : null)}
                  placeholder="Enter manager name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Select 
                  value={editingDepartment.location} 
                  onValueChange={(value) => setEditingDepartment(prev => prev ? {...prev, location: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Building A">Building A</SelectItem>
                    <SelectItem value="Building B">Building B</SelectItem>
                    <SelectItem value="Building C">Building C</SelectItem>
                    <SelectItem value="Building D">Building D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateDepartment}>
                  Update Department
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Departments;