
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, ExternalLink, Users, Star, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Trainers = () => {
  const trainers = [
    { 
      id: 1, 
      name: "Dr. John Smith", 
      specialization: "Leadership Development", 
      rating: 4.8, 
      programs: 12, 
      location: "New York",
      status: "Active",
      external: false
    },
    { 
      id: 2, 
      name: "Sarah Johnson", 
      specialization: "Digital Marketing", 
      rating: 4.9, 
      programs: 8, 
      location: "Online",
      status: "Active",
      external: false
    },
    { 
      id: 3, 
      name: "Mike Davis", 
      specialization: "Project Management", 
      rating: 4.7, 
      programs: 15, 
      location: "California",
      status: "Active",
      external: false
    },
  ];

  const { toast } = useToast();

  const handleConnectToSimplify = () => {
    window.open('https://www.SimplifyMyTraining.com', '_blank');
  };

  const handleAddTrainer = () => {
    toast({
      title: "Add Trainer",
      description: "Trainer creation form coming soon!",
    });
  };

  const handleScheduleTraining = () => {
    toast({
      title: "Schedule Training",
      description: "Training scheduling feature coming soon!",
    });
  };

  const handleTrainerReports = () => {
    toast({
      title: "Trainer Reports",
      description: "Trainer analytics and reports coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trainer Management</h1>
          <p className="text-muted-foreground">Manage internal trainers and connect with SimplifyMyTraining.com</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleConnectToSimplify} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            SimplifyMyTraining.com
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Trainer
          </Button>
        </div>
      </div>

      {/* SimplifyMyTraining Integration Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <ExternalLink className="h-5 w-5" />
            SimplifyMyTraining.com Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 mb-2">
                Access thousands of professional trainers and expand your training capabilities
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Browse verified trainers by expertise</li>
                <li>• Book training sessions directly</li>
                <li>• Access training materials and resources</li>
                <li>• Manage external trainer relationships</li>
              </ul>
            </div>
            <Button onClick={handleConnectToSimplify} className="bg-blue-600 hover:bg-blue-700">
              Connect Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trainers..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
        <Button variant="outline">Sort by Rating</Button>
      </div>

      {/* Trainers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainers.map((trainer) => (
          <Card key={trainer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{trainer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                </div>
                <Badge variant={trainer.status === "Active" ? "default" : "secondary"}>
                  {trainer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{trainer.rating}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{trainer.programs} programs</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{trainer.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Profile</Button>
                  <Button size="sm">Assign Program</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleAddTrainer}>
            <Plus className="h-6 w-6" />
            <span>Add Trainer</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleConnectToSimplify}>
            <ExternalLink className="h-6 w-6" />
            <span>Browse External</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleScheduleTraining}>
            <Calendar className="h-6 w-6" />
            <span>Schedule Training</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleTrainerReports}>
            <Users className="h-6 w-6" />
            <span>Trainer Reports</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trainers;
