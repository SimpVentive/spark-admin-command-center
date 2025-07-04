
import { useState } from "react";

export interface EmployeeFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  dateOfJoining: string;
  employeeId: string;
  designation: string;
  department: string;
  grade: string;
  rank: string;
  location: string;
  reportingManager: string;
  qualification: string;
  experience: string;
  skills: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  panNumber: string;
  aadharNumber: string;
  pfNumber: string;
  esiNumber: string;
  salary: string;
  workType: string;
  shiftTiming: string;
}

export const useEmployeeForm = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    dateOfJoining: "",
    employeeId: "",
    designation: "",
    department: "",
    grade: "",
    rank: "",
    location: "",
    reportingManager: "",
    qualification: "",
    experience: "",
    skills: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodGroup: "",
    maritalStatus: "",
    nationality: "",
    panNumber: "",
    aadharNumber: "",
    pfNumber: "",
    esiNumber: "",
    salary: "",
    workType: "",
    shiftTiming: "",
  });

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return { formData, handleInputChange };
};
