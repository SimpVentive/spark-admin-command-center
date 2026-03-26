
-- Announcements & Communications tables
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'banner' CHECK (type IN ('banner','email','alert','maintenance')),
  priority text NOT NULL DEFAULT 'info' CHECK (priority IN ('info','warning','critical')),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT 'all_tenants',
  audience_company_ids uuid[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','live','scheduled','sent','archived')),
  show_from timestamptz,
  show_until timestamptz,
  also_email boolean DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template text,
  subject text NOT NULL,
  body text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT 'all_admins',
  audience_company_ids uuid[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  open_rate numeric(5,2) DEFAULT 0,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text DEFAULT '📋',
  description text,
  default_subject text,
  default_body text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage announcements" ON public.announcements
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins manage email campaigns" ON public.email_campaigns
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins manage email templates" ON public.email_templates
  FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- Triggers
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default templates
INSERT INTO public.email_templates (name, icon, description, default_subject) VALUES
  ('Feature Update', '📋', 'Announce new platform features, modules, or enhancements to all tenant admins.', 'New Feature Announcement'),
  ('Maintenance Notice', '🔧', 'Notify tenants of scheduled downtime, system updates, or maintenance windows.', 'Scheduled Maintenance Notice'),
  ('Renewal Reminder', '🔔', 'Send personalized renewal reminders before subscription expiry.', 'Subscription Renewal Reminder'),
  ('Welcome & Onboarding', '👋', 'Greet new company admins and guide them through setup with a warm welcome.', 'Welcome to UniTol TMS'),
  ('Security Alert', '🛡️', 'Urgent notice for security incidents, password resets, or MFA requirements.', 'Security Alert'),
  ('Custom Email', '✉️', 'Start from a blank canvas for custom one-off communications.', '');
