
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Upload, Edit, Plus, Download, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Hierarchy = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [departments, setDepartments] = useState([
    { id: 1, name: "Engineering", manager: "John Smith", employees: 45, parentId: null },
    { id: 2, name: "Marketing", manager: "Sarah Johnson", employees: 23, parentId: null },
    { id: 3, name: "Human Resources", manager: "Mike Davis", employees: 12, parentId: null },
    { id: 4, name: "Sales", manager: "Lisa Chen", employees: 34, parentId: null },
  ]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate AI processing of the organizational chart image
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Success",
        description: "Organizational chart has been processed and structure updated!",
      });
      
      // In a real implementation, this would call an AI service to extract the org structure
      console.log('Processing organizational chart image with AI...');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the organizational chart image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddDepartment = () => {
    const newDept = {
      id: departments.length + 1,
      name: "New Department",
      manager: "Assign Manager",
      employees: 0,
      parentId: null
    };
    setDepartments([...departments, newDept]);
  };

  const handleExportChart = () => {
    toast({
      title: "Export Started",
      description: "Organizational chart is being exported as PDF...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporting Structure</h1>
          <p className="text-muted-foreground">View and edit organizational hierarchy and reporting relationships</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Chart
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Organizational Chart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chart-upload">Select organizational chart image</Label>
                  <Input
                    id="chart-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload an image of your organizational chart. AI will extract the structure and update your hierarchy.
                  </p>
                </div>
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wand2 className="h-4 w-4 animate-spin" />
                    Processing with AI...
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleExportChart} className="gap-2">
            <Download className="h-4 w-4" />
            Export Chart
          </Button>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"} className="gap-2">
            <Edit className="h-4 w-4" />
            {isEditing ? "Save Changes" : "Edit Structure"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Organizational Hierarchy
            {isEditing && (
              <Button onClick={handleAddDepartment} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* CEO Level */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-medium">CEO</h3>
                <p className="text-sm text-muted-foreground">Executive Level</p>
                {isEditing && (
                  <Button variant="ghost" size="sm" className="mt-2">
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Department Level */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-3 border rounded-lg text-center relative group">
                  <div className="w-10 h-10 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input 
                        value={dept.name} 
                        className="text-center text-sm h-8"
                        onChange={(e) => {
                          setDepartments(departments.map(d => 
                            d.id === dept.id ? {...d, name: e.target.value} : d
                          ));
                        }}
                      />
                      <Input 
                        value={dept.manager} 
                        className="text-center text-xs h-6"
                        onChange={(e) => {
                          setDepartments(departments.map(d => 
                            d.id === dept.id ? {...d, manager: e.target.value} : d
                          ));
                        }}
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium text-sm">{dept.name}</h4>
                      <p className="text-xs text-muted-foreground">{dept.manager}</p>
                    </>
                  )}
                  <Badge variant="outline" className="mt-1 text-xs">
                    {dept.employees} members
                  </Badge>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => {
                        setDepartments(departments.filter(d => d.id !== dept.id));
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Editing Mode:</strong> Click on any department to edit details, drag to reorder, or use the AI upload feature to automatically generate structure from an organizational chart image.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Wand2 className="h-6 w-6" />
                <span>AI Chart Generator</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Chart with AI</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Upload an image of your current organizational structure, and our AI will automatically extract and digitize it into an editable format.
                </p>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                <Button className="w-full" disabled={isUploading}>
                  {isUploading ? "Processing..." : "Generate Structure"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => window.open('https://www.SimplifyMyTraining.com', '_blank')}>
            <Users className="h-6 w-6" />
            <span>Manage Trainers</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Building2 className="h-6 w-6" />
            <span>Add Department</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Download className="h-6 w-6" />
            <span>Export Chart</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hierarchy;
