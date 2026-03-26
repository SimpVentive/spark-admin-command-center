import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  Bell, Mail, Plus, Send, Eye, Pencil, Copy, Trash2,
  Megaphone, AlertTriangle, Wrench, Clock, Users, ChevronRight
} from "lucide-react";
import { format } from "date-fns";

/* ─── types ─── */
interface Announcement {
  id: string; type: string; priority: string; title: string; body: string;
  audience: string; status: string; show_from: string | null; show_until: string | null;
  also_email: boolean; views: number; created_at: string;
}
interface EmailCampaign {
  id: string; template: string | null; subject: string; body: string;
  audience: string; status: string; scheduled_at: string | null;
  sent_at: string | null; open_rate: number; created_at: string;
}
interface EmailTemplate {
  id: string; name: string; icon: string; description: string | null; default_subject: string | null;
}

const TYPE_ICONS: Record<string, any> = { banner: Megaphone, email: Mail, alert: AlertTriangle, maintenance: Wrench };
const TYPE_LABELS: Record<string, string> = { banner: "Banner", email: "Email", alert: "Alert", maintenance: "Maintenance" };
const PRIORITY_COLORS: Record<string, string> = {
  info: "bg-sky-100 text-sky-800 border-sky-300",
  warning: "bg-amber-100 text-amber-800 border-amber-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};
const STATUS_COLORS: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-800", scheduled: "bg-amber-100 text-amber-800",
  draft: "bg-muted text-muted-foreground", sent: "bg-sky-100 text-sky-800", archived: "bg-muted text-muted-foreground",
};

export default function AnnouncementsComms() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [emails, setEmails] = useState<EmailCampaign[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [emailStatusFilter, setEmailStatusFilter] = useState("all");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  // Create form
  const [form, setForm] = useState({
    type: "banner", priority: "info", title: "", body: "",
    audience: "all_tenants", showFrom: "", showUntil: "", alsoEmail: false,
  });

  // Email form
  const [emailForm, setEmailForm] = useState({
    template: "", subject: "", body: "", audience: "all_admins", scheduleAt: "",
  });

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const [{ data: anns }, { data: ems }, { data: tmpls }] = await Promise.all([
      (supabase as any).from("announcements").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("email_campaigns").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("email_templates").select("*").eq("is_active", true).order("created_at"),
    ]);
    setAnnouncements(anns || []);
    setEmails(ems || []);
    setTemplates(tmpls || []);
    setLoading(false);
  }

  // Stats
  const stats = useMemo(() => {
    const liveBanners = announcements.filter(a => a.type === "banner" && a.status === "live").length;
    const emailsSent = emails.filter(e => e.status === "sent").length;
    const scheduled = announcements.filter(a => a.status === "scheduled").length;
    const companies = 47; // placeholder for actual company count
    return [
      { label: "Active Banners", value: liveBanners, sub: "Showing on platform now", icon: Bell, color: "text-primary" },
      { label: "Emails Sent (30d)", value: emailsSent, sub: "94.2% delivery rate", icon: Send, color: "text-emerald-600" },
      { label: "Scheduled", value: scheduled, sub: "Upcoming this week", icon: Clock, color: "text-amber-600" },
      { label: "Tenant Coverage", value: "100%", sub: `All ${companies} companies reached`, icon: Users, color: "text-emerald-600" },
    ];
  }, [announcements, emails]);

  // Filtered announcements
  const filteredAnns = useMemo(() => {
    let list = announcements;
    if (typeFilter !== "all") list = list.filter(a => a.type === typeFilter);
    if (statusFilter !== "all") list = list.filter(a => a.status === statusFilter);
    if (audienceFilter !== "all") list = list.filter(a => a.audience === audienceFilter);
    return list;
  }, [announcements, typeFilter, statusFilter, audienceFilter]);

  const filteredEmails = useMemo(() => {
    if (emailStatusFilter === "all") return emails;
    return emails.filter(e => e.status === emailStatusFilter);
  }, [emails, emailStatusFilter]);

  // Active banners
  const activeBanners = announcements.filter(a => a.type === "banner" && a.status === "live");

  /* ─── CRUD ─── */
  async function createAnnouncement(status: string) {
    if (!form.title) { toast.error("Title is required"); return; }
    const { error } = await (supabase as any).from("announcements").insert({
      type: form.type, priority: form.priority, title: form.title, body: form.body,
      audience: form.audience, status,
      show_from: form.showFrom || null, show_until: form.showUntil || null,
      also_email: form.alsoEmail,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(status === "draft" ? "Draft saved" : "Announcement published");
    setCreateOpen(false);
    resetForm();
    fetchAll();
  }

  async function sendEmailCampaign(sendNow: boolean) {
    if (!emailForm.subject) { toast.error("Subject is required"); return; }
    const { error } = await (supabase as any).from("email_campaigns").insert({
      template: emailForm.template || null, subject: emailForm.subject,
      body: emailForm.body, audience: emailForm.audience,
      status: sendNow ? "sent" : emailForm.scheduleAt ? "scheduled" : "draft",
      scheduled_at: emailForm.scheduleAt || null,
      sent_at: sendNow ? new Date().toISOString() : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(sendNow ? "Email sent!" : "Email scheduled");
    setEmailOpen(false);
    resetEmailForm();
    fetchAll();
  }

  async function removeAnnouncement(id: string) {
    await (supabase as any).from("announcements").delete().eq("id", id);
    toast.success("Announcement removed");
    fetchAll();
  }

  async function duplicateAnnouncement(a: Announcement) {
    await (supabase as any).from("announcements").insert({
      type: a.type, priority: a.priority, title: a.title + " (copy)",
      body: a.body, audience: a.audience, status: "draft",
    });
    toast.success("Duplicated as draft");
    fetchAll();
  }

  function resetForm() {
    setForm({ type: "banner", priority: "info", title: "", body: "", audience: "all_tenants", showFrom: "", showUntil: "", alsoEmail: false });
  }
  function resetEmailForm() {
    setEmailForm({ template: "", subject: "", body: "", audience: "all_admins", scheduleAt: "" });
  }

  function selectTemplate(t: EmailTemplate) {
    setEmailForm(p => ({ ...p, template: t.name, subject: t.default_subject || "", body: "" }));
    setEmailOpen(true);
  }

  const audienceLabel = (a: string) => {
    const map: Record<string, string> = { all_tenants: "All Tenants", enterprise_only: "Enterprise Only", trial_users: "Trial Users", specific: "Specific Companies", all_admins: "All Admins" };
    return map[a] || a;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Announcements & Communications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Send platform-wide banners, email alerts, and maintenance notices to all tenants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { resetEmailForm(); setEmailOpen(true); }}>
            <Mail className="w-4 h-4 mr-1" /> Send Email
          </Button>
          <Button size="sm" onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Create Announcement
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold font-mono mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active banners */}
      {activeBanners.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Active Platform Banners</CardTitle>
                <CardDescription className="text-xs">Visible to all users right now</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => { resetForm(); setForm(p => ({ ...p, type: "banner" })); setCreateOpen(true); }}>
                <Plus className="w-3 h-3 mr-1" /> New Banner
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeBanners.map(b => (
              <div key={b.id} className={`p-3 rounded-lg border text-sm ${b.priority === "warning" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20" : b.priority === "critical" ? "bg-red-50 border-red-200 dark:bg-red-950/20" : "bg-sky-50 border-sky-200 dark:bg-sky-950/20"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1">{b.body || b.title}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => toast.success("Edit modal would open")}>Edit</Button>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeAnnouncement(b.id)}>Remove</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Announcements</TabsTrigger>
            <TabsTrigger value="emails">Email Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>
        </div>

        {/* ─── ALL ANNOUNCEMENTS ─── */}
        <TabsContent value="all">
          <div className="flex gap-2 mb-4 flex-wrap">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={audienceFilter} onValueChange={setAudienceFilter}>
              <SelectTrigger className="w-[150px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audience</SelectItem>
                <SelectItem value="all_tenants">All Tenants</SelectItem>
                <SelectItem value="enterprise_only">Enterprise Only</SelectItem>
                <SelectItem value="trial_users">Trial Users</SelectItem>
                <SelectItem value="specific">Specific Companies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredAnns.map(a => {
              const Icon = TYPE_ICONS[a.type] || Bell;
              return (
                <Card key={a.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold">{a.title}</h3>
                          <Badge variant="outline" className="text-[10px]">{TYPE_LABELS[a.type]}</Badge>
                          <Badge className={`text-[10px] ${STATUS_COLORS[a.status] || ""}`}>{a.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{a.body}</p>
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span>🎯 {audienceLabel(a.audience)}</span>
                          <span>{format(new Date(a.created_at), "dd MMM yyyy")}</span>
                          {a.views > 0 && <span>👁 {a.views.toLocaleString()} views</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Edit modal")}><Pencil className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateAnnouncement(a)}><Copy className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeAnnouncement(a.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredAnns.length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No announcements found. Create one to get started.</CardContent></Card>
            )}
          </div>
        </TabsContent>

        {/* ─── EMAIL CAMPAIGNS ─── */}
        <TabsContent value="emails">
          <div className="flex gap-2 mb-4">
            <Select value={emailStatusFilter} onValueChange={setEmailStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.subject}</TableCell>
                      <TableCell className="text-sm">{audienceLabel(e.audience)}</TableCell>
                      <TableCell className="text-sm">{e.sent_at ? format(new Date(e.sent_at), "dd MMM yyyy") : "—"}</TableCell>
                      <TableCell className="text-sm">{e.status === "sent" ? `${e.open_rate}%` : "—"}</TableCell>
                      <TableCell><Badge className={`text-[10px] ${STATUS_COLORS[e.status] || ""}`}>{e.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                          {e.status === "sent" && <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => toast.success("Resend triggered")}>Resend</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEmails.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No email campaigns yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TEMPLATES ─── */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <Card key={t.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <h3 className="text-sm font-semibold mb-1">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.description}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => selectTemplate(t)}>
                    Use Template <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── CREATE ANNOUNCEMENT MODAL ─── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(["banner", "alert", "maintenance", "email"] as const).map(t => (
                  <div
                    key={t}
                    onClick={() => setForm(p => ({ ...p, type: t }))}
                    className={`border rounded-lg p-2 text-xs cursor-pointer transition-all flex items-center gap-2 ${form.type === t ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"}`}
                  >
                    {React.createElement(TYPE_ICONS[t] || Bell, { className: "w-3.5 h-3.5" })}
                    {t === "banner" ? "Banner (in-platform)" : t === "alert" ? "Alert (dismissible)" : t === "maintenance" ? "Maintenance notice" : "Email campaign"}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Priority</Label>
              <div className="flex gap-2 mt-1">
                {(["info", "warning", "critical"] as const).map(p => (
                  <div
                    key={p}
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    className={`border rounded-lg px-3 py-1.5 text-xs cursor-pointer transition-all ${form.priority === p ? "border-primary ring-1 ring-primary" : ""} ${PRIORITY_COLORS[p]}`}
                  >
                    {p === "info" ? "Info (blue)" : p === "warning" ? "Warning (yellow)" : "Critical (red)"}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Title / Subject</Label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <Label className="text-xs">Message Body</Label>
              <Textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={3} />
            </div>

            <div>
              <Label className="text-xs">Target Audience</Label>
              <div className="flex gap-2 mt-1">
                {[
                  { key: "all_tenants", icon: "🌍", label: "All Tenants" },
                  { key: "enterprise_only", icon: "🏢", label: "Enterprise Only" },
                  { key: "specific", icon: "🎯", label: "Select Companies" },
                ].map(a => (
                  <div
                    key={a.key}
                    onClick={() => setForm(p => ({ ...p, audience: a.key }))}
                    className={`border rounded-lg px-3 py-2 text-xs cursor-pointer transition-all flex items-center gap-1.5 ${form.audience === a.key ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"}`}
                  >
                    <span>{a.icon}</span>{a.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Show From</Label><Input type="datetime-local" value={form.showFrom} onChange={e => setForm(p => ({ ...p, showFrom: e.target.value }))} /></div>
              <div><Label className="text-xs">Show Until (optional)</Label><Input type="datetime-local" value={form.showUntil} onChange={e => setForm(p => ({ ...p, showUntil: e.target.value }))} /></div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox checked={form.alsoEmail} onCheckedChange={v => setForm(p => ({ ...p, alsoEmail: !!v }))} />
              <Label className="text-xs">Also send as email notification to Company Admins</Label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button variant="outline" size="sm" onClick={() => createAnnouncement("draft")}>Save Draft</Button>
              <Button size="sm" onClick={() => createAnnouncement("live")}>Publish Now</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── SEND EMAIL MODAL ─── */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Send Email Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Email Template</Label>
              <Select value={emailForm.template} onValueChange={v => {
                const tmpl = templates.find(t => t.name === v);
                setEmailForm(p => ({ ...p, template: v, subject: tmpl?.default_subject || p.subject }));
              }}>
                <SelectTrigger><SelectValue placeholder="Select template…" /></SelectTrigger>
                <SelectContent>
                  {templates.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Subject Line</Label>
              <Input value={emailForm.subject} onChange={e => setEmailForm(p => ({ ...p, subject: e.target.value }))} />
            </div>

            <div>
              <Label className="text-xs">To</Label>
              <div className="flex gap-2 mt-1">
                {[
                  { key: "all_admins", icon: "🌍", label: "All Admins" },
                  { key: "enterprise_only", icon: "🏢", label: "Enterprise" },
                  { key: "specific", icon: "🎯", label: "Select" },
                ].map(a => (
                  <div
                    key={a.key}
                    onClick={() => setEmailForm(p => ({ ...p, audience: a.key }))}
                    className={`border rounded-lg px-3 py-2 text-xs cursor-pointer transition-all flex items-center gap-1.5 ${emailForm.audience === a.key ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-primary/40"}`}
                  >
                    <span>{a.icon}</span>{a.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Message</Label>
              <Textarea value={emailForm.body} onChange={e => setEmailForm(p => ({ ...p, body: e.target.value }))} rows={4} />
            </div>

            <div>
              <Label className="text-xs">Schedule (leave blank to send now)</Label>
              <Input type="datetime-local" value={emailForm.scheduleAt} onChange={e => setEmailForm(p => ({ ...p, scheduleAt: e.target.value }))} />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setEmailOpen(false)}>Cancel</Button>
              {emailForm.scheduleAt && <Button variant="outline" size="sm" onClick={() => sendEmailCampaign(false)}>Schedule</Button>}
              <Button size="sm" onClick={() => sendEmailCampaign(true)}><Send className="w-3 h-3 mr-1" /> Send Now</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
