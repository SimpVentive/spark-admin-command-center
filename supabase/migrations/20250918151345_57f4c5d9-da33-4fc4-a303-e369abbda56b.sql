-- Create content versioning and management tables for admin AI system

-- Content versions table for version control
CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size BIGINT,
  content_type TEXT NOT NULL,
  quality_score NUMERIC DEFAULT 0.0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT false,
  change_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Content analytics table
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'view', 'complete', 'download', 'share', 'rate'
  session_duration_seconds INTEGER,
  completion_percentage INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Content tags table for advanced categorization
CREATE TABLE IF NOT EXISTS public.content_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- 'skill', 'topic', 'level', 'format', 'industry'
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Junction table for content-tag relationships
CREATE TABLE IF NOT EXISTS public.content_tag_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES public.content_tags(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_id, tag_id)
);

-- Bulk operations table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.bulk_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'content_upload', 'tag_assignment', 'quality_review', 'bulk_edit'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  total_items INTEGER NOT NULL DEFAULT 0,
  processed_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_details JSONB,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Learning path recommendations for admins
CREATE TABLE IF NOT EXISTS public.admin_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_type TEXT NOT NULL, -- 'content_gap', 'trending_topic', 'skill_demand', 'learner_feedback'
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  confidence_score NUMERIC NOT NULL DEFAULT 0.0,
  supporting_data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'implemented', 'dismissed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  implementation_notes TEXT
);

-- Enable RLS on all new tables
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_versions
DROP POLICY IF EXISTS "Admins can manage content versions" ON public.content_versions;
CREATE POLICY "Admins can manage content versions" ON public.content_versions
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view active content versions" ON public.content_versions;
CREATE POLICY "Anyone can view active content versions" ON public.content_versions
FOR SELECT USING (is_active = true);

-- RLS Policies for content_analytics
DROP POLICY IF EXISTS "Users can insert their own content analytics" ON public.content_analytics;
CREATE POLICY "Users can insert their own content analytics" ON public.content_analytics
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all content analytics" ON public.content_analytics;
CREATE POLICY "Admins can view all content analytics" ON public.content_analytics
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view their own content analytics" ON public.content_analytics;
CREATE POLICY "Users can view their own content analytics" ON public.content_analytics
FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for content_tags
DROP POLICY IF EXISTS "Admins can manage content tags" ON public.content_tags;
CREATE POLICY "Admins can manage content tags" ON public.content_tags
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view active content tags" ON public.content_tags;
CREATE POLICY "Users can view active content tags" ON public.content_tags
FOR SELECT USING (is_active = true);

-- RLS Policies for content_tag_assignments
DROP POLICY IF EXISTS "Admins can manage content tag assignments" ON public.content_tag_assignments;
CREATE POLICY "Admins can manage content tag assignments" ON public.content_tag_assignments
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view content tag assignments" ON public.content_tag_assignments;
CREATE POLICY "Users can view content tag assignments" ON public.content_tag_assignments
FOR SELECT USING (true);

-- RLS Policies for bulk_operations
DROP POLICY IF EXISTS "Admins can manage bulk operations" ON public.bulk_operations;
CREATE POLICY "Admins can manage bulk operations" ON public.bulk_operations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for admin_recommendations
DROP POLICY IF EXISTS "Admins can manage admin recommendations" ON public.admin_recommendations;  
CREATE POLICY "Admins can manage admin recommendations" ON public.admin_recommendations
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON public.content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_active ON public.content_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON public.content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_user_id ON public.content_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_action_type ON public.content_analytics(action_type);
CREATE INDEX IF NOT EXISTS idx_content_tag_assignments_content_id ON public.content_tag_assignments(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tag_assignments_tag_id ON public.content_tag_assignments(tag_id);
CREATE INDEX IF NOT EXISTS idx_bulk_operations_status ON public.bulk_operations(status);
CREATE INDEX IF NOT EXISTS idx_admin_recommendations_priority ON public.admin_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_admin_recommendations_status ON public.admin_recommendations(status);

-- Create triggers for updated_at timestamps
DROP TRIGGER IF EXISTS update_content_versions_updated_at ON public.content_versions;
CREATE TRIGGER update_content_versions_updated_at
  BEFORE UPDATE ON public.content_versions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Sample data for content tags
INSERT INTO public.content_tags (name, category, color) VALUES
('Leadership', 'skill', '#3B82F6'),
('Data Analysis', 'skill', '#10B981'),
('Communication', 'skill', '#F59E0B'),
('Project Management', 'skill', '#8B5CF6'),
('Technical Writing', 'skill', '#EF4444'),
('Beginner', 'level', '#6B7280'),
('Intermediate', 'level', '#059669'),
('Advanced', 'level', '#DC2626'),
('Video', 'format', '#7C3AED'),
('Document', 'format', '#0D9488'),
('Interactive', 'format', '#EA580C'),
('Healthcare', 'industry', '#BE123C'),
('Technology', 'industry', '#0369A1'),
('Finance', 'industry', '#166534'),
('Manufacturing', 'industry', '#B45309');