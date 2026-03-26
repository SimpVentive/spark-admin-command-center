import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Search, Plus, Library, FileText, Video, Presentation,
  Building2, Upload, Filter, MoreHorizontal, Eye, Pencil,
  Trash2, Send, Download, Loader2, Tag, Users, BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ContentItem {
  id: string;
  title: string;
  content_type: string;
  description: string | null;
  file_format: string | null;
  file_size: number | null;
  tags: string[] | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  company_count?: number;
  avg_completion?: number;
}

interface CompanyPoolEntry {
  id: string;
  company_id: string;
  content_id: string;
  pool_type: string;
  completion_pct: number | null;
  company?: { name: string; id: string };
}

const GlobalContentLibrary = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [poolEntries, setPoolEntries] = useState<CompanyPoolEntry[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pushDialogOpen, setPushDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [pushType, setPushType] = useState<string>("mandatory");
  const [pushCompanyId, setPushCompanyId] = useState<string>("");

  const [newItem, setNewItem] = useState({
    title: "", description: "", content_type: "document", file_format: "pdf", tags: ""
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [contentRes, poolRes, compRes] = await Promise.all([
        (supabase as any).from("content_items").select("*").is("company_id", null).eq("is_active", true).order("created_at", { ascending: false }),
        (supabase as any).from("company_content_pool").select("*, company:companies(id, name)"),
        (supabase as any).from("companies").select("id, name").eq("is_active", true).order("name")
      ]);

      if (contentRes.error) throw contentRes.error;
      if (poolRes.error) throw poolRes.error;

      const pool: CompanyPoolEntry[] = poolRes.data || [];
      setPoolEntries(pool);
      setCompanies(compRes.data || []);

      const enriched = (contentRes.data || []).map((item: any) => {
        const itemPool = pool.filter((p) => p.content_id === item.id);
        const pcts = itemPool.map((p) => p.completion_pct || 0).filter((p) => p > 0);
        return {
          ...item,
          company_count: itemPool.length,
          avg_completion: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0,
        };
      });

      setItems(enriched);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load content library.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.description) {
      toast({ title: "Error", description: "Title and description are required.", variant: "destructive" });
      return;
    }
    try {
      const { error } = await (supabase as any).from("content_items").insert({
        title: newItem.title,
        description: newItem.description,
        content_type: newItem.content_type,
        file_format: newItem.file_format,
        tags: newItem.tags ? newItem.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        is_active: true,
        company_id: null,
      });
      if (error) throw error;
      toast({ title: "Success", description: "Content item added to global library." });
      setAddDialogOpen(false);
      setNewItem({ title: "", description: "", content_type: "document", file_format: "pdf", tags: "" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handlePushToCompany = async () => {
    if (!selectedItem || !pushCompanyId) return;
    try {
      // Check if already exists
      const { data: existing } = await (supabase as any)
        .from("company_content_pool")
        .select("id")
        .eq("company_id", pushCompanyId)
        .eq("content_id", selectedItem.id)
        .maybeSingle();

      if (existing) {
        toast({ title: "Already exists", description: "This content is already in the company's pool.", variant: "destructive" });
        return;
      }

      const { error } = await (supabase as any).from("company_content_pool").insert({
        company_id: pushCompanyId,
        content_id: selectedItem.id,
        pool_type: pushType,
        completion_pct: 0,
      });
      if (error) throw error;
      toast({ title: "Pushed", description: `Content pushed as ${pushType} to company.` });
      setPushDialogOpen(false);
      setPushCompanyId("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("content_items").update({ is_active: false }).eq("id", id);
      if (error) throw error;
      toast({ title: "Removed", description: "Content item deactivated." });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "presentation": return <Presentation className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      video: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      presentation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      document: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    };
    return <Badge className={colors[type] || "bg-muted text-muted-foreground"}>{type}</Badge>;
  };

  // Derive unique tags/categories from items
  const allTags = [...new Set(items.flatMap((i) => i.tags || []))].sort();
  const uniqueTypes = [...new Set(items.map((i) => i.content_type))].sort();

  const filtered = items.filter((i) => {
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || i.content_type === typeFilter;
    const matchesCategory = categoryFilter === "all" || (i.tags || []).includes(categoryFilter);
    return matchesSearch && matchesType && matchesCategory;
  });

  // Stats
  const totalCompaniesUsing = new Set(poolEntries.map((p) => p.company_id)).size;
  const mandatoryCount = poolEntries.filter((p) => p.pool_type === "mandatory").length;
  const avgAdoption = items.length > 0
    ? Math.round(items.reduce((sum, i) => sum + (i.company_count || 0), 0) / items.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Library className="h-7 w-7 text-primary" />
            Global Content Library
          </h1>
          <p className="text-muted-foreground">Manage global content items and push them to tenant companies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Content</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Global Content Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} placeholder="Content title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={newItem.content_type} onValueChange={(v) => setNewItem({ ...newItem, content_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={newItem.file_format} onValueChange={(v) => setNewItem({ ...newItem, file_format: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="pptx">PPTX</SelectItem>
                        <SelectItem value="xlsx">XLSX</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                        <SelectItem value="scorm">SCORM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} rows={3} placeholder="Describe this content..." />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input value={newItem.tags} onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })} placeholder="compliance, mandatory, safety" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddItem}>Add to Library</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Library className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{items.length}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10"><Building2 className="h-5 w-5 text-emerald-600" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCompaniesUsing}</p>
                <p className="text-xs text-muted-foreground">Companies Using</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Send className="h-5 w-5 text-amber-600" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mandatoryCount}</p>
                <p className="text-xs text-muted-foreground">Mandatory Pushes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10"><BarChart3 className="h-5 w-5 text-violet-600" /></div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgAdoption}</p>
                <p className="text-xs text-muted-foreground">Avg Adoption (companies)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Content ({items.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({items.filter((i) => i.content_type === "document").length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({items.filter((i) => i.content_type === "video").length})</TabsTrigger>
          <TabsTrigger value="presentations">Presentations ({items.filter((i) => i.content_type === "presentation").length})</TabsTrigger>
        </TabsList>

        {["all", "documents", "videos", "presentations"].map((tab) => {
          const tabItems = tab === "all" ? filtered : filtered.filter((i) =>
            tab === "documents" ? i.content_type === "document" :
            tab === "videos" ? i.content_type === "video" :
            i.content_type === "presentation"
          );

          return (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {/* Filters */}
              <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search content..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                {tab === "all" && (
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]"><Filter className="h-3 w-3 mr-1" /><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]"><Tag className="h-3 w-3 mr-1" /><SelectValue placeholder="Tag" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Content</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-center">Companies</TableHead>
                        <TableHead className="text-center">Avg Completion</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tabItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No content items found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        tabItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-md bg-muted">{getIcon(item.content_type)}</div>
                                <div>
                                  <p className="font-medium text-foreground">{item.title}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getTypeBadge(item.content_type)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {(item.tags || []).slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                                ))}
                                {(item.tags || []).length > 3 && (
                                  <Badge variant="outline" className="text-[10px]">+{(item.tags || []).length - 3}</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm font-medium">{item.company_count}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center gap-2 justify-center">
                                <Progress value={item.avg_completion} className="w-16 h-1.5" />
                                <span className="text-xs text-muted-foreground">{item.avg_completion}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem><Eye className="h-3 w-3 mr-2" />View Details</DropdownMenuItem>
                                  <DropdownMenuItem><Pencil className="h-3 w-3 mr-2" />Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedItem(item); setPushDialogOpen(true); }}>
                                    <Send className="h-3 w-3 mr-2" />Push to Company
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteItem(item.id)}>
                                    <Trash2 className="h-3 w-3 mr-2" />Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground">Showing {tabItems.length} of {items.length} items</p>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Push to Company Dialog */}
      <Dialog open={pushDialogOpen} onOpenChange={setPushDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Push Content to Company</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {getIcon(selectedItem.content_type)}
                  <span className="font-medium">{selectedItem.title}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company *</Label>
                <Select value={pushCompanyId} onValueChange={setPushCompanyId}>
                  <SelectTrigger><SelectValue placeholder="Select company..." /></SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pool Type</Label>
                <Select value={pushType} onValueChange={setPushType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">🔒 Mandatory — Cannot be removed by company</SelectItem>
                    <SelectItem value="optional">📋 Optional — Company can choose to use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPushDialogOpen(false)}>Cancel</Button>
                <Button onClick={handlePushToCompany} disabled={!pushCompanyId}>
                  <Send className="h-4 w-4 mr-1" />Push to Company
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalContentLibrary;
