
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobRole {
  id: number;
  title: string;
  department: string;
  level: string;
  employees: number;
}

const Roles = () => {
  const { toast } = useToast();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([
    { id: 1, title: "Software Engineer", department: "Engineering", level: "Mid-level", employees: 12 },
    { id: 2, title: "Marketing Specialist", department: "Marketing", level: "Entry-level", employees: 8 },
    { id: 3, title: "HR Manager", department: "Human Resources", level: "Senior", employees: 3 },
    { id: 4, title: "Sales Representative", department: "Sales", level: "Entry-level", employees: 15 },
    { id: 5, title: "Product Manager", department: "Engineering", level: "Senior", employees: 4 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);
  const [newRole, setNewRole] = useState({
    title: "",
    department: "",
    level: ""
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry-level": return "bg-green-100 text-green-800";
      case "Mid-level": return "bg-blue-100 text-blue-800";
      case "Senior": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddRole = () => {
    if (!newRole.title.trim() || !newRole.department.trim() || !newRole.level.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const role: JobRole = {
      id: Date.now(),
      title: newRole.title.trim(),
      department: newRole.department,
      level: newRole.level,
      employees: 0
    };

    setJobRoles(prev => [...prev, role]);
    setNewRole({ title: "", department: "", level: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Role added successfully"
    });
  };

  const handleEditRole = (role: JobRole) => {
    setEditingRole({ ...role });
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingRole) return;
    
    if (!editingRole.title.trim() || !editingRole.department.trim() || !editingRole.level.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setJobRoles(prev => prev.map(role => 
      role.id === editingRole.id ? editingRole : role
    ));
    setIsEditDialogOpen(false);
    setEditingRole(null);
    
    toast({
      title: "Success",
      description: "Role updated successfully"
    });
  };

  const handleDeleteRole = (id: number) => {
    setJobRoles(prev => prev.filter(role => role.id !== id));
    toast({
      title: "Success",
      description: "Role deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Roles</h1>
          <p className="text-muted-foreground">Define and manage job roles within the organization</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Role Title</Label>
                <Input
                  id="title"
                  value={newRole.title}
                  onChange={(e) => setNewRole(prev => ({...prev, title: e.target.value}))}
                  placeholder="Enter role title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newRole.department} onValueChange={(value) => setNewRole(prev => ({...prev, department: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={newRole.level} onValueChange={(value) => setNewRole(prev => ({...prev, level: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole}>
                  Add Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobRoles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{role.title}</h3>
                    <Badge className={getLevelColor(role.level)}>
                      {role.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Department: {role.department}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UserCheck className="h-3 w-3" />
                    {role.employees} employees in this role
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditRole(role)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteRole(role.id)}
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

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Role Title</Label>
                <Input
                  id="edit-title"
                  value={editingRole.title}
                  onChange={(e) => setEditingRole(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="Enter role title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select 
                  value={editingRole.department} 
                  onValueChange={(value) => setEditingRole(prev => prev ? {...prev, department: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level</Label>
                <Select 
                  value={editingRole.level} 
                  onValueChange={(value) => setEditingRole(prev => prev ? {...prev, level: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateRole}>
                  Update Role
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
