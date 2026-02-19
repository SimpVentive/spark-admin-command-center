
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmployeeFormData } from "@/hooks/useEmployeeForm";
import { ManagerCombobox } from "./ManagerCombobox";

interface EmploymentInfoSectionProps {
  formData: EmployeeFormData;
  onInputChange: (field: keyof EmployeeFormData, value: string) => void;
}

export const EmploymentInfoSection = ({ formData, onInputChange }: EmploymentInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID *</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => onInputChange('employeeId', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfJoining">Date of Joining *</Label>
          <Input
            id="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={(e) => onInputChange('dateOfJoining', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation *</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => onInputChange('designation', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select value={formData.department} onValueChange={(value) => onInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="it">Information Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="quality">Quality Assurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade}
            onChange={(e) => onInputChange('grade', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank">Rank</Label>
          <Input
            id="rank"
            value={formData.rank}
            onChange={(e) => onInputChange('rank', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => onInputChange('location', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reportingManager">Reporting Manager</Label>
          <ManagerCombobox
            value={formData.reportingManager}
            onChange={(value) => onInputChange('reportingManager', value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workType">Work Type</Label>
          <Select value={formData.workType} onValueChange={(value) => onInputChange('workType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
              <SelectItem value="consultant">Consultant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
