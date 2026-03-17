import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Check, ChevronRight, Upload, Globe, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, label: "Organization Details", icon: Building2 },
  { id: 2, label: "Contact Person", icon: User },
  { id: 3, label: "Review & Create", icon: Check },
];

export default function CompanyCreationWizard({ onComplete, onCancel }: WizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    address_line_1: "",
    address_line_2: "",
    address_line_3: "",
    website: "",
    logo_url: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_phone: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : {}),
    }));
  };

  const canProceedStep1 = form.name.trim() && form.slug.trim() && form.address_line_1.trim();
  const canProceedStep2 = form.contact_person_name.trim() && form.contact_person_email.trim();

  const handleCreate = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any).from("companies").insert([{
        name: form.name.trim(),
        slug: form.slug.trim(),
        address_line_1: form.address_line_1.trim() || null,
        address_line_2: form.address_line_2.trim() || null,
        address_line_3: form.address_line_3.trim() || null,
        website: form.website.trim() || null,
        logo_url: form.logo_url.trim() || null,
        contact_person_name: form.contact_person_name.trim() || null,
        contact_person_email: form.contact_person_email.trim() || null,
        contact_person_phone: form.contact_person_phone.trim() || null,
      }]);
      if (error) throw error;
      toast({ title: "Company created successfully!" });
      onComplete();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              disabled={step.id > currentStep}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                step.id === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.id < currentStep
                  ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <step.icon className="h-4 w-4" />
              {step.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step 1: Organization Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organization Name *</Label>
                <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Acme Corporation" />
              </div>
              <div>
                <Label>URL Slug *</Label>
                <Input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="acme-corp" />
              </div>
            </div>
            <div>
              <Label>Address Line 1 *</Label>
              <Input value={form.address_line_1} onChange={(e) => updateField("address_line_1", e.target.value)} placeholder="123 Business Avenue" />
            </div>
            <div>
              <Label>Address Line 2</Label>
              <Input value={form.address_line_2} onChange={(e) => updateField("address_line_2", e.target.value)} placeholder="Suite 100, Floor 5" />
            </div>
            <div>
              <Label>Address Line 3 (City, State, ZIP)</Label>
              <Input value={form.address_line_3} onChange={(e) => updateField("address_line_3", e.target.value)} placeholder="Mumbai, Maharashtra 400001" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><Globe className="h-3 w-3" /> Website</Label>
                <Input value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://www.acme.com" />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Upload className="h-3 w-3" /> Logo URL</Label>
                <Input value={form.logo_url} onChange={(e) => updateField("logo_url", e.target.value)} placeholder="https://example.com/logo.png" />
              </div>
            </div>
            {form.logo_url && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <img src={form.logo_url} alt="Logo preview" className="h-12 w-12 object-contain rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <span className="text-sm text-muted-foreground">Logo preview</span>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onCancel}>Cancel</Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceedStep1}>
                Next: Contact Person <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Person */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Primary Contact (Main Admin)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Contact Person Name *</Label>
              <Input value={form.contact_person_name} onChange={(e) => updateField("contact_person_name", e.target.value)} placeholder="John Smith" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
                <Input type="email" value={form.contact_person_email} onChange={(e) => updateField("contact_person_email", e.target.value)} placeholder="john@acme.com" />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> Phone Number</Label>
                <Input value={form.contact_person_phone} onChange={(e) => updateField("contact_person_phone", e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">This person will be designated as the Company Admin once their account is created in the system.</p>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!canProceedStep2}>
                Next: Review <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Review & Create Company
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Organization
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {form.name}</p>
                  <p><span className="text-muted-foreground">Slug:</span> <code className="bg-muted px-1 rounded text-xs">{form.slug}</code></p>
                  <p><span className="text-muted-foreground">Address:</span> {form.address_line_1}</p>
                  {form.address_line_2 && <p className="pl-[72px]">{form.address_line_2}</p>}
                  {form.address_line_3 && <p className="pl-[72px]">{form.address_line_3}</p>}
                  {form.website && <p><span className="text-muted-foreground">Website:</span> {form.website}</p>}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <User className="h-4 w-4" /> Primary Contact
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {form.contact_person_name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {form.contact_person_email}</p>
                  {form.contact_person_phone && <p><span className="text-muted-foreground">Phone:</span> {form.contact_person_phone}</p>}
                </div>
              </div>
            </div>
            {form.logo_url && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <img src={form.logo_url} alt="Logo" className="h-10 w-10 object-contain rounded" />
                <Badge variant="outline">Logo configured</Badge>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create Company"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
