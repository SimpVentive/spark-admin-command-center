import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Edit, Trash2, Settings, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";

interface Location {
  id: string;
  name: string;
  address: string | null;
  type: string | null;
  latitude: number | null;
  longitude: number | null;
  department_count: number;
  employee_count: number;
}

const Locations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationTypes, setLocationTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({ name: "", address: "", type: "" });
  const [newLocationType, setNewLocationType] = useState("");

  useEffect(() => { fetchLocations(); fetchLocationTypes(); }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await (supabase as any).from('locations').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const fetchLocationTypes = async () => {
    try {
      const { data } = await (supabase as any).from('location_types').select('*').eq('is_active', true).order('name');
      setLocationTypes(data || []);
    } catch {}
  };

  const handleAddLocation = async () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      toast({ title: "Error", description: "Name and address are required", variant: "destructive" });
      return;
    }
    try {
      const { error } = await (supabase as any).from('locations').insert([{ name: newLocation.name.trim(), address: newLocation.address.trim(), type: newLocation.type || null }]);
      if (error) throw error;
      toast({ title: "Success", description: "Location added successfully" });
      setNewLocation({ name: "", address: "", type: "" });
      setIsAddDialogOpen(false);
      fetchLocations();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleUpdateLocation = async () => {
    if (!editingLocation) return;
    try {
      const { error } = await (supabase as any).from('locations').update({ name: editingLocation.name, address: editingLocation.address, type: editingLocation.type }).eq('id', editingLocation.id);
      if (error) throw error;
      toast({ title: "Success", description: "Location updated" });
      setIsEditDialogOpen(false);
      fetchLocations();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDeleteLocation = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('locations').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Location deleted" });
      fetchLocations();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleAddLocationType = async () => {
    if (!newLocationType.trim()) return;
    try {
      const { error } = await (supabase as any).from('location_types').insert([{ name: newLocationType.trim() }]);
      if (error) throw error;
      toast({ title: "Success", description: "Location type added" });
      setNewLocationType("");
      fetchLocationTypes();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDeleteLocationType = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('location_types').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      fetchLocationTypes();
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plants & Locations</h1>
          <p className="text-muted-foreground">Manage organizational locations and facilities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsManageTypesOpen(true)} variant="outline" className="gap-2"><Settings className="h-4 w-4" />Manage Types</Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Location</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Location</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Location Name *</Label><Input value={newLocation.name} onChange={(e) => setNewLocation(p => ({ ...p, name: e.target.value }))} placeholder="Enter location name" /></div>
                <div className="space-y-2"><Label>Address *</Label><Input value={newLocation.address} onChange={(e) => setNewLocation(p => ({ ...p, address: e.target.value }))} placeholder="Enter address" /></div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newLocation.type} onValueChange={(v) => setNewLocation(p => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{locationTypes.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddLocation}>Add Location</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {locations.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No locations found. Add your first location.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{location.name}</h3>
                      {location.type && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{location.type}</span>}
                    </div>
                    {location.address && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{location.address}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{location.department_count} departments</span>
                      <span>{location.employee_count} employees</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingLocation({ ...location }); setIsEditDialogOpen(true); }} className="gap-1"><Edit className="h-4 w-4" />Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteLocation(location.id)} className="gap-1 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Location</DialogTitle></DialogHeader>
          {editingLocation && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={editingLocation.name} onChange={(e) => setEditingLocation(p => p ? { ...p, name: e.target.value } : null)} /></div>
              <div className="space-y-2"><Label>Address *</Label><Input value={editingLocation.address || ""} onChange={(e) => setEditingLocation(p => p ? { ...p, address: e.target.value } : null)} /></div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={editingLocation.type || ""} onValueChange={(v) => setEditingLocation(p => p ? { ...p, type: v } : null)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{locationTypes.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateLocation}>Update Location</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isManageTypesOpen} onOpenChange={setIsManageTypesOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Location Types</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Add New Type</Label>
              <div className="flex gap-2">
                <Input value={newLocationType} onChange={(e) => setNewLocationType(e.target.value)} placeholder="Enter new type" onKeyDown={(e) => e.key === 'Enter' && handleAddLocationType()} />
                <Button onClick={handleAddLocationType}>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Existing Types</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {locationTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{type.name}</span>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteLocationType(type.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsManageTypesOpen(false)}>Done</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locations;
