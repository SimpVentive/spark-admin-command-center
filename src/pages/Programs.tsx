import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar, Users, MapPin, Monitor, BookOpen, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Programs = () => {
  const navigate = useNavigate();
  
  const programs = [
    {
      id: 1,
      title: "Leadership Development Program",
      type: "ILT",
      level: "Advanced",
      duration: "3 days",
      sessions: 2,
      enrolled: 45,
      capacity: 50,
      trainer: "Dr. Smith",
      venue: "Conference Room A",
      status: "Active"
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      type: "Digital",
      level: "Beginner",
      duration: "4 weeks",
      sessions: 1,
      enrolled: 120,
      capacity: 150,
      trainer: "Sarah Johnson",
      venue: "Online",
      status: "Active"
    },
    {
      id: 3,
      title: "Project Management Certification",
      type: "Hybrid",
      level: "Intermediate",
      duration: "6 weeks",
      sessions: 3,
      enrolled: 30,
      capacity: 35,
      trainer: "Mike Davis",
      venue: "Multiple",
      status: "Draft"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ILT': return <Users className="h-4 w-4" />;
      case 'Digital': return <Monitor className="h-4 w-4" />;
      case 'Hybrid': return <Video className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "Active" 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Program Management</h1>
          <p className="text-muted-foreground">Create and manage training programs</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/programs/create')}>
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search programs..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(program.type)}
                    <span className="text-sm text-muted-foreground">{program.type}</span>
                    <Badge variant="outline">{program.level}</Badge>
                  </div>
                </div>
                {getStatusBadge(program.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{program.enrolled}/{program.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{program.venue}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Trainer:</span>
                  <br />
                  <span className="font-medium">{program.trainer}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">
                  {program.sessions} session{program.sessions > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/programs/create')}>
            <Plus className="h-6 w-6" />
            <span>New Program</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span>Schedule Session</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => window.open('https://www.SimplifyMyTraining.com', '_blank')}>
            <Users className="h-6 w-6" />
            <span>Manage Trainers</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <MapPin className="h-6 w-6" />
            <span>Venue Setup</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Programs;
