import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building2, User, Check, ChevronRight, ChevronLeft, Rocket, Plus, X, CreditCard, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: "Company Info" },
  { id: 2, label: "Plan & Contract" },
  { id: 3, label: "People & Access" },
  { id: 4, label: "Review & Launch" },
];

const INDUSTRIES = ["Pharmaceuticals", "Manufacturing", "Engineering", "FMCG", "IT / Technology", "Healthcare", "Government / PSU", "Education", "Financial Services", "Retail"];
const COMPANY_SIZES = ["1–50", "51–200", "201–500", "500–1000", "1000+"];
const STATES = ["Andhra Pradesh", "Gujarat", "Haryana", "Himachal Pradesh", "Karnataka", "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

const PLANS = [
  { name: "Trial", desc: "Up to 15 users · Limited modules · No credit card required", price: "Free", seats: 15 },
  { name: "Starter", desc: "Up to 30 users · Core LMS · Basic reports · Email support", price: "₹4,999/mo", seats: 30 },
  { name: "Growth", desc: "Up to 100 users · All core modules · Analytics · Priority support", price: "₹12,999/mo", seats: 100 },
  { name: "Pro", desc: "Up to 250 users · All modules · Custom branding · API access · Dedicated CSM", price: "₹24,999/mo", seats: 250 },
  { name: "Enterprise", desc: "Unlimited users · White-label · SLA · On-premise option · HRMS integration", price: "Custom", seats: 9999 },
];

const ALL_FEATURES = [
  { id: "core_lms", name: "Core LMS", desc: "Course management, enrollments, completions", plans: ["Trial", "Starter", "Growth", "Pro", "Enterprise"], addon: false, required: true },
  { id: "posh", name: "POSH Compliance", desc: "Prevention of Sexual Harassment training", plans: ["Starter", "Growth", "Pro", "Enterprise"], addon: false },
  { id: "scorm", name: "SCORM / xAPI", desc: "Import and run SCORM 1.2, 2004 and xAPI packages", plans: ["Starter", "Growth", "Pro", "Enterprise"], addon: false },
  { id: "assessments", name: "Assessments", desc: "Quiz builder, question bank, auto-grading", plans: ["Trial", "Starter", "Growth", "Pro", "Enterprise"], addon: false },
  { id: "analytics", name: "Advanced Analytics", desc: "Completion trends, skill gap analysis", plans: ["Growth", "Pro", "Enterprise"], addon: false },
  { id: "custom_branding", name: "Custom Branding", desc: "Company logo, colours, email templates", plans: ["Growth", "Pro", "Enterprise"], addon: false },
  { id: "api_access", name: "API Access", desc: "REST API for third-party integrations", plans: ["Pro", "Enterprise"], addon: false },
  { id: "sso", name: "Single Sign-On", desc: "SAML 2.0 / Azure AD / Google Workspace SSO", plans: ["Pro", "Enterprise"], addon: false },
  { id: "vilt", name: "VILT / Live Sessions", desc: "Virtual instructor-led training scheduler", plans: ["Pro", "Enterprise"], addon: true },
  { id: "ai_recommendations", name: "AI Recommendations", desc: "AI-powered course & skill suggestions", plans: ["Pro", "Enterprise"], addon: true },
  { id: "hrms_integration", name: "HRMS Integration", desc: "Sync employees from SAP, Darwinbox, Keka", plans: ["Enterprise"], addon: true },
  { id: "whitelabel", name: "White-label", desc: "Remove UniTol branding entirely", plans: ["Enterprise"], addon: true },
];

export default function CompanyCreationWizard({ onComplete, onCancel }: WizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1: Company Info
  const [form, setForm] = useState({
    name: "", industry: "", company_size: "", gstin: "", address: "", city: "", state: "", pin_code: "",
    primary_domain: "", subdomain: "", website: "", logo_url: "",
  });

  // Step 2: Plan & Contract
  const [selectedPlan, setSelectedPlan] = useState("Trial");
  const [seats, setSeats] = useState("15");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [contractStart, setContractStart] = useState(new Date().toISOString().split("T")[0]);
  const [contractEnd, setContractEnd] = useState("");
  const [contractValue, setContractValue] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [featureStates, setFeatureStates] = useState<Record<string, boolean>>(() => {
    const states: Record<string, boolean> = {};
    ALL_FEATURES.forEach(f => { states[f.id] = f.plans.includes("Trial"); });
    return states;
  });

  // Step 3: People & Access
  const [admins, setAdmins] = useState([{ name: "", email: "", designation: "", role: "Company Admin (full access)" }]);
  const [billingContact, setBillingContact] = useState({ name: "", email: "", phone: "", designation: "" });
  const [sameAsPrimary, setSameAsPrimary] = useState(false);
  const [csmAssigned, setCsmAssigned] = useState("Auto-assign");
  const [contentTemplate, setContentTemplate] = useState("No template");
  const [internalNotes, setInternalNotes] = useState("");

  const updateField = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === "name" ? { subdomain: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}),
    }));
  };

  const selectPlan = (planName: string) => {
    setSelectedPlan(planName);
    const plan = PLANS.find(p => p.name === planName);
    if (plan) setSeats(String(plan.seats));
    const newStates: Record<string, boolean> = {};
    ALL_FEATURES.forEach(f => { newStates[f.id] = f.plans.includes(planName) && !f.addon; });
    setFeatureStates(newStates);
  };

  const addAdmin = () => {
    if (admins.length < 4) setAdmins([...admins, { name: "", email: "", designation: "", role: "Company Admin (full access)" }]);
  };

  const removeAdmin = (i: number) => {
    if (admins.length > 1) setAdmins(admins.filter((_, idx) => idx !== i));
  };

  const updateAdmin = (i: number, field: string, value: string) => {
    setAdmins(admins.map((a, idx) => idx === i ? { ...a, [field]: value } : a));
  };

  const canProceed = (s: number) => {
    if (s === 1) return form.name.trim() && form.subdomain.trim();
    if (s === 2) return selectedPlan;
    if (s === 3) return admins[0].name.trim() && admins[0].email.trim();
    return true;
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      // Create company
      const { data: companyData, error: companyError } = await (supabase as any).from("companies").insert([{
        name: form.name.trim(),
        slug: form.subdomain.trim(),
        subdomain: form.subdomain.trim(),
        industry: form.industry || null,
        company_size: form.company_size || null,
        gstin: form.gstin.trim() || null,
        address_line_1: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state || null,
        pin_code: form.pin_code.trim() || null,
        primary_domain: form.primary_domain.trim() || null,
        website: form.website.trim() || null,
        logo_url: form.logo_url.trim() || null,
        contact_person_name: admins[0].name.trim(),
        contact_person_email: admins[0].email.trim(),
        billing_contact_name: sameAsPrimary ? admins[0].name : billingContact.name || null,
        billing_contact_email: sameAsPrimary ? admins[0].email : billingContact.email || null,
        billing_contact_phone: billingContact.phone || null,
        billing_contact_designation: billingContact.designation || null,
        csm_assigned: csmAssigned !== "Auto-assign" ? csmAssigned : null,
      }]).select("id").single();

      if (companyError) throw companyError;
      const companyId = companyData.id;

      // Create payment record
      const planDef = PLANS.find(p => p.name === selectedPlan);
      const amount = selectedPlan === "Trial" ? 0 : selectedPlan === "Enterprise" ? (parseInt(contractValue) || 0) / 12 :
        parseInt(planDef?.price.replace(/[^\d]/g, "") || "0");

      await (supabase as any).from("company_payments").insert([{
        company_id: companyId,
        plan_name: selectedPlan,
        plan_status: selectedPlan === "Trial" ? "trial" : "active",
        amount,
        seats_included: parseInt(seats) || 15,
        billing_cycle: billingCycle,
        contract_start_date: contractStart || null,
        contract_end_date: contractEnd || null,
        contract_value: contractValue ? parseInt(contractValue) : null,
        po_number: poNumber || null,
        start_date: contractStart || null,
        renewal_date: contractEnd || null,
      }]);

      // Create feature records
      const enabledFeatures = Object.entries(featureStates).filter(([_, v]) => v).map(([k]) => ({
        company_id: companyId,
        feature_key: k,
        is_enabled: true,
        is_addon: ALL_FEATURES.find(f => f.id === k)?.addon || false,
      }));

      if (enabledFeatures.length > 0) {
        await (supabase as any).from("company_features").insert(enabledFeatures);
      }

      toast({ title: "Company created! Invite sent to admin." });
      onComplete();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Progress */}
      <div className="flex gap-0 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex-1 flex flex-col items-center relative pb-4">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-[1] border-2 transition-all ${
              s.id < step ? "bg-emerald-500 text-white border-emerald-500" :
              s.id === step ? "bg-amber-500 text-white border-amber-500 shadow-md" :
              "bg-muted text-muted-foreground border-muted"
            }`}>
              {s.id < step ? "✓" : s.id}
            </div>
            <span className={`text-[11px] mt-1.5 font-medium text-center ${
              s.id === step ? "text-amber-600" : s.id < step ? "text-muted-foreground" : "text-muted-foreground/50"
            }`}>{s.label}</span>
            {i < STEPS.length - 1 && (
              <div className={`absolute top-3.5 left-[calc(50%+14px)] w-[calc(100%-28px)] h-[2px] ${s.id < step ? "bg-emerald-400" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1: Company Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company Information</CardTitle>
            <p className="text-sm text-muted-foreground">Basic identity, registration, and platform setup details</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Company Name *</Label>
              <Input value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Acme Corporation" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Industry *</Label>
                <Select value={form.industry} onValueChange={v => updateField("industry", v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry…" /></SelectTrigger>
                  <SelectContent>{INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Company Size *</Label>
                <Select value={form.company_size} onValueChange={v => updateField("company_size", v)}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{COMPANY_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>GSTIN</Label>
              <Input value={form.gstin} onChange={e => updateField("gstin", e.target.value)} placeholder="15-character GST identification number" />
            </div>
            <div>
              <Label>Registered Address</Label>
              <Input value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="123 Business Avenue" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={e => updateField("city", e.target.value)} />
              </div>
              <div>
                <Label>State</Label>
                <Select value={form.state} onValueChange={v => updateField("state", v)}>
                  <SelectTrigger><SelectValue placeholder="State…" /></SelectTrigger>
                  <SelectContent>{STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>PIN Code</Label>
                <Input value={form.pin_code} onChange={e => updateField("pin_code", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Primary Domain</Label>
              <Input value={form.primary_domain} onChange={e => updateField("primary_domain", e.target.value)} placeholder="acme.com" />
              <p className="text-xs text-muted-foreground mt-1">Used for user email matching and SSO</p>
            </div>
            <div>
              <Label>Platform Subdomain *</Label>
              <div className="flex items-center gap-0">
                <Input value={form.subdomain} onChange={e => updateField("subdomain", e.target.value)} className="rounded-r-none" />
                <span className="h-10 px-3 flex items-center bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">.unitoltms.com</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Company admins and users log in at this URL</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Plan & Contract */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan, Contract & Feature Access</CardTitle>
            <p className="text-sm text-muted-foreground">Set subscription terms and control which features this company can access</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2 block">Subscription Plan</Label>
              <div className="space-y-2">
                {PLANS.map(p => (
                  <div
                    key={p.name}
                    onClick={() => selectPlan(p.name)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center gap-3 ${
                      selectedPlan === p.name ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedPlan === p.name ? "border-primary bg-primary" : "border-muted-foreground/30"}`}>
                      {selectedPlan === p.name && <div className="w-full h-full rounded-full flex items-center justify-center text-white text-[8px]">✓</div>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{p.name}</span>
                        {p.name === "Trial" && <Badge variant="outline" className="text-[9px] h-4">30 days free</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                    </div>
                    <span className="font-bold text-sm">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Seat Count *</Label>
                <Input type="number" value={seats} onChange={e => setSeats(e.target.value)} />
              </div>
              <div>
                <Label>Billing Cycle</Label>
                <Select value={billingCycle} onValueChange={setBillingCycle}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Contract Details</Label>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs">Contract Start Date</Label><Input type="date" value={contractStart} onChange={e => setContractStart(e.target.value)} /></div>
                <div><Label className="text-xs">Contract End / Renewal Date</Label><Input type="date" value={contractEnd} onChange={e => setContractEnd(e.target.value)} /></div>
                <div><Label className="text-xs">Contract Value (₹)</Label><Input type="number" value={contractValue} onChange={e => setContractValue(e.target.value)} /></div>
                <div><Label className="text-xs">PO Number (if applicable)</Label><Input value={poNumber} onChange={e => setPoNumber(e.target.value)} /></div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Feature Access Control <span className="text-xs text-muted-foreground font-normal">Overrides plan defaults for this company</span></Label>
              <div className="grid grid-cols-2 gap-2">
                {ALL_FEATURES.map(f => (
                  <div
                    key={f.id}
                    onClick={() => !f.required && setFeatureStates(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
                    className={`border rounded-lg p-2.5 flex items-start gap-2 cursor-pointer transition-colors ${
                      featureStates[f.id] ? "border-primary/50 bg-primary/5" : f.required ? "opacity-50 cursor-not-allowed bg-muted/30" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-[30px] h-[16px] rounded-full flex-shrink-0 mt-0.5 relative transition-colors ${featureStates[f.id] ? "bg-primary" : "bg-muted-foreground/20"}`}>
                      <div className={`absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow transition-all ${featureStates[f.id] ? "left-[16px]" : "left-[2px]"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium">{f.name}</span>
                        {f.addon && <Badge variant="outline" className="text-[8px] h-3.5 px-1">Add-on</Badge>}
                        {f.required && <Badge variant="secondary" className="text-[8px] h-3.5 px-1">Core</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: People & Access */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-primary" />People & Access</CardTitle>
            <p className="text-sm text-muted-foreground">Set up company admins and billing contact. All admins receive an invite email.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Company Admins</Label>
                {admins.length < 4 && (
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addAdmin}>
                    <Plus className="h-3 w-3" /> Add Another Admin
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {admins.map((admin, i) => (
                  <div key={i} className="border rounded-lg p-3 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                        {i === 0 ? "Primary Admin" : `Admin ${i + 1}`}
                      </span>
                      {i > 0 && (
                        <button onClick={() => removeAdmin(i)} className="text-[11px] text-destructive hover:underline">✕ Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="text-xs">Full Name {i === 0 && "*"}</Label><Input value={admin.name} onChange={e => updateAdmin(i, "name", e.target.value)} /></div>
                      <div><Label className="text-xs">Email {i === 0 && "*"}</Label><Input type="email" value={admin.email} onChange={e => updateAdmin(i, "email", e.target.value)} /></div>
                      <div><Label className="text-xs">Designation</Label><Input value={admin.designation} onChange={e => updateAdmin(i, "designation", e.target.value)} /></div>
                      <div>
                        <Label className="text-xs">Role</Label>
                        <Select value={admin.role} onValueChange={v => updateAdmin(i, "role", v)}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Company Admin (full access)">Company Admin (full access)</SelectItem>
                            <SelectItem value="Training Manager">Training Manager</SelectItem>
                            <SelectItem value="HR Admin">HR Admin</SelectItem>
                            <SelectItem value="Compliance Admin">Compliance Admin</SelectItem>
                            <SelectItem value="Reports Only">Reports Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Billing Contact <span className="text-xs text-muted-foreground font-normal">Receives all invoices</span></Label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={sameAsPrimary} onChange={e => {
                    setSameAsPrimary(e.target.checked);
                    if (e.target.checked) setBillingContact({ ...billingContact, name: admins[0].name, email: admins[0].email });
                  }} className="rounded" />
                  Same as Primary Admin
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Full Name</Label><Input value={sameAsPrimary ? admins[0].name : billingContact.name} onChange={e => setBillingContact({ ...billingContact, name: e.target.value })} disabled={sameAsPrimary} /></div>
                <div><Label className="text-xs">Designation</Label><Input value={billingContact.designation} onChange={e => setBillingContact({ ...billingContact, designation: e.target.value })} /></div>
                <div><Label className="text-xs">Email</Label><Input value={sameAsPrimary ? admins[0].email : billingContact.email} onChange={e => setBillingContact({ ...billingContact, email: e.target.value })} disabled={sameAsPrimary} /></div>
                <div><Label className="text-xs">Phone</Label><Input value={billingContact.phone} onChange={e => setBillingContact({ ...billingContact, phone: e.target.value })} /></div>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Internal Setup</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Assign CSM</Label>
                  <Select value={csmAssigned} onValueChange={setCsmAssigned}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto-assign">Auto-assign</SelectItem>
                      <SelectItem value="Ravi Sharma">Ravi Sharma</SelectItem>
                      <SelectItem value="Priya Menon">Priya Menon</SelectItem>
                      <SelectItem value="Arun Das">Arun Das</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Default Content Template</Label>
                  <Select value={contentTemplate} onValueChange={setContentTemplate}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pharma Compliance Pack">Pharma Compliance Pack</SelectItem>
                      <SelectItem value="Manufacturing Safety Pack">Manufacturing Safety Pack</SelectItem>
                      <SelectItem value="Generic Starter Pack">Generic Starter Pack</SelectItem>
                      <SelectItem value="No template">No template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3">
                <Label className="text-xs">Internal Notes</Label>
                <Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} rows={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Check className="h-5 w-5 text-primary" />Review & Launch</CardTitle>
            <p className="text-sm text-muted-foreground">Confirm all details before creating the company and sending the admin invite</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ReviewBlock title="Company Info">
              <ReviewRow label="Company Name" value={form.name} />
              <ReviewRow label="Industry / Size" value={`${form.industry || "—"} · ${form.company_size || "—"}`} />
              <ReviewRow label="GSTIN" value={form.gstin || "—"} />
              <ReviewRow label="Address" value={[form.address, form.city, form.state, form.pin_code].filter(Boolean).join(", ") || "—"} />
              <ReviewRow label="Subdomain" value={`${form.subdomain || "—"}.unitoltms.com`} />
            </ReviewBlock>

            <ReviewBlock title="Plan & Contract">
              <ReviewRow label="Plan" value={selectedPlan} />
              <ReviewRow label="Seats / Billing" value={`${seats} seats · ${billingCycle}`} />
              <ReviewRow label="Contract Period" value={`${contractStart || "—"} → ${contractEnd || "—"}`} />
              <ReviewRow label="Contract Value" value={contractValue ? `₹${parseInt(contractValue).toLocaleString("en-IN")}` : "—"} />
            </ReviewBlock>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Features Enabled</h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_FEATURES.filter(f => featureStates[f.id]).map(f => (
                  <Badge key={f.id} variant="secondary" className="text-[10px]">{f.name}</Badge>
                ))}
              </div>
            </div>

            <ReviewBlock title="People">
              <ReviewRow label="Primary Admin" value={`${admins[0].name || "—"} (${admins[0].email || "—"})`} />
              <ReviewRow label="Billing Contact" value={sameAsPrimary ? "Same as Primary Admin" : (billingContact.name || "—")} />
              <ReviewRow label="CSM" value={csmAssigned} />
            </ReviewBlock>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">What happens next:</p>
              <p>Company account is created instantly → Primary admin receives invite email → Admin sets password → Greeted with setup wizard → You can track progress in Tenant Onboarding.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="text-sm text-muted-foreground">Step {step} of 4 — {STEPS[step - 1].label}</div>
        <div className="flex gap-2">
          {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>}
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed(step)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={saving}>
              <Rocket className="h-4 w-4 mr-1" /> {saving ? "Creating..." : "Create & Send Invite"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <h4 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}
