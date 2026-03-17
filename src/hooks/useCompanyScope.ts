import { useCompany } from '@/contexts/CompanyContext';

/**
 * Hook that provides the current company_id for scoping database operations.
 * Use `scopeData(obj)` to add company_id to insert payloads.
 * RLS handles read filtering automatically via can_access_company().
 */
export const useCompanyScope = () => {
  const { companyId, loading } = useCompany();

  /** Adds company_id to an insert/update payload */
  const scopeData = <T extends Record<string, any>>(data: T): T & { company_id: string | null } => {
    return { ...data, company_id: companyId };
  };

  /** Adds company_id to each item in an array payload */
  const scopeArray = <T extends Record<string, any>>(items: T[]): (T & { company_id: string | null })[] => {
    return items.map(item => ({ ...item, company_id: companyId }));
  };

  return { companyId, loading, scopeData, scopeArray };
};
