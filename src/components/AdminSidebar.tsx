
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Award,
  Calendar,
  Bell,
  Menu,
  X,
  Building2,
  GraduationCap,
  FileText,
  Video,
  DollarSign,
  Library,
  Globe,
  Lock,
  Monitor,
  ChevronDown,
  ChevronRight,
  Workflow,
  UserCog,
  CheckCircle,
  Brain,
  ShieldCheck,
  Target
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { 
    title: "Organization", 
    icon: Building2,
    subItems: [
      { title: "Departments", url: "/organization/departments" },
      { title: "Reporting Structure", url: "/organization/hierarchy" },
      { title: "Plants & Locations", url: "/organization/locations" },
      { title: "Job Roles", url: "/organization/roles" }
    ]
  },
  { 
    title: "User Management", 
    icon: Users,
    subItems: [
      { title: "All Users", url: "/users" },
      { title: "Add Employee", url: "/users/add" },
      { title: "Bulk Enrollment", url: "/users/bulk" }
    ]
  },
  { 
    title: "Processes", 
    icon: Workflow,
    subItems: [
      { title: "Workflow Management", url: "/processes/workflow", icon: Workflow },
      { title: "User and Role Management", url: "/processes/user-roles", icon: UserCog },
      { title: "Approval Framework", url: "/processes/approval", icon: CheckCircle },
      { title: "Business Rules", url: "/processes/business-rules", icon: Brain },
      { title: "Security & Access Control", url: "/processes/security", icon: ShieldCheck }
    ]
  },
  { 
    title: "Training Needs Analysis", 
    icon: Target,
    subItems: [
      { title: "TNA Dashboard", url: "/training-needs" },
      { title: "Create TNI Cycle", url: "/training-needs/create-cycle" }
    ]
  },
  { 
    title: "Programs", 
    icon: GraduationCap,
    subItems: [
      { title: "All Programs", url: "/programs" },
      { title: "Create Program", url: "/programs/create" },
      { title: "Program Sessions", url: "/programs/sessions" },
      { title: "Trainers", url: "/programs/trainers" },
      { title: "Venues", url: "/programs/venues" }
    ]
  },
  { 
    title: "Learning Paths", 
    icon: BookOpen,
    subItems: [
      { title: "All Learning Paths", url: "/learning-paths" },
      { title: "Create Learning Path", url: "/learning-paths/create" },
      { title: "Content Management", url: "/learning-paths/content" },
      { title: "Enrollment Management", url: "/learning-paths/enrollment" },
      { title: "Analytics Dashboard", url: "/learning-paths/analytics" },
      { title: "Status Tracking", url: "/learning-paths/status" }
    ]
  },
  { 
    title: "Assessments", 
    icon: FileText,
    subItems: [
      { title: "All Assessments", url: "/assessments" },
      { title: "Create Assessment", url: "/assessments/create" },
      { title: "Question Bank", url: "/assessments/questions" },
      { title: "Results", url: "/assessments/results" }
    ]
  },
  { 
    title: "Content", 
    icon: Video,
    subItems: [
      { title: "Content Library", url: "/content" },
      { title: "Content Tools", url: "/content/tools" },
      { title: "Upload Content", url: "/content/upload" },
      { title: "Content Categories", url: "/content/categories" }
    ]
  },
  { 
    title: "ROI & Analytics", 
    icon: DollarSign,
    subItems: [
      { title: "ROI Dashboard", url: "/roi" },
      { title: "Computation Models", url: "/roi/models" },
      { title: "Cost Analysis", url: "/roi/costs" },
      { title: "Impact Reports", url: "/roi/impact" }
    ]
  },
  { 
    title: "Library", 
    icon: Library,
    subItems: [
      { title: "Resources", url: "/library" },
      { title: "Check In/Out", url: "/library/checkout" },
      { title: "Reservations", url: "/library/reservations" },
      { title: "Catalog", url: "/library/catalog" }
    ]
  },
  { 
    title: "MOOC Integration", 
    icon: Globe,
    subItems: [
      { title: "Connected Platforms", url: "/mooc" },
      { title: "Course Sync", url: "/mooc/sync" },
      { title: "Certificates", url: "/mooc/certificates" },
      { title: "Integrations", url: "/mooc/integrations" }
    ]
  },
  { 
    title: "LTI Tools", 
    icon: Monitor,
    subItems: [
      { title: "LTI Providers", url: "/lti/providers" },
      { title: "Tools", url: "/lti/tools" },
      { title: "Launches", url: "/lti/launches" },
      { title: "Grade Passback", url: "/lti/grades" }
    ]
  },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (subItems: any[]) => subItems.some(item => currentPath.startsWith(item.url));
  
  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${
      isActive 
        ? "bg-primary text-primary-foreground font-medium" 
        : "hover:bg-accent hover:text-accent-foreground"
    }`;

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">LMSAdmin</h1>
              <p className="text-xs text-muted-foreground">Skill Spark Manager</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible 
                      open={openGroups.includes(item.title)} 
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between hover:bg-accent hover:text-accent-foreground ${isGroupActive(item.subItems) ? 'bg-accent' : ''}`}
                          title={isCollapsed ? item.title : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && (
                            <div className="flex-shrink-0">
                              {openGroups.includes(item.title) ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </div>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                          {item.subItems.map(subItem => (
                            <div key={subItem.url}>
                              <NavLink 
                                to={subItem.url} 
                                end 
                                className={getNavClass}
                              >
                                <span className="text-sm">{subItem.title}</span>
                              </NavLink>
                            </div>
                          ))}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavClass}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
