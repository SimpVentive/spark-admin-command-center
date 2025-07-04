
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeFormData } from "@/hooks/useEmployeeForm";

interface AdditionalInfoSectionProps {
  formData: EmployeeFormData;
  onInputChange: (field: keyof EmployeeFormData, value: string) => void;
}

export const AdditionalInfoSection = ({ formData, onInputChange }: AdditionalInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Textarea
            id="qualification"
            value={formData.qualification}
            onChange={(e) => onInputChange('qualification', e.target.value)}
            placeholder="Educational qualifications, certifications..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => onInputChange('skills', e.target.value)}
            placeholder="Technical and soft skills..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => onInputChange('experience', e.target.value)}
            placeholder="Years of experience"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => onInputChange('bloodGroup', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
