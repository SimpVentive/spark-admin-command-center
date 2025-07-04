
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmployeeForm } from "@/hooks/useEmployeeForm";
import { useEmployeeSubmission } from "@/hooks/useEmployeeSubmission";
import { PersonalInfoSection } from "@/components/employee-form/PersonalInfoSection";
import { EmploymentInfoSection } from "@/components/employee-form/EmploymentInfoSection";
import { AdditionalInfoSection } from "@/components/employee-form/AdditionalInfoSection";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { formData, handleInputChange } = useEmployeeForm();
  const { submitEmployee, isLoading } = useEmployeeSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitEmployee(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add New Employee</h1>
          <p className="text-muted-foreground">Enter comprehensive employee information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <PersonalInfoSection formData={formData} onInputChange={handleInputChange} />
          <EmploymentInfoSection formData={formData} onInputChange={handleInputChange} />
          <AdditionalInfoSection formData={formData} onInputChange={handleInputChange} />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/users')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Employee"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
