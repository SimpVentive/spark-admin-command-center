import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Crosshair,
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
import { useUserRole } from "@/hooks/useUserRole";

interface NavSubItem {
  title: string;
  url: string;
  subItems?: NavSubItem[];
}

interface NavItem {
  title?: string;
  url?: string;
  icon?: any;
  subItems?: NavSubItem[];
  separator?: boolean;
  adminOnly?: boolean;
  managerOnly?: boolean;
  superAdminOnly?: boolean;
}

// Super Admin sees only global-level navigation
const superAdminNavigationItems: NavItem[] = [
  { title: "Global Dashboard", url: "/", icon: BarChart3 },
  {
    title: "Company Management",
    icon: Building2,
    url: "/super-admin/companies",
  },
  {
    title: "Platform Reports",
    icon: FileText,
    subItems: [
      { title: "Reports Center", url: "/reports" },
      { title: "Audit Trail", url: "/reports/audit" },
    ],
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    subItems: [
      { title: "System Access", url: "/security/system-access" },
      { title: "Audit Trail", url: "/security/audit-trail" },
      { title: "Security Infrastructure", url: "/security/infrastructure" },
    ],
  },
  { title: "Settings", url: "/settings", icon: Settings },
  { separator: true },
  { title: "User Documentation", url: "/user-documentation", icon: FileText },
];

// Regular admin / other roles navigation
const navigationItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Workflow Guide", url: "/workflow-guide", icon: Workflow, adminOnly: true },
  { title: "AI Recommendations", icon: Zap, url: "/ai-recommendations", adminOnly: true },
  { 
    title: "Organization", 
    icon: Building2,
    adminOnly: true,
    subItems: [
      { title: "Hierarchy Builder", url: "/organization/hierarchy" },
      { title: "Organization Chart", url: "/organization/chart" },
      { title: "Plants & Locations", url: "/organization/locations" },
      { title: "Venues", url: "/organization/venues" },
      { title: "Job Roles", url: "/organization/roles" }
    ]
  },
  { 
    title: "User Management", 
    icon: Users,
    adminOnly: true,
    subItems: [
      { title: "All Users", url: "/users" },
      { title: "Add Employee", url: "/users/add-employee" },
      { title: "Bulk Enrollment", url: "/users/bulk-enrollment" },
      { title: "Learning Profiles", url: "/users/learning-profiles" }
    ]
  },
  { 
    title: "Processes", 
    icon: Workflow,
    adminOnly: true,
    subItems: [
      { title: "Workflow Management", url: "/processes/workflows" },
      { title: "User and Role Management", url: "/processes/user-roles" },
      { title: "Approval Framework", url: "/processes/approvals" },
      { title: "Business Rules", url: "/processes/business-rules" },
      { title: "Security & Access Control", url: "/processes/security" }
    ]
  },
  { 
    title: "Training Needs Analysis", 
    icon: Target,
    adminOnly: true,
    subItems: [
      { title: "TNA Dashboard", url: "/training-needs" },
      { title: "All TNA Cycles", url: "/training-needs/cycles" },
      { title: "Create TNI Cycle", url: "/training-needs/create-cycle" }
    ]
  },
  {
    title: "Org. Training Needs",
    icon: Target,
    adminOnly: true,
    url: "/org-training-needs",
  },
  { 
    title: "Programs", 
    icon: GraduationCap,
    adminOnly: true,
    subItems: [
      { title: "All Programs", url: "/programs" },
      { title: "Program Categories", url: "/programs/categories" },
      { title: "Program Sessions", url: "/programs/sessions" },
      { title: "Events", url: "/events" },
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
    adminOnly: true,
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
    adminOnly: true,
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
    adminOnly: true,
    subItems: [
      { 
        title: "Computation Models", 
        url: "/roi/models",
        subItems: [
          { title: "Kirkpatrick Model", url: "/roi/models/kirkpatrick" },
          { title: "Phillips Model", url: "/roi/models/phillips" }
        ]
      },
      { title: "Kirkpatrick Evaluations", url: "/roi/kirkpatrick-evaluations" },
      { title: "ROI Dashboard", url: "/roi" },
      { title: "Cost Analysis", url: "/roi/costs" },
      { title: "Impact Reports", url: "/roi/impact" }
    ]
  },
  {
    title: "LASER",
    icon: Crosshair,
    adminOnly: true,
    subItems: [
      { title: "LASER Dashboard", url: "/laser" },
      { title: "KPI Configuration", url: "/laser/kpi-config" },
      { title: "Causal Maps", url: "/laser/causal-maps" },
      { title: "Performance Data", url: "/laser/performance-data" },
      { title: "Interventions", url: "/laser/interventions" },
      { title: "Impact Validation", url: "/laser/impact" },
      { title: "Data Sources", url: "/laser/data-sources" },
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
    adminOnly: true,
    subItems: [
      { title: "Platform Management", url: "/mooc" },
      { title: "Course Catalog", url: "/mooc/catalog" },
      { title: "Enrollment Management", url: "/mooc/enrollments" },
      { title: "Analytics Dashboard", url: "/mooc/analytics" },
      { title: "Budget & Licensing", url: "/mooc/budget" }
    ]
  },
  { 
    title: "LTI Tools", 
    icon: Monitor,
    adminOnly: true,
    subItems: [
      { title: "LTI Providers", url: "/lti/providers" },
      { title: "Tools", url: "/lti/tools" },
      { title: "Launches", url: "/lti/launches" },
      { title: "Grade Passback", url: "/lti/grades" }
    ]
  },
  { 
    title: "Security", 
    url: "/security", 
    icon: Shield,
    adminOnly: true,
    subItems: [
      { title: "System Access & Authentication", url: "/security/system-access" },
      { title: "Audit Trail", url: "/security/audit-trail" },
      { title: "Electronic Signature", url: "/security/electronic-signature" },
      { title: "Data Integrity & Validation", url: "/security/data-integrity" },
      { title: "User Management", url: "/security/user-management" },
      { title: "Record Management", url: "/security/record-management" },
      { title: "System Validation", url: "/security/system-validation" },
      { title: "Reporting & Compliance", url: "/security/reporting-compliance" },
      { title: "Security & Infrastructure", url: "/security/infrastructure" },
      { title: "Integration & API Security", url: "/security/integration-security" },
      { title: "Quality Management", url: "/security/quality-management" }
    ]
  },
  {
    title: "Reports",
    icon: FileText,
    adminOnly: true,
    subItems: [
      { title: "Reports Center", url: "/reports" },
      { title: "TNA Report", url: "/reports/tna" },
      { title: "Training Attendance", url: "/reports/attendance" },
      { title: "Program Report", url: "/reports/programs" },
      { title: "Budget Report", url: "/reports/budget" },
      { title: "Assessment Report", url: "/reports/assessments" },
      { title: "Kirkpatrick Report", url: "/reports/kirkpatrick" },
      { title: "Employee Profiles", url: "/reports/employee-profile" },
      { title: "LASER Report", url: "/reports/laser" },
      { title: "Audit Trail", url: "/reports/audit" },
    ]
  },
  { title: "Settings", url: "/settings", icon: Settings, adminOnly: true },
  // Separator for documentation
  { separator: true },
  { title: "User Documentation", url: "/user-documentation", icon: FileText },
];

export function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const { isAdmin, isManager, isSuperAdmin, loading } = useUserRole();

  const isActive = (path: string) => currentPath === path;
  
  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  // Super admin gets a focused global menu; regular users get the full admin menu
  const itemsToUse = isSuperAdmin ? superAdminNavigationItems : navigationItems;
  
  const filteredItems = itemsToUse.filter(item => {
    if (item.separator) return true;
    if (item.superAdminOnly && !isSuperAdmin) return false;
    if (item.adminOnly && !isAdmin) return false;
    if (item.managerOnly && !isManager) return false;
    return true;
  });

  return (
    <div className="w-64 h-screen bg-background border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSuperAdmin ? 'bg-amber-500' : 'bg-primary'}`}>
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{isSuperAdmin ? 'L-Kurve' : 'LMSAdmin'}</h1>
            <p className="text-xs text-muted-foreground">{isSuperAdmin ? 'Super Admin Console' : 'Skill Spark Manager'}</p>
          </div>
        </div>
      </div>

      {/* Navigation - simplified scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {filteredItems.map((item, index) => (
            <div key={`${item.title || 'separator'}-${index}`} className="w-full">
              {item.separator ? (
                <div className="my-4">
                  <div className="border-t border-border"></div>
                </div>
              ) : item.subItems ? (
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
                        <div key={`${subItem.url || subItem.title}-${subIndex}`}>
                          {subItem.subItems ? (
                            <div>
                              <button 
                                onClick={() => toggleGroup(`${item.title}-${subItem.title}`)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                              >
                                <span>{subItem.title}</span>
                                {openGroups.includes(`${item.title}-${subItem.title}`) ? 
                                  <ChevronDown className="w-3 h-3" /> : 
                                  <ChevronRight className="w-3 h-3" />
                                }
                              </button>
                              {openGroups.includes(`${item.title}-${subItem.title}`) && (
                                <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                                  {subItem.subItems.map((nestedItem, nestedIndex) => (
                                    <NavLink 
                                      key={`${nestedItem.url}-${nestedIndex}`}
                                      to={nestedItem.url} 
                                      className={({ isActive }) => 
                                        `flex items-center px-3 py-1 rounded-lg text-xs transition-colors ${
                                          isActive 
                                            ? "bg-primary text-primary-foreground font-medium" 
                                            : "hover:bg-accent hover:text-accent-foreground"
                                        }`
                                      }
                                    >
                                      {nestedItem.title}
                                    </NavLink>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <NavLink 
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
                          )}
                        </div>
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
