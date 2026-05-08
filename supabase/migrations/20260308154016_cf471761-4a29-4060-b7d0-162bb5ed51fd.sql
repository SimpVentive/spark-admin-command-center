-- ============================================
-- LASER Module Database Schema
-- ============================================

-- 1. KPI Definitions - What KPIs exist
CREATE TABLE IF NOT EXISTS public.laser_kpi_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  unit text NOT NULL DEFAULT 'percent',
  measurement_frequency text NOT NULL DEFAULT 'daily',
  category text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Role-KPI Mappings - Which KPIs apply to which roles
CREATE TABLE IF NOT EXISTS public.laser_role_kpi_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_role_id uuid REFERENCES public.job_roles(id) ON DELETE CASCADE NOT NULL,
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  target_value numeric NOT NULL,
  threshold_warning numeric NOT NULL,
  threshold_critical numeric NOT NULL,
  comparison_operator text NOT NULL DEFAULT 'greater_is_better',
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_role_id, kpi_id)
);

-- 3. Causal Map - Possible causes for KPI deviations
CREATE TABLE IF NOT EXISTS public.laser_cause_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  cause_name text NOT NULL,
  cause_category text NOT NULL DEFAULT 'skill_gap',
  description text,
  default_weight numeric NOT NULL DEFAULT 0.25,
  requires_training boolean DEFAULT true,
  escalation_target text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Cause-Intervention Links - What learning to assign for each cause
CREATE TABLE IF NOT EXISTS public.laser_cause_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cause_id uuid REFERENCES public.laser_cause_definitions(id) ON DELETE CASCADE NOT NULL,
  intervention_type text NOT NULL DEFAULT 'learning_path',
  learning_path_id uuid REFERENCES public.learning_paths(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.training_programs(id) ON DELETE SET NULL,
  micro_intervention_title text,
  micro_intervention_content text,
  micro_intervention_type text,
  priority integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Performance Signals - Actual KPI data per employee
CREATE TABLE IF NOT EXISTS public.laser_performance_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  kpi_value numeric NOT NULL,
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  operational_context jsonb DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'manual',
  batch_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Detected Deviations - System-detected KPI deviations
CREATE TABLE IF NOT EXISTS public.laser_deviations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  role_kpi_mapping_id uuid REFERENCES public.laser_role_kpi_mappings(id) ON DELETE CASCADE NOT NULL,
  actual_value numeric NOT NULL,
  target_value numeric NOT NULL,
  deviation_percentage numeric NOT NULL,
  severity text NOT NULL DEFAULT 'warning',
  status text NOT NULL DEFAULT 'open',
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. RCA Results - Root cause analysis outcomes
CREATE TABLE IF NOT EXISTS public.laser_rca_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deviation_id uuid REFERENCES public.laser_deviations(id) ON DELETE CASCADE NOT NULL,
  cause_id uuid REFERENCES public.laser_cause_definitions(id) ON DELETE CASCADE NOT NULL,
  probability_score numeric NOT NULL DEFAULT 0,
  is_primary_cause boolean DEFAULT false,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Assigned Interventions - Auto-assigned to employees
CREATE TABLE IF NOT EXISTS public.laser_assigned_interventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deviation_id uuid REFERENCES public.laser_deviations(id) ON DELETE CASCADE NOT NULL,
  rca_result_id uuid REFERENCES public.laser_rca_results(id) ON DELETE CASCADE NOT NULL,
  employee_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cause_intervention_id uuid REFERENCES public.laser_cause_interventions(id) ON DELETE SET NULL,
  intervention_type text NOT NULL,
  learning_path_id uuid REFERENCES public.learning_paths(id) ON DELETE SET NULL,
  program_id uuid REFERENCES public.training_programs(id) ON DELETE SET NULL,
  micro_intervention_title text,
  micro_intervention_content text,
  status text NOT NULL DEFAULT 'assigned',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Impact Validation - Pre/post KPI comparison
CREATE TABLE IF NOT EXISTS public.laser_impact_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id uuid REFERENCES public.laser_assigned_interventions(id) ON DELETE CASCADE NOT NULL,
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  pre_intervention_value numeric NOT NULL,
  post_intervention_value numeric,
  improvement_percentage numeric,
  validation_status text NOT NULL DEFAULT 'pending',
  measurement_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 10. Pattern Repository - Learning from past interventions
CREATE TABLE IF NOT EXISTS public.laser_pattern_repository (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id uuid REFERENCES public.laser_kpi_definitions(id) ON DELETE CASCADE NOT NULL,
  cause_id uuid REFERENCES public.laser_cause_definitions(id) ON DELETE CASCADE NOT NULL,
  success_count integer DEFAULT 0,
  failure_count integer DEFAULT 0,
  avg_improvement_percentage numeric DEFAULT 0,
  refined_weight numeric,
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kpi_id, cause_id)
);

-- 11. Data Source Configuration - For Phase 3 API integration
CREATE TABLE IF NOT EXISTS public.laser_data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL DEFAULT 'csv',
  api_endpoint text,
  api_key_encrypted text,
  sync_frequency text DEFAULT 'daily',
  last_sync_at timestamptz,
  status text DEFAULT 'active',
  config_data jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.laser_kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_role_kpi_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_cause_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_cause_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_performance_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_deviations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_rca_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_assigned_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_impact_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_pattern_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laser_data_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Admin can manage all LASER tables
DROP POLICY IF EXISTS "Admins can manage KPI definitions" ON public.laser_kpi_definitions;
CREATE POLICY "Admins can manage KPI definitions" ON public.laser_kpi_definitions FOR ALL USING (public.has_role(auth.uid(), 'admin'));


DROP POLICY IF EXISTS "Anyone can view active KPIs" ON public.laser_kpi_definitions;
CREATE POLICY "Anyone can view active KPIs" ON public.laser_kpi_definitions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage role-KPI mappings" ON public.laser_role_kpi_mappings;
CREATE POLICY "Admins can manage role-KPI mappings" ON public.laser_role_kpi_mappings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view active mappings" ON public.laser_role_kpi_mappings;
CREATE POLICY "Anyone can view active mappings" ON public.laser_role_kpi_mappings FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage cause definitions" ON public.laser_cause_definitions;
CREATE POLICY "Admins can manage cause definitions" ON public.laser_cause_definitions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view active causes" ON public.laser_cause_definitions;
CREATE POLICY "Anyone can view active causes" ON public.laser_cause_definitions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage cause interventions" ON public.laser_cause_interventions;
CREATE POLICY "Admins can manage cause interventions" ON public.laser_cause_interventions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can view active interventions" ON public.laser_cause_interventions;
CREATE POLICY "Anyone can view active interventions" ON public.laser_cause_interventions FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage performance signals" ON public.laser_performance_signals;
CREATE POLICY "Admins can manage performance signals" ON public.laser_performance_signals FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own signals" ON public.laser_performance_signals;
CREATE POLICY "Users can view own signals" ON public.laser_performance_signals FOR SELECT USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS "Admins can manage deviations" ON public.laser_deviations;
CREATE POLICY "Admins can manage deviations" ON public.laser_deviations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own deviations" ON public.laser_deviations;
CREATE POLICY "Users can view own deviations" ON public.laser_deviations FOR SELECT USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS "Admins can manage RCA results" ON public.laser_rca_results;
CREATE POLICY "Admins can manage RCA results" ON public.laser_rca_results FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage assigned interventions" ON public.laser_assigned_interventions;
CREATE POLICY "Admins can manage assigned interventions" ON public.laser_assigned_interventions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can view own interventions" ON public.laser_assigned_interventions;
CREATE POLICY "Users can view own interventions" ON public.laser_assigned_interventions FOR SELECT USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS "Users can update own interventions" ON public.laser_assigned_interventions;
CREATE POLICY "Users can update own interventions" ON public.laser_assigned_interventions FOR UPDATE USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS "Admins can manage impact validations" ON public.laser_impact_validations;
CREATE POLICY "Admins can manage impact validations" ON public.laser_impact_validations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage pattern repository" ON public.laser_pattern_repository;
CREATE POLICY "Admins can manage pattern repository" ON public.laser_pattern_repository FOR ALL USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage data sources" ON public.laser_data_sources;
CREATE POLICY "Admins can manage data sources" ON public.laser_data_sources FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Learning diary for employee journal entries
CREATE TABLE IF NOT EXISTS public.laser_learning_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_type text NOT NULL DEFAULT 'learning_completed',
  title text NOT NULL,
  description text,
  related_intervention_id uuid REFERENCES public.laser_assigned_interventions(id),
  related_kpi_id uuid REFERENCES public.laser_kpi_definitions(id),
  performance_improvement_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.laser_learning_diary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own diary entries"
ON public.laser_learning_diary;

CREATE POLICY "Users can view own diary entries"
  ON public.laser_learning_diary FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own diary entries"
ON public.laser_learning_diary;

CREATE POLICY "Users can insert own diary entries"
  ON public.laser_learning_diary FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

-- Workplace action tasks
CREATE TABLE IF NOT EXISTS public.laser_action_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  intervention_id uuid REFERENCES public.laser_assigned_interventions(id),
  title text NOT NULL,
  description text,
  checklist jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  assigned_by uuid REFERENCES public.profiles(id),
  due_date timestamptz,
  completed_at timestamptz,
  supervisor_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.laser_action_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own action tasks"
ON public.laser_action_tasks;

CREATE POLICY "Users can view own action tasks"
  ON public.laser_action_tasks FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own action tasks"
ON public.laser_action_tasks;

CREATE POLICY "Users can update own action tasks"
  ON public.laser_action_tasks FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all action tasks"
ON public.laser_action_tasks;

CREATE POLICY "Admins can manage all action tasks"
  ON public.laser_action_tasks FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Manager feedback messages
CREATE TABLE IF NOT EXISTS public.laser_manager_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  manager_id uuid NOT NULL REFERENCES public.profiles(id),
  message text NOT NULL,
  feedback_type text NOT NULL DEFAULT 'coaching',
  related_intervention_id uuid REFERENCES public.laser_assigned_interventions(id),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.laser_manager_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own feedback"
ON public.laser_manager_feedback;

CREATE POLICY "Users can view own feedback"
  ON public.laser_manager_feedback FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid() OR manager_id = auth.uid());

DROP POLICY IF EXISTS "Managers can insert feedback"
ON public.laser_manager_feedback;

CREATE POLICY "Managers can insert feedback"
  ON public.laser_manager_feedback FOR INSERT
  TO authenticated
  WITH CHECK (manager_id = auth.uid());

-- RLS policies for existing LASER tables so employees can see their own data
DROP POLICY IF EXISTS "Employees can view own deviations"
ON public.laser_deviations;

CREATE POLICY "Employees can view own deviations"
  ON public.laser_deviations FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Employees can view own interventions"
ON public.laser_assigned_interventions;

CREATE POLICY "Employees can view own interventions"
  ON public.laser_assigned_interventions FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Employees can update own interventions"
ON public.laser_assigned_interventions;

CREATE POLICY "Employees can update own interventions"
  ON public.laser_assigned_interventions FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid());

DROP POLICY IF EXISTS "Employees can view own performance signals"
ON public.laser_performance_signals;

CREATE POLICY "Employees can view own performance signals"
  ON public.laser_performance_signals FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated can view KPI definitions"
ON public.laser_kpi_definitions;

CREATE POLICY "Anyone authenticated can view KPI definitions"
  ON public.laser_kpi_definitions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone authenticated can view cause definitions"
ON public.laser_cause_definitions;

CREATE POLICY "Anyone authenticated can view cause definitions"
  ON public.laser_cause_definitions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Employees can view own RCA results"
ON public.laser_rca_results;

CREATE POLICY "Employees can view own RCA results"
  ON public.laser_rca_results FOR SELECT
  TO authenticated
  USING (
    deviation_id IN (
      SELECT id FROM public.laser_deviations WHERE employee_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Employees can view own impact validations"
ON public.laser_impact_validations;

CREATE POLICY "Employees can view own impact validations"
  ON public.laser_impact_validations FOR SELECT
  TO authenticated
  USING (
    intervention_id IN (
      SELECT id FROM public.laser_assigned_interventions WHERE employee_id = auth.uid()
    )
    OR public.is_admin()
  );
