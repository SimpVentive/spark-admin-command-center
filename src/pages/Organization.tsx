
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Plus, Edit, Trash2 } from "lucide-react";

const Organization = () => {
  const departments = [
    { id: 1, name: "Engineering", manager: "John Smith", employees: 45, location: "Building A" },
    { id: 2, name: "Marketing", manager: "Sarah Johnson", employees: 23, location: "Building B" },
    { id: 3, name: "Human Resources", manager: "Mike Davis", employees: 12, location: "Building A" },
    { id: 4, name: "Sales", manager: "Lisa Chen", employees: 34, location: "Building C" },
  ];

  const locations = [
    { id: 1, name: "Headquarters", address: "123 Main St, City", departments: 3, employees: 80 },
    { id: 2, name: "Manufacturing Plant", address: "456 Industrial Ave", departments: 2, employees: 120 },
    { id: 3, name: "R&D Center", address: "789 Tech Blvd", departments: 1, employees: 25 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground">Manage departments, reporting structure, and locations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">Manager: {dept.manager}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dept.employees} employees
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {dept.location}
                      </span>
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
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizational Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2"></div>
                <h3 className="font-medium">CEO</h3>
                <p className="text-sm text-muted-foreground">Executive Level</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-3 border rounded-lg text-center">
                  <div className="w-10 h-10 bg-secondary rounded-full mx-auto mb-2"></div>
                  <h4 className="font-medium text-sm">{dept.name}</h4>
                  <p className="text-xs text-muted-foreground">{dept.manager}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {dept.employees} members
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;
