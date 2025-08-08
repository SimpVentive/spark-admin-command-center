
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { LibraryProvider } from "@/contexts/LibraryContext";
import Index from "./pages/Index";
import Users from "./pages/Users";
import AddEmployee from "./pages/users/AddEmployee";
import BulkEnrollment from "./pages/users/BulkEnrollment";
import Organization from "./pages/Organization";
import Hierarchy from "./pages/organization/Hierarchy";
import OrganizationChart from "./pages/organization/OrganizationChart";
import Locations from "./pages/organization/Locations";
import Roles from "./pages/organization/Roles";
import Programs from "./pages/Programs";
import CreateProgram from "./pages/programs/CreateProgram";
import Trainers from "./pages/programs/Trainers";
import CategoryManagement from "./pages/programs/CategoryManagement";
import LearningPaths from "./pages/LearningPaths";
import CreateLearningPath from "./pages/learning-paths/CreateLearningPath";
import ContentManagement from "./pages/learning-paths/ContentManagement";
import EnrollmentManagement from "./pages/learning-paths/EnrollmentManagement";
import AnalyticsDashboard from "./pages/learning-paths/AnalyticsDashboard";
import StatusTracking from "./pages/learning-paths/StatusTracking";
import LearningPathDetails from "./pages/learning-paths/LearningPathDetails";
import LearningPathManagement from "./pages/learning-paths/LearningPathManagement";
import Assessments from "./pages/Assessments";
import Processes from "./pages/Processes";
import WorkflowManagement from "./pages/processes/WorkflowManagement";
import UserRoleManagement from "./pages/processes/UserRoleManagement";
import ApprovalFramework from "./pages/processes/ApprovalFramework";
import BusinessRules from "./pages/processes/BusinessRules";
import SecurityAccessControl from "./pages/processes/SecurityAccessControl";
import EmployeeTNI from "./pages/training-needs/EmployeeTNI";
import CreateCycle from "./pages/training-needs/CreateCycle";
import TNADashboard from "./pages/training-needs/TNADashboard";
import ProgramManagement from "./pages/training-needs/ProgramManagement";
import ManagerApproval from "./pages/training-needs/ManagerApproval";
import Resources from "./pages/library/Resources";
import Catalog from "./pages/library/Catalog";
import CheckInOut from "./pages/library/CheckInOut";
import Reservations from "./pages/library/Reservations";
import NotFound from "./pages/NotFound";
import ContentLibrary from "./pages/content/ContentLibrary";
import ContentTools from "./pages/content/ContentTools";
import UploadContent from "./pages/content/UploadContent";
import ContentCategories from "./pages/content/ContentCategories";

const queryClient = new QueryClient();

// Force rebuild to clear cache

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LibraryProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AdminSidebar />
              <div className="flex-1 flex flex-col">
                <AdminHeader />
                <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add" element={<AddEmployee />} />
                  <Route path="/users/bulk" element={<BulkEnrollment />} />
                   <Route path="/organization/departments" element={<Organization />} />
                   <Route path="/organization/hierarchy" element={<Hierarchy />} />
                   <Route path="/organization/chart" element={<OrganizationChart />} />
                   <Route path="/organization/locations" element={<Locations />} />
                   <Route path="/organization/roles" element={<Roles />} />
                  <Route path="/programs" element={<Programs />} />
          <Route path="/programs/create" element={<CreateProgram />} />
          <Route path="/programs/trainers" element={<Trainers />} />
          <Route path="/programs/categories" element={<CategoryManagement />} />
                  <Route path="/learning-paths" element={<LearningPaths />} />
                  <Route path="/learning-paths/create" element={<CreateLearningPath />} />
                  <Route path="/learning-paths/content" element={<ContentManagement />} />
          <Route path="/learning-paths/enrollment" element={<EnrollmentManagement />} />
          <Route path="/learning-paths/analytics" element={<AnalyticsDashboard />} />
          <Route path="/learning-paths/status" element={<StatusTracking />} />
          <Route path="/learning-paths/:id/details" element={<LearningPathDetails />} />
          <Route path="/learning-paths/:id/manage" element={<LearningPathManagement />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/processes" element={<Processes />} />
          <Route path="/processes/workflow" element={<WorkflowManagement />} />
          <Route path="/processes/user-roles" element={<UserRoleManagement />} />
          <Route path="/processes/approval" element={<ApprovalFramework />} />
          <Route path="/processes/business-rules" element={<BusinessRules />} />
          <Route path="/processes/security" element={<SecurityAccessControl />} />
        <Route path="/training-needs" element={<TNADashboard />} />
        <Route path="/training-needs/create-cycle" element={<CreateCycle />} />
        <Route path="/training-needs/employee-tni" element={<EmployeeTNI />} />
        <Route path="/training-needs/manager-approval" element={<ManagerApproval />} />
        <Route path="/training-needs/analytics" element={<TNADashboard />} />
        <Route path="/library" element={<Resources />} />
        <Route path="/library/catalog" element={<Catalog />} />
        <Route path="/library/checkout" element={<CheckInOut />} />
        <Route path="/library/reservations" element={<Reservations />} />
        <Route path="/content" element={<ContentLibrary />} />
        <Route path="/content/tools" element={<ContentTools />} />
        <Route path="/content/upload" element={<UploadContent />} />
        <Route path="/content/categories" element={<ContentCategories />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
        </LibraryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
