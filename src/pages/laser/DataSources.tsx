import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Activity, ArrowLeft, Plus, Trash2, RefreshCw, Database, Cloud, FileSpreadsheet, Copy, BookOpen, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DataSources = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [learningLoopRunning, setLearningLoopRunning] = useState(false);

  const [form, setForm] = useState({
    name: "", source_type: "csv", api_endpoint: "", sync_frequency: "daily",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("laser_data_sources").select("*").order("created_at", { ascending: false });
    setSources(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    // Generate an API key for this source
    const apiKey = `laser_${crypto.randomUUID().replace(/-/g, "")}`;
    const { error } = await supabase.from("laser_data_sources").insert({
      ...form,
      api_key_encrypted: apiKey,
      status: "active",
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Data source added", description: `API Key: ${apiKey}` });
    setShowDialog(false);
    setForm({ name: "", source_type: "csv", api_endpoint: "", sync_frequency: "daily" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("laser_data_sources").delete().eq("id", id);
    toast({ title: "Data source removed" }); fetchData();
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "API key copied to clipboard" });
  };

  const handleRunLearningLoop = async () => {
    setLearningLoopRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("laser-learning-loop", { body: {} });
      if (error) throw error;
      toast({
        title: "🧠 Learning Loop Complete",
        description: `${data.validations_processed} validations processed, ${data.patterns_updated + data.patterns_created} patterns updated`,
      });
    } catch (err: any) {
      toast({ title: "Learning loop failed", description: err.message, variant: "destructive" });
    } finally {
      setLearningLoopRunning(false);
    }
  };

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "exwakeotltumdcsviinl";
  const ingestionUrl = `https://${projectId}.supabase.co/functions/v1/laser-data-ingestion`;

  const sourceTypeIcons: Record<string, any> = {
    csv: FileSpreadsheet,
    api: Cloud,
    erp: Database,
    mes: Database,
    hris: Database,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/laser")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Data Sources & Integration
          </h1>
          <p className="text-muted-foreground text-sm">Configure external systems to push KPI data and manage the learning loop</p>
        </div>
        <Button variant="outline" onClick={handleRunLearningLoop} disabled={learningLoopRunning}>
          <Brain className="h-4 w-4 mr-2" />
          {learningLoopRunning ? "Running..." : "Run Learning Loop"}
        </Button>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Add Source</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Data Source</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Source Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Plant A ERP System" />
              </div>
              <div>
                <Label>Source Type</Label>
                <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV Upload</SelectItem>
                    <SelectItem value="api">REST API</SelectItem>
                    <SelectItem value="erp">ERP System</SelectItem>
                    <SelectItem value="mes">MES System</SelectItem>
                    <SelectItem value="hris">HRIS System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.source_type !== "csv" && (
                <div>
                  <Label>API Endpoint (source system)</Label>
                  <Input value={form.api_endpoint} onChange={(e) => setForm({ ...form, api_endpoint: e.target.value })} placeholder="https://your-erp.com/api/kpis" />
                </div>
              )}
              <div>
                <Label>Sync Frequency</Label>
                <Select value={form.sync_frequency} onValueChange={(v) => setForm({ ...form, sync_frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">An API key will be auto-generated. Use it to authenticate data pushes from your external system.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>Add Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Documentation */}
      <Accordion type="single" collapsible>
        <AccordionItem value="api-docs" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">API Integration Guide</p>
                <p className="text-xs text-muted-foreground">How to push KPI data from external systems (ERP, MES, HRIS)</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">ENDPOINT</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono break-all">
                    POST {ingestionUrl}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(ingestionUrl); toast({ title: "URL copied" }); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">HEADERS</Label>
                <pre className="text-xs bg-muted px-3 py-2 rounded-md mt-1 overflow-x-auto">{`Content-Type: application/json
x-laser-api-key: <your-api-key>`}</pre>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">REQUEST BODY</Label>
                <pre className="text-xs bg-muted px-3 py-2 rounded-md mt-1 overflow-x-auto">{`{
  "employee_lookup_field": "employee_id",  // "id", "employee_id", or "email"
  "signals": [
    {
      "employee_code": "EMP-001",
      "kpi_name": "Production Output",
      "value": 85.5,
      "date": "2026-03-08"
    },
    {
      "employee_id": "uuid-here",
      "kpi_id": "kpi-uuid",
      "value": 92.0
    }
  ]
}`}</pre>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">RESPONSE</Label>
                <pre className="text-xs bg-muted px-3 py-2 rounded-md mt-1 overflow-x-auto">{`{
  "message": "Data ingestion complete",
  "batch_id": "uuid",
  "source": "Plant A ERP",
  "inserted": 2,
  "skipped": 0,
  "deviations_detected": 1,
  "errors": []
}`}</pre>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>How it works:</strong></p>
                <p>1. External system sends KPI data via POST request</p>
                <p>2. System validates employee/KPI references and inserts performance signals</p>
                <p>3. Each signal is checked against role-KPI threshold mappings</p>
                <p>4. If a deviation is detected, the Bayesian RCA engine runs automatically</p>
                <p>5. Interventions are auto-assigned to the employee</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Data Source Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => {
          const Icon = sourceTypeIcons[s.source_type] || Database;
          return (
            <Card key={s.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.source_type} • {s.sync_frequency}</p>
                    </div>
                  </div>
                  <Badge variant={s.status === "active" ? "default" : "secondary"}>{s.status}</Badge>
                </div>
                {s.api_key_encrypted && (
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">API Key</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate font-mono">
                        {s.api_key_encrypted.slice(0, 20)}...
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyApiKey(s.api_key_encrypted)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {s.api_endpoint && (
                  <p className="text-xs text-muted-foreground mt-2 truncate">{s.api_endpoint}</p>
                )}
                {s.last_sync_at && (
                  <p className="text-xs text-muted-foreground mt-1">Last sync: {new Date(s.last_sync_at).toLocaleString()}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="h-3 w-3 mr-1" /> Sync Now
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sources.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No data sources configured</p>
            <p className="text-sm">Add a data source to get an API key for external system integration.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSources;
