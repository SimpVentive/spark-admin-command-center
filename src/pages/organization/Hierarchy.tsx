
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users } from "lucide-react";

const Hierarchy = () => {
  const departments = [
    { id: 1, name: "Engineering", manager: "John Smith", employees: 45 },
    { id: 2, name: "Marketing", manager: "Sarah Johnson", employees: 23 },
    { id: 3, name: "Human Resources", manager: "Mike Davis", employees: 12 },
    { id: 4, name: "Sales", manager: "Lisa Chen", employees: 34 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reporting Structure</h1>
        <p className="text-muted-foreground">View organizational hierarchy and reporting relationships</p>
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

export default Hierarchy;
