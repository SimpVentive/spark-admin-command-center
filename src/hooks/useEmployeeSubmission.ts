
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFormData } from "./useEmployeeForm";

export const useEmployeeSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitEmployee = async (formData: EmployeeFormData) => {
    setIsLoading(true);

    try {
      // Generate a UUID for the profile since we don't have auth yet
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: crypto.randomUUID(),
            full_name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
            email: formData.email,
            department: formData.department,
            position: formData.designation,
            manager_id: formData.reportingManager || null,
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Employee added successfully!",
      });

      navigate('/users');
    } catch (error: any) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add employee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { submitEmployee, isLoading };
};
