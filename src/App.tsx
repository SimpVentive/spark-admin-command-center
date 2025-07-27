
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import Index from "./pages/Index";
import Users from "./pages/Users";
import AddEmployee from "./pages/users/AddEmployee";
import BulkEnrollment from "./pages/users/BulkEnrollment";
import Organization from "./pages/Organization";
import Hierarchy from "./pages/organization/Hierarchy";
import Locations from "./pages/organization/Locations";
import Roles from "./pages/organization/Roles";
import Programs from "./pages/Programs";
import CreateProgram from "./pages/programs/CreateProgram";
import Trainers from "./pages/programs/Trainers";
import LearningPaths from "./pages/LearningPaths";
import CreateLearningPath from "./pages/learning-paths/CreateLearningPath";
import ContentManagement from "./pages/learning-paths/ContentManagement";
import EnrollmentManagement from "./pages/learning-paths/EnrollmentManagement";
import AnalyticsDashboard from "./pages/learning-paths/AnalyticsDashboard";
import StatusTracking from "./pages/learning-paths/StatusTracking";
import Assessments from "./pages/Assessments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
                  <Route path="/organization/locations" element={<Locations />} />
                  <Route path="/organization/roles" element={<Roles />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/programs/create" element={<CreateProgram />} />
                  <Route path="/programs/trainers" element={<Trainers />} />
                  <Route path="/learning-paths" element={<LearningPaths />} />
                  <Route path="/learning-paths/create" element={<CreateLearningPath />} />
                  <Route path="/learning-paths/content" element={<ContentManagement />} />
                  <Route path="/learning-paths/enrollment" element={<EnrollmentManagement />} />
                  <Route path="/learning-paths/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/learning-paths/status" element={<StatusTracking />} />
                  <Route path="/assessments" element={<Assessments />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
