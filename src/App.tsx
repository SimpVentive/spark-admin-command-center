
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LibraryProvider } from "@/contexts/LibraryContext";
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

// LTI pages
import LTIProviders from "./pages/lti/LTIProviders";
import LTITools from "./pages/lti/LTITools";
import LTILaunches from "./pages/lti/LTILaunches";
import GradePassback from "./pages/lti/GradePassback";

// User pages
import AddEmployee from "./pages/users/AddEmployee";
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

// Auth pages
import Auth from "./pages/auth/Auth";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LibraryProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen w-full">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminHeader />
              <main className="flex-1 overflow-auto p-6">
                <Routes>
                  <Route path="/" element={<Index />} />
          <Route path="/workflow-guide" element={<WorkflowGuide />} />
          <Route path="/user-documentation" element={<UserDocumentation />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/add-employee" element={<AddEmployee />} />
                  <Route path="/users/bulk-enrollment" element={<BulkEnrollment />} />
                  <Route path="/users/learning-profiles" element={<EmployeeLearningProfiles />} />
                  
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
                  <Route path="/assessments/create" element={<CreateAssessment />} />
                  <Route path="/assessments/questions" element={<QuestionBank />} />
                  <Route path="/assessments/results" element={<AssessmentResults />} />
                  <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                  <Route path="/mooc" element={<MOOC />} />
                  <Route path="/mooc/catalog" element={<CourseCatalog />} />
                  <Route path="/mooc/enrollments" element={<MOOCEnrollmentManagement />} />
                  <Route path="/mooc/analytics" element={<MOOCAnalytics />} />
                  <Route path="/mooc/budget" element={<BudgetLicensing />} />
                  
                  {/* LTI Routes */}
                  <Route path="/lti/providers" element={<LTIProviders />} />
                  <Route path="/lti/tools" element={<LTITools />} />
                  <Route path="/lti/launches" element={<LTILaunches />} />
                  <Route path="/lti/grades" element={<GradePassback />} />
                  
                  {/* ROI Routes */}
                  <Route path="/roi/models" element={<ComputationModels />} />
                  <Route path="/roi/models/kirkpatrick" element={<KirkpatrickModel />} />
                  <Route path="/roi/models/phillips" element={<PhillipsModel />} />
                  <Route path="/roi/kirkpatrick-evaluations" element={<KirkpatrickEvaluations />} />
                  
                  <Route path="/security" element={<Security />} />
                  <Route path="/security/system-access" element={<SystemAccess />} />
                  <Route path="/security/audit-trail" element={<AuditTrail />} />
                  <Route path="/security/electronic-signature" element={<ElectronicSignature />} />
                  <Route path="/security/data-integrity" element={<DataIntegrity />} />
                  <Route path="/security/user-management" element={<UserManagement />} />
                  <Route path="/security/record-management" element={<RecordManagement />} />
                  <Route path="/security/system-validation" element={<SystemValidation />} />
                  <Route path="/security/reporting-compliance" element={<ReportingCompliance />} />
                  <Route path="/security/infrastructure" element={<SecurityInfrastructure />} />
                  <Route path="/security/integration-security" element={<IntegrationSecurity />} />
                  <Route path="/security/quality-management" element={<QualityManagement />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </LibraryProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
