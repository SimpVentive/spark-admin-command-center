
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import RoleHome from "@/components/RoleHome";
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
import Venues from "./pages/organization/Venues";

// Event pages
import EventsList from "./pages/events/EventsList";
import EventDetail from "./pages/events/EventDetail";

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
import OrgTrainingNeeds from "./pages/training-needs/OrgTrainingNeeds";

// Auth pages
import Auth from "./pages/auth/Auth";
import ResetPassword from "./pages/auth/ResetPassword";

// AI pages
import AIRecommendationsPage from "./pages/AIRecommendations";

// Workflow Guide
import WorkflowGuide from "./pages/WorkflowGuide";
import UserDocumentation from "./pages/UserDocumentation";

// Super Admin
import CompanyManagement from "./pages/super-admin/CompanyManagement";
import AIReportBuilder from "./pages/super-admin/AIReportBuilder";

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

// LASER pages
import LaserDashboard from "./pages/laser/LaserDashboard";
import KpiConfiguration from "./pages/laser/KpiConfiguration";
import CausalMaps from "./pages/laser/CausalMaps";
import PerformanceData from "./pages/laser/PerformanceData";
import LaserInterventions from "./pages/laser/Interventions";
import ImpactValidation from "./pages/laser/ImpactValidation";
import DataSources from "./pages/laser/DataSources";

// Reports pages
import ReportsHub from "./pages/reports/ReportsHub";
import TNAReport from "./pages/reports/TNAReport";
import AttendanceReport from "./pages/reports/AttendanceReport";
import ProgramReport from "./pages/reports/ProgramReport";
import BudgetReport from "./pages/reports/BudgetReport";
import AssessmentReport from "./pages/reports/AssessmentReport";
import KirkpatrickReport from "./pages/reports/KirkpatrickReport";
import EmployeeProfileReport from "./pages/reports/EmployeeProfileReport";
import LaserReport from "./pages/reports/LaserReport";
import AuditReport from "./pages/reports/AuditReport";
import ReportBuilder from "./pages/reports/ReportBuilder";

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
        <UserRoleProvider>
        <CompanyProvider>
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
              <Route path="/" element={<ProtectedRoute><AuthenticatedLayout><RoleHome /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/super-admin" element={<ProtectedRoute><SuperAdminRoute><Navigate to="/super-admin/companies" replace /></SuperAdminRoute></ProtectedRoute>} />
              <Route path="/workflow-guide" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><WorkflowGuide /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/user-documentation" element={<ProtectedRoute><AuthenticatedLayout><UserDocumentation /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Super Admin */}
              <Route path="/super-admin/companies" element={<ProtectedRoute><SuperAdminRoute><AuthenticatedLayout><CompanyManagement /></AuthenticatedLayout></SuperAdminRoute></ProtectedRoute>} />
              <Route path="/super-admin/report-builder" element={<ProtectedRoute><SuperAdminRoute><AuthenticatedLayout><AIReportBuilder /></AuthenticatedLayout></SuperAdminRoute></ProtectedRoute>} />
              
              {/* User Management - Admin Only */}
              <Route path="/users" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Users /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/add" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AddEmployee /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/add-employee" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AddEmployee /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/bulk" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><BulkEnrollment /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/bulk-enrollment" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><BulkEnrollment /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/edit/:id" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EditEmployee /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/learning-profile/:id" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EmployeeLearningProfiles /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/users/learning-profiles" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EmployeeLearningProfiles /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Programs - Admin Only */}
              <Route path="/programs" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Programs /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/programs/create" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CreateProgram /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/programs/categories" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CategoryManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/programs/trainers" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Trainers /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/programs/sessions" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ProgramSessions /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Learning Paths */}
              <Route path="/learning-paths" element={<ProtectedRoute><AuthenticatedLayout><LearningPaths /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/create" element={<ProtectedRoute><AuthenticatedLayout><CreateLearningPath /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/management" element={<ProtectedRoute><AuthenticatedLayout><LearningPathManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/details/:id" element={<ProtectedRoute><AuthenticatedLayout><LearningPathDetails /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/content" element={<ProtectedRoute><AuthenticatedLayout><ContentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/enrollment" element={<ProtectedRoute><AuthenticatedLayout><EnrollmentManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/status" element={<ProtectedRoute><AuthenticatedLayout><StatusTracking /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/learning-paths/analytics" element={<ProtectedRoute><AuthenticatedLayout><AnalyticsDashboard /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Organization - Admin Only */}
              <Route path="/organization" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Organization /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/chart" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><OrganizationChart /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/departments" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Departments /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/roles" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Roles /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/hierarchy" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Hierarchy /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/locations" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Locations /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/organization/venues" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Venues /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Events */}
              <Route path="/events" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EventsList /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/events/:id" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EventDetail /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Processes - Admin Only */}
              <Route path="/processes" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Processes /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/workflow" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><WorkflowManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/workflows" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><WorkflowManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/approval" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ApprovalFramework /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/approvals" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ApprovalFramework /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/user-roles" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><UserRoleManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/security" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SecurityAccessControl /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/processes/business-rules" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><BusinessRules /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Content - Admin Only */}
              <Route path="/content" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ContentLibrary /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/content/upload" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><UploadContent /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/content/categories" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ContentCategories /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/content/tools" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ContentTools /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Library */}
              <Route path="/library" element={<ProtectedRoute><AuthenticatedLayout><Catalog /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/catalog" element={<ProtectedRoute><AuthenticatedLayout><Catalog /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/resources" element={<ProtectedRoute><AuthenticatedLayout><Resources /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/check-in-out" element={<ProtectedRoute><AuthenticatedLayout><CheckInOut /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/library/reservations" element={<ProtectedRoute><AuthenticatedLayout><Reservations /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Training Needs */}
              <Route path="/training-needs" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><TNADashboard /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/training-needs/cycles" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><TNACycleList /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/training-needs/cycles/:id" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><TNACycleDetail /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/training-needs/create-cycle" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CreateCycle /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/training-needs/employee-tni" element={<ProtectedRoute><AuthenticatedLayout><EmployeeTNI /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/enhanced-employee-tni" element={<ProtectedRoute><AuthenticatedLayout><EnhancedEmployeeTNI /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/manager-approval" element={<ProtectedRoute><AuthenticatedLayout><ManagerApproval /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/enhanced-manager-approval" element={<ProtectedRoute><AuthenticatedLayout><EnhancedManagerApproval /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/program-management" element={<ProtectedRoute><AuthenticatedLayout><ProgramManagement /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/analytics" element={<ProtectedRoute><AuthenticatedLayout><Analytics /></AuthenticatedLayout></ProtectedRoute>} />
              <Route path="/training-needs/manager-dashboard" element={<ProtectedRoute><AuthenticatedLayout><ManagerTNIDashboard /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Org Training Needs - Admin */}
              <Route path="/org-training-needs" element={<ProtectedRoute><AuthenticatedLayout><OrgTrainingNeeds /></AuthenticatedLayout></ProtectedRoute>} />
              
              {/* Assessments - Admin Only */}
              <Route path="/assessments" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Assessments /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/assessments/create" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CreateAssessment /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/assessments/questions" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><QuestionBank /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/assessments/results" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AssessmentResults /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* AI & MOOC - Admin Only */}
              <Route path="/ai-recommendations" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AIRecommendationsPage /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/mooc" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><MOOC /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/mooc/catalog" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CourseCatalog /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/mooc/enrollments" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><MOOCEnrollmentManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/mooc/analytics" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><MOOCAnalytics /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/mooc/budget" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><BudgetLicensing /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* LTI Routes - Admin Only */}
              <Route path="/lti/providers" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LTIProviders /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/lti/tools" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LTITools /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/lti/launches" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LTILaunches /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/lti/grades" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><GradePassback /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* ROI Routes - Admin Only */}
              <Route path="/roi/models" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ComputationModels /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi/models/kirkpatrick" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><KirkpatrickModel /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi/models/phillips" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><PhillipsModel /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi/kirkpatrick-evaluations" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><KirkpatrickEvaluations /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ROIDashboard /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi/costs" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CostAnalysis /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/roi/impact" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ImpactReports /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Security - Admin Only */}
              <Route path="/security" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Security /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-access" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SystemAccess /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/audit-trail" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AuditTrail /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/electronic-signature" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ElectronicSignature /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/data-integrity" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><DataIntegrity /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/user-management" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><UserManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/record-management" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><RecordManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SystemValidation /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/cmdb" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVConfigurationManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/change-control" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVChangeControl /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/test-execution" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVTestExecution /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/performance" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVPerformanceMonitoring /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/environments" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVEnvironmentManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/system-validation/documentation" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SVValidationDocumentation /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/reporting-compliance" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ReportingCompliance /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/infrastructure" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><SecurityInfrastructure /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/integration-security" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><IntegrationSecurity /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/security/quality-management" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><QualityManagement /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Reports - Admin Only */}
              <Route path="/reports" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ReportsHub /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/tna" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><TNAReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/attendance" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AttendanceReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/programs" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ProgramReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/budget" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><BudgetReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/assessments" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AssessmentReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/kirkpatrick" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><KirkpatrickReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/employee-profile" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><EmployeeProfileReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/laser" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LaserReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/audit" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><AuditReport /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/reports/builder" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ReportBuilder /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />

              {/* Settings - Admin Only */}
              <Route path="/settings" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><Settings /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* LASER - Admin Only */}
              <Route path="/laser" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LaserDashboard /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/kpi-config" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><KpiConfiguration /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/causal-maps" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><CausalMaps /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/performance-data" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><PerformanceData /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/interventions" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><LaserInterventions /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/impact" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><ImpactValidation /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              <Route path="/laser/data-sources" element={<ProtectedRoute><AdminRoute><AuthenticatedLayout><DataSources /></AuthenticatedLayout></AdminRoute></ProtectedRoute>} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LibraryProvider>
        </CompanyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
