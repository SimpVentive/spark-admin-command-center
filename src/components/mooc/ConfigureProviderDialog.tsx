import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConfigureProviderDialogProps {
  platform: any;
  onConfigurationUpdate: () => void;
}

export const ConfigureProviderDialog = ({ platform, onConfigurationUpdate }: ConfigureProviderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    api_endpoint: platform?.api_endpoint || '',
    sync_frequency: platform?.sync_frequency || 'daily',
    auto_enrollment: platform?.config_data?.auto_enrollment || false,
    notification_settings: {
      sync_completion: platform?.config_data?.notification_settings?.sync_completion || true,
      enrollment_updates: platform?.config_data?.notification_settings?.enrollment_updates || true
    }
  });
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mooc_providers')
        .update({
          api_endpoint: config.api_endpoint,
          sync_frequency: config.sync_frequency,
          config_data: {
            auto_enrollment: config.auto_enrollment,
            notification_settings: config.notification_settings
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', platform.id);

      if (error) throw error;

      toast({
        title: "Configuration Updated",
        description: `${platform.name} configuration has been saved successfully.`
      });
      
      setOpen(false);
      onConfigurationUpdate();
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: "Configuration Failed",
        description: "Failed to update configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configure
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {platform?.name}</DialogTitle>
          <DialogDescription>
            Manage integration settings and synchronization preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api_endpoint">API Endpoint</Label>
            <Input
              id="api_endpoint"
              value={config.api_endpoint}
              onChange={(e) => setConfig({...config, api_endpoint: e.target.value})}
              placeholder="https://api.platform.com/v1"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sync_frequency">Sync Frequency</Label>
            <Select 
              value={config.sync_frequency} 
              onValueChange={(value) => setConfig({...config, sync_frequency: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto_enrollment">Auto Enrollment</Label>
            <Switch
              id="auto_enrollment"
              checked={config.auto_enrollment}
              onCheckedChange={(checked) => setConfig({...config, auto_enrollment: checked})}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Notification Settings</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="sync_completion">Sync Completion Notifications</Label>
              <Switch
                id="sync_completion"
                checked={config.notification_settings.sync_completion}
                onCheckedChange={(checked) => setConfig({
                  ...config, 
                  notification_settings: {...config.notification_settings, sync_completion: checked}
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enrollment_updates">Enrollment Update Notifications</Label>
              <Switch
                id="enrollment_updates"
                checked={config.notification_settings.enrollment_updates}
                onCheckedChange={(checked) => setConfig({
                  ...config, 
                  notification_settings: {...config.notification_settings, enrollment_updates: checked}
                })}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};