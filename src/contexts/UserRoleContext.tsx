import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "trainer"
  | "user"
  | "location_admin";

interface UserRoleContextType {
  roles: AppRole[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isTrainer: boolean;
  isLocationAdmin: boolean;
  hasRole: (role: AppRole) => boolean;
  loading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const MAX_ROLE_RETRIES = 6;

    if (authLoading) {
      setLoading(true);
      return () => { isMounted = false; };
    }

    if (!user || !session) {
      setRoles([]);
      setLoading(false);
      return () => { isMounted = false; };
    }

    const fetchRoles = async (attempt = 0) => {
      if (attempt === 0) setLoading(true);
      try {
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

        if (rolesResult.error) console.warn("[UserRoleProvider] roles error:", rolesResult.error.message);
        if (rpcResult.error) console.warn("[UserRoleProvider] RPC error:", rpcResult.error.message);

        const normalizedRoles = Array.from(
          new Set<AppRole>([
            ...fetchedRoles,
            ...(isSuperAdminRpc ? (["super_admin"] as AppRole[]) : []),
          ])
        );

        console.log("[UserRoleProvider] roles:", normalizedRoles, "user:", user.email);
        setRoles(normalizedRoles);

        if (normalizedRoles.length === 0 && attempt < MAX_ROLE_RETRIES) {
          console.log(`[UserRoleProvider] no roles yet, retrying ${attempt + 1}/${MAX_ROLE_RETRIES}...`);
          retryTimer = setTimeout(() => {
            if (isMounted) fetchRoles(attempt + 1);
          }, 800);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("[UserRoleProvider] error:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchRoles();

    return () => {
      isMounted = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [user?.id, session?.access_token, authLoading]);

  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuperAdmin;
  const isManager = roles.includes("manager");
  const isTrainer = roles.includes("trainer");
  const isLocationAdmin = roles.includes("location_admin");
  const hasRole = (role: AppRole) => roles.includes(role);

  return (
    <UserRoleContext.Provider
      value={{ roles, isSuperAdmin, isAdmin, isManager, isTrainer, isLocationAdmin, hasRole, loading }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
};
