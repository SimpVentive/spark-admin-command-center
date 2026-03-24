import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import Index from "@/pages/Index";

const RoleHome = () => {
  const { isSuperAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return <Navigate to="/super-admin/companies" replace />;
  }

  return <Index />;
};

export default RoleHome;