import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "super_admin" | "admin" | "manager" | "trainer" | "user" | "location_admin";

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      setLoading(true);
      const [{ data, error }, { data: isSuperAdminRpc }] = await Promise.all([
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id),
        supabase.rpc("is_super_admin"),
      ]);

      if (!isMounted) return;

      const fetchedRoles = !error && data
        ? data.map((r: { role: string }) => r.role as AppRole)
        : [];

      const normalizedRoles = Array.from(new Set<AppRole>([
        ...fetchedRoles,
        ...(isSuperAdminRpc ? ["super_admin"] as AppRole[] : []),
      ]));

      setRoles(normalizedRoles);

      if (!error && data) {
        setRoles(normalizedRoles);
      } else {
        setRoles(isSuperAdminRpc ? ["super_admin"] : []);
      }

      setLoading(false);
    };

    fetchRoles();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuperAdmin;
  const isManager = roles.includes("manager");
  const isTrainer = roles.includes("trainer");
  const isLocationAdmin = roles.includes("location_admin");
  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, isSuperAdmin, isAdmin, isManager, isTrainer, isLocationAdmin, hasRole, loading };
};
