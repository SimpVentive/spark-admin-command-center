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
import { Activity, ArrowLeft, Plus, Trash2, RefreshCw, Database, Cloud, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DataSources = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

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
    const { error } = await supabase.from("laser_data_sources").insert(form);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Data source added" });
    setShowDialog(false);
    setForm({ name: "", source_type: "csv", api_endpoint: "", sync_frequency: "daily" });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("laser_data_sources").delete().eq("id", id);
    toast({ title: "Data source removed" }); fetchData();
  };

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
            <Activity className="h-6 w-6 text-primary" /> Data Sources
          </h1>
          <p className="text-muted-foreground text-sm">Configure where KPI performance data comes from</p>
        </div>
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
                  <Label>API Endpoint</Label>
                  <Input value={form.api_endpoint} onChange={(e) => setForm({ ...form, api_endpoint: e.target.value })} placeholder="https://..." />
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleSave}>Add Source</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
                {s.api_endpoint && (
                  <p className="text-xs text-muted-foreground mt-3 truncate">{s.api_endpoint}</p>
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
            <p className="text-sm">Add a data source to automate KPI data ingestion. Start with CSV for Phase 1.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSources;
