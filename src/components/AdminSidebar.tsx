import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Building2,
  GraduationCap,
  FileText,
  Video,
  DollarSign,
  Library,
  Globe,
  Monitor,
  ChevronDown,
  ChevronRight,
  Workflow,
  Target,
  Zap
} from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Workflow Guide", url: "/workflow-guide", icon: Workflow },
  { title: "User Documentation", url: "/user-documentation", icon: FileText },
  { title: "AI Recommendations", icon: Zap, url: "/ai-recommendations" },
  { 
    title: "Organization", 
    icon: Building2,
    subItems: [
      { title: "Hierarchy Builder", url: "/organization/hierarchy" },
      { title: "Organization Chart", url: "/organization/chart" },
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
      { title: "Bulk Enrollment", url: "/users/bulk" },
      { title: "Learning Profiles", url: "/users/learning-profiles" }
    ]
  },
  { 
    title: "Processes", 
    icon: Workflow,
    subItems: [
      { title: "Workflow Management", url: "/processes/workflow" },
      { title: "User and Role Management", url: "/processes/user-roles" },
      { title: "Approval Framework", url: "/processes/approval" },
      { title: "Business Rules", url: "/processes/business-rules" },
      { title: "Security & Access Control", url: "/processes/security" }
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
      { title: "Trainers", url: "/programs/trainers" }
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
      { title: "Check In/Out", url: "/library/check-in-out" },
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
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (path: string) => currentPath === path;
  
  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="w-64 h-screen bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">LMSAdmin</h1>
            <p className="text-xs text-muted-foreground">Skill Spark Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation - simplified scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {navigationItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="w-full">
              {item.subItems ? (
                <div>
                  <button 
                    onClick={() => toggleGroup(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {openGroups.includes(item.title) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  {openGroups.includes(item.title) && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                      {item.subItems.map((subItem, subIndex) => (
                        <NavLink 
                          key={`${subItem.url}-${subIndex}`}
                          to={subItem.url} 
                          className={({ isActive }) => 
                            `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive 
                                ? "bg-primary text-primary-foreground font-medium" 
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`
                          }
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.url ? (
                <NavLink 
                  to={item.url} 
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </NavLink>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;