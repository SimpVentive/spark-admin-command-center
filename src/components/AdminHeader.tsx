
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CompanySwitcher } from "@/components/CompanySwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mockNotifications = [
  { id: 1, title: "New TNA cycle created", time: "5 min ago", read: false },
  { id: 2, title: "3 pending approvals", time: "1 hour ago", read: false },
  { id: 3, title: "Training program updated", time: "2 hours ago", read: true },
  { id: 4, title: "Assessment results available", time: "Yesterday", read: true },
];

export function AdminHeader() {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
    toast({ title: "Signed out", description: "You have been logged out successfully." });
  };

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "AD";

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center gap-4 px-4">
        <div className="flex-1 flex items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users, courses, or skills..."
              className="pl-8 bg-muted/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-medium">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b border-border">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {mockNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-3 py-2.5 border-b border-border last:border-0 cursor-pointer hover:bg-muted/50 ${!n.read ? "bg-muted/30" : ""}`}
                  >
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium truncate">{user?.email ?? "Admin"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
