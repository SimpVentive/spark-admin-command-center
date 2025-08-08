
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Plus, Edit, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoogleMapPicker from "@/components/GoogleMapPicker";

interface Location {
  id: number;
  name: string;
  location: string;
  type: string;
  lat?: number;
  lng?: number;
  departments: number;
  employees: number;
}

const Locations = () => {
  const { toast } = useToast();
  const [locationTypes, setLocationTypes] = useState<string[]>([
    "Manufacturing Plant",
    "R&D Center", 
    "Regional Office",
    "Sales Office"
  ]);
  
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: "Headquarters", location: "123 Main St, City", type: "Regional Office", departments: 3, employees: 80 },
    { id: 2, name: "Manufacturing Plant", location: "456 Industrial Ave", type: "Manufacturing Plant", departments: 2, employees: 120 },
    { id: 3, name: "R&D Center", location: "789 Tech Blvd", type: "R&D Center", departments: 1, employees: 25 },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: "",
    location: "",
    type: "",
    lat: 0,
    lng: 0
  });
  const [newLocationType, setNewLocationType] = useState("");

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setNewLocation(prev => ({
      ...prev,
      location: address,
      lat,
      lng
    }));
  };

  const handleAddLocation = () => {
    if (!newLocation.name.trim() || !newLocation.location.trim() || !newLocation.type.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const location: Location = {
      id: Date.now(),
      name: newLocation.name.trim(),
      location: newLocation.location.trim(),
      type: newLocation.type.trim(),
      lat: newLocation.lat,
      lng: newLocation.lng,
      departments: 0,
      employees: 0
    };

    setLocations(prev => [...prev, location]);
    setNewLocation({ name: "", location: "", type: "", lat: 0, lng: 0 });
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
    
    if (!editingLocation.name.trim() || !editingLocation.location.trim() || !editingLocation.type.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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

  const handleAddLocationType = () => {
    if (!newLocationType.trim()) return;
    
    if (locationTypes.includes(newLocationType.trim())) {
      toast({
        title: "Error",
        description: "Location type already exists",
        variant: "destructive"
      });
      return;
    }

    setLocationTypes(prev => [...prev, newLocationType.trim()]);
    setNewLocationType("");
    
    toast({
      title: "Success",
      description: "Location type added successfully"
    });
  };

  const handleDeleteLocationType = (type: string) => {
    setLocationTypes(prev => prev.filter(t => t !== type));
    toast({
      title: "Success",
      description: "Location type deleted successfully"
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
        <div className="flex gap-2">
          <Button onClick={() => setIsManageTypesOpen(true)} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Types
          </Button>
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
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <GoogleMapPicker 
                  onLocationSelect={handleLocationSelect}
                  defaultValue={newLocation.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={newLocation.type} onValueChange={(value) => setNewLocation(prev => ({...prev, type: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      </div>

      <div className="grid gap-4">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{location.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{location.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location.location}
                  </p>
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
                <Label htmlFor="edit-name">Location Name *</Label>
                <Input
                  id="edit-name"
                  value={editingLocation.name}
                  onChange={(e) => setEditingLocation(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter location name"
                />
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <GoogleMapPicker 
                  onLocationSelect={(address, lat, lng) => setEditingLocation(prev => prev ? {...prev, location: address, lat, lng} : null)}
                  defaultValue={editingLocation.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select 
                  value={editingLocation.type} 
                  onValueChange={(value) => setEditingLocation(prev => prev ? {...prev, type: value} : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      {/* Manage Location Types Dialog */}
      <Dialog open={isManageTypesOpen} onOpenChange={setIsManageTypesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Location Types</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-type">Add New Type</Label>
              <div className="flex gap-2">
                <Input
                  id="new-type"
                  value={newLocationType}
                  onChange={(e) => setNewLocationType(e.target.value)}
                  placeholder="Enter new location type"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocationType()}
                />
                <Button onClick={handleAddLocationType}>Add</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Existing Types</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {locationTypes.map((type) => (
                  <div key={type} className="flex items-center justify-between p-2 border rounded">
                    <span>{type}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteLocationType(type)}
                      className="gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsManageTypesOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locations;
