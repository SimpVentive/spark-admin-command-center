import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, LogIn, Edit, Mail, Phone, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ALL_FEATURES = [
  { id: "core_lms", name: "Core LMS", desc: "Course management, enrollments, completions", addon: false },
  { id: "posh", name: "POSH Compliance", desc: "Prevention of Sexual Harassment training", addon: false },
  { id: "scorm", name: "SCORM / xAPI", desc: "Import and run SCORM 1.2, 2004 and xAPI packages", addon: false },
  { id: "assessments", name: "Assessments", desc: "Quiz builder, question bank, auto-grading", addon: false },
  { id: "analytics", name: "Advanced Analytics", desc: "Completion trends, skill gap analysis, dashboards", addon: false },
  { id: "custom_branding", name: "Custom Branding", desc: "Company logo, colours, email templates", addon: false },
  { id: "api_access", name: "API Access", desc: "REST API for third-party integrations", addon: false },
  { id: "sso", name: "Single Sign-On", desc: "SAML 2.0 / Azure AD / Google Workspace SSO", addon: false },
  { id: "vilt", name: "VILT / Live Sessions", desc: "Virtual instructor-led training scheduler", addon: true },
  { id: "ai_recommendations", name: "AI Recommendations", desc: "AI-powered course & skill suggestions", addon: true },
  { id: "hrms_integration", name: "HRMS Integration", desc: "Sync employees from SAP, Darwinbox, Keka", addon: true },
  { id: "whitelabel", name: "White-label", desc: "Remove UniTol branding entirely", addon: true },
];

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  [key: string]: any;
}

interface Props {
  company: Company | null;
  onClose: () => void;
  companyAdmins: any[];
  employeeCounts: Record<string, number>;
  payments: any[];
  companyFeatures: any[];
}

export default function CompanyDetailDrawer({ company, onClose, companyAdmins, employeeCounts, payments, companyFeatures }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Activity log
  const { data: activityLog = [] } = useQuery({
    queryKey: ["company-activity", company?.id],
    enabled: !!company?.id,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("company_activity_log")
        .select("*")
        .eq("company_id", company!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ featureKey, enabled }: { featureKey: string; enabled: boolean }) => {
      const { error } = await (supabase as any).from("company_features").upsert({
        company_id: company!.id,
        feature_key: featureKey,
        is_enabled: enabled,
      }, { onConflict: "company_id,feature_key" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company-features"] }),
  });

  const suspendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("companies").update({ is_active: false }).eq("id", company!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company suspended" });
    },
  });

  if (!company) return null;

  const admins = companyAdmins.filter((a: any) => a.company_id === company.id);
  const empCount = employeeCounts[company.id] || 0;
  const payment = payments.find((p: any) => p.company_id === company.id);
  const planName = payment?.plan_name || "Starter";
  const features = companyFeatures.filter((f: any) => f.company_id === company.id);
  const isFeatureEnabled = (key: string) => features.some((f: any) => f.feature_key === key && f.is_enabled);

  const healthScore = (() => {
    let score = 50;
    if (empCount > 0) score += 20;
    if (empCount > 10) score += 10;
    if (admins.length > 0) score += 15;
    if (payment?.plan_status === "active") score += 5;
    return Math.min(score, 100);
  })();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "contacts", label: "People" },
    { id: "features", label: "Feature Access" },
    { id: "bandwidth", label: "Bandwidth" },
    { id: "activity", label: "Activity" },
  ];

  const fmt = (n: number | null | undefined) => n ? "₹" + n.toLocaleString("en-IN") : "—";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/35 z-50 transition-opacity ${company ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 w-[680px] max-w-[95vw] h-full bg-background z-[51] shadow-2xl transition-transform duration-300 flex flex-col ${company ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="px-5 py-3.5 border-b flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${company.logo_url ? "" : "bg-primary"}`}>
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="w-10 h-10 rounded-lg object-contain" />
            ) : (
              company.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px]">{company.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{company.id.substring(0, 8)} · {company.industry || "—"} · {company.subdomain || company.slug}.unitoltms.com</div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast({ title: "Impersonation started" })}>
              <LogIn className="h-3 w-3" /> Login As
            </Button>
            <Button variant="default" size="sm" className="h-7 text-xs" onClick={() => toast({ title: "Edit opened" })}>Edit</Button>
            <button onClick={onClose} className="w-7 h-7 rounded border flex items-center justify-center text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-5 shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === t.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Active Users</p>
                  <p className="text-lg font-bold font-mono">{empCount}</p>
                  <p className="text-[11px] text-muted-foreground">of {(payment as any)?.seats_included || Math.max(empCount, 20)} licensed</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">MRR</p>
                  <p className="text-lg font-bold font-mono">{fmt(payment?.amount)}</p>
                  <p className="text-[11px] text-muted-foreground">{planName} · {payment?.billing_cycle || "—"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Health Score</p>
                  <p className="text-lg font-bold font-mono">{healthScore}</p>
                  <p className="text-[11px] text-muted-foreground">{healthScore >= 80 ? "Good standing" : healthScore >= 50 ? "Needs monitoring" : "Urgent attention"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Completions (30d)</p>
                  <p className="text-lg font-bold font-mono">—</p>
                  <p className="text-[11px] text-muted-foreground">Courses completed</p>
                </div>
              </div>

              {/* Company Info */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Company Info</h3>
                <div className="space-y-1.5 text-sm">
                  <InfoRow label="ID" value={company.id.substring(0, 8)} mono />
                  <InfoRow label="Industry" value={company.industry || "—"} />
                  <InfoRow label="Size" value={company.company_size ? `${company.company_size} employees` : "—"} />
                  <InfoRow label="GSTIN" value={company.gstin || "—"} mono />
                  <InfoRow label="Address" value={company.address_line_1 || "—"} />
                  <InfoRow label="Subdomain" value={`${company.subdomain || company.slug}.unitoltms.com`} mono />
                  <InfoRow label="Onboarded" value={new Date(company.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
                  <InfoRow label="CSM" value={company.csm_assigned || "—"} />
                </div>
              </div>

              {/* Contract */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Contract</h3>
                <div className="space-y-1.5 text-sm">
                  <InfoRow label="Plan" value={planName} />
                  <InfoRow label="Contract Value" value={fmt((payment as any)?.contract_value)} mono />
                  <InfoRow label="Billing" value={payment?.billing_cycle || "—"} />
                  <InfoRow label="Renewal" value={payment?.renewal_date ? new Date(payment.renewal_date).toLocaleDateString("en-IN") : "—"} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap pt-2">
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Plan modal opened" })}>Change Plan</Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Billing history opened" })}>Billing History</Button>
                <Button variant="outline" size="sm" className="text-amber-600 border-amber-300 hover:bg-amber-50" onClick={() => suspendMutation.mutate()}>Suspend</Button>
                <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => toast({ title: "Delete — confirmation required" })}>Delete</Button>
              </div>
            </div>
          )}

          {/* CONTACTS TAB */}
          {activeTab === "contacts" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Company Admins</h3>
                {admins.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No admins assigned</p>
                ) : (
                  <div className="space-y-2">
                    {admins.map((admin: any, i: number) => (
                      <div key={admin.id} className="border rounded-lg p-3">
                        <div className="font-medium text-sm">{admin.profiles?.full_name || admin.profiles?.email}</div>
                        <div className="text-[11px] text-muted-foreground mb-2">{i === 0 ? "Primary Admin" : admin.role}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{admin.profiles?.email}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => toast({ title: "Impersonation started" })}>Login As</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => toast({ title: "Password reset sent" })}>Reset Password</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Billing Contact</h3>
                <div className="border rounded-lg p-3">
                  <div className="font-medium text-sm">{company.billing_contact_name || "—"}</div>
                  <div className="text-[11px] text-muted-foreground mb-2">{company.billing_contact_designation || "Billing & Finance"}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{company.billing_contact_email || "—"}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{company.billing_contact_phone || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FEATURE ACCESS TAB */}
          {activeTab === "features" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Feature access for this company. Toggles here <strong>override</strong> their plan defaults. Changes apply immediately.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_FEATURES.map(f => {
                  const enabled = isFeatureEnabled(f.id);
                  return (
                    <div
                      key={f.id}
                      className={`border rounded-lg p-3 flex items-start gap-2.5 cursor-pointer transition-colors ${
                        enabled ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => toggleFeatureMutation.mutate({ featureKey: f.id, enabled: !enabled })}
                    >
                      <div className={`w-[34px] h-[18px] rounded-full flex-shrink-0 mt-0.5 relative transition-colors ${enabled ? "bg-primary" : "bg-muted-foreground/20"}`}>
                        <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-all ${enabled ? "left-[18px]" : "left-[2px]"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{f.name}</span>
                          {f.addon && <Badge variant="outline" className="text-[9px] h-4 px-1">Add-on</Badge>}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => toast({ title: "Feature overrides saved" })}>Save Changes</Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Reset to plan defaults" })}>Reset to Plan Defaults</Button>
              </div>
            </div>
          )}

          {/* BANDWIDTH TAB */}
          {activeTab === "bandwidth" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">This Month</p>
                  <p className="text-lg font-bold font-mono">—</p>
                  <p className="text-[11px] text-muted-foreground">—</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Monthly Quota</p>
                  <p className="text-lg font-bold font-mono">—</p>
                  <p className="text-[11px] text-muted-foreground">—</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Video Streaming</p>
                  <p className="text-lg font-bold font-mono">—</p>
                  <p className="text-[11px] text-muted-foreground">Highest consumer</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">SCORM / Downloads</p>
                  <p className="text-lg font-bold font-mono">—</p>
                  <p className="text-[11px] text-muted-foreground">Packages & files</p>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Breakdown by Type</h3>
                <div className="space-y-1.5 text-sm">
                  <InfoRow label="🎥 Video Streaming" value="—" mono />
                  <InfoRow label="📦 SCORM Packages" value="—" mono />
                  <InfoRow label="📄 Document Downloads" value="—" mono />
                  <InfoRow label="🖼 Image Assets" value="—" mono />
                  <InfoRow label="🔌 API Calls" value="—" mono />
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div className="space-y-2">
              {activityLog.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No activity recorded yet.</p>
              ) : (
                activityLog.map((log: any) => (
                  <div key={log.id} className="border-b last:border-0 py-2.5 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">{log.description || log.action}</p>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {new Date(log.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono font-medium" : ""}>{value}</span>
    </div>
  );
}
