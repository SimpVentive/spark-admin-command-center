
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Programs from "./pages/Programs";
import LearningPaths from "./pages/LearningPaths";
import Organization from "./pages/Organization";
import Processes from "./pages/Processes";
import Assessments from "./pages/Assessments";
import CreateAssessment from "./pages/assessments/CreateAssessment";
import QuestionBank from "./pages/assessments/QuestionBank";
import AssessmentResults from "./pages/assessments/AssessmentResults";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// LTI pages
import LTIProviders from "./pages/lti/LTIProviders";
import LTITools from "./pages/lti/LTITools";
import LTILaunches from "./pages/lti/LTILaunches";
import GradePassback from "./pages/lti/GradePassback";

// User pages
import AddEmployee from "./pages/users/AddEmployee";
import EditEmployee from "./pages/users/EditEmployee";
import BulkEnrollment from "./pages/users/BulkEnrollment";
import EmployeeLearningProfiles from "./pages/users/EmployeeLearningProfiles";

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
import TNACycleList from "./pages/training-needs/TNACycleList";
import TNACycleDetail from "./pages/training-needs/TNACycleDetail";
import ManagerTNIDashboard from "./pages/training-needs/ManagerTNIDashboard";

// Auth pages
import Auth from "./pages/auth/Auth";
import ResetPassword from "./pages/auth/ResetPassword";

// AI pages
import AIRecommendationsPage from "./pages/AIRecommendations";

// Workflow Guide
import WorkflowGuide from "./pages/WorkflowGuide";
import UserDocumentation from "./pages/UserDocumentation";

// MOOC Integration
import MOOC from "./pages/MOOC";
import CourseCatalog from "./pages/mooc/CourseCatalog";
import MOOCEnrollmentManagement from "./pages/mooc/EnrollmentManagement";
import MOOCAnalytics from "./pages/mooc/MOOCAnalytics";
import BudgetLicensing from "./pages/mooc/BudgetLicensing";

// ROI pages
import ComputationModels from "./pages/roi/ComputationModels";
import KirkpatrickModel from "./pages/roi/KirkpatrickModel";
import PhillipsModel from "./pages/roi/PhillipsModel";
import KirkpatrickEvaluations from "./pages/roi/KirkpatrickEvaluations";
import ROIDashboard from "./pages/roi/ROIDashboard";
import CostAnalysis from "./pages/roi/CostAnalysis";
import ImpactReports from "./pages/roi/ImpactReports";

// Program Sessions
import ProgramSessions from "./pages/programs/ProgramSessions";

// Settings and Security pages
import Security from "./pages/Security";
import Settings from "./pages/Settings";

// Security subpages
import SystemAccess from "./pages/security/SystemAccess";
import AuditTrail from "./pages/security/AuditTrail";
import ElectronicSignature from "./pages/security/ElectronicSignature";
import DataIntegrity from "./pages/security/DataIntegrity";
import UserManagement from "./pages/security/UserManagement";
import RecordManagement from "./pages/security/RecordManagement";
import SystemValidation from "./pages/security/SystemValidation";
import ReportingCompliance from "./pages/security/ReportingCompliance";
import SecurityInfrastructure from "./pages/security/SecurityInfrastructure";
import IntegrationSecurity from "./pages/security/IntegrationSecurity";
import QualityManagement from "./pages/security/QualityManagement";

// System Validation subpages
import SVConfigurationManagement from "./pages/security/system-validation/ConfigurationManagement";
import SVChangeControl from "./pages/security/system-validation/ChangeControl";
import SVTestExecution from "./pages/security/system-validation/TestExecution";
import SVPerformanceMonitoring from "./pages/security/system-validation/PerformanceMonitoring";
import SVEnvironmentManagement from "./pages/security/system-validation/EnvironmentManagement";
import SVValidationDocumentation from "./pages/security/system-validation/ValidationDocumentation";

const queryClient = new QueryClient();

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen w-full">
    <AdminSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminHeader />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LibraryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes without layout */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={<ProtectedRoute><AuthenticatedLayout><Index /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/workflow-guide" element={<ProtectedRoute><AuthenticatedLayout><WorkflowGuide /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/user-documentation" element={<ProtectedRoute><AuthenticatedLayout><UserDocumentation /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* User Management */}
              <Route path="/users" element={<ProtectedRoute><AuthenticatedLayout><Users /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/add" element={<ProtectedRoute><AuthenticatedLayout><AddEmployee /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/add-employee" element={<ProtectedRoute><AuthenticatedLayout><AddEmployee /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/bulk" element={<ProtectedRoute><AuthenticatedLayout><BulkEnrollment /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/bulk-enrollment" element={<ProtectedRoute><AuthenticatedLayout><BulkEnrollment /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/edit/:id" element={<ProtectedRoute><AuthenticatedLayout><EditEmployee /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/learning-profile/:id" element={<ProtectedRoute><AuthenticatedLayout><EmployeeLearningProfiles /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/users/learning-profiles" element={<ProtectedRoute><AuthenticatedLayout><EmployeeLearningProfiles /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Programs */}
              <Route path="/programs" element={<ProtectedRoute><AuthenticatedLayout><Programs /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/programs/create" element={<ProtectedRoute><AuthenticatedLayout><CreateProgram /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/programs/categories" element={<ProtectedRoute><AuthenticatedLayout><CategoryManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/programs/trainers" element={<ProtectedRoute><AuthenticatedLayout><Trainers /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/programs/sessions" element={<ProtectedRoute><AuthenticatedLayout><ProgramSessions /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Learning Paths */}
              <Route path="/learning-paths" element={<ProtectedRoute><AuthenticatedLayout><LearningPaths /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/create" element={<ProtectedRoute><AuthenticatedLayout><CreateLearningPath /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/management" element={<ProtectedRoute><AuthenticatedLayout><LearningPathManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/details/:id" element={<ProtectedRoute><AuthenticatedLayout><LearningPathDetails /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/content" element={<ProtectedRoute><AuthenticatedLayout><ContentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/enrollment" element={<ProtectedRoute><AuthenticatedLayout><EnrollmentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/status" element={<ProtectedRoute><AuthenticatedLayout><StatusTracking /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/analytics" element={<ProtectedRoute><AuthenticatedLayout><AnalyticsDashboard /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Organization */}
              <Route path="/organization" element={<ProtectedRoute><AuthenticatedLayout><Organization /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/organization/chart" element={<ProtectedRoute><AuthenticatedLayout><OrganizationChart /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/organization/departments" element={<ProtectedRoute><AuthenticatedLayout><Departments /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/organization/roles" element={<ProtectedRoute><AuthenticatedLayout><Roles /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/organization/hierarchy" element={<ProtectedRoute><AuthenticatedLayout><Hierarchy /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/organization/locations" element={<ProtectedRoute><AuthenticatedLayout><Locations /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Processes */}
              <Route path="/processes" element={<ProtectedRoute><AuthenticatedLayout><Processes /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/workflow" element={<ProtectedRoute><AuthenticatedLayout><WorkflowManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/workflows" element={<ProtectedRoute><AuthenticatedLayout><WorkflowManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/approval" element={<ProtectedRoute><AuthenticatedLayout><ApprovalFramework /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/approvals" element={<ProtectedRoute><AuthenticatedLayout><ApprovalFramework /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/user-roles" element={<ProtectedRoute><AuthenticatedLayout><UserRoleManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/security" element={<ProtectedRoute><AuthenticatedLayout><SecurityAccessControl /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/processes/business-rules" element={<ProtectedRoute><AuthenticatedLayout><BusinessRules /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Content */}
              <Route path="/content" element={<ProtectedRoute><AuthenticatedLayout><ContentLibrary /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/content/upload" element={<ProtectedRoute><AuthenticatedLayout><UploadContent /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/content/categories" element={<ProtectedRoute><AuthenticatedLayout><ContentCategories /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/content/tools" element={<ProtectedRoute><AuthenticatedLayout><ContentTools /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Library */}
              <Route path="/library" element={<ProtectedRoute><AuthenticatedLayout><Catalog /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/catalog" element={<ProtectedRoute><AuthenticatedLayout><Catalog /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/resources" element={<ProtectedRoute><AuthenticatedLayout><Resources /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/check-in-out" element={<ProtectedRoute><AuthenticatedLayout><CheckInOut /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/reservations" element={<ProtectedRoute><AuthenticatedLayout><Reservations /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Training Needs */}
              <Route path="/training-needs" element={<ProtectedRoute><AuthenticatedLayout><TNADashboard /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/cycles" element={<ProtectedRoute><AuthenticatedLayout><TNACycleList /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/cycles/:id" element={<ProtectedRoute><AuthenticatedLayout><TNACycleDetail /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/create-cycle" element={<ProtectedRoute><AuthenticatedLayout><CreateCycle /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/employee-tni" element={<ProtectedRoute><AuthenticatedLayout><EmployeeTNI /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/enhanced-employee-tni" element={<ProtectedRoute><AuthenticatedLayout><EnhancedEmployeeTNI /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/manager-approval" element={<ProtectedRoute><AuthenticatedLayout><ManagerApproval /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/enhanced-manager-approval" element={<ProtectedRoute><AuthenticatedLayout><EnhancedManagerApproval /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/program-management" element={<ProtectedRoute><AuthenticatedLayout><ProgramManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/analytics" element={<ProtectedRoute><AuthenticatedLayout><Analytics /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/manager-dashboard" element={<ProtectedRoute><AuthenticatedLayout><ManagerTNIDashboard /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Assessments */}
              <Route path="/assessments" element={<ProtectedRoute><AuthenticatedLayout><Assessments /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/assessments/create" element={<ProtectedRoute><AuthenticatedLayout><CreateAssessment /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/assessments/questions" element={<ProtectedRoute><AuthenticatedLayout><QuestionBank /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/assessments/results" element={<ProtectedRoute><AuthenticatedLayout><AssessmentResults /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* AI & MOOC */}
              <Route path="/ai-recommendations" element={<ProtectedRoute><AuthenticatedLayout><AIRecommendationsPage /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/mooc" element={<ProtectedRoute><AuthenticatedLayout><MOOC /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/mooc/catalog" element={<ProtectedRoute><AuthenticatedLayout><CourseCatalog /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/mooc/enrollments" element={<ProtectedRoute><AuthenticatedLayout><MOOCEnrollmentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/mooc/analytics" element={<ProtectedRoute><AuthenticatedLayout><MOOCAnalytics /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/mooc/budget" element={<ProtectedRoute><AuthenticatedLayout><BudgetLicensing /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* LTI Routes */}
              <Route path="/lti/providers" element={<ProtectedRoute><AuthenticatedLayout><LTIProviders /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/lti/tools" element={<ProtectedRoute><AuthenticatedLayout><LTITools /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/lti/launches" element={<ProtectedRoute><AuthenticatedLayout><LTILaunches /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/lti/grades" element={<ProtectedRoute><AuthenticatedLayout><GradePassback /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* ROI Routes */}
              <Route path="/roi/models" element={<ProtectedRoute><AuthenticatedLayout><ComputationModels /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi/models/kirkpatrick" element={<ProtectedRoute><AuthenticatedLayout><KirkpatrickModel /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi/models/phillips" element={<ProtectedRoute><AuthenticatedLayout><PhillipsModel /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi/kirkpatrick-evaluations" element={<ProtectedRoute><AuthenticatedLayout><KirkpatrickEvaluations /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi" element={<ProtectedRoute><AuthenticatedLayout><ROIDashboard /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi/costs" element={<ProtectedRoute><AuthenticatedLayout><CostAnalysis /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/roi/impact" element={<ProtectedRoute><AuthenticatedLayout><ImpactReports /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Security */}
              <Route path="/security" element={<ProtectedRoute><AuthenticatedLayout><Security /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-access" element={<ProtectedRoute><AuthenticatedLayout><SystemAccess /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/audit-trail" element={<ProtectedRoute><AuthenticatedLayout><AuditTrail /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/electronic-signature" element={<ProtectedRoute><AuthenticatedLayout><ElectronicSignature /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/data-integrity" element={<ProtectedRoute><AuthenticatedLayout><DataIntegrity /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/user-management" element={<ProtectedRoute><AuthenticatedLayout><UserManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/record-management" element={<ProtectedRoute><AuthenticatedLayout><RecordManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation" element={<ProtectedRoute><AuthenticatedLayout><SystemValidation /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/cmdb" element={<ProtectedRoute><AuthenticatedLayout><SVConfigurationManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/change-control" element={<ProtectedRoute><AuthenticatedLayout><SVChangeControl /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/test-execution" element={<ProtectedRoute><AuthenticatedLayout><SVTestExecution /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/performance" element={<ProtectedRoute><AuthenticatedLayout><SVPerformanceMonitoring /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/environments" element={<ProtectedRoute><AuthenticatedLayout><SVEnvironmentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/system-validation/documentation" element={<ProtectedRoute><AuthenticatedLayout><SVValidationDocumentation /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/reporting-compliance" element={<ProtectedRoute><AuthenticatedLayout><ReportingCompliance /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/infrastructure" element={<ProtectedRoute><AuthenticatedLayout><SecurityInfrastructure /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/integration-security" element={<ProtectedRoute><AuthenticatedLayout><IntegrationSecurity /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/security/quality-management" element={<ProtectedRoute><AuthenticatedLayout><QualityManagement /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Settings */}
              <Route path="/settings" element={<ProtectedRoute><AuthenticatedLayout><Settings /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LibraryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
