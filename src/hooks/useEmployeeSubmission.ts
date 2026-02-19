
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
      const profileId = crypto.randomUUID();

      // Insert into profiles with all supported columns
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: profileId,
            full_name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
            email: formData.email,
            department: formData.department,
            position: formData.designation,
            manager_id: formData.reportingManager || null,
            phone: formData.phone || null,
            employee_id: formData.employeeId || null,
            date_of_joining: formData.dateOfJoining || null,
            gender: formData.gender || null,
            location: formData.location || null,
            grade: formData.grade || null,
            rank: formData.rank || null,
            work_type: formData.workType || null,
          }
        ]);

      if (profileError) throw profileError;

      // Insert into employee_details for extended fields
      const { error: detailsError } = await supabase
        .from('employee_details')
        .insert([
          {
            profile_id: profileId,
            date_of_birth: formData.dateOfBirth || null,
            qualification: formData.qualification || null,
            experience: formData.experience || null,
            skills: formData.skills || null,
            address: formData.address || null,
            emergency_contact: formData.emergencyContact || null,
            emergency_phone: formData.emergencyPhone || null,
            blood_group: formData.bloodGroup || null,
            marital_status: formData.maritalStatus || null,
            nationality: formData.nationality || null,
            pan_number: formData.panNumber || null,
            aadhar_number: formData.aadharNumber || null,
            pf_number: formData.pfNumber || null,
            esi_number: formData.esiNumber || null,
            salary: formData.salary || null,
            shift_timing: formData.shiftTiming || null,
          }
        ]);

      if (detailsError) throw detailsError;

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
