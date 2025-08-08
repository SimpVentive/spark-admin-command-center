
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: number;
  name: string;
  address: string;
  departments: number;
  employees: number;
}

const Locations = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: "Headquarters", address: "123 Main St, City", departments: 3, employees: 80 },
    { id: 2, name: "Manufacturing Plant", address: "456 Industrial Ave", departments: 2, employees: 120 },
    { id: 3, name: "R&D Center", address: "789 Tech Blvd", departments: 1, employees: 25 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: ""
  });

  const handleAddLocation = () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const location: Location = {
      id: Date.now(),
      name: newLocation.name.trim(),
      address: newLocation.address.trim(),
      departments: 0,
      employees: 0
    };

    setLocations(prev => [...prev, location]);
    setNewLocation({ name: "", address: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Location added successfully"
    });
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation({ ...location });
    setIsEditDialogOpen(true);
  };

  const handleUpdateLocation = () => {
    if (!editingLocation) return;
    
    if (!editingLocation.name.trim() || !editingLocation.address.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLocations(prev => prev.map(loc => 
      loc.id === editingLocation.id ? editingLocation : loc
    ));
    setIsEditDialogOpen(false);
    setEditingLocation(null);
    
    toast({
      title: "Success",
      description: "Location updated successfully"
    });
  };

  const handleDeleteLocation = (id: number) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    toast({
      title: "Success",
      description: "Location deleted successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plants & Locations</h1>
          <p className="text-muted-foreground">Manage organizational locations and facilities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation(prev => ({...prev, address: e.target.value}))}
                  placeholder="Enter address"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLocation}>
                  Add Location
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{location.departments} departments</span>
                    <span>{location.employees} employees</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditLocation(location)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteLocation(location.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          {editingLocation && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Location Name</Label>
                <Input
                  id="edit-name"
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingLocation.address}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, address: e.target.value} : null)}
                  placeholder="Enter address"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLocation}>
                  Update Location
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locations;
