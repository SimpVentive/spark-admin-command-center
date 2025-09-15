import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  BookOpen, 
  Target, 
  ClipboardCheck, 
  GraduationCap,
  Settings,
  Shield,
  BarChart3,
  Download,
  Printer
} from 'lucide-react';

const UserDocumentation: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Trigger browser's print dialog with PDF option
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 no-print">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Training Management System
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete User Documentation & Guide
            </p>
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

      {/* Print Header - Only visible when printing */}
      <div className="print-only mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-center">Training Management System</h1>
        <p className="text-lg text-center text-gray-600 mt-2">User Documentation & Guide</p>
        <p className="text-sm text-center text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Table of Contents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Getting Started</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• System Overview</li>
                <li>• User Roles & Permissions</li>
                <li>• Navigation Guide</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Core Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Training Needs Analysis</li>
                <li>• Program Management</li>
                <li>• Learning Paths</li>
                <li>• Assessments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Training Management System is a comprehensive platform designed to streamline 
            organizational learning and development processes. It supports the complete training 
            lifecycle from needs identification to program delivery and assessment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-2">Training Needs Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Identify skill gaps and training requirements across the organization
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-2">Program Management</h4>
              <p className="text-sm text-muted-foreground">
                Create, manage, and deliver training programs effectively
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-2">Analytics & Reporting</h4>
              <p className="text-sm text-muted-foreground">
                Track progress and measure training effectiveness
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Roles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Training Manager</Badge>
                <span className="text-sm text-muted-foreground">Full System Access</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and manage TNA cycles</li>
                <li>• Design training programs and learning paths</li>
                <li>• Configure system settings and workflows</li>
                <li>• Access all analytics and reports</li>
                <li>• Manage user accounts and permissions</li>
              </ul>
            </div>

            <div className="border-l-4 border-secondary pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Department Manager</Badge>
                <span className="text-sm text-muted-foreground">Department-Level Access</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review and approve team training needs</li>
                <li>• Enroll team members in programs</li>
                <li>• Track department training progress</li>
                <li>• Access department-specific reports</li>
              </ul>
            </div>

            <div className="border-l-4 border-muted pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Employee</Badge>
                <span className="text-sm text-muted-foreground">Self-Service Access</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Submit training needs and requests</li>
                <li>• Access assigned learning paths</li>
                <li>• Complete assessments and evaluations</li>
                <li>• Track personal learning progress</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Navigation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Training Needs Analysis
              </h4>
              <ul className="space-y-2 text-sm">
                <li><strong>TNA Dashboard:</strong> Overview of all TNA cycles and status</li>
                <li><strong>Create Cycle:</strong> Launch new training needs identification</li>
                <li><strong>Employee TNI:</strong> Employee self-assessment interface</li>
                <li><strong>Manager Approval:</strong> Review and approve team requests</li>
                <li><strong>Analytics:</strong> TNA insights and gap analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Programs & Learning
              </h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Programs:</strong> Training program catalog and management</li>
                <li><strong>Learning Paths:</strong> Structured learning journeys</li>
                <li><strong>Content Library:</strong> Training materials and resources</li>
                <li><strong>Assessments:</strong> Evaluation and testing tools</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Needs Analysis Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Training Needs Analysis (TNA) Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 1: Create TNA Cycle</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Training managers initiate organization-wide training needs identification
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Set cycle name, duration, and objectives</li>
                <li>• Define target departments and roles</li>
                <li>• Configure assessment templates</li>
              </ul>
            </div>

            <div className="bg-secondary/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 2: Employee Self-Assessment</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Employees identify their own training needs and skill gaps
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete skill assessment forms</li>
                <li>• Request specific training programs</li>
                <li>• Set learning goals and priorities</li>
              </ul>
            </div>

            <div className="bg-accent/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 3: Manager Review</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Department managers review and validate team training needs
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review employee submissions</li>
                <li>• Add additional training requirements</li>
                <li>• Approve and prioritize requests</li>
              </ul>
            </div>

            <div className="bg-muted/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 4: Analysis & Planning</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Consolidate needs and create comprehensive training plans
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analyze organization-wide skill gaps</li>
                <li>• Design targeted training programs</li>
                <li>• Allocate resources and set timelines</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Program Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Creating Programs</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Define program objectives and outcomes</li>
                  <li>• Set duration, capacity, and prerequisites</li>
                  <li>• Assign trainers and resources</li>
                  <li>• Configure assessment criteria</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Managing Enrollments</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bulk enroll employees</li>
                  <li>• Track attendance and participation</li>
                  <li>• Monitor progress and completion</li>
                  <li>• Generate completion certificates</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Learning paths provide structured, sequential learning experiences tailored to specific roles or skills.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Design Paths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Define learning objectives</li>
                  <li>• Sequence training modules</li>
                  <li>• Set prerequisites</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Track Progress</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitor completion rates</li>
                  <li>• Track time investment</li>
                  <li>• Identify bottlenecks</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Optimize Paths</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Analyze effectiveness</li>
                  <li>• Update content</li>
                  <li>• Improve engagement</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessments */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Assessments & Evaluations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Assessment Types</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded">
                    <h5 className="font-medium">Pre-Assessment</h5>
                    <p className="text-sm text-muted-foreground">Evaluate baseline knowledge before training</p>
                  </div>
                  <div className="p-3 bg-secondary/5 rounded">
                    <h5 className="font-medium">Progress Assessment</h5>
                    <p className="text-sm text-muted-foreground">Monitor learning during training programs</p>
                  </div>
                  <div className="p-3 bg-accent/5 rounded">
                    <h5 className="font-medium">Final Assessment</h5>
                    <p className="text-sm text-muted-foreground">Evaluate competency achievement</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Question Bank Management</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create multiple choice questions</li>
                  <li>• Design scenario-based assessments</li>
                  <li>• Set difficulty levels and categories</li>
                  <li>• Maintain question pools by topic</li>
                  <li>• Configure automated scoring</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Administration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">User Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and manage user accounts</li>
                <li>• Assign roles and permissions</li>
                <li>• Configure department hierarchies</li>
                <li>• Manage bulk user operations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Security & Access Control</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Configure approval workflows</li>
                <li>• Set data access permissions</li>
                <li>• Manage security policies</li>
                <li>• Monitor system activity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Best Practices & Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-primary">For Training Managers</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Schedule regular TNA cycles (quarterly or bi-annually)</li>
                <li>• Maintain up-to-date skill matrices for all roles</li>
                <li>• Use analytics to identify organization-wide trends</li>
                <li>• Ensure consistent communication throughout TNA process</li>
                <li>• Archive completed cycles for historical reference</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-secondary">For Department Managers</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Review employee submissions promptly</li>
                <li>• Align training needs with business objectives</li>
                <li>• Consider both individual and team development needs</li>
                <li>• Prioritize training based on urgency and impact</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-accent">For Employees</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Be honest and thorough in self-assessments</li>
                <li>• Consider both current role and career aspirations</li>
                <li>• Provide specific examples of skill gaps</li>
                <li>• Actively participate in assigned training programs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Troubleshooting & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Common Issues</h4>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                  <h5 className="font-medium">Cannot Access TNA Form</h5>
                  <p className="text-sm text-muted-foreground">
                    Ensure the TNA cycle is active and you are assigned to the target group. Contact your manager if the issue persists.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                  <h5 className="font-medium">Training Program Not Visible</h5>
                  <p className="text-sm text-muted-foreground">
                    Check if you meet the prerequisites and if enrollment is still open. Contact the training administrator for assistance.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50">
                  <h5 className="font-medium">Assessment Not Loading</h5>
                  <p className="text-sm text-muted-foreground">
                    Refresh your browser and ensure you have a stable internet connection. Clear browser cache if the problem continues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Support & Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Technical Support</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For system issues and technical difficulties
              </p>
              <p className="text-sm">Email: support@trainingmanagement.com</p>
              <p className="text-sm">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Training Administration</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For program enrollment and training questions
              </p>
              <p className="text-sm">Email: training@company.com</p>
              <p className="text-sm">Phone: +1 (555) 765-4321</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground border-t pt-4">
        <p>Training Management System © 2024 | Version 1.0 | Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .page-break {
              page-break-before: always;
            }
          }
          .print-only {
            display: none;
          }
        `
      }} />
    </div>
  );
};

export default UserDocumentation;