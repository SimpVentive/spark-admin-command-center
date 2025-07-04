
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Plus, Edit, Trash2 } from "lucide-react";

const Roles = () => {
  const jobRoles = [
    { id: 1, title: "Software Engineer", department: "Engineering", level: "Mid-level", employees: 12 },
    { id: 2, title: "Marketing Specialist", department: "Marketing", level: "Entry-level", employees: 8 },
    { id: 3, title: "HR Manager", department: "Human Resources", level: "Senior", employees: 3 },
    { id: 4, title: "Sales Representative", department: "Sales", level: "Entry-level", employees: 15 },
    { id: 5, title: "Product Manager", department: "Engineering", level: "Senior", employees: 4 },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Entry-level": return "bg-green-100 text-green-800";
      case "Mid-level": return "bg-blue-100 text-blue-800";
      case "Senior": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Roles</h1>
          <p className="text-muted-foreground">Define and manage job roles within the organization</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-4">
        {jobRoles.map((role) => (
          <Card key={role.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{role.title}</h3>
                    <Badge className={getLevelColor(role.level)}>
                      {role.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Department: {role.department}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <UserCheck className="h-3 w-3" />
                    {role.employees} employees in this role
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

export default Roles;
