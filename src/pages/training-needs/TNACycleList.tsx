import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Eye, Edit, Trash2, Calendar, Users } from "lucide-react";

interface TNACycle {
  id: string;
  name: string;
  status: "active" | "completed" | "draft" | "closed";
  startDate: string;
  endDate: string;
  departments: string[];
  totalEmployees: number;
  completedCount: number;
  createdBy: string;
  workflowType: string;
}

export default function TNACycleList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const cycles: TNACycle[] = [
    {
      id: "1",
      name: "Q1 2024 Training Needs Analysis",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      departments: ["Engineering", "Sales", "Marketing"],
      totalEmployees: 2847,
      completedCount: 2456,
      createdBy: "Admin",
      workflowType: "Individual Input + Manager Approval"
    },
    {
      id: "2",
      name: "Q4 2023 TNI Cycle",
      status: "completed",
      startDate: "2023-10-01",
      endDate: "2023-12-15",
      departments: ["All"],
      totalEmployees: 2650,
      completedCount: 2650,
      createdBy: "HR Manager",
      workflowType: "Manager Input for Team"
    },
    {
      id: "3",
      name: "Mid-Year 2024 Skills Assessment",
      status: "draft",
      startDate: "2024-06-01",
      endDate: "2024-07-31",
      departments: ["Engineering", "Operations"],
      totalEmployees: 1200,
      completedCount: 0,
      createdBy: "Training Head",
      workflowType: "Individual Input + Manager Approval"
    },
    {
      id: "4",
      name: "Q3 2023 Compliance Training Needs",
      status: "closed",
      startDate: "2023-07-01",
      endDate: "2023-09-30",
      departments: ["All"],
      totalEmployees: 2500,
      completedCount: 2380,
      createdBy: "Compliance Officer",
      workflowType: "TM Batch Input by Department"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      active: { variant: "default", label: "Active" },
      completed: { variant: "secondary", label: "Completed" },
      draft: { variant: "outline", label: "Draft" },
      closed: { variant: "destructive", label: "Closed" }
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredCycles = cycles.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.departments.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/training-needs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">TNA Cycles</h1>
            <p className="text-muted-foreground">View and manage all Training Needs Analysis cycles</p>
          </div>
        </div>
        <Button onClick={() => navigate('/training-needs/create-cycle')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{cycles.length}</div>
            <p className="text-sm text-muted-foreground">Total Cycles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{cycles.filter(c => c.status === "active").length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{cycles.filter(c => c.status === "completed").length}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{cycles.filter(c => c.status === "draft").length}</div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cycles by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All TNA Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cycle Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCycles.map((cycle) => (
                <TableRow key={cycle.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cycle.name}</p>
                      <p className="text-xs text-muted-foreground">Created by {cycle.createdBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {cycle.startDate} - {cycle.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cycle.departments.slice(0, 2).map(d => (
                        <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                      ))}
                      {cycle.departments.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{cycle.departments.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span className="text-sm">{cycle.completedCount}/{cycle.totalEmployees}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round((cycle.completedCount / cycle.totalEmployees) * 100)}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{cycle.workflowType}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={cycle.status === "completed" || cycle.status === "closed"}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
