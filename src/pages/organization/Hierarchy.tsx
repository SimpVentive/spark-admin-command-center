
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Edit, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OrganizationChart from "@/components/OrganizationChart";

const Hierarchy = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
                    <Loader2 className="h-4 w-4 animate-spin" />
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

      <OrganizationChart 
        isEditing={isEditing} 
        onSave={() => {
          setIsEditing(false);
          toast({
            title: "Success",
            description: "Organization structure saved successfully"
          });
        }} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-6 w-6" />
            <span>Edit Structure</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleExportChart}>
            <Download className="h-6 w-6" />
            <span>Export Chart</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hierarchy;
