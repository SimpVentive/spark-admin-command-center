
-- ROI Cost Entries: tracks budget vs actual per category
CREATE TABLE public.roi_cost_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  actual NUMERIC NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'Q1 2026',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roi_cost_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ROI cost entries"
  ON public.roi_cost_entries FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view ROI cost entries"
  ON public.roi_cost_entries FOR SELECT
  USING (auth.role() = 'authenticated');

-- ROI Impact Metrics: before/after KPI tracking
CREATE TABLE public.roi_impact_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  before_value NUMERIC NOT NULL DEFAULT 0,
  after_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'percent',
  program_id UUID REFERENCES public.training_programs(id),
  report_title TEXT,
  report_status TEXT NOT NULL DEFAULT 'draft',
  impact_level TEXT NOT NULL DEFAULT 'Medium',
  employee_count INTEGER DEFAULT 0,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roi_impact_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ROI impact metrics"
  ON public.roi_impact_metrics FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view ROI impact metrics"
  ON public.roi_impact_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_roi_cost_entries_updated_at
  BEFORE UPDATE ON public.roi_cost_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roi_impact_metrics_updated_at
  BEFORE UPDATE ON public.roi_impact_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
