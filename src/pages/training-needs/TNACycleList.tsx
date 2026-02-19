import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Search, Eye, Edit, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TNACycle {
  id: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  departments: string[];
  workflow_type: string;
  created_at: string;
}

export default function TNACycleList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cycles, setCycles] = useState<TNACycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCycles();
  }, []);

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('tna_cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error: any) {
      console.error('Error fetching cycles:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
    (c.departments || []).some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const countByStatus = (s: string) => cycles.filter(c => c.status === s).length;

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{cycles.length}</div><p className="text-sm text-muted-foreground">Total Cycles</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{countByStatus("active")}</div><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{countByStatus("completed")}</div><p className="text-sm text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{countByStatus("draft")}</div><p className="text-sm text-muted-foreground">Drafts</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search cycles by name or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All TNA Cycles</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading cycles...</div>
          ) : filteredCycles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {cycles.length === 0 ? "No cycles created yet. Create your first TNA cycle!" : "No cycles match your search."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cycle Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCycles.map((cycle) => (
                  <TableRow key={cycle.id}>
                    <TableCell>
                      <p className="font-medium">{cycle.name}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {cycle.start_date} - {cycle.end_date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(cycle.departments || []).slice(0, 2).map(d => (
                          <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                        ))}
                        {(cycle.departments || []).length > 2 && (
                          <Badge variant="outline" className="text-xs">+{cycle.departments.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell><span className="text-xs">{cycle.workflow_type}</span></TableCell>
                    <TableCell>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/training-needs/cycles/${cycle.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={cycle.status === "completed" || cycle.status === "closed"} onClick={() => navigate(`/training-needs/cycles/${cycle.id}?edit=true`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
