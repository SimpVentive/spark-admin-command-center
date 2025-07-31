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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  CSS,
} from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  title: string;
  name: string;
  department: string;
  level: number;
  parentId?: string;
  employees: number;
}

interface SortableItemProps {
  id: string;
  position: Position;
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
  onAddSubordinate: (parentId: string) => void;
}

function SortableItem({ id, position, onEdit, onDelete, onAddSubordinate }: SortableItemProps) {
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

  const getCardColors = (level: number) => {
    switch (level) {
      case 0: return "bg-primary text-primary-foreground";
      case 1: return "bg-secondary text-secondary-foreground";
      case 2: return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className={`${getCardColors(position.level)} border-2`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">{position.title}</h3>
                <p className="text-sm opacity-90">{position.name}</p>
                <p className="text-xs opacity-75">{position.department}</p>
                <div className="flex items-center gap-1 text-xs opacity-75 mt-1">
                  <Users className="h-3 w-3" />
                  {position.employees} employees
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onAddSubordinate(position.id)}
                className="opacity-90 hover:opacity-100 bg-white/20 hover:bg-white/30"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit(position)}
                className="opacity-90 hover:opacity-100 bg-white/20 hover:bg-white/30"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onDelete(position.id)}
                className="opacity-90 hover:opacity-100 bg-red-500/20 hover:bg-red-500/30"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function OrganizationalHierarchy() {
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      title: "CEO",
      name: "Executive Level",
      department: "Executive",
      level: 0,
      employees: 200,
    },
    {
      id: "2",
      title: "Engineering",
      name: "John Smith",
      department: "Engineering",
      level: 1,
      parentId: "1",
      employees: 45,
    },
    {
      id: "3",
      title: "Marketing",
      name: "Sarah Johnson",
      department: "Marketing",
      level: 1,
      parentId: "1",
      employees: 23,
    },
    {
      id: "4",
      title: "Human Resources",
      name: "Mike Davis",
      department: "Human Resources",
      level: 1,
      parentId: "1",
      employees: 12,
    },
    {
      id: "5",
      title: "Sales",
      name: "Lisa Chen",
      department: "Sales",
      level: 1,
      parentId: "1",
      employees: 34,
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [newPosition, setNewPosition] = useState({
    title: "",
    name: "",
    department: "",
    parentId: "",
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
      setPositions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setIsEditDialogOpen(true);
  };

  const handleUpdatePosition = () => {
    if (!editingPosition) return;

    setPositions(positions.map(pos => 
      pos.id === editingPosition.id ? editingPosition : pos
    ));
    setIsEditDialogOpen(false);
    setEditingPosition(null);
    
    toast({
      title: "Success",
      description: "Position updated successfully"
    });
  };

  const handleAddSubordinate = (parentId: string) => {
    const parent = positions.find(p => p.id === parentId);
    setNewPosition({
      title: "",
      name: "",
      department: "",
      parentId: parentId,
    });
    setIsAddDialogOpen(true);
  };

  const handleCreatePosition = () => {
    if (!newPosition.title || !newPosition.name || !newPosition.department) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const parent = positions.find(p => p.id === newPosition.parentId);
    const position: Position = {
      id: Date.now().toString(),
      title: newPosition.title,
      name: newPosition.name,
      department: newPosition.department,
      level: parent ? parent.level + 1 : 0,
      parentId: newPosition.parentId || undefined,
      employees: 0,
    };

    setPositions([...positions, position]);
    setNewPosition({ title: "", name: "", department: "", parentId: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Position added successfully"
    });
  };

  const handleDeletePosition = (id: string) => {
    setPositions(positions.filter(pos => pos.id !== id));
    toast({
      title: "Success",
      description: "Position deleted successfully"
    });
  };

  const sortedPositions = [...positions].sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Organizational Hierarchy</h2>
          <p className="text-muted-foreground">Drag and drop to reorganize positions</p>
        </div>
        <Button onClick={() => handleAddSubordinate("")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={positions.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedPositions.map((position) => (
              <div key={position.id} style={{ marginLeft: `${position.level * 40}px` }}>
                <SortableItem
                  id={position.id}
                  position={position}
                  onEdit={handleEditPosition}
                  onDelete={handleDeletePosition}
                  onAddSubordinate={handleAddSubordinate}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Edit Position Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
          </DialogHeader>
          {editingPosition && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Position Title</Label>
                <Input
                  id="edit-title"
                  value={editingPosition.title}
                  onChange={(e) => setEditingPosition({...editingPosition, title: e.target.value})}
                  placeholder="Enter position title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Person Name</Label>
                <Input
                  id="edit-name"
                  value={editingPosition.name}
                  onChange={(e) => setEditingPosition({...editingPosition, name: e.target.value})}
                  placeholder="Enter person name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select value={editingPosition.department} onValueChange={(value) => setEditingPosition({...editingPosition, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdatePosition}>
                  Update Position
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Position Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Position</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">Position Title</Label>
              <Input
                id="new-title"
                value={newPosition.title}
                onChange={(e) => setNewPosition({...newPosition, title: e.target.value})}
                placeholder="Enter position title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name">Person Name</Label>
              <Input
                id="new-name"
                value={newPosition.name}
                onChange={(e) => setNewPosition({...newPosition, name: e.target.value})}
                placeholder="Enter person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-department">Department</Label>
              <Select value={newPosition.department} onValueChange={(value) => setNewPosition({...newPosition, department: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePosition}>
                Add Position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}