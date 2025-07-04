
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

const Locations = () => {
  const locations = [
    { id: 1, name: "Headquarters", address: "123 Main St, City", departments: 3, employees: 80 },
    { id: 2, name: "Manufacturing Plant", address: "456 Industrial Ave", departments: 2, employees: 120 },
    { id: 3, name: "R&D Center", address: "789 Tech Blvd", departments: 1, employees: 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plants & Locations</h1>
          <p className="text-muted-foreground">Manage organizational locations and facilities</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
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
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Locations;
