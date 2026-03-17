import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Edit, Trash2, Users, MapPin, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useCompanyScope } from "@/hooks/useCompanyScope";

interface Event {
  id: string;
  title: string;
  description: string | null;
  program_id: string | null;
  event_type: string;
  venue_id: string | null;
  location_id: string | null;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  max_participants: number | null;
  status: string;
  meeting_link: string | null;
  budget_allocated: number | null;
}

const emptyForm = {
  title: "", description: "", event_type: "offline", start_date: "", end_date: "",
  start_time: "", end_time: "", max_participants: "", meeting_link: "",
  budget_allocated: "", venue_id: "", location_id: "", program_id: ""
};

const statusColors: Record<string, string> = {
  draft: "secondary", scheduled: "default", in_progress: "default", completed: "default", cancelled: "destructive"
};

const EventsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scopeData } = useCompanyScope();
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [evRes, veRes, loRes, prRes] = await Promise.all([
        (supabase as any).from('events').select('*').eq('is_active', true).order('start_date', { ascending: false }),
        (supabase as any).from('venues').select('id, name').eq('is_active', true),
        (supabase as any).from('locations').select('id, name').eq('is_active', true),
        (supabase as any).from('training_programs').select('id, name')
      ]);
      setEvents(evRes.data || []);
      setVenues(veRes.data || []);
      setLocations(loRes.data || []);
      setPrograms(prRes.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditingEvent(null); setForm(emptyForm); setIsDialogOpen(true); };
  const openEdit = (ev: Event) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title, description: ev.description || "", event_type: ev.event_type,
      start_date: ev.start_date, end_date: ev.end_date, start_time: ev.start_time || "",
      end_time: ev.end_time || "", max_participants: ev.max_participants?.toString() || "",
      meeting_link: ev.meeting_link || "", budget_allocated: ev.budget_allocated?.toString() || "",
      venue_id: ev.venue_id || "", location_id: ev.location_id || "", program_id: ev.program_id || ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.start_date || !form.end_date) {
      toast({ title: "Error", description: "Title, start date, and end date are required", variant: "destructive" });
      return;
    }
    const payload: any = {
      title: form.title.trim(), description: form.description || null, event_type: form.event_type,
      start_date: form.start_date, end_date: form.end_date,
      start_time: form.start_time || null, end_time: form.end_time || null,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      meeting_link: form.meeting_link || null,
      budget_allocated: form.budget_allocated ? parseFloat(form.budget_allocated) : null,
      venue_id: form.venue_id || null, location_id: form.location_id || null,
      program_id: form.program_id || null
    };
    try {
      if (editingEvent) {
        const { error } = await (supabase as any).from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        toast({ title: "Success", description: "Event updated" });
      } else {
        payload.status = 'scheduled';
        const { error } = await (supabase as any).from('events').insert([payload]);
        if (error) throw error;
        toast({ title: "Success", description: "Event created" });
      }
      setIsDialogOpen(false);
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await (supabase as any).from('events').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Event deleted" });
      fetchAll();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const filtered = statusFilter === "all" ? events : events.filter(e => e.status === statusFilter);

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage training events, sessions, and attendance</p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Create Event</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No events found. Create your first event.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => {
            const venueName = venues.find(v => v.id === event.venue_id)?.name;
            const locationName = locations.find(l => l.id === event.location_id)?.name;
            const programName = programs.find(p => p.id === event.program_id)?.name;
            return (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge variant={statusColors[event.status] as any}>{event.status.replace('_', ' ')}</Badge>
                        <Badge variant="outline">{event.event_type.replace('_', ' ')}</Badge>
                      </div>
                      {programName && <p className="text-sm text-primary">Program: {programName}</p>}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.start_date} → {event.end_date}</span>
                        {venueName && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{venueName}</span>}
                        {locationName && <span>Location: {locationName}</span>}
                        {event.max_participants && <span className="flex items-center gap-1"><Users className="h-3 w-3" />Max: {event.max_participants}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/events/${event.id}`)} className="gap-1"><Eye className="h-4 w-4" />Details</Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(event)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Event Title *</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Type *</Label>
                <Select value={form.event_type} onValueChange={v => setForm(p => ({ ...p, event_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online_virtual">Online Virtual</SelectItem>
                    <SelectItem value="elearning">eLearning</SelectItem>
                    <SelectItem value="blended">Blended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Program</Label>
                <Select value={form.program_id} onValueChange={v => setForm(p => ({ ...p, program_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date *</Label><Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} /></div>
              <div className="space-y-2"><Label>End Date *</Label><Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))} /></div>
              <div className="space-y-2"><Label>End Time</Label><Input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue</Label>
                <Select value={form.venue_id} onValueChange={v => setForm(p => ({ ...p, venue_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select venue" /></SelectTrigger>
                  <SelectContent>
                    {venues.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={form.location_id} onValueChange={v => setForm(p => ({ ...p, location_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>
                    {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Max Participants</Label><Input type="number" value={form.max_participants} onChange={e => setForm(p => ({ ...p, max_participants: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Budget (₹)</Label><Input type="number" value={form.budget_allocated} onChange={e => setForm(p => ({ ...p, budget_allocated: e.target.value }))} /></div>
            </div>
            {(form.event_type === 'online_virtual' || form.event_type === 'blended') && (
              <div className="space-y-2"><Label>Meeting Link</Label><Input value={form.meeting_link} onChange={e => setForm(p => ({ ...p, meeting_link: e.target.value }))} placeholder="https://..." /></div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingEvent ? 'Update' : 'Create'} Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsList;
