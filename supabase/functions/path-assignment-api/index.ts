import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const method = req.method;

    // POST /api/paths/{id}/assign/ - Assign path to users/groups
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'assign') {
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

      // Get enrollment stats
      const { data: enrollments, error: enrollError } = await supabase
        .from('user_learning_path_enrollments')
        .select(`
          *,
          profiles(full_name, department)
        `)
        .eq('learning_path_id', pathId);

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

      // Get completion analytics by department
      const departmentStats = {};
      if (enrollments) {
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

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('user_learning_analytics')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('learning_path_id', pathId)
        .order('created_at', { ascending: false })
        .limit(10);

      const progressData = {
        overview: {
          totalEnrolled,
          completed,
          inProgress,
          notStarted,
          completionRate: totalEnrolled > 0 ? (completed / totalEnrolled * 100).toFixed(1) : 0
        },
        departmentStats,
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

    // POST /api/paths/{id}/enroll/ - Manual enrollment
    if (method === 'POST' && pathSegments.length === 5 && pathSegments[4] === 'enroll') {
      const pathId = pathSegments[3];
      const body = await req.json();
      const { userId } = body;

      const { data, error } = await supabase
        .from('user_learning_path_enrollments')
        .upsert({
          user_id: userId,
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