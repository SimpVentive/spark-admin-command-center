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

    // GET /api/paths/{id}/content/ - List path modules (any authenticated user can view)
    if (method === 'GET' && pathSegments.length === 5 && pathSegments[4] === 'content') {
      const pathId = pathSegments[3];

      const { data, error } = await supabase
        .from('learning_path_modules')
        .select('*')
        .eq('learning_path_id', pathId)
        .order('order_index');

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

    // POST /api/paths/{id}/content/ - Add content to path (admin only)
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'content') {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const body = await req.json();

      // Get the next order index
      const { data: maxOrderData } = await supabase
        .from('learning_path_modules')
        .select('order_index')
        .eq('learning_path_id', pathId)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

      const nextOrderIndex = maxOrderData ? maxOrderData.order_index + 1 : 1;

      const { data, error } = await supabase
        .from('learning_path_modules')
        .insert({
          learning_path_id: pathId,
          title: body.title,
          description: body.description,
          order_index: body.order_index || nextOrderIndex,
          duration_hours: body.duration_hours,
          is_required: body.is_required !== false
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

    // PUT /api/paths/{id}/content/{module_id}/ - Update module in path (admin only)
    if (method === 'PUT' && pathSegments.length === 6) {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const moduleId = pathSegments[5];
      const body = await req.json();

      const { data, error } = await supabase
        .from('learning_path_modules')
        .update({
          title: body.title,
          description: body.description,
          order_index: body.order_index,
          duration_hours: body.duration_hours,
          is_required: body.is_required
        })
        .eq('id', moduleId)
        .eq('learning_path_id', pathId)
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

    // DELETE /api/paths/{id}/content/{module_id}/ - Remove module from path (admin only)
    if (method === 'DELETE' && pathSegments.length === 6) {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const moduleId = pathSegments[5];

      const { error } = await supabase
        .from('learning_path_modules')
        .delete()
        .eq('id', moduleId)
        .eq('learning_path_id', pathId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Module removed successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/paths/{id}/content/reorder/ - Change module sequence (admin only)
    if (method === 'POST' && pathSegments.length === 6 && pathSegments[5] === 'reorder') {
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const body = await req.json();
      const { modules } = body; // Array of { id, order_index }

      // Update each module's order_index
      const updates = modules.map(async (module: any) => {
        return supabase
          .from('learning_path_modules')
          .update({ order_index: module.order_index })
          .eq('id', module.id)
          .eq('learning_path_id', pathId);
      });

      const results = await Promise.all(updates);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        return new Response(JSON.stringify({ error: 'Failed to reorder some modules' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ message: 'Modules reordered successfully' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in path-content-api:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
