import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, BookOpen, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CourseManageDialogProps {
  course: any;
  onUpdate: () => void;
}

export const CourseManageDialog = ({ course, onUpdate }: CourseManageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    in_catalog: course?.in_catalog || false,
    organization_enrollments: course?.organization_enrollments || 0,
    is_active: course?.is_active || true
  });
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mooc_courses')
        .update({
          in_catalog: settings.in_catalog,
          is_active: settings.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (error) throw error;

      toast({
        title: "Course Updated",
        description: `${course.title} settings have been updated successfully.`
      });
      
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update course settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollUser = () => {
    toast({
      title: "Bulk Enrollment",
      description: "Opening bulk enrollment interface..."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Course: {course?.title}</DialogTitle>
          <DialogDescription>
            Configure course settings and manage enrollments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{course?.organization_enrollments || 0}</div>
              <div className="text-xs text-muted-foreground">Enrollments</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{course?.duration_weeks || 0}</div>
              <div className="text-xs text-muted-foreground">Weeks</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">{course?.rating || 0}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="in_catalog">Include in Organization Catalog</Label>
                <p className="text-sm text-muted-foreground">Make this course available to all employees</p>
              </div>
              <Switch
                id="in_catalog"
                checked={settings.in_catalog}
                onCheckedChange={(checked) => setSettings({...settings, in_catalog: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Course Active Status</Label>
                <p className="text-sm text-muted-foreground">Enable or disable this course</p>
              </div>
              <Switch
                id="is_active"
                checked={settings.is_active}
                onCheckedChange={(checked) => setSettings({...settings, is_active: checked})}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Course Information</Label>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Provider:</span> {course?.provider_name}
              </div>
              <div>
                <span className="font-medium">Category:</span> {course?.category}
              </div>
              <div>
                <span className="font-medium">Level:</span> {course?.level}
              </div>
              <div>
                <span className="font-medium">Price:</span> ${course?.price || 0}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Quick Actions</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEnrollUser}>
                <Users className="w-4 h-4 mr-2" />
                Bulk Enroll
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" size="sm">
                Export Enrollments
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};