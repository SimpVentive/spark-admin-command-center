import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrgUnit {
  id: string;
  name: string;
  type: "department" | "subdepartment";
  manager: string;
  employees: number;
  parentId?: string;
  color: string;
}

interface SortableItemProps {
  id: string;
  unit: OrgUnit;
  onEdit: (unit: OrgUnit) => void;
  onDelete: (id: string) => void;
  onAddPeople: (unitId: string) => void;
}

function SortableItem({ id, unit, onEdit, onDelete, onAddPeople }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-move hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: unit.color }}
                />
                <h3 className="font-medium">{unit.name}</h3>
                <Badge variant={unit.type === "department" ? "default" : "secondary"}>
                  {unit.type === "department" ? "Department" : "Sub-Department"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Manager: {unit.manager}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {unit.employees} employees
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddPeople(unit.id);
                }}
                className="text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                Add People
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(unit);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(unit.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const DraggableOrgChart = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState<OrgUnit[]>([
    {
      id: "1",
      name: "Engineering",
      type: "department",
      manager: "John Smith",
      employees: 45,
      color: "#3b82f6"
    },
    {
      id: "2",
      name: "Frontend Team",
      type: "subdepartment",
      manager: "Sarah Johnson",
      employees: 12,
      parentId: "1",
      color: "#60a5fa"
    },
    {
      id: "3",
      name: "Backend Team",
      type: "subdepartment",
      manager: "Mike Davis",
      employees: 15,
      parentId: "1",
      color: "#60a5fa"
    },
    {
      id: "4",
      name: "Marketing",
      type: "department",
      manager: "Lisa Chen",
      employees: 23,
      color: "#10b981"
    },
    {
      id: "5",
      name: "Digital Marketing",
      type: "subdepartment",
      manager: "Alex Brown",
      employees: 8,
      parentId: "4",
      color: "#34d399"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPeopleDialogOpen, setIsPeopleDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrgUnit | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [newUnit, setNewUnit] = useState({
    name: "",
    type: "department" as "department" | "subdepartment",
    manager: "",
    parentId: "",
    color: "#3b82f6"
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setUnits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      toast({
        title: "Organization Updated",
        description: "Unit order has been changed successfully"
      });
    }
  }

  const handleAddUnit = () => {
    if (!newUnit.name.trim() || !newUnit.manager.trim()) {
      toast({
        title: "Error",
        description: "Please fill in name and manager fields",
        variant: "destructive"
      });
      return;
    }

    const unit: OrgUnit = {
      id: Date.now().toString(),
      name: newUnit.name.trim(),
      type: newUnit.type,
      manager: newUnit.manager.trim(),
      employees: 0,
      parentId: newUnit.parentId || undefined,
      color: newUnit.color
    };

    setUnits(prev => [...prev, unit]);
    setNewUnit({ name: "", type: "department", manager: "", parentId: "", color: "#3b82f6" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: `${unit.type === "department" ? "Department" : "Sub-department"} added successfully`
    });
  };

  const handleEditUnit = (unit: OrgUnit) => {
    setEditingUnit({ ...unit });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUnit = () => {
    if (!editingUnit) return;
    
    if (!editingUnit.name.trim() || !editingUnit.manager.trim()) {
      toast({
        title: "Error",
        description: "Please fill in name and manager fields",
        variant: "destructive"
      });
      return;
    }

    setUnits(prev => prev.map(unit => 
      unit.id === editingUnit.id ? editingUnit : unit
    ));
    setIsEditDialogOpen(false);
    setEditingUnit(null);
    
    toast({
      title: "Success",
      description: "Unit updated successfully"
    });
  };

  const handleDeleteUnit = (id: string) => {
    // Check if unit has sub-departments
    const hasSubDepartments = units.some(unit => unit.parentId === id);
    if (hasSubDepartments) {
      toast({
        title: "Cannot Delete",
        description: "Please remove sub-departments first",
        variant: "destructive"
      });
      return;
    }

    setUnits(prev => prev.filter(unit => unit.id !== id));
    toast({
      title: "Success",
      description: "Unit deleted successfully"
    });
  };

  const handleAddPeople = (unitId: string) => {
    setSelectedUnitId(unitId);
    setIsPeopleDialogOpen(true);
  };

  const handleAssignPeople = () => {
    const selectedUnit = units.find(u => u.id === selectedUnitId);
    if (selectedUnit) {
      toast({
        title: "People Management",
        description: `This would open the people management interface for ${selectedUnit.name}`
      });
    }
    setIsPeopleDialogOpen(false);
  };

  const departments = units.filter(unit => unit.type === "department");
  const getSubDepartments = (parentId: string) => units.filter(unit => unit.parentId === parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Organization Structure</h2>
          <p className="text-muted-foreground">Drag and drop to reorganize departments and sub-departments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organizational Unit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter unit name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newUnit.type} onValueChange={(value: "department" | "subdepartment") => setNewUnit(prev => ({...prev, type: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="subdepartment">Sub-Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUnit.type === "subdepartment" && (
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Department</Label>
                  <Select value={newUnit.parentId} onValueChange={(value) => setNewUnit(prev => ({...prev, parentId: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={newUnit.manager}
                  onChange={(e) => setNewUnit(prev => ({...prev, manager: e.target.value}))}
                  placeholder="Enter manager name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={newUnit.color}
                  onChange={(e) => setNewUnit(prev => ({...prev, color: e.target.value}))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUnit}>
                  Add Unit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-8">
          {departments.map(department => (
            <div key={department.id} className="space-y-4">
              <SortableContext items={[department.id]} strategy={rectSortingStrategy}>
                <SortableItem
                  id={department.id}
                  unit={department}
                  onEdit={handleEditUnit}
                  onDelete={handleDeleteUnit}
                  onAddPeople={handleAddPeople}
                />
              </SortableContext>
              
              {/* Sub-departments */}
              <div className="ml-8 space-y-2">
                <SortableContext items={getSubDepartments(department.id).map(sub => sub.id)} strategy={rectSortingStrategy}>
                  {getSubDepartments(department.id).map(subDept => (
                    <SortableItem
                      key={subDept.id}
                      id={subDept.id}
                      unit={subDept}
                      onEdit={handleEditUnit}
                      onDelete={handleDeleteUnit}
                      onAddPeople={handleAddPeople}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
          ))}
        </div>
      </DndContext>

      {/* Edit Unit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          {editingUnit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingUnit.name}
                  onChange={(e) => setEditingUnit(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter unit name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager">Manager</Label>
                <Input
                  id="edit-manager"
                  value={editingUnit.manager}
                  onChange={(e) => setEditingUnit(prev => prev ? {...prev, manager: e.target.value} : null)}
                  placeholder="Enter manager name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  type="color"
                  value={editingUnit.color}
                  onChange={(e) => setEditingUnit(prev => prev ? {...prev, color: e.target.value} : null)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUnit}>
                  Update Unit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add People Dialog */}
      <Dialog open={isPeopleDialogOpen} onOpenChange={setIsPeopleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage People</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This would integrate with the people management system to assign employees to this unit.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPeopleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignPeople}>
                Open People Management
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DraggableOrgChart;