import { Building2, ChevronDown, Check } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CompanySwitcher() {
  const { isSuperAdmin } = useUserRole();
  const { company, availableCompanies, switchCompany, loading } = useCompany();

  // Only show for super admins with multiple companies
  if (!isSuperAdmin || availableCompanies.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[200px]">
          <Building2 className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-sm">
            {loading ? "Loading..." : company?.name || "Select Company"}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Super Admin</Badge>
          Switch Company
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableCompanies.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => switchCompany(c.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{c.name}</span>
            </div>
            {company?.id === c.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CompanySwitcher;
