import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
}

interface CompanyContextType {
  company: Company | null;
  companyId: string | null;
  loading: boolean;
  /** Super admins can switch between companies */
  availableCompanies: Company[];
  switchCompany: (companyId: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { isSuperAdmin, loading: roleLoading } = useUserRole();
  const [company, setCompany] = useState<Company | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || roleLoading) return;

    const fetchCompany = async () => {
      setLoading(true);

      if (isSuperAdmin) {
        // Super admins see all companies
        const { data } = await (supabase as any)
          .from('companies')
          .select('*')
          .eq('is_active', true)
          .order('name');

        const companies = (data || []) as Company[];
        setAvailableCompanies(companies);

        // Auto-select first or previously selected
        const target = selectedCompanyId
          ? companies.find((c: Company) => c.id === selectedCompanyId) || companies[0]
          : companies[0];
        setCompany(target || null);
      } else {
        // Regular users: get company from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (profile?.company_id) {
          const { data: companyData } = await (supabase as any)
            .from('companies')
            .select('*')
            .eq('id', profile.company_id)
            .single();

          setCompany(companyData as Company | null);
          setAvailableCompanies(companyData ? [companyData as Company] : []);
        }
      }

      setLoading(false);
    };

    fetchCompany();
  }, [user, isSuperAdmin, roleLoading, selectedCompanyId]);

  const switchCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        companyId: company?.id || null,
        loading,
        availableCompanies,
        switchCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
