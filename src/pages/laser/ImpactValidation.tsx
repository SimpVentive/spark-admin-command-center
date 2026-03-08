import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { TrendingUp, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ImpactValidation = () => {
  const navigate = useNavigate();
  const [validations, setValidations] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"validations" | "patterns">("validations");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [valRes, patRes] = await Promise.all([
      supabase.from("laser_impact_validations").select("*, laser_kpi_definitions(name, unit), laser_assigned_interventions(profiles(full_name), intervention_type, micro_intervention_title, learning_paths(title), training_programs(title))").order("created_at", { ascending: false }),
      supabase.from("laser_pattern_repository").select("*, laser_kpi_definitions(name), laser_cause_definitions(cause_name)").order("avg_improvement_percentage", { ascending: false }),
    ]);
    setValidations(valRes.data || []);
    setPatterns(patRes.data || []);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" /> Impact Validation
          </h1>
          <p className="text-muted-foreground text-sm">Track KPI improvement after interventions and review learned patterns</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === "validations" ? "default" : "outline"} onClick={() => setActiveTab("validations")}>
          Impact Results ({validations.length})
        </Button>
        <Button variant={activeTab === "patterns" ? "default" : "outline"} onClick={() => setActiveTab("patterns")}>
          Pattern Repository ({patterns.length})
        </Button>
      </div>

      {activeTab === "validations" && (
        <Card>
          <CardContent className="pt-6">
            {validations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No impact data yet</p>
                <p className="text-sm">Impact is validated after interventions are completed and follow-up KPI data is collected.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead>Pre-Value</TableHead>
                    <TableHead>Post-Value</TableHead>
                    <TableHead>Improvement</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validations.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        {v.laser_assigned_interventions?.profiles?.full_name || "—"}
                      </TableCell>
                      <TableCell>{v.laser_kpi_definitions?.name || "—"}</TableCell>
                      <TableCell>{v.pre_intervention_value}</TableCell>
                      <TableCell>{v.post_intervention_value ?? "—"}</TableCell>
                      <TableCell>
                        {v.improvement_percentage != null ? (
                          <span className={v.improvement_percentage > 0 ? "text-emerald-600 font-medium" : "text-destructive"}>
                            {v.improvement_percentage > 0 ? "+" : ""}{v.improvement_percentage.toFixed(1)}%
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={v.validation_status === "improved" ? "default" : v.validation_status === "pending" ? "secondary" : "destructive"}>
                          {v.validation_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "patterns" && (
        <Card>
          <CardContent className="pt-6">
            {patterns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No patterns learned yet</p>
                <p className="text-sm">Patterns build over time as interventions are completed and validated.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPI</TableHead>
                    <TableHead>Cause</TableHead>
                    <TableHead>Successes</TableHead>
                    <TableHead>Failures</TableHead>
                    <TableHead>Avg Improvement</TableHead>
                    <TableHead>Refined Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patterns.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.laser_kpi_definitions?.name || "—"}</TableCell>
                      <TableCell>{p.laser_cause_definitions?.cause_name || "—"}</TableCell>
                      <TableCell className="text-emerald-600">{p.success_count}</TableCell>
                      <TableCell className="text-destructive">{p.failure_count}</TableCell>
                      <TableCell>
                        {p.avg_improvement_percentage != null ? `${p.avg_improvement_percentage.toFixed(1)}%` : "—"}
                      </TableCell>
                      <TableCell>{p.refined_weight?.toFixed(3) ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImpactValidation;
