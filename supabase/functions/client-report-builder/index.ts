import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AVAILABLE_TABLES = [
  "profiles (id, email, full_name, company_id, department, designation, employee_id, is_active)",
  "training_programs (id, title, category, company_id, is_active, created_at)",
  "events (id, title, event_type, status, start_date, end_date, company_id, program_id, budget_allocated, budget_spent)",
  "event_enrollments (id, event_id, employee_id, enrollment_status, completed_at)",
  "assessments (id, title, assessment_type, passing_score, company_id)",
  "assessment_results (id, assessment_id, user_id, score, status, completed_at, attempt_number)",
  "departments (id, name, company_id, employee_count, is_active)",
  "locations (id, name, city, country, company_id, is_active)",
  "trainers (id, name, specialization, is_active)",
  "attendance (id, event_id, employee_id, status, check_in_time, check_out_time)",
  "content_items (id, title, content_type, company_id, created_at, file_size)",
  "kirkpatrick_evaluations (id, enrollment_id, level, metric_name, score, evaluation_date)",
  "competencies (id, name, company_id, is_active)",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = mode === "manual"
      ? `You are a SQL query assistant for an LMS platform. The user wants to build a report manually using Supabase JS queries.

Available database tables:
${AVAILABLE_TABLES.join("\n")}

When the user describes a report:
1. Generate the exact Supabase JS query code (using .from().select() syntax)
2. Explain what the query does
3. Suggest appropriate columns for the report table
4. Recommend filters that could be added

IMPORTANT: Only generate SELECT queries. Never modify data. Always reference exact table and column names from the schema above.
Format your response with markdown. Use code blocks for the query.`
      : `You are an AI report builder for an LMS (Learning Management System). You help company admins create custom reports and insights about THEIR company's data.

Available database tables:
${AVAILABLE_TABLES.join("\n")}

When the user asks for a report:
1. Understand what data they need
2. Suggest a clear report structure with columns, filters, and grouping
3. Generate a Supabase JS query (using .from().select() syntax) to fetch the data
4. Suggest a visualization type (table, bar chart, pie chart, line chart)
5. Format your response with markdown sections: ## Report Title, ### Query, ### Visualization, ### Suggested Filters

IMPORTANT: Only use SELECT queries. Never modify data. Always reference exact table and column names.
Keep responses concise and actionable. If the user's request is vague, ask clarifying questions.
Remember: This is for company-level admins, so always filter by company_id where relevant.`;

    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
