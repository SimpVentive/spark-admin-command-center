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
    const { userId: authenticatedUserId, isAdmin, error: authError } = await validateAuth(req);
    if (authError) {
      return authError;
    }

    // Create service client for database operations (after auth validation)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const method = req.method;

    // POST /api/paths/{id}/assign/ - Assign path to users/groups (admin only)
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'assign') {
      // Only admins can assign paths to other users
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const pathId = pathSegments[3];
      const body = await req.json();
      const { userIds, groupIds, dueDate } = body;

      const enrollments = [];

      // Assign to individual users
      if (userIds && userIds.length > 0) {
        for (const userId of userIds) {
          enrollments.push({
            user_id: userId,
            learning_path_id: pathId,
            status: 'assigned'
          });
        }
      }

      // Assign to groups (assuming we have a groups table)
      if (groupIds && groupIds.length > 0) {
        // Get users from groups - this would need a group_members table
        const { data: groupMembers } = await supabase
          .from('group_members') // This table would need to be created
          .select('user_id')
          .in('group_id', groupIds);

        if (groupMembers) {
          for (const member of groupMembers) {
            enrollments.push({
              user_id: member.user_id,
              learning_path_id: pathId,
              status: 'assigned'
            });
          }
        }
      }

      if (enrollments.length === 0) {
        return new Response(JSON.stringify({ error: 'No users to assign' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('user_learning_path_enrollments')
        .upsert(enrollments, { onConflict: 'user_id,learning_path_id' })
        .select();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        message: `Assigned learning path to ${enrollments.length} users`,
        data 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/paths/{id}/progress/ - Path progress analytics
    if (method === 'GET' && pathSegments.length === 5 && pathSegments[4] === 'progress') {
      const pathId = pathSegments[3];

      // For progress, admins can see all enrollments, regular users can only see their own
      let query = supabase
        .from('user_learning_path_enrollments')
        .select(`
          *,
          profiles(full_name, department)
        `)
        .eq('learning_path_id', pathId);

      if (!isAdmin) {
        query = query.eq('user_id', authenticatedUserId);
      }

      const { data: enrollments, error: enrollError } = await query;

      if (enrollError) {
        return new Response(JSON.stringify({ error: enrollError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate progress analytics
      const totalEnrolled = enrollments?.length || 0;
      const completed = enrollments?.filter(e => e.status === 'completed').length || 0;
      const inProgress = enrollments?.filter(e => e.status === 'in_progress').length || 0;
      const notStarted = enrollments?.filter(e => e.status === 'enrolled').length || 0;

      // Get completion analytics by department (only for admins)
      const departmentStats: Record<string, { total: number; completed: number }> = {};
      if (isAdmin && enrollments) {
        for (const enrollment of enrollments) {
          const dept = enrollment.profiles?.department || 'Unknown';
          if (!departmentStats[dept]) {
            departmentStats[dept] = { total: 0, completed: 0 };
          }
          departmentStats[dept].total++;
          if (enrollment.status === 'completed') {
            departmentStats[dept].completed++;
          }
        }
      }

      // Get recent activity (scoped to user for non-admins)
      let activityQuery = supabase
        .from('user_learning_analytics')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('learning_path_id', pathId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!isAdmin) {
        activityQuery = activityQuery.eq('user_id', authenticatedUserId);
      }

      const { data: recentActivity } = await activityQuery;

      const progressData = {
        overview: {
          totalEnrolled,
          completed,
          inProgress,
          notStarted,
          completionRate: totalEnrolled > 0 ? (completed / totalEnrolled * 100).toFixed(1) : 0
        },
        departmentStats: isAdmin ? departmentStats : undefined,
        enrollments: enrollments?.map(e => ({
          userId: e.user_id,
          userName: e.profiles?.full_name,
          department: e.profiles?.department,
          status: e.status,
          enrolledAt: e.enrolled_at,
          completedAt: e.completed_at
        })),
        recentActivity
      };

      return new Response(JSON.stringify({ data: progressData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/paths/{id}/enroll/ - Manual enrollment (user can enroll themselves, admins can enroll anyone)
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'enroll') {
      const pathId = pathSegments[3];
      const body = await req.json();
      const { userId } = body;

      // Determine the target user ID
      let targetUserId = authenticatedUserId;
      
      // If a different userId is provided, only admins can enroll other users
      if (userId && userId !== authenticatedUserId) {
        if (!isAdmin) {
          return new Response(JSON.stringify({ error: 'Forbidden: Cannot enroll other users' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        targetUserId = userId;
      }

      const { data, error } = await supabase
        .from('user_learning_path_enrollments')
        .upsert({
          user_id: targetUserId,
          learning_path_id: pathId,
          status: 'enrolled'
        }, { onConflict: 'user_id,learning_path_id' })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ 
        message: 'User enrolled successfully',
        data 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in path-assignment-api:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
