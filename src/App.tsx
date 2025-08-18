
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Programs from "./pages/Programs";
import LearningPaths from "./pages/LearningPaths";
import Organization from "./pages/Organization";
import Processes from "./pages/Processes";
import Assessments from "./pages/Assessments";
import NotFound from "./pages/NotFound";

// User pages
import AddEmployee from "./pages/users/AddEmployee";
import BulkEnrollment from "./pages/users/BulkEnrollment";

// Program pages
import CreateProgram from "./pages/programs/CreateProgram";
import CategoryManagement from "./pages/programs/CategoryManagement";
import Trainers from "./pages/programs/Trainers";

// Learning path pages
import CreateLearningPath from "./pages/learning-paths/CreateLearningPath";
import LearningPathManagement from "./pages/learning-paths/LearningPathManagement";
import LearningPathDetails from "./pages/learning-paths/LearningPathDetails";
import ContentManagement from "./pages/learning-paths/ContentManagement";
import EnrollmentManagement from "./pages/learning-paths/EnrollmentManagement";
import StatusTracking from "./pages/learning-paths/StatusTracking";
import AnalyticsDashboard from "./pages/learning-paths/AnalyticsDashboard";

// Organization pages
import OrganizationChart from "./pages/organization/OrganizationChart";
import Departments from "./pages/organization/Departments";
import Roles from "./pages/organization/Roles";
import Hierarchy from "./pages/organization/Hierarchy";
import Locations from "./pages/organization/Locations";

// Process pages
import WorkflowManagement from "./pages/processes/WorkflowManagement";
import ApprovalFramework from "./pages/processes/ApprovalFramework";
import UserRoleManagement from "./pages/processes/UserRoleManagement";
import SecurityAccessControl from "./pages/processes/SecurityAccessControl";
import BusinessRules from "./pages/processes/BusinessRules";

// Content Library pages
import ContentLibrary from "./pages/content/ContentLibrary";
import UploadContent from "./pages/content/UploadContent";
import ContentCategories from "./pages/content/ContentCategories";
import ContentTools from "./pages/content/ContentTools";

// Library pages
import Catalog from "./pages/library/Catalog";
import Resources from "./pages/library/Resources";
import CheckInOut from "./pages/library/CheckInOut";
import Reservations from "./pages/library/Reservations";

// Training Needs pages
import TNADashboard from "./pages/training-needs/TNADashboard";
import CreateCycle from "./pages/training-needs/CreateCycle";
import EmployeeTNI from "./pages/training-needs/EmployeeTNI";
import ManagerApproval from "./pages/training-needs/ManagerApproval";
import ProgramManagement from "./pages/training-needs/ProgramManagement";
import Analytics from "./pages/training-needs/Analytics";
import EnhancedEmployeeTNI from "./pages/training-needs/EnhancedEmployeeTNI";
import EnhancedManagerApproval from "./pages/training-needs/EnhancedManagerApproval";

// Auth pages
import Auth from "./pages/auth/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/add-employee" element={<AddEmployee />} />
                <Route path="/users/bulk-enrollment" element={<BulkEnrollment />} />
                
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/create" element={<CreateProgram />} />
                <Route path="/programs/categories" element={<CategoryManagement />} />
                <Route path="/programs/trainers" element={<Trainers />} />
                
                <Route path="/learning-paths" element={<LearningPaths />} />
                <Route path="/learning-paths/create" element={<CreateLearningPath />} />
                <Route path="/learning-paths/management" element={<LearningPathManagement />} />
                <Route path="/learning-paths/details/:id" element={<LearningPathDetails />} />
                <Route path="/learning-paths/content" element={<ContentManagement />} />
                <Route path="/learning-paths/enrollment" element={<EnrollmentManagement />} />
                <Route path="/learning-paths/status" element={<StatusTracking />} />
                <Route path="/learning-paths/analytics" element={<AnalyticsDashboard />} />
                
                <Route path="/organization" element={<Organization />} />
                <Route path="/organization/chart" element={<OrganizationChart />} />
                <Route path="/organization/departments" element={<Departments />} />
                <Route path="/organization/roles" element={<Roles />} />
                <Route path="/organization/hierarchy" element={<Hierarchy />} />
                <Route path="/organization/locations" element={<Locations />} />
                
                <Route path="/processes" element={<Processes />} />
                <Route path="/processes/workflows" element={<WorkflowManagement />} />
                <Route path="/processes/approvals" element={<ApprovalFramework />} />
                <Route path="/processes/user-roles" element={<UserRoleManagement />} />
                <Route path="/processes/security" element={<SecurityAccessControl />} />
                <Route path="/processes/business-rules" element={<BusinessRules />} />
                
                <Route path="/content" element={<ContentLibrary />} />
                <Route path="/content/upload" element={<UploadContent />} />
                <Route path="/content/categories" element={<ContentCategories />} />
                <Route path="/content/tools" element={<ContentTools />} />
                
                <Route path="/library" element={<Catalog />} />
                <Route path="/library/catalog" element={<Catalog />} />
                <Route path="/library/resources" element={<Resources />} />
                <Route path="/library/check-in-out" element={<CheckInOut />} />
                <Route path="/library/reservations" element={<Reservations />} />
                
                <Route path="/training-needs" element={<TNADashboard />} />
                <Route path="/training-needs/create-cycle" element={<CreateCycle />} />
                <Route path="/training-needs/employee-tni" element={<EmployeeTNI />} />
                <Route path="/training-needs/enhanced-employee-tni" element={<EnhancedEmployeeTNI />} />
                <Route path="/training-needs/manager-approval" element={<ManagerApproval />} />
                <Route path="/training-needs/enhanced-manager-approval" element={<EnhancedManagerApproval />} />
                <Route path="/training-needs/program-management" element={<ProgramManagement />} />
                <Route path="/training-needs/analytics" element={<Analytics />} />
                
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
