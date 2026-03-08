import { useState, useEffect } from "react";
import { Settings as SettingsIcon, User, Bell, Globe, Palette, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single();
        if (data) setProfile({ full_name: data.full_name || "", email: data.email || "" });
      }
    };
    load();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("profiles").update({ full_name: profile.full_name }).eq("id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated successfully" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={profile.full_name} onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
            </div>
            <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Settings</CardTitle>
            <CardDescription>Control how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Email Notifications</Label><p className="text-sm text-muted-foreground">Receive notifications via email</p></div>
              <Switch checked={notifications.email} onCheckedChange={(v) => { setNotifications(n => ({ ...n, email: v })); toast({ title: `Email notifications ${v ? "enabled" : "disabled"}` }); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label>Push Notifications</Label><p className="text-sm text-muted-foreground">Receive push notifications</p></div>
              <Switch checked={notifications.push} onCheckedChange={(v) => { setNotifications(n => ({ ...n, push: v })); toast({ title: `Push notifications ${v ? "enabled" : "disabled"}` }); }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label>SMS Notifications</Label><p className="text-sm text-muted-foreground">Receive SMS notifications</p></div>
              <Switch checked={notifications.sms} onCheckedChange={(v) => { setNotifications(n => ({ ...n, sms: v })); toast({ title: `SMS notifications ${v ? "enabled" : "disabled"}` }); }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><Label>Dark Mode</Label><p className="text-sm text-muted-foreground">Switch to dark theme</p></div>
              <Switch onCheckedChange={(v) => toast({ title: `Dark mode ${v ? "enabled" : "disabled"}` })} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><Label>Compact View</Label><p className="text-sm text-muted-foreground">Use a more compact layout</p></div>
              <Switch onCheckedChange={(v) => toast({ title: `Compact view ${v ? "enabled" : "disabled"}` })} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
