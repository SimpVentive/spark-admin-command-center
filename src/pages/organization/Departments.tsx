import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";

interface Department {
  id: string;
  name: string;
  manager_name: string | null;
  location: string | null;
  employee_count: number;
}

const Departments = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({ name: "", manager_name: "", location: "" });
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchDepartments();
    fetchLocations();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await (supabase as any).from('departments').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      setDepartments(data || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await (supabase as any).from('locations').select('id, name').eq('is_active', true);
      setLocations(data || []);
    } catch {}
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim()) {
      toast({ title: "Error", description: "Department name is required", variant: "destructive" });
      return;
    }
    try {
      const { error } = await (supabase as any).from('departments').insert([{
        name: newDepartment.name.trim(),
        manager_name: newDepartment.manager_name.trim() || null,
        location: newDepartment.location || null,
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Department added successfully" });
      setNewDepartment({ name: "", manager_name: "", location: "" });
      setIsAddDialogOpen(false);
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;
    try {
      const { error } = await (supabase as any).from('departments').update({
        name: editingDepartment.name,
        manager_name: editingDepartment.manager_name,
        location: editingDepartment.location,
      }).eq('id', editingDepartment.id);
      if (error) throw error;
      toast({ title: "Success", description: "Department updated successfully" });
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('departments').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Department deleted successfully" });
      fetchDepartments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Add Department</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Department</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Department Name *</Label>
                <Input value={newDepartment.name} onChange={(e) => setNewDepartment(p => ({ ...p, name: e.target.value }))} placeholder="Enter department name" />
              </div>
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input value={newDepartment.manager_name} onChange={(e) => setNewDepartment(p => ({ ...p, manager_name: e.target.value }))} placeholder="Enter manager name" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={newDepartment.location} onChange={(e) => setNewDepartment(p => ({ ...p, location: e.target.value }))} placeholder="Enter location" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDepartment}>Add Department</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {departments.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No departments found. Add your first department to get started.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {departments.map((dept) => (
            <Card key={dept.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{dept.name}</h3>
                    {dept.manager_name && <p className="text-sm text-muted-foreground">Manager: {dept.manager_name}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{dept.employee_count} employees</span>
                      {dept.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{dept.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingDepartment({ ...dept }); setIsEditDialogOpen(true); }} className="gap-1"><Edit className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDepartment(dept.id)} className="gap-1 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Department</DialogTitle></DialogHeader>
          {editingDepartment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Department Name *</Label>
                <Input value={editingDepartment.name} onChange={(e) => setEditingDepartment(p => p ? { ...p, name: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label>Manager</Label>
                <Input value={editingDepartment.manager_name || ""} onChange={(e) => setEditingDepartment(p => p ? { ...p, manager_name: e.target.value } : null)} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={editingDepartment.location || ""} onChange={(e) => setEditingDepartment(p => p ? { ...p, location: e.target.value } : null)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateDepartment}>Update Department</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departments;
