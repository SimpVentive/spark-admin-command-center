import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Building, Plus, Edit, Trash2, Users, MapPin, Loader2, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";

interface Venue {
  id: string;
  name: string;
  venue_type: string;
  address: string | null;
  city: string | null;
  capacity: number | null;
  contact_person: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  facilities: string[] | null;
  hourly_rate: number | null;
  location_id: string | null;
  notes: string | null;
  is_active: boolean;
}

const emptyVenue = {
  name: "", venue_type: "internal", address: "", city: "",
  capacity: "", contact_person: "", contact_phone: "", contact_email: "",
  hourly_rate: "", notes: ""
};

const Venues = () => {
  const { toast } = useToast();
  const { scopeData } = useCompanyScope();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [form, setForm] = useState(emptyVenue);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchVenues(); }, []);

  const fetchVenues = async () => {
    try {
      const { data, error } = await (supabase as any).from('venues').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      setVenues(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditingVenue(null); setForm(emptyVenue); setIsDialogOpen(true); };
  const openEdit = (v: Venue) => {
    setEditingVenue(v);
    setForm({
      name: v.name, venue_type: v.venue_type, address: v.address || "", city: v.city || "",
      capacity: v.capacity?.toString() || "", contact_person: v.contact_person || "",
      contact_phone: v.contact_phone || "", contact_email: v.contact_email || "",
      hourly_rate: v.hourly_rate?.toString() || "", notes: v.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Venue name is required", variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name.trim(), venue_type: form.venue_type, address: form.address || null,
      city: form.city || null, capacity: form.capacity ? parseInt(form.capacity) : null,
      contact_person: form.contact_person || null, contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null, hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      notes: form.notes || null
    };
    try {
      if (editingVenue) {
        const { error } = await (supabase as any).from('venues').update(payload).eq('id', editingVenue.id);
        if (error) throw error;
        toast({ title: "Success", description: "Venue updated" });
      } else {
        const { error } = await (supabase as any).from('venues').insert([scopeData(payload)]);
        if (error) throw error;
        toast({ title: "Success", description: "Venue added" });
      }
      setIsDialogOpen(false);
      fetchVenues();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('venues').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Venue deleted" });
      fetchVenues();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const filtered = filter === "all" ? venues : venues.filter(v => v.venue_type === filter);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Venues</h1>
          <p className="text-muted-foreground">Manage internal and external training venues</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Venue</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No venues found. Add your first venue.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((venue) => (
            <Card key={venue.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{venue.name}</h3>
                    <Badge variant={venue.venue_type === 'internal' ? 'default' : 'secondary'} className="mt-1">
                      {venue.venue_type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(venue)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(venue.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                {venue.address && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{venue.address}{venue.city ? `, ${venue.city}` : ''}</p>}
                {venue.capacity && <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />Capacity: {venue.capacity}</p>}
                {venue.contact_person && <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{venue.contact_person}</p>}
                {venue.hourly_rate && <p className="text-sm font-medium">₹{venue.hourly_rate}/hr</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Venue Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={form.venue_type} onValueChange={v => setForm(p => ({ ...p, venue_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contact_person} onChange={e => setForm(p => ({ ...p, contact_person: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Contact Phone</Label><Input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact Email</Label><Input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Hourly Rate (₹)</Label><Input type="number" value={form.hourly_rate} onChange={e => setForm(p => ({ ...p, hourly_rate: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingVenue ? 'Update' : 'Add'} Venue</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Venues;
