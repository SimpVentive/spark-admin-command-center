import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PersonalInfoSection } from "@/components/employee-form/PersonalInfoSection";
import { EmploymentInfoSection } from "@/components/employee-form/EmploymentInfoSection";
import { AdditionalInfoSection } from "@/components/employee-form/AdditionalInfoSection";
import { EmployeeFormData } from "@/hooks/useEmployeeForm";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "", middleName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", gender: "", dateOfJoining: "", employeeId: "",
    designation: "", department: "", grade: "", rank: "", location: "",
    reportingManager: "", qualification: "", experience: "", skills: "",
    address: "", emergencyContact: "", emergencyPhone: "", bloodGroup: "",
    maritalStatus: "", nationality: "", panNumber: "", aadharNumber: "",
    pfNumber: "", esiNumber: "", salary: "", workType: "", shiftTiming: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({ title: "Error", description: "Could not load user profile", variant: "destructive" });
        navigate("/users");
        return;
      }

      if (data) {
        const nameParts = (data.full_name || "").split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
          middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
          email: data.email || "",
          department: data.department || "",
          designation: data.position || "",
          reportingManager: data.manager_id || "",
        }));
      }
      setIsFetching(false);
    };
    fetchProfile();
  }, [id]);

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
          email: formData.email,
          department: formData.department,
          position: formData.designation,
          manager_id: formData.reportingManager || null,
        })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Success", description: "Employee updated successfully!" });
      navigate("/users");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update employee", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Employee</h1>
          <p className="text-muted-foreground">Update employee information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <PersonalInfoSection formData={formData} onInputChange={handleInputChange} />
          <EmploymentInfoSection formData={formData} onInputChange={handleInputChange} />
          <AdditionalInfoSection formData={formData} onInputChange={handleInputChange} />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Update Employee"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
