
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function AdminHeader() {
  const { toast } = useToast();

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "System settings functionality coming soon!",
    });
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger className="-ml-1" />
        
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
