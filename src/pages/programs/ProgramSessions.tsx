import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const mockSessions = [
  { id: "1", program: "Leadership Essentials", date: "2026-03-15", time: "09:00 - 12:00", location: "Training Room A", trainer: "Dr. Smith", enrolled: 25, capacity: 30, status: "upcoming" },
  { id: "2", program: "Safety Compliance", date: "2026-03-10", time: "14:00 - 17:00", location: "Online - Zoom", trainer: "Jane Doe", enrolled: 40, capacity: 50, status: "upcoming" },
  { id: "3", program: "Technical Skills Workshop", date: "2026-02-20", time: "10:00 - 16:00", location: "Lab B", trainer: "John Lee", enrolled: 15, capacity: 20, status: "completed" },
  { id: "4", program: "Communication Skills", date: "2026-04-01", time: "09:00 - 11:00", location: "Conference Hall", trainer: "Maria Garcia", enrolled: 18, capacity: 35, status: "scheduled" },
];

const ProgramSessions = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/programs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Programs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Program Sessions</h1>
            <p className="text-muted-foreground">Manage and schedule training sessions</p>
          </div>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <div className="grid gap-4">
        {mockSessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{session.program}</h3>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{session.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{session.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{session.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" />{session.enrolled}/{session.capacity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Trainer: {session.trainer}</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramSessions;
