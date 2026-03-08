import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-laser-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Authenticate via API key from data source config or Authorization header
    const apiKey = req.headers.get("x-laser-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing authentication. Provide x-laser-api-key header or Bearer token." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate API key against registered data sources
    const { data: source } = await supabase
      .from("laser_data_sources")
      .select("id, name, source_type, status")
      .eq("api_key_encrypted", apiKey)
      .eq("status", "active")
      .single();

    if (!source) {
      return new Response(
        JSON.stringify({ error: "Invalid or inactive API key. Register this data source first." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { signals, employee_lookup_field } = body;

    // signals: array of { employee_id | employee_code | email, kpi_name | kpi_id, value, date? }
    if (!signals || !Array.isArray(signals) || signals.length === 0) {
      return new Response(
        JSON.stringify({ error: "Provide 'signals' array with at least one entry.", example: {
          signals: [
            { employee_id: "uuid-or-code", kpi_name: "Production Output", value: 85.5, date: "2026-03-08" }
          ]
        }}),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve KPI names to IDs
    const kpiNames = [...new Set(signals.filter((s: any) => s.kpi_name && !s.kpi_id).map((s: any) => s.kpi_name))];
    const kpiMap = new Map<string, string>();

    if (kpiNames.length) {
      const { data: kpis } = await supabase
        .from("laser_kpi_definitions")
        .select("id, name")
        .in("name", kpiNames)
        .eq("is_active", true);

      for (const kpi of kpis || []) {
        kpiMap.set(kpi.name.toLowerCase(), kpi.id);
      }
    }

    // Resolve employee references
    const lookupField = employee_lookup_field || "id"; // "id", "employee_id", or "email"
    const employeeRefs = [...new Set(signals.map((s: any) => s.employee_id || s.employee_code || s.email))];
    const employeeMap = new Map<string, string>();

    if (lookupField === "employee_id" || signals.some((s: any) => s.employee_code)) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, employee_id")
        .in("employee_id", employeeRefs);
      for (const p of profiles || []) {
        if (p.employee_id) employeeMap.set(p.employee_id, p.id);
      }
    } else if (lookupField === "email") {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("email", employeeRefs);
      for (const p of profiles || []) {
        if (p.email) employeeMap.set(p.email, p.id);
      }
    } else {
      // Assume direct UUIDs
      for (const ref of employeeRefs) {
        employeeMap.set(ref, ref);
      }
    }

    const batchId = crypto.randomUUID();
    const results = { inserted: 0, skipped: 0, errors: [] as string[], deviations_detected: 0 };

    // Process each signal
    for (const signal of signals) {
      try {
        // Resolve KPI ID
        let kpiId = signal.kpi_id;
        if (!kpiId && signal.kpi_name) {
          kpiId = kpiMap.get(signal.kpi_name.toLowerCase());
        }
        if (!kpiId) {
          results.errors.push(`KPI not found: ${signal.kpi_name || signal.kpi_id}`);
          results.skipped++;
          continue;
        }

        // Resolve employee ID
        const empRef = signal.employee_id || signal.employee_code || signal.email;
        const employeeId = employeeMap.get(empRef) || empRef;
        if (!employeeId) {
          results.errors.push(`Employee not found: ${empRef}`);
          results.skipped++;
          continue;
        }

        // Insert performance signal
        const { error: sigError } = await supabase.from("laser_performance_signals").insert({
          employee_id: employeeId,
          kpi_id: kpiId,
          kpi_value: signal.value,
          measurement_date: signal.date || new Date().toISOString().split("T")[0],
          source: source.source_type,
          batch_id: batchId,
        });

        if (sigError) {
          results.errors.push(`Signal insert error for ${empRef}: ${sigError.message}`);
          results.skipped++;
          continue;
        }

        results.inserted++;

        // Check for deviation
        const { data: mappings } = await supabase
          .from("laser_role_kpi_mappings")
          .select("*")
          .eq("kpi_id", kpiId)
          .eq("is_active", true);

        if (mappings?.length) {
          const mapping = mappings[0];
          let isDeviation = false;
          let severity = "warning";
          let deviationPct = 0;

          if (mapping.comparison_operator === "greater_is_better") {
            if (signal.value < mapping.threshold_critical) { isDeviation = true; severity = "critical"; }
            else if (signal.value < mapping.threshold_warning) { isDeviation = true; severity = "warning"; }
            deviationPct = ((mapping.target_value - signal.value) / mapping.target_value) * 100;
          } else {
            if (signal.value > mapping.threshold_critical) { isDeviation = true; severity = "critical"; }
            else if (signal.value > mapping.threshold_warning) { isDeviation = true; severity = "warning"; }
            deviationPct = ((signal.value - mapping.target_value) / mapping.target_value) * 100;
          }

          if (isDeviation) {
            const { data: devData } = await supabase.from("laser_deviations").insert({
              employee_id: employeeId,
              kpi_id: kpiId,
              role_kpi_mapping_id: mapping.id,
              actual_value: signal.value,
              target_value: mapping.target_value,
              deviation_percentage: Math.abs(deviationPct),
              severity,
              status: "open",
            }).select("id").single();

            results.deviations_detected++;

            // Auto-trigger RCA for this deviation
            if (devData) {
              try {
                const rcaResponse = await fetch(`${supabaseUrl}/functions/v1/laser-rca-engine`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${serviceKey}`,
                  },
                  body: JSON.stringify({ deviation_id: devData.id, mode: "analyze" }),
                });
                await rcaResponse.json();
              } catch (rcaErr) {
                console.error("RCA auto-trigger failed:", rcaErr);
              }
            }
          }
        }
      } catch (err) {
        results.errors.push(`Unexpected error: ${err.message}`);
        results.skipped++;
      }
    }

    // Update last_sync_at on the data source
    await supabase
      .from("laser_data_sources")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", source.id);

    return new Response(
      JSON.stringify({
        message: "Data ingestion complete",
        batch_id: batchId,
        source: source.name,
        ...results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("LASER data ingestion error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
