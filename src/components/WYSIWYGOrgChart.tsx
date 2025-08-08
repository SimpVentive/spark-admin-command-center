import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
}

interface Department {
  id: string;
  name: string;
  manager: string;
  employees: Employee[];
  parentId?: string;
  level: number;
}

interface SortableDepartmentProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
  onAddEmployee: (deptId: string) => void;
  onAddSubDepartment: (parentId: string) => void;
}

const SortableDepartment = ({ 
  department, 
  onEdit, 
  onDelete, 
  onAddEmployee, 
  onAddSubDepartment 
}: SortableDepartmentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: department.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${department.level * 32}px`,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-move flex-1"
              {...attributes}
              {...listeners}
            >
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">{department.name}</h3>
                <p className="text-sm text-muted-foreground">Manager: {department.manager}</p>
                <p className="text-xs text-muted-foreground">{department.employees.length} employees</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddEmployee(department.id)}
                className="gap-1"
              >
                <Users className="h-3 w-3" />
                Add People
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddSubDepartment(department.id)}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                Sub Dept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(department)}
                className="gap-1"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(department.id)}
                className="gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WYSIWYGOrgChart = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Executive Office',
      manager: 'CEO',
      employees: [],
      level: 0,
    },
    {
      id: '2',
      name: 'Engineering',
      manager: 'John Smith',
      employees: [
        { id: 'e1', name: 'Alice Johnson', position: 'Senior Developer', email: 'alice@company.com' },
        { id: 'e2', name: 'Bob Wilson', position: 'DevOps Engineer', email: 'bob@company.com' }
      ],
      parentId: '1',
      level: 1,
    },
    {
      id: '3',
      name: 'Marketing',
      manager: 'Sarah Davis',
      employees: [
        { id: 'e3', name: 'Carol Brown', position: 'Marketing Specialist', email: 'carol@company.com' }
      ],
      parentId: '1',
      level: 1,
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState({ name: '', manager: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', email: '' });
  const [parentDeptId, setParentDeptId] = useState<string>('');

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDepartments((departments) => {
        const oldIndex = departments.findIndex((dept) => dept.id === active.id);
        const newIndex = departments.findIndex((dept) => dept.id === over.id);
        
        return arrayMove(departments, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleAddDepartment = () => {
    const newDept: Department = {
      id: Date.now().toString(),
      name: newDepartment.name,
      manager: newDepartment.manager,
      employees: [],
      parentId: parentDeptId || undefined,
      level: parentDeptId ? (departments.find(d => d.id === parentDeptId)?.level || 0) + 1 : 0,
    };

    setDepartments(prev => [...prev, newDept]);
    setNewDepartment({ name: '', manager: '' });
    setShowAddDialog(false);
    setParentDeptId('');
    
    toast({
      title: "Success",
      description: "Department added successfully"
    });
  };

  const handleAddEmployee = () => {
    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      position: newEmployee.position,
      email: newEmployee.email,
    };

    setDepartments(prev => prev.map(dept => 
      dept.id === selectedDeptId 
        ? { ...dept, employees: [...dept.employees, employee] }
        : dept
    ));

    setNewEmployee({ name: '', position: '', email: '' });
    setShowEmployeeDialog(false);
    setSelectedDeptId('');
    
    toast({
      title: "Success",
      description: "Employee added successfully"
    });
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setNewDepartment({ name: department.name, manager: department.manager });
    setShowAddDialog(true);
  };

  const handleUpdateDepartment = () => {
    if (!editingDepartment) return;

    setDepartments(prev => prev.map(dept => 
      dept.id === editingDepartment.id 
        ? { ...dept, name: newDepartment.name, manager: newDepartment.manager }
        : dept
    ));

    setEditingDepartment(null);
    setNewDepartment({ name: '', manager: '' });
    setShowAddDialog(false);
    
    toast({
      title: "Success",
      description: "Department updated successfully"
    });
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    toast({
      title: "Success",
      description: "Department deleted successfully"
    });
  };

  const openAddEmployeeDialog = (deptId: string) => {
    setSelectedDeptId(deptId);
    setShowEmployeeDialog(true);
  };

  const openAddSubDepartmentDialog = (parentId: string) => {
    setParentDeptId(parentId);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Organization Structure</h2>
          <p className="text-sm text-muted-foreground">Drag and drop to reorganize departments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={departments.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {departments.map((department) => (
            <SortableDepartment
              key={department.id}
              department={department}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
              onAddEmployee={openAddEmployeeDialog}
              onAddSubDepartment={openAddSubDepartmentDialog}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <Card className="opacity-90">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{departments.find(d => d.id === activeId)?.name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add/Edit Department Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department Name</label>
              <Input
                value={newDepartment.name}
                onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter department name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Manager</label>
              <Input
                value={newDepartment.manager}
                onChange={(e) => setNewDepartment(prev => ({ ...prev, manager: e.target.value }))}
                placeholder="Enter manager name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingDepartment(null);
                setNewDepartment({ name: '', manager: '' });
                setParentDeptId('');
              }}>
                Cancel
              </Button>
              <Button onClick={editingDepartment ? handleUpdateDepartment : handleAddDepartment}>
                {editingDepartment ? 'Update' : 'Add'} Department
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter employee name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input
                value={newEmployee.position}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter position/title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEmployeeDialog(false);
                setNewEmployee({ name: '', position: '', email: '' });
                setSelectedDeptId('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WYSIWYGOrgChart;