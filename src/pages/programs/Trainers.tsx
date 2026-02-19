import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, ExternalLink, Star, MapPin, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Trainer {
  id: string;
  name: string;
  specialization: string | null;
  rating: number;
  programs_count: number;
  location: string | null;
  status: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
}

const Trainers = () => {
  const { toast } = useToast();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: "", specialization: "", location: "", email: "", phone: "" });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    try {
      const { data, error } = await (supabase as any).from('trainers').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      setTrainers(data || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const handleAddTrainer = async () => {
    if (!newTrainer.name.trim()) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }
    try {
      const { error } = await (supabase as any).from('trainers').insert([{
        name: newTrainer.name.trim(),
        specialization: newTrainer.specialization || null,
        location: newTrainer.location || null,
        email: newTrainer.email || null,
        phone: newTrainer.phone || null,
      }]);
      if (error) throw error;
      toast({ title: "Success", description: "Trainer added successfully" });
      setNewTrainer({ name: "", specialization: "", location: "", email: "", phone: "" });
      setIsAddDialogOpen(false);
      fetchTrainers();
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
  };

  const filtered = trainers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.specialization || '').toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trainer Management</h1>
          <p className="text-muted-foreground">Manage internal trainers and connect with SimplifyMyTraining.com</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('https://www.SimplifyMyTraining.com', '_blank')} className="gap-2"><ExternalLink className="h-4 w-4" />SimplifyMyTraining.com</Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Trainer</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Trainer</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={newTrainer.name} onChange={(e) => setNewTrainer(p => ({ ...p, name: e.target.value }))} placeholder="Trainer name" /></div>
                <div className="space-y-2"><Label>Specialization</Label><Input value={newTrainer.specialization} onChange={(e) => setNewTrainer(p => ({ ...p, specialization: e.target.value }))} placeholder="Area of expertise" /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={newTrainer.location} onChange={(e) => setNewTrainer(p => ({ ...p, location: e.target.value }))} placeholder="Location" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={newTrainer.email} onChange={(e) => setNewTrainer(p => ({ ...p, email: e.target.value }))} placeholder="Email" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={newTrainer.phone} onChange={(e) => setNewTrainer(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" /></div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTrainer}>Add Trainer</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-blue-800"><ExternalLink className="h-5 w-5" />SimplifyMyTraining.com Integration</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 mb-2">Access thousands of professional trainers</p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Browse verified trainers by expertise</li>
                <li>• Book training sessions directly</li>
              </ul>
            </div>
            <Button onClick={() => window.open('https://www.SimplifyMyTraining.com', '_blank')} className="bg-blue-600 hover:bg-blue-700">Connect Now</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trainers..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No trainers found. Add your first trainer.</CardContent></Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trainer) => (
            <Card key={trainer.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{trainer.specialization || 'No specialization'}</p>
                  </div>
                  <Badge variant={trainer.status === "Active" ? "default" : "secondary"}>{trainer.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /><span>{trainer.rating}/5.0</span></div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{trainer.programs_count} programs</span></div>
                  {trainer.location && <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{trainer.location}</span></div>}
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button size="sm">Assign Program</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trainers;
