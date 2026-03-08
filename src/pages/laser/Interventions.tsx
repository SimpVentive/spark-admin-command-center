import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Zap, ArrowLeft, BookOpen, GraduationCap, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Interventions = () => {
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("laser_assigned_interventions")
      .select("*, profiles(full_name), learning_paths(title), training_programs(title), laser_deviations(deviation_percentage, severity, laser_kpi_definitions(name))")
      .order("assigned_at", { ascending: false });
    setInterventions(data || []);
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    assigned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    skipped: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  const typeIcons: Record<string, any> = {
    learning_path: BookOpen,
    program: GraduationCap,
    micro: FileText,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" /> Active Interventions
          </h1>
          <p className="text-muted-foreground text-sm">Auto-assigned learning interventions based on root cause analysis</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {["assigned", "in_progress", "completed", "skipped"].map(status => {
          const count = interventions.filter(i => i.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground capitalize">{status.replace("_", " ")}</p>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          {interventions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No interventions assigned yet</p>
              <p className="text-sm">Interventions are auto-assigned when KPI deviations are detected and root causes identified.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>KPI Deviation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Intervention</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((i) => {
                  const TypeIcon = typeIcons[i.intervention_type] || FileText;
                  const kpiName = i.laser_deviations?.laser_kpi_definitions?.name || "—";
                  const deviation = i.laser_deviations?.deviation_percentage;
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.profiles?.full_name || "—"}</TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm">{kpiName}</span>
                          {deviation && <span className="text-xs text-destructive ml-2">({deviation.toFixed(1)}% off)</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{i.intervention_type.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {i.intervention_type === "learning_path" && (i.learning_paths?.title || "—")}
                        {i.intervention_type === "program" && (i.training_programs?.title || "—")}
                        {i.intervention_type === "micro" && (i.micro_intervention_title || "—")}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[i.status] || ""}>{i.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(i.assigned_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Interventions;
