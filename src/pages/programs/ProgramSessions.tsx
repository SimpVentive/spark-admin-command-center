import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Session {
  id: string;
  program_id: string;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  current_participants: number;
  status: string | null;
  program?: { title: string; venue: string | null; faculty: string | null } | null;
}

const ProgramSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('program_sessions')
        .select('*, program:training_programs(title, venue, faculty)')
        .order('start_date', { ascending: false });
      if (error) throw error;
      setSessions((data as any) || []);
    } catch (error: any) { console.error(error); } finally { setLoading(false); }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "upcoming": case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/programs')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Programs</Button>
          <div>
            <h1 className="text-2xl font-bold">Program Sessions</h1>
            <p className="text-muted-foreground">Manage and schedule training sessions</p>
          </div>
        </div>
        <Button onClick={() => navigate('/programs/create')}><Plus className="h-4 w-4 mr-2" />Schedule Session</Button>
      </div>

      {sessions.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No sessions found. Create a program to schedule sessions.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{(session as any).program?.title || 'Unknown Program'}</h3>
                      <Badge className={getStatusColor(session.status)}>{(session.status || 'scheduled').charAt(0).toUpperCase() + (session.status || 'scheduled').slice(1)}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{session.start_date}</span>
                      {(session as any).program?.venue && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{(session as any).program.venue}</span>}
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{session.current_participants}/{session.max_participants || '∞'}</span>
                    </div>
                    {(session as any).program?.faculty && <p className="text-sm text-muted-foreground">Trainer: {(session as any).program.faculty}</p>}
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramSessions;
