import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Download, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const BulkEnrollment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        parseAndValidateCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseAndValidateCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      setValidationErrors(["CSV file must contain at least a header row and one data row"]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['firstName', 'lastName', 'email', 'department', 'designation'];
    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
    
    if (missingHeaders.length > 0) {
      setValidationErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
      return;
    }

    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      row.rowNumber = index + 2; // +2 because we start from row 2 (after header)
      return row;
    });

    // Validate data
    const errors: string[] = [];
    data.forEach(row => {
      if (!row.firstName) errors.push(`Row ${row.rowNumber}: First Name is required`);
      if (!row.lastName) errors.push(`Row ${row.rowNumber}: Last Name is required`);
      if (!row.email) errors.push(`Row ${row.rowNumber}: Email is required`);
      if (!row.department) errors.push(`Row ${row.rowNumber}: Department is required`);
      if (!row.designation) errors.push(`Row ${row.rowNumber}: Designation is required`);
      
      // Email validation
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push(`Row ${row.rowNumber}: Invalid email format`);
      }
    });

    setValidationErrors(errors);
    setPreviewData(data.slice(0, 10)); // Show first 10 rows for preview
  };

  const handleBulkUpload = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix all validation errors before proceeding",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Parse the full CSV data
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      });

      // Insert profiles to database
      const profilesToInsert = data.map(row => ({
        id: crypto.randomUUID(),
        full_name: `${row.firstName} ${row.lastName}`.trim(),
        email: row.email,
        department: row.department || null,
        position: row.designation || null,
      }));

      const { error } = await supabase
        .from('profiles')
        .insert(profilesToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully enrolled ${data.length} employees`,
      });

      navigate('/users');
    } catch (error: any) {
      console.error('Bulk enrollment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process bulk enrollment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,phone,department,designation,dateOfJoining,location,reportingManager
John,Doe,john.doe@company.com,+1234567890,IT,Software Engineer,2024-01-15,New York,Jane Smith
Jane,Smith,jane.smith@company.com,+1234567891,HR,HR Manager,2024-01-10,New York,Mike Johnson`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Bulk Employee Enrollment</h1>
          <p className="text-muted-foreground">Upload multiple employees at once using CSV format</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {uploadedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>File:</strong> {uploadedFile.name}
                </p>
                <p className="text-sm">
                  <strong>Size:</strong> {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Entry Section */}
        <Card>
          <CardHeader>
            <CardTitle>Manual CSV Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="csvData">Paste CSV Data</Label>
              <Textarea
                id="csvData"
                value={csvData}
                onChange={(e) => {
                  setCsvData(e.target.value);
                  parseAndValidateCSV(e.target.value);
                }}
                placeholder="Paste your CSV data here..."
                rows={10}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
              {validationErrors.length > 10 && (
                <p className="text-sm">... and {validationErrors.length - 10} more errors</p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview Data */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Data Preview ({previewData.length} of {csvData.split('\n').length - 1} rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-gray-300 p-2 text-left">First Name</th>
                    <th className="border border-gray-300 p-2 text-left">Last Name</th>
                    <th className="border border-gray-300 p-2 text-left">Email</th>
                    <th className="border border-gray-300 p-2 text-left">Department</th>
                    <th className="border border-gray-300 p-2 text-left">Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{row.firstName}</td>
                      <td className="border border-gray-300 p-2">{row.lastName}</td>
                      <td className="border border-gray-300 p-2">{row.email}</td>
                      <td className="border border-gray-300 p-2">{row.department}</td>
                      <td className="border border-gray-300 p-2">{row.designation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {previewData.length > 0 && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => {
            setUploadedFile(null);
            setCsvData("");
            setPreviewData([]);
            setValidationErrors([]);
          }}>
            Clear
          </Button>
          <Button 
            onClick={handleBulkUpload} 
            disabled={isLoading || validationErrors.length > 0}
          >
            {isLoading ? "Processing..." : "Upload Employees"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkEnrollment;
