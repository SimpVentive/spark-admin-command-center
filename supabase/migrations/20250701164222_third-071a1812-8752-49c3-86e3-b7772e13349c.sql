
-- Drop the existing tables first to avoid conflicts
DROP TABLE IF EXISTS public.lti_sessions CASCADE;
DROP TABLE IF EXISTS public.lti_launches CASCADE;
DROP TABLE IF EXISTS public.lti_tools CASCADE;
DROP TABLE IF EXISTS public.lti_providers CASCADE;
DROP TABLE IF EXISTS public.lti_grade_passback CASCADE;
DROP TABLE IF EXISTS public.lti_content_items CASCADE;
DROP TABLE IF EXISTS public.lti_jwks CASCADE;
-- Complete LTI (Learning Tools Interoperability) Database Schema
-- Supports LTI 1.1, 1.3, and basic LTI Advantage features

-- Create LTI providers table (represents LMS/platform configurations)
CREATE TABLE public.lti_providers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    platform_id TEXT, -- For LTI 1.3
    issuer TEXT, -- For LTI 1.3 
    auth_login_url TEXT, -- For LTI 1.3
    auth_token_url TEXT, -- For LTI 1.3
    key_set_url TEXT, -- For LTI 1.3 JWKS endpoint
    deployment_id TEXT, -- For LTI 1.3
    lti_version TEXT NOT NULL DEFAULT 'LTI-1p1' CHECK (lti_version IN ('LTI-1p0', 'LTI-1p1', 'LTI-1p3')),
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('anonymous', 'name_only', 'email_only', 'public')),
    custom_parameters JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LTI tools table
CREATE TABLE public.lti_tools (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES public.lti_providers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    tool_url TEXT NOT NULL,
    launch_url TEXT NOT NULL,
    icon_url TEXT,
    category TEXT,
    
    -- LTI 1.1/1.0 credentials
    consumer_key TEXT,
    consumer_secret_encrypted TEXT, -- Store encrypted, never plain text
    
    -- LTI 1.3 credentials  
    client_id TEXT,
    public_key TEXT, -- Tool's public key for LTI 1.3
    public_key_set_url TEXT, -- Tool's JWKS endpoint
    
    -- Feature support flags
    grade_passback_enabled BOOLEAN DEFAULT false,
    deep_linking_enabled BOOLEAN DEFAULT false, -- LTI 1.3 feature
    content_item_selection_enabled BOOLEAN DEFAULT false, -- LTI 1.1 feature
    names_roles_service_enabled BOOLEAN DEFAULT false, -- LTI Advantage
    assignments_grades_service_enabled BOOLEAN DEFAULT false, -- LTI Advantage
    
    -- Configuration
    custom_parameters JSONB DEFAULT '{}',
    privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('anonymous', 'name_only', 'email_only', 'public')),
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LTI launches table (track tool launches)
CREATE TABLE public.lti_launches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_id UUID REFERENCES public.lti_tools(id) ON DELETE CASCADE NOT NULL,
    
    -- Launch URLs and routing
    launch_url TEXT NOT NULL,
    return_url TEXT,
    
    -- LTI Standard Parameters
    lti_message_type TEXT DEFAULT 'basic-lti-launch-request',
    lti_version TEXT DEFAULT 'LTI-1p1',
    resource_link_id TEXT,
    resource_link_title TEXT,
    resource_link_description TEXT,
    
    -- Context (course/class) information
    context_id TEXT,
    context_type TEXT,
    context_title TEXT,
    context_label TEXT,
    
    -- User information
    user_email TEXT,
    user_roles TEXT, -- Comma separated: Instructor,Student,etc
    lis_person_name_given TEXT,
    lis_person_name_family TEXT,
    lis_person_name_full TEXT,
    lis_person_contact_email_primary TEXT,
    
    -- Tool Consumer (LMS) information
    tool_consumer_instance_guid TEXT,
    tool_consumer_instance_name TEXT,
    tool_consumer_instance_description TEXT,
    tool_consumer_instance_url TEXT,
    tool_consumer_instance_contact_email TEXT,
    
    -- OAuth 1.0 parameters (for LTI 1.1)
    oauth_consumer_key TEXT,
    oauth_nonce TEXT,
    oauth_timestamp INTEGER,
    oauth_signature TEXT,
    oauth_signature_method TEXT DEFAULT 'HMAC-SHA1',
    oauth_version TEXT DEFAULT '1.0',
    
    -- Grade passback parameters
    lis_outcome_service_url TEXT,
    lis_result_sourcedid TEXT,
    grade_passback_url TEXT,
    
    -- LTI 1.3 specific fields
    id_token TEXT, -- JWT token for LTI 1.3
    state_parameter TEXT, -- OIDC state parameter
    nonce_parameter TEXT, -- OIDC nonce parameter
    
    -- Session and tracking
    launch_parameters JSONB DEFAULT '{}', -- Store all launch parameters as JSON
    custom_parameters JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Status tracking
    launched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    grade_received DECIMAL(5,2),
    status TEXT DEFAULT 'launched' CHECK (status IN ('launched', 'active', 'completed', 'failed', 'expired'))
);

-- Create LTI sessions table (track active sessions)
CREATE TABLE public.lti_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    launch_id UUID REFERENCES public.lti_launches(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    csrf_token TEXT, -- Additional security
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LTI grade passback table (track grade submissions back to LMS)
CREATE TABLE public.lti_grade_passback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    launch_id UUID REFERENCES public.lti_launches(id) ON DELETE CASCADE NOT NULL,
    grade_value DECIMAL(5,2), -- The grade (0.0 to 1.0 or 0-100 depending on scale)
    grade_scale TEXT DEFAULT 'decimal', -- 'decimal' (0.0-1.0) or 'percentage' (0-100)
    result_status TEXT DEFAULT 'pending' CHECK (result_status IN ('pending', 'success', 'failed')),
    passback_url TEXT NOT NULL,
    source_did TEXT NOT NULL, -- lis_result_sourcedid
    response_code INTEGER, -- HTTP response code from LMS
    response_body TEXT, -- Response from LMS
    attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    succeeded_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Create LTI content items table (for deep linking/content item selection)
CREATE TABLE public.lti_content_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.lti_tools(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    text TEXT,
    url TEXT NOT NULL,
    media_type TEXT,
    thumbnail_url TEXT,
    iframe_width INTEGER,
    iframe_height INTEGER,
    custom_parameters JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LTI JWKS (JSON Web Key Sets) table for LTI 1.3
CREATE TABLE public.lti_jwks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key_id TEXT NOT NULL UNIQUE, -- kid
    key_type TEXT NOT NULL, -- kty (RSA, EC, etc.)
    algorithm TEXT NOT NULL, -- alg (RS256, ES256, etc.)
    use_type TEXT DEFAULT 'sig', -- use (sig, enc)
    public_key TEXT NOT NULL, -- The actual public key (PEM format)
    private_key_encrypted TEXT, -- Encrypted private key (for platform keys)
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_lti_launches_user_id ON public.lti_launches(user_id);
CREATE INDEX idx_lti_launches_tool_id ON public.lti_launches(tool_id);
CREATE INDEX idx_lti_launches_context_id ON public.lti_launches(context_id);
CREATE INDEX idx_lti_launches_resource_link_id ON public.lti_launches(resource_link_id);
CREATE INDEX idx_lti_launches_status ON public.lti_launches(status);
CREATE INDEX idx_lti_launches_launched_at ON public.lti_launches(launched_at);

CREATE INDEX idx_lti_sessions_token ON public.lti_sessions(session_token);
CREATE INDEX idx_lti_sessions_expires_at ON public.lti_sessions(expires_at);
CREATE INDEX idx_lti_sessions_launch_id ON public.lti_sessions(launch_id);

CREATE INDEX idx_lti_grade_passback_launch_id ON public.lti_grade_passback(launch_id);
CREATE INDEX idx_lti_grade_passback_status ON public.lti_grade_passback(result_status);

CREATE INDEX idx_lti_tools_provider_id ON public.lti_tools(provider_id);
CREATE INDEX idx_lti_tools_consumer_key ON public.lti_tools(consumer_key);
CREATE INDEX idx_lti_tools_client_id ON public.lti_tools(client_id);

-- Enable Row Level Security
ALTER TABLE public.lti_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_grade_passback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lti_jwks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- LTI Providers (admin/system access)
DROP POLICY IF EXISTS "Authenticated users can view LTI providers" ON public.lti_providers;
CREATE POLICY "Authenticated users can view LTI providers" 
    ON public.lti_providers FOR SELECT 
    USING (auth.role() = 'authenticated');

-- LTI Tools (authenticated users can view active tools)
DROP POLICY IF EXISTS "Authenticated users can view active LTI tools" ON public.lti_tools;
CREATE POLICY "Authenticated users can view active LTI tools" 
    ON public.lti_tools FOR SELECT 
    USING (auth.role() = 'authenticated' AND is_active = true);

-- LTI Launches (users can only access their own launches)
DROP POLICY IF EXISTS "Users can view their own LTI launches" ON public.lti_launches;
CREATE POLICY "Users can view their own LTI launches" 
    ON public.lti_launches FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own LTI launches" ON public.lti_launches;
CREATE POLICY "Users can create their own LTI launches" 
    ON public.lti_launches FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own LTI launches" ON public.lti_launches;
CREATE POLICY "Users can update their own LTI launches" 
    ON public.lti_launches FOR UPDATE 
    USING (auth.uid() = user_id);

-- LTI Sessions (users can access sessions for their launches)
DROP POLICY IF EXISTS "Users can view their own LTI sessions" ON public.lti_sessions;
CREATE POLICY "Users can view their own LTI sessions" 
    ON public.lti_sessions FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.lti_launches 
        WHERE id = lti_sessions.launch_id AND user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can create their own LTI sessions" ON public.lti_sessions;
CREATE POLICY "Users can create their own LTI sessions" 
    ON public.lti_sessions FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.lti_launches 
        WHERE id = lti_sessions.launch_id AND user_id = auth.uid()
    ));

-- LTI Grade Passback (users can view their own grade passbacks)
DROP POLICY IF EXISTS "Users can view their own grade passbacks" ON public.lti_grade_passback;
CREATE POLICY "Users can view their own grade passbacks" 
    ON public.lti_grade_passback FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.lti_launches 
        WHERE id = lti_grade_passback.launch_id AND user_id = auth.uid()
    ));

-- LTI Content Items (authenticated users can view)
DROP POLICY IF EXISTS "Authenticated users can view LTI content items" ON public.lti_content_items;
CREATE POLICY "Authenticated users can view LTI content items" 
    ON public.lti_content_items FOR SELECT 
    USING (auth.role() = 'authenticated' AND is_active = true);

-- LTI JWKS (public read access for key verification)
DROP POLICY IF EXISTS "Public can view active JWKS" ON public.lti_jwks;
CREATE POLICY "Public can view active JWKS" 
    ON public.lti_jwks FOR SELECT 
    USING (is_active = true);

-- Automatic updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lti_providers_updated_at ON public.lti_providers;
CREATE TRIGGER update_lti_providers_updated_at 
    BEFORE UPDATE ON public.lti_providers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lti_tools_updated_at ON public.lti_tools;
CREATE TRIGGER update_lti_tools_updated_at 
    BEFORE UPDATE ON public.lti_tools 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
DROP TRIGGER IF EXISTS update_lti_content_items_updated_at ON public.lti_content_items;
CREATE TRIGGER update_lti_content_items_updated_at 
    BEFORE UPDATE ON public.lti_content_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clean up expired sessions (you'll want to run this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_lti_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.lti_sessions 
    WHERE expires_at < now() - INTERVAL '1 day';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
