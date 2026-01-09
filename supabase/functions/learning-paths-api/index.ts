import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Helper function to validate JWT and get user ID
async function validateAuth(req: Request): Promise<{ userId: string | null; isAdmin: boolean; error: Response | null }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      userId: null,
      isAdmin: false,
      error: new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return {
      userId: null,
      isAdmin: false,
      error: new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    };
  }

  // Check if user is admin using service role
  const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: roleData } = await serviceSupabase
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  return { userId: data.user.id, isAdmin: !!roleData, error: null };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const { userId, isAdmin, error: authError } = await validateAuth(req);
    if (authError) {
      return authError;
    }

    // Create service client for database operations (after auth validation)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const method = req.method;

    // GET /api/paths/ - List learning paths with filtering, pagination, search (any authenticated user)
    if (method === 'GET' && pathSegments.length === 3) {
      const search = url.searchParams.get('search') || '';
      const category = url.searchParams.get('category') || '';
      const level = url.searchParams.get('level') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('learning_paths')
        .select('*, learning_path_modules(count)', { count: 'exact' })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (level) {
        query = query.eq('level', level);
      }

      const { data, error, count } = await query;

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/paths/ - Create new learning path (admin only)
    if (method === 'POST' && pathSegments.length === 3) {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const body = await req.json();
      
      const { data, error } = await supabase
        .from('learning_paths')
        .insert({
          title: body.title,
          description: body.description,
          category: body.category,
          level: body.level,
          required_experience_level: body.required_experience_level,
          total_duration_hours: body.total_duration_hours,
          prerequisites: body.prerequisites || [],
          certification_enabled: body.certification_enabled || false,
          assessment_enabled: body.assessment_enabled || false
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/paths/{id}/ - Get detailed learning path (any authenticated user)
    if (method === 'GET' && pathSegments.length === 4) {
      const pathId = pathSegments[3];
      
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_modules(
            id,
            title,
            description,
            order_index,
            duration_hours,
            is_required
          )
        `)
        .eq('id', pathId)
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/paths/{id}/ - Update learning path (admin only)
    if (method === 'PUT' && pathSegments.length === 4) {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const body = await req.json();

      const { data, error } = await supabase
        .from('learning_paths')
        .update({
          title: body.title,
          description: body.description,
          category: body.category,
          level: body.level,
          required_experience_level: body.required_experience_level,
          total_duration_hours: body.total_duration_hours,
          prerequisites: body.prerequisites,
          certification_enabled: body.certification_enabled,
          assessment_enabled: body.assessment_enabled
        })
        .eq('id', pathId)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /api/paths/{id}/ - Soft delete learning path (admin only)
    if (method === 'DELETE' && pathSegments.length === 4) {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];

      // Instead of hard delete, we could add an is_active field for soft delete
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', pathId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Learning path deleted successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/paths/{id}/duplicate/ - Clone learning path (admin only)
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'duplicate') {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];

      // Get original path
      const { data: originalPath, error: fetchError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_modules(*)
        `)
        .eq('id', pathId)
        .single();

      if (fetchError) {
        return new Response(JSON.stringify({ error: fetchError.message }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create new path
      const { data: newPath, error: createError } = await supabase
        .from('learning_paths')
        .insert({
          title: `${originalPath.title} (Copy)`,
          description: originalPath.description,
          category: originalPath.category,
          level: originalPath.level,
          required_experience_level: originalPath.required_experience_level,
          total_duration_hours: originalPath.total_duration_hours,
          prerequisites: originalPath.prerequisites,
          certification_enabled: originalPath.certification_enabled,
          assessment_enabled: originalPath.assessment_enabled
        })
        .select()
        .single();

      if (createError) {
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Copy modules if they exist
      if (originalPath.learning_path_modules && originalPath.learning_path_modules.length > 0) {
        const modulesToInsert = originalPath.learning_path_modules.map((module: any) => ({
          learning_path_id: newPath.id,
          title: module.title,
          description: module.description,
          order_index: module.order_index,
          duration_hours: module.duration_hours,
          is_required: module.is_required
        }));

        await supabase
          .from('learning_path_modules')
          .insert(modulesToInsert);
      }

      return new Response(JSON.stringify({ data: newPath }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in learning-paths-api:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
