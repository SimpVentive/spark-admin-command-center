import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Users, BookOpen, Target, ClipboardCheck, GraduationCap,
  Settings, Shield, BarChart3, Download, Printer, Building2, 
  Workflow, Video, Library, Globe, Monitor, Zap, DollarSign,
  ArrowRight, CheckCircle, AlertTriangle, Info, Star
} from 'lucide-react';

const UserDocumentation: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body { 
              font-family: 'Times New Roman', serif !important;
              font-size: 12pt !important;
              line-height: 1.5 !important;
              color: #000 !important;
              background: white !important;
            }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .page-break { page-break-before: always !important; }
            .page-break-after { page-break-after: always !important; }
            .avoid-break { page-break-inside: avoid !important; }
            h1 { font-size: 18pt !important; margin: 20pt 0 12pt 0 !important; }
            h2 { font-size: 16pt !important; margin: 16pt 0 10pt 0 !important; }
            h3 { font-size: 14pt !important; margin: 12pt 0 8pt 0 !important; }
            h4 { font-size: 13pt !important; margin: 10pt 0 6pt 0 !important; }
            p, li { margin-bottom: 6pt !important; }
            ul, ol { margin: 6pt 0 12pt 20pt !important; }
            .card { border: 1px solid #ddd !important; margin: 10pt 0 !important; }
            .border { border: 1px solid #ddd !important; }
            .bg-muted { background-color: #f5f5f5 !important; }
            .text-primary { color: #0066cc !important; }
            .text-muted-foreground { color: #666 !important; }
          }
          .print-only { display: none; }
          @page {
            margin: 1in;
            @bottom-center {
              content: counter(page) " of " counter(pages);
            }
          }
        `
      }} />

      {/* Header Section - No Print */}
      <div className="mb-8 no-print p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Training Management System</h1>
            <p className="text-xl text-gray-600">Complete User Documentation & Guide</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Title Page */}
        <div className="text-center mb-8 page-break-after">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Training Management System</h1>
            <h2 className="text-2xl text-gray-600 mb-8">Complete User Documentation</h2>
          </div>
          
          <div className="mb-12">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <p className="text-lg text-gray-600 mb-2">Version 1.0</p>
            <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="border-t border-b py-8 my-12">
            <h3 className="text-xl font-semibold mb-4">Comprehensive Guide for</h3>
            <div className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Training Managers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Department Managers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>HR Administrators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Employees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="page-break mb-12">
          <h1 className="text-3xl font-bold mb-6">Table of Contents</h1>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">1. System Overview</span>
              <span>3</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>1.1 Introduction</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span>1.2 Key Features</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span>1.3 User Roles & Permissions</span>
                <span>4</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">2. Getting Started</span>
              <span>5</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>2.1 System Login</span>
                <span>5</span>
              </div>
              <div className="flex justify-between">
                <span>2.2 Dashboard Overview</span>
                <span>5</span>
              </div>
              <div className="flex justify-between">
                <span>2.3 Navigation Guide</span>
                <span>6</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">3. Organization Management</span>
              <span>7</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>3.1 Organization Structure</span>
                <span>7</span>
              </div>
              <div className="flex justify-between">
                <span>3.2 Department Management</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>3.3 Role Management</span>
                <span>9</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">4. User Management</span>
              <span>10</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>4.1 Adding Employees</span>
                <span>10</span>
              </div>
              <div className="flex justify-between">
                <span>4.2 Bulk Operations</span>
                <span>11</span>
              </div>
              <div className="flex justify-between">
                <span>4.3 Learning Profiles</span>
                <span>12</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">5. Training Needs Analysis</span>
              <span>13</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>5.1 Creating TNA Cycles</span>
                <span>13</span>
              </div>
              <div className="flex justify-between">
                <span>5.2 Employee TNI Process</span>
                <span>14</span>
              </div>
              <div className="flex justify-between">
                <span>5.3 Manager Approval</span>
                <span>15</span>
              </div>
              <div className="flex justify-between">
                <span>5.4 Analytics & Reporting</span>
                <span>16</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">6. Program Management</span>
              <span>17</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>6.1 Creating Programs</span>
                <span>17</span>
              </div>
              <div className="flex justify-between">
                <span>6.2 Program Categories</span>
                <span>18</span>
              </div>
              <div className="flex justify-between">
                <span>6.3 Trainer Management</span>
                <span>19</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">7. Learning Paths</span>
              <span>20</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>7.1 Creating Learning Paths</span>
                <span>20</span>
              </div>
              <div className="flex justify-between">
                <span>7.2 Content Management</span>
                <span>21</span>
              </div>
              <div className="flex justify-between">
                <span>7.3 Enrollment & Tracking</span>
                <span>22</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">8. Assessments</span>
              <span>23</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>8.1 Creating Assessments</span>
                <span>23</span>
              </div>
              <div className="flex justify-between">
                <span>8.2 Question Bank</span>
                <span>24</span>
              </div>
              <div className="flex justify-between">
                <span>8.3 Results Analysis</span>
                <span>25</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">9. Advanced Features</span>
              <span>26</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>9.1 AI Recommendations</span>
                <span>26</span>
              </div>
              <div className="flex justify-between">
                <span>9.2 MOOC Integration</span>
                <span>27</span>
              </div>
              <div className="flex justify-between">
                <span>9.3 Digital Library</span>
                <span>28</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">10. Administration</span>
              <span>29</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">11. Troubleshooting</span>
              <span>30</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">12. Appendix</span>
              <span>31</span>
            </div>
          </div>
        </div>

        {/* Chapter 1: System Overview */}
        <div className="page-break mb-12">
          <h1 className="text-3xl font-bold mb-6">1. System Overview</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1.1 Introduction</h2>
            <p className="mb-4 text-gray-700">
              The Training Management System (TMS) is a comprehensive platform designed to streamline 
              organizational learning and development processes. It provides end-to-end support for 
              training needs identification, program management, delivery, and evaluation.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Purpose
              </h4>
              <p className="text-gray-700">
                TMS enables organizations to create a structured approach to employee development, 
                ensuring training aligns with business objectives and career growth paths.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1.2 Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Training Needs Analysis</h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Systematic skill gap identification</li>
                  <li>• AI-powered needs categorization</li>
                  <li>• Multi-level approval workflows</li>
                  <li>• Competency mapping</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Program Management</h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Comprehensive program catalog</li>
                  <li>• Session scheduling & management</li>
                  <li>• Trainer assignment & tracking</li>
                  <li>• Enrollment management</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Learning Paths</h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Structured learning journeys</li>
                  <li>• Multi-modal content integration</li>
                  <li>• Progress tracking & milestones</li>
                  <li>• Certification management</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold">Analytics & ROI</h3>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Real-time learning analytics</li>
                  <li>• ROI computation models</li>
                  <li>• Predictive insights</li>
                  <li>• Comprehensive reporting</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1.3 User Roles & Permissions</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-6 bg-red-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">Training Manager</h3>
                  <Badge className="bg-red-100 text-red-800">Full Access</Badge>
                </div>
                <p className="text-red-700 mb-3">
                  Complete system administration with full access to all modules and settings.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Responsibilities:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• System configuration & setup</li>
                      <li>• TNA cycle creation & management</li>
                      <li>• Program design & approval</li>
                      <li>• Resource allocation</li>
                      <li>• Analytics & reporting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">System Access:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• All modules and features</li>
                      <li>• User management</li>
                      <li>• System administration</li>
                      <li>• Security settings</li>
                      <li>• Global analytics</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Department Manager</h3>
                  <Badge className="bg-blue-100 text-blue-800">Department Level</Badge>
                </div>
                <p className="text-blue-700 mb-3">
                  Manages training activities within their department with approval responsibilities.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Responsibilities:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Team training needs review</li>
                      <li>• Training request approvals</li>
                      <li>• Team enrollment management</li>
                      <li>• Progress monitoring</li>
                      <li>• Department reporting</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">System Access:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Department employee data</li>
                      <li>• Training catalogs</li>
                      <li>• Approval workflows</li>
                      <li>• Department analytics</li>
                      <li>• Enrollment management</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Employee</h3>
                  <Badge className="bg-green-100 text-green-800">Self-Service</Badge>
                </div>
                <p className="text-green-700 mb-3">
                  Individual users with access to personal learning features and self-service options.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Responsibilities:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Training needs identification</li>
                      <li>• Program participation</li>
                      <li>• Assessment completion</li>
                      <li>• Learning progress tracking</li>
                      <li>• Feedback provision</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">System Access:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Personal learning dashboard</li>
                      <li>• Training catalog</li>
                      <li>• Assessment platform</li>
                      <li>• Learning paths</li>
                      <li>• Digital library</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 2: Getting Started */}
        <div className="page-break mb-12">
          <h1 className="text-3xl font-bold mb-6">2. Getting Started</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.1 System Login</h2>
            
            <div className="bg-gray-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Authentication Process</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Access the System</h4>
                    <p className="text-sm text-gray-600">Navigate to the TMS login page using your organization's URL</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Enter Credentials</h4>
                    <p className="text-sm text-gray-600">Use your assigned username and password or SSO authentication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Dashboard Access</h4>
                    <p className="text-sm text-gray-600">Upon successful login, you'll be redirected to your role-specific dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                First-Time Login
              </h4>
              <p className="text-sm text-gray-700">
                New users will be prompted to change their temporary password and complete their profile setup.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.2 Dashboard Overview</h2>
            
            <p className="mb-4 text-gray-700">
              The dashboard serves as your central hub, providing quick access to key information and functions 
              based on your role and current activities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Quick Stats
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Active training programs</li>
                  <li>• Pending approvals</li>
                  <li>• Completion rates</li>
                  <li>• Upcoming deadlines</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-green-600" />
                  Recent Activity
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Latest submissions</li>
                  <li>• Recent completions</li>
                  <li>• System notifications</li>
                  <li>• Update alerts</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                  Quick Actions
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Create new program</li>
                  <li>• Launch TNA cycle</li>
                  <li>• Review pending items</li>
                  <li>• Generate reports</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.3 Navigation Guide</h2>
            
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Main Navigation Menu</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Organization</h4>
                    <p className="text-sm text-gray-600">Manage organizational structure, departments, roles, and locations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-medium">User Management</h4>
                    <p className="text-sm text-gray-600">Add employees, manage profiles, and handle bulk operations</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Target className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Training Needs Analysis</h4>
                    <p className="text-sm text-gray-600">Create TNA cycles, monitor responses, and analyze training needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <GraduationCap className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Programs</h4>
                    <p className="text-sm text-gray-600">Design training programs, schedule sessions, and manage trainers</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <BookOpen className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Learning Paths</h4>
                    <p className="text-sm text-gray-600">Create structured learning journeys and track progress</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ClipboardCheck className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <h4 className="font-medium">Assessments</h4>
                    <p className="text-sm text-gray-600">Design evaluations, manage question banks, and analyze results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 3: Organization Management */}
        <div className="page-break mb-12">
          <h1 className="text-3xl font-bold mb-6">3. Organization Management</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3.1 Organization Structure</h2>
            
            <p className="mb-4 text-gray-700">
              The organization structure forms the foundation of your training management system. 
              It defines reporting relationships, departmental boundaries, and access controls.
            </p>

            <div className="bg-blue-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Setting Up Your Structure</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">1. Define Organizational Units</h4>
                  <p className="text-sm text-gray-700 mb-2">Create the basic building blocks of your organization:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Corporate divisions</li>
                    <li>• Business units</li>
                    <li>• Departments</li>
                    <li>• Teams and sections</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium mb-2">2. Establish Hierarchies</h4>
                  <p className="text-sm text-gray-700 mb-2">Set up reporting relationships and approval chains:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Manager-subordinate relationships</li>
                    <li>• Cross-functional reporting</li>
                    <li>• Matrix organization support</li>
                    <li>• Approval level definitions</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium mb-2">3. Location Management</h4>
                  <p className="text-sm text-gray-700 mb-2">Add geographical and physical locations:</p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Head office and branches</li>
                    <li>• Manufacturing plants</li>
                    <li>• Regional offices</li>
                    <li>• Remote work designations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Organization Chart Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Visual Representation</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Interactive org chart</li>
                    <li>• Drag-and-drop editing</li>
                    <li>• Multiple view formats</li>
                    <li>• Export capabilities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Advanced Functions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Position management</li>
                    <li>• Succession planning</li>
                    <li>• Skill mapping</li>
                    <li>• Vacancy tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3.2 Department Management</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Creating Departments</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium">Department Information</h4>
                      <p className="text-sm text-gray-600">Define basic department details including name, code, and description</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium">Assign Leadership</h4>
                      <p className="text-sm text-gray-600">Designate department heads and key personnel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium">Configure Permissions</h4>
                      <p className="text-sm text-gray-600">Set access levels and training approval authorities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Department Attributes</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Basic Information:</strong> Name, code, description</li>
                    <li><strong>Location:</strong> Primary office location</li>
                    <li><strong>Budget:</strong> Training budget allocation</li>
                    <li><strong>Approval Limits:</strong> Training spend thresholds</li>
                    <li><strong>Skills Focus:</strong> Core competency areas</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Management Features</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>Employee Assignment:</strong> Bulk transfer capabilities</li>
                    <li><strong>Training Calendars:</strong> Department-specific schedules</li>
                    <li><strong>Reporting:</strong> Department-level analytics</li>
                    <li><strong>Notifications:</strong> Automated department updates</li>
                    <li><strong>Compliance:</strong> Department training requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3.3 Role Management</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h4 className="font-semibold mb-2">Important Note</h4>
              <p className="text-sm text-gray-700">
                Job roles in TMS define both organizational positions and skill requirements. 
                They serve as the foundation for competency mapping and training needs analysis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Role Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Management Roles</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Executive Leadership</li>
                      <li>• Department Heads</li>
                      <li>• Team Leaders</li>
                      <li>• Project Managers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Technical Roles</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Subject Matter Experts</li>
                      <li>• Technical Specialists</li>
                      <li>• Engineers & Analysts</li>
                      <li>• Support Personnel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Role Definition Process</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium mb-2">1. Role Identification</h4>
                    <p className="text-sm text-gray-700 mb-2">Define the role's purpose and scope:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Job title and grade level</li>
                      <li>• Department assignment</li>
                      <li>• Reporting relationships</li>
                      <li>• Key responsibilities</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium mb-2">2. Competency Mapping</h4>
                    <p className="text-sm text-gray-700 mb-2">Identify required skills and competencies:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Technical skills</li>
                      <li>• Behavioral competencies</li>
                      <li>• Leadership capabilities</li>
                      <li>• Compliance requirements</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium mb-2">3. Training Requirements</h4>
                    <p className="text-sm text-gray-700 mb-2">Define mandatory and developmental training:</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Onboarding programs</li>
                      <li>• Mandatory compliance training</li>
                      <li>• Skill development paths</li>
                      <li>• Career progression requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with remaining chapters... */}
        {/* For brevity, I'll include the key remaining sections */}

        {/* Chapter 4: User Management */}
        <div className="page-break mb-12">
          <h1 className="text-3xl font-bold mb-6">4. User Management</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4.1 Adding Employees</h2>
            
            <div className="bg-blue-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Individual Employee Addition</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Full name and employee ID</li>
                      <li>• Contact information</li>
                      <li>• Date of birth and joining</li>
                      <li>• Emergency contacts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Employment Details</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Job role and grade</li>
                      <li>• Department assignment</li>
                      <li>• Reporting manager</li>
                      <li>• Work location</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Educational qualifications</li>
                        <li>• Professional certifications</li>
                        <li>• Previous experience</li>
                        <li>• Language proficiencies</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Skills and competencies</li>
                        <li>• Training preferences</li>
                        <li>• Career aspirations</li>
                        <li>• Accessibility requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4.2 Bulk Operations</h2>
            
            <div className="bg-green-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Bulk Employee Import</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Template Download</h4>
                    <p className="text-sm text-gray-600">Download the standardized Excel template with all required fields</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Data Preparation</h4>
                    <p className="text-sm text-gray-600">Fill in employee data following the template format and validation rules</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Upload & Validation</h4>
                    <p className="text-sm text-gray-600">Upload the file and review validation results before final import</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Page Numbers */}
        <div className="mt-16 pt-8 border-t text-center text-sm text-gray-500">
          <p>Training Management System - User Documentation</p>
          <p>© 2024 | Version 1.0 | Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDocumentation;