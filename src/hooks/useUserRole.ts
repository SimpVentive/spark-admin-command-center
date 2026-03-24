import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "trainer"
  | "user"
  | "location_admin";

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let sessionRetryCount = 0;
    const MAX_SESSION_RETRIES = 8;

    if (authLoading) {
      setLoading(true);
      return () => {
        isMounted = false;
      };
    }

    if (!user) {
      setRoles([]);
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const fetchRoles = async () => {
      setLoading(true);
      try {
        // Ensure we have a valid session before querying
        const { data: sessionData } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (!sessionData.session) {
          if (sessionRetryCount < MAX_SESSION_RETRIES) {
            sessionRetryCount += 1;
            console.warn(`[useUserRole] No active session yet, retrying (${sessionRetryCount}/${MAX_SESSION_RETRIES})`);
            retryTimer = setTimeout(() => {
              if (isMounted) fetchRoles();
            }, 500);
            return;
          }

          console.warn("[useUserRole] No active session after retries, cannot fetch roles");
          setRoles([]);
          setLoading(false);
          return;
        }

        sessionRetryCount = 0;

        const [rolesResult, rpcResult] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", user.id),
          supabase.rpc("is_super_admin"),
        ]);

        if (!isMounted) return;

        const fetchedRoles =
          !rolesResult.error && rolesResult.data
            ? rolesResult.data.map((r: { role: string }) => r.role as AppRole)
            : [];

        const isSuperAdminRpc = rpcResult.data === true;

        if (rolesResult.error) {
          console.warn("[useUserRole] roles query error:", rolesResult.error.message);
        }
        if (rpcResult.error) {
          console.warn("[useUserRole] is_super_admin RPC error:", rpcResult.error.message);
        }

        const normalizedRoles = Array.from(
          new Set<AppRole>([
            ...fetchedRoles,
            ...(isSuperAdminRpc ? (["super_admin"] as AppRole[]) : []),
          ])
        );

        console.log("[useUserRole] detected roles:", normalizedRoles, "for user:", user.email);
        setRoles(normalizedRoles);
        setLoading(false);

        // Retry once if no roles detected (auth token might not have propagated yet)
        if (normalizedRoles.length === 0) {
          console.log("[useUserRole] no roles found, retrying in 1.5s...");
          retryTimer = setTimeout(async () => {
            if (!isMounted) return;
            try {
              const [retryRoles, retryRpc] = await Promise.all([
                supabase.from("user_roles").select("role").eq("user_id", user.id),
                supabase.rpc("is_super_admin"),
              ]);
              if (!isMounted) return;
              const retryFetched =
                !retryRoles.error && retryRoles.data
                  ? retryRoles.data.map((r: { role: string }) => r.role as AppRole)
                  : [];
              const retryIsSA = retryRpc.data === true;
              const retryNormalized = Array.from(
                new Set<AppRole>([
                  ...retryFetched,
                  ...(retryIsSA ? (["super_admin"] as AppRole[]) : []),
                ])
              );
              console.log("[useUserRole] retry detected roles:", retryNormalized);
              if (isMounted) {
                setRoles(retryNormalized);
                setLoading(false);
              }
            } catch (e) {
              console.error("[useUserRole] retry error:", e);
              if (isMounted) setLoading(false);
            }
          }, 1500);
        }
      } catch (err) {
        console.error("[useUserRole] unexpected error:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchRoles();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [user?.id, authLoading]);

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuperAdmin;
  const isManager = roles.includes("manager");
  const isTrainer = roles.includes("trainer");
  const isLocationAdmin = roles.includes("location_admin");
  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, isSuperAdmin, isAdmin, isManager, isTrainer, isLocationAdmin, hasRole, loading };
};
