import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobRole {
  id: string;
  title: string;
  description: string | null;
  level: string;
  department_id: string | null;
}

const Roles = () => {
  const { toast } = useToast();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);
  const [newRole, setNewRole] = useState({ title: "", department_id: "", level: "", description: "" });

  useEffect(() => { fetchRoles(); fetchDepartments(); }, []);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('job_roles').select('*').eq('is_active', true).order('title');
      if (error) throw error;
      setJobRoles(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await (supabase as any).from('departments').select('id, name').eq('is_active', true);
      setDepartments(data || []);
    } catch {}
  };

  const handleAddRole = async () => {
    if (!newRole.title.trim() || !newRole.level) {
      toast({ title: "Error", description: "Title and level are required", variant: "destructive" });
      return;
    }
    try {
      const { error } = await supabase.from('job_roles').insert([{
        title: newRole.title.trim(),
        level: newRole.level,
        department_id: newRole.department_id || null,
        description: newRole.description || null,
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Role added successfully" });
      setNewRole({ title: "", department_id: "", level: "", description: "" });
      setIsAddDialogOpen(false);
      fetchRoles();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      const { error } = await supabase.from('job_roles').update({
        title: editingRole.title,
        level: editingRole.level,
        department_id: editingRole.department_id,
        description: editingRole.description,
      }).eq('id', editingRole.id);
      if (error) throw error;
      toast({ title: "Success", description: "Role updated" });
      setIsEditDialogOpen(false);
      fetchRoles();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const { error } = await supabase.from('job_roles').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Role deleted" });
      fetchRoles();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry-level": return "bg-green-100 text-green-800";
      case "Mid-level": return "bg-blue-100 text-blue-800";
      case "Senior": return "bg-purple-100 text-purple-800";
      case "Executive": return "bg-orange-100 text-orange-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDeptName = (deptId: string | null) => {
    if (!deptId) return null;
    return departments.find(d => d.id === deptId)?.name || null;
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Roles</h1>
          <p className="text-muted-foreground">Define and manage job roles within the organization</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Role</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Role</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Role Title *</Label><Input value={newRole.title} onChange={(e) => setNewRole(p => ({ ...p, title: e.target.value }))} placeholder="Enter role title" /></div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={newRole.department_id} onValueChange={(v) => setNewRole(p => ({ ...p, department_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level *</Label>
                <Select value={newRole.level} onValueChange={(v) => setNewRole(p => ({ ...p, level: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Description</Label><Input value={newRole.description} onChange={(e) => setNewRole(p => ({ ...p, description: e.target.value }))} placeholder="Role description" /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddRole}>Add Role</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {jobRoles.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No roles found. Add your first role.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {jobRoles.map((role) => (
            <Card key={role.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{role.title}</h3>
                      <Badge className={getLevelColor(role.level)}>{role.level}</Badge>
                    </div>
                    {getDeptName(role.department_id) && <p className="text-sm text-muted-foreground">Department: {getDeptName(role.department_id)}</p>}
                    {role.description && <p className="text-xs text-muted-foreground">{role.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingRole({ ...role }); setIsEditDialogOpen(true); }} className="gap-1"><Edit className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteRole(role.id)} className="gap-1 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Role</DialogTitle></DialogHeader>
          {editingRole && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Role Title *</Label><Input value={editingRole.title} onChange={(e) => setEditingRole(p => p ? { ...p, title: e.target.value } : null)} /></div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={editingRole.department_id || ""} onValueChange={(v) => setEditingRole(p => p ? { ...p, department_id: v } : null)}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Level *</Label>
                <Select value={editingRole.level} onValueChange={(v) => setEditingRole(p => p ? { ...p, level: v } : null)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateRole}>Update Role</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
