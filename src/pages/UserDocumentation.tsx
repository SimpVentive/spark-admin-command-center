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
    // Add instructions for better PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>L-Kurve Training Management System - User Documentation</title>
            <style>
              @media print {
                * { 
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                html, body { 
                  font-family: 'Times New Roman', serif !important;
                  font-size: 12pt !important;
                  line-height: 1.4 !important;
                  color: #000 !important;
                  background: white !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                .new-page {
                  page-break-before: always !important;
                  break-before: page !important;
                  min-height: 100vh !important;
                }
                h1 { 
                  font-size: 18pt !important; 
                  margin: 20pt 0 12pt 0 !important; 
                  page-break-after: avoid !important;
                }
                h2 { 
                  font-size: 16pt !important; 
                  margin: 16pt 0 10pt 0 !important; 
                  page-break-after: avoid !important;
                }
                .avoid-break { 
                  page-break-inside: avoid !important; 
                  break-inside: avoid !important;
                }
              }
              @page {
                size: A4;
                margin: 0.75in;
              }
            </style>
          </head>
          <body>
            ${document.querySelector('.max-w-4xl')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      // Fallback to regular print
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            * { 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body { 
              font-family: 'Times New Roman', serif !important;
              font-size: 12pt !important;
              line-height: 1.4 !important;
              color: #000 !important;
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .page-break { 
              page-break-before: always !important; 
              break-before: page !important;
              display: block !important;
            }
            .page-break-after { 
              page-break-after: always !important; 
              break-after: page !important;
            }
            .avoid-break { 
              page-break-inside: avoid !important; 
              break-inside: avoid !important;
            }
            .new-page {
              page-break-before: always !important;
              break-before: page !important;
              min-height: 100vh !important;
            }
            h1 { 
              font-size: 18pt !important; 
              margin: 20pt 0 12pt 0 !important; 
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            h2 { 
              font-size: 16pt !important; 
              margin: 16pt 0 10pt 0 !important; 
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            h3 { 
              font-size: 14pt !important; 
              margin: 12pt 0 8pt 0 !important; 
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            h4 { 
              font-size: 13pt !important; 
              margin: 10pt 0 6pt 0 !important; 
              page-break-after: avoid !important;
              break-after: avoid !important;
            }
            p, li { margin-bottom: 6pt !important; }
            ul, ol { margin: 6pt 0 12pt 20pt !important; }
            .card, .border { 
              border: 1px solid #ddd !important; 
              margin: 8pt 0 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .bg-muted, .bg-blue-50 { 
              background-color: #f5f5f5 !important; 
              -webkit-print-color-adjust: exact !important;
            }
            .text-primary { color: #0066cc !important; }
            .text-muted-foreground { color: #666 !important; }
            .border-l-4 { border-left: 4px solid #3b82f6 !important; }
            .grid { display: block !important; }
            .grid > * { margin-bottom: 10pt !important; }
          }
          .print-only { display: none; }
          @page {
            size: A4;
            margin: 0.75in;
          }
        `
      }} />

      {/* Header Section - No Print */}
      <div className="mb-8 no-print p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">L-Kurve</h1>
            <p className="text-2xl text-gray-600">Training Management System</p>
            <p className="text-lg text-gray-500 mt-2">Complete User Documentation & Guide</p>
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
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">PDF Export Instructions</h4>
              <p className="text-blue-700 text-sm">
                For best results when generating PDF: Use Chrome/Edge browser, ensure "Print backgrounds" is enabled in print settings, 
                and select "Save as PDF" as destination. This will generate a multi-page document with proper formatting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="max-w-4xl mx-auto p-8">
        
        {/* Title Page */}
        <div className="text-center mb-8 page-break-after">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-2">L-Kurve</h1>
            <h2 className="text-3xl text-gray-600 mb-8">Training Management System</h2>
            <h3 className="text-xl text-gray-500">Complete User Documentation</h3>
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
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">Table of Contents</h1>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">1. System Overview</span>
              <span>3</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>1.1 Introduction to L-Kurve</span>
                <span>3</span>
              </div>
              <div className="flex justify-between">
                <span>1.2 Key Features & Capabilities</span>
                <span>4</span>
              </div>
              <div className="flex justify-between">
                <span>1.3 User Roles & Permissions</span>
                <span>5</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">2. Getting Started</span>
              <span>7</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>2.1 System Login & Setup</span>
                <span>7</span>
              </div>
              <div className="flex justify-between">
                <span>2.2 Dashboard Overview</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>2.3 Navigation Guide</span>
                <span>9</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">3. Organization Management</span>
              <span>10</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>3.1 Organization Structure Setup</span>
                <span>10</span>
              </div>
              <div className="flex justify-between">
                <span>3.2 Department & Location Management</span>
                <span>12</span>
              </div>
              <div className="flex justify-between">
                <span>3.3 Job Roles & Hierarchies</span>
                <span>14</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">4. User Management</span>
              <span>16</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>4.1 Employee Management</span>
                <span>16</span>
              </div>
              <div className="flex justify-between">
                <span>4.2 Bulk Operations & Import</span>
                <span>18</span>
              </div>
              <div className="flex justify-between">
                <span>4.3 Learning Profiles</span>
                <span>19</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">5. Training Needs Analysis (TNA)</span>
              <span>20</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>5.1 TNA Cycle Creation & Management</span>
                <span>20</span>
              </div>
              <div className="flex justify-between">
                <span>5.2 Employee TNI Process</span>
                <span>22</span>
              </div>
              <div className="flex justify-between">
                <span>5.3 Manager Approval Workflows</span>
                <span>24</span>
              </div>
              <div className="flex justify-between">
                <span>5.4 TNA Analytics & Reporting</span>
                <span>26</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">6. Training Program Management</span>
              <span>28</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>6.1 Program Creation & Design</span>
                <span>28</span>
              </div>
              <div className="flex justify-between">
                <span>6.2 Category Management</span>
                <span>30</span>
              </div>
              <div className="flex justify-between">
                <span>6.3 Trainer & Session Management</span>
                <span>32</span>
              </div>
              <div className="flex justify-between">
                <span>6.4 Enrollment & Attendance</span>
                <span>34</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">7. Learning Paths</span>
              <span>36</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>7.1 Learning Path Design</span>
                <span>36</span>
              </div>
              <div className="flex justify-between">
                <span>7.2 Content Management & Integration</span>
                <span>38</span>
              </div>
              <div className="flex justify-between">
                <span>7.3 Enrollment & Progress Tracking</span>
                <span>40</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">8. Assessment & Evaluation</span>
              <span>42</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>8.1 Assessment Creation</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span>8.2 Question Bank Management</span>
                <span>44</span>
              </div>
              <div className="flex justify-between">
                <span>8.3 Results Analysis & Reporting</span>
                <span>46</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">9. Content Management</span>
              <span>48</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>9.1 Content Library Organization</span>
                <span>48</span>
              </div>
              <div className="flex justify-between">
                <span>9.2 Content Creation Tools</span>
                <span>50</span>
              </div>
              <div className="flex justify-between">
                <span>9.3 Upload & Categorization</span>
                <span>52</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">10. Digital Library</span>
              <span>54</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>10.1 Resource Management</span>
                <span>54</span>
              </div>
              <div className="flex justify-between">
                <span>10.2 Check-in/Check-out System</span>
                <span>56</span>
              </div>
              <div className="flex justify-between">
                <span>10.3 Reservations & Catalog</span>
                <span>58</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">11. Advanced Features</span>
              <span>60</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>11.1 AI Recommendations</span>
                <span>60</span>
              </div>
              <div className="flex justify-between">
                <span>11.2 MOOC Integration</span>
                <span>62</span>
              </div>
              <div className="flex justify-between">
                <span>11.3 LTI Tools Integration</span>
                <span>64</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">12. Analytics & ROI</span>
              <span>66</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>12.1 Learning Analytics Dashboard</span>
                <span>66</span>
              </div>
              <div className="flex justify-between">
                <span>12.2 ROI Computation Models</span>
                <span>68</span>
              </div>
              <div className="flex justify-between">
                <span>12.3 Predictive Analytics</span>
                <span>70</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">13. System Administration</span>
              <span>72</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>13.1 Security & Access Control</span>
                <span>72</span>
              </div>
              <div className="flex justify-between">
                <span>13.2 System Settings</span>
                <span>74</span>
              </div>
              <div className="flex justify-between">
                <span>13.3 Process & Workflow Management</span>
                <span>76</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">14. Best Practices & Troubleshooting</span>
              <span>78</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>14.1 Implementation Best Practices</span>
                <span>78</span>
              </div>
              <div className="flex justify-between">
                <span>14.2 Common Issues & Solutions</span>
                <span>80</span>
              </div>
              <div className="flex justify-between">
                <span>14.3 Support & Contact Information</span>
                <span>82</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">15. Appendix</span>
              <span>84</span>
            </div>
          </div>
        </div>

        {/* Chapter 1: System Overview */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">1. System Overview</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1.1 Introduction to L-Kurve</h2>
            <p className="mb-4 text-gray-700">
              L-Kurve Training Management System is a comprehensive, enterprise-grade platform designed to revolutionize 
              organizational learning and development processes. Built with modern technology and AI-powered insights, 
              L-Kurve provides end-to-end support for training needs identification, program management, delivery, and evaluation.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Mission Statement
              </h4>
              <p className="text-gray-700">
                L-Kurve empowers organizations to create data-driven, personalized learning experiences that align 
                with business objectives and accelerate employee growth through intelligent automation and analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Core Philosophy
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Data-Driven:</strong> Every decision backed by analytics</li>
                  <li>• <strong>AI-Powered:</strong> Intelligent recommendations and automation</li>
                  <li>• <strong>User-Centric:</strong> Intuitive interfaces for all stakeholders</li>
                  <li>• <strong>Scalable:</strong> Grows with your organization</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Key Benefits
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>Efficiency:</strong> 60% reduction in admin overhead</li>
                  <li>• <strong>Compliance:</strong> Automated tracking and reporting</li>
                  <li>• <strong>ROI:</strong> Measurable training impact</li>
                  <li>• <strong>Engagement:</strong> Personalized learning experiences</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1.2 Key Features & Capabilities</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                  <h3 className="text-xl font-semibold">Intelligent Training Needs Analysis</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Core Features:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• AI-powered skill gap identification</li>
                      <li>• Multi-level approval workflows</li>
                      <li>• Competency mapping & benchmarking</li>
                      <li>• Automated needs categorization</li>
                      <li>• Real-time dashboard analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Advanced Capabilities:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Predictive analytics for future needs</li>
                      <li>• Integration with performance data</li>
                      <li>• Customizable assessment templates</li>
                      <li>• Automated reminder systems</li>
                      <li>• Cross-departmental analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-8 h-8 text-green-600" />
                  <h3 className="text-xl font-semibold">Comprehensive Program Management</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Program Features:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Flexible program design & structure</li>
                      <li>• Multi-modal delivery options</li>
                      <li>• Automated session scheduling</li>
                      <li>• Trainer assignment & management</li>
                      <li>• Capacity & waitlist management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Management Tools:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Program catalog with search</li>
                      <li>• Prerequisites & dependency tracking</li>
                      <li>• Budget allocation & cost tracking</li>
                      <li>• Quality assurance workflows</li>
                      <li>• Feedback & evaluation systems</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <h3 className="text-xl font-semibold">Dynamic Learning Paths</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Path Design:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Adaptive learning sequences</li>
                      <li>• Multi-format content integration</li>
                      <li>• Milestone & checkpoint tracking</li>
                      <li>• Personalized recommendations</li>
                      <li>• Social learning features</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Progress Management:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Real-time progress visualization</li>
                      <li>• Automated progress notifications</li>
                      <li>• Competency achievement tracking</li>
                      <li>• Certificate & badge management</li>
                      <li>• Learning analytics insights</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <h3 className="text-xl font-semibold">Advanced Analytics & ROI</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Analytics Features:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Real-time learning dashboards</li>
                      <li>• Predictive success modeling</li>
                      <li>• Engagement pattern analysis</li>
                      <li>• Cross-program comparisons</li>
                      <li>• Custom report builder</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">ROI Measurement:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multi-level ROI calculations</li>
                      <li>• Business impact correlation</li>
                      <li>• Cost-benefit analysis tools</li>
                      <li>• Stakeholder reporting</li>
                      <li>• Trend analysis & forecasting</li>
                    </ul>
                  </div>
                </div>
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
                  <Badge className="bg-red-100 text-red-800">Full System Access</Badge>
                </div>
                <p className="text-red-700 mb-3">
                  Strategic oversight with complete system administration and decision-making authority.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Strategic Functions:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• TNA cycle strategy & launch</li>
                      <li>• Global program portfolio management</li>
                      <li>• Budget allocation & optimization</li>
                      <li>• ROI analysis & reporting</li>
                      <li>• Organizational learning strategy</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Administrative Control:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• User account management</li>
                      <li>• System configuration & settings</li>
                      <li>• Security policy enforcement</li>
                      <li>• Integration management</li>
                      <li>• Compliance monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Analytics & Insights:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Enterprise-wide analytics</li>
                      <li>• Predictive modeling access</li>
                      <li>• Executive dashboard views</li>
                      <li>• Custom report creation</li>
                      <li>• Benchmarking & comparisons</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Department Manager</h3>
                  <Badge className="bg-blue-100 text-blue-800">Department-Level Authority</Badge>
                </div>
                <p className="text-blue-700 mb-3">
                  Departmental training leadership with approval authority and team management capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Team Management:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Team training needs approval</li>
                      <li>• Employee development planning</li>
                      <li>• Performance-training alignment</li>
                      <li>• Team skill gap analysis</li>
                      <li>• Budget recommendation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Program Oversight:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Department program enrollment</li>
                      <li>• Training calendar management</li>
                      <li>• Progress monitoring</li>
                      <li>• Quality feedback provision</li>
                      <li>• Compliance tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Reporting Access:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Department analytics</li>
                      <li>• Team progress reports</li>
                      <li>• ROI measurement</li>
                      <li>• Comparative analysis</li>
                      <li>• Stakeholder reporting</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">Employee</h3>
                  <Badge className="bg-green-100 text-green-800">Self-Service & Learning</Badge>
                </div>
                <p className="text-green-700 mb-3">
                  Individual learners with comprehensive self-service capabilities and personalized learning experiences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Learning Activities:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Training needs identification</li>
                      <li>• Program enrollment & participation</li>
                      <li>• Learning path progression</li>
                      <li>• Assessment completion</li>
                      <li>• Certificate management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Self-Service Tools:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Personal learning dashboard</li>
                      <li>• Training catalog browsing</li>
                      <li>• Schedule management</li>
                      <li>• Resource library access</li>
                      <li>• Feedback & evaluation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Progress Tracking:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Personal progress monitoring</li>
                      <li>• Skill development tracking</li>
                      <li>• Achievement visualization</li>
                      <li>• Goal setting & tracking</li>
                      <li>• Peer comparison (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 bg-purple-50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">Trainer/Facilitator</h3>
                  <Badge className="bg-purple-100 text-purple-800">Content & Delivery</Badge>
                </div>
                <p className="text-purple-700 mb-3">
                  Training delivery specialists with content management and learner interaction capabilities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Content Management:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Training material development</li>
                      <li>• Assessment creation & grading</li>
                      <li>• Resource library management</li>
                      <li>• Course structure design</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Learner Interaction:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Class management & attendance</li>
                      <li>• Progress monitoring & feedback</li>
                      <li>• Discussion facilitation</li>
                      <li>• Performance evaluation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 2: Getting Started */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">2. Getting Started</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.1 System Login & Setup</h2>
            
            <div className="bg-gray-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Initial System Access</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">System URL Access</h4>
                    <p className="text-sm text-gray-600 mb-2">Navigate to your organization's L-Kurve instance</p>
                    <div className="bg-white border rounded p-2 text-sm font-mono">
                      https://yourcompany.l-kurve.com
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Authentication Options</h4>
                    <p className="text-sm text-gray-600">Choose your preferred login method:</p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      <li>• <strong>Username/Password:</strong> Standard L-Kurve credentials</li>
                      <li>• <strong>Single Sign-On (SSO):</strong> Corporate directory integration</li>
                      <li>• <strong>Multi-Factor Authentication (MFA):</strong> Enhanced security</li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Profile Completion</h4>
                    <p className="text-sm text-gray-600">Complete your user profile for personalized experience</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                First-Time Login Checklist
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Change temporary password to secure personal password</li>
                <li>• Verify email address and contact information</li>
                <li>• Complete mandatory profile fields</li>
                <li>• Review and accept terms of service</li>
                <li>• Configure notification preferences</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.2 Dashboard Overview</h2>
            
            <p className="mb-4 text-gray-700">
              The L-Kurve dashboard is your command center, providing personalized insights and quick access 
              to all system functions based on your role and current priorities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Executive Summary Widget
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Active training programs count</li>
                  <li>• Pending approval notifications</li>
                  <li>• Completion rate trends</li>
                  <li>• Budget utilization status</li>
                  <li>• Critical deadline alerts</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-green-600" />
                  Activity Feed
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Recent training completions</li>
                  <li>• New program enrollments</li>
                  <li>• System notifications</li>
                  <li>• Collaboration updates</li>
                  <li>• Achievement milestones</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Performance Metrics
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Learning velocity indicators</li>
                  <li>• Engagement score trends</li>
                  <li>• Competency development progress</li>
                  <li>• ROI performance indicators</li>
                  <li>• Benchmark comparisons</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-orange-600" />
                  Quick Actions Panel
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Launch new TNA cycle</li>
                  <li>• Create training program</li>
                  <li>• Approve pending requests</li>
                  <li>• Generate reports</li>
                  <li>• Schedule training sessions</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Personalization Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Widget Customization:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Drag-and-drop widget arrangement</li>
                    <li>• Show/hide specific widgets</li>
                    <li>• Resize widgets for optimal view</li>
                    <li>• Color theme preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data Filtering:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Department-specific views</li>
                    <li>• Time period selection</li>
                    <li>• Priority-based filtering</li>
                    <li>• Custom alert thresholds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2.3 Navigation Guide</h2>
            
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Main Navigation Structure</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Building2 className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-blue-800">Organization</h4>
                        <p className="text-sm text-gray-600 mb-2">Foundation setup and structure management</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Hierarchy Builder - Visual org chart creation</li>
                          <li>• Departments - Department setup and management</li>
                          <li>• Locations - Geographic location management</li>
                          <li>• Job Roles - Position and competency definition</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Users className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-green-800">User Management</h4>
                        <p className="text-sm text-gray-600 mb-2">Employee lifecycle and profile management</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• All Users - Employee directory and profiles</li>
                          <li>• Add Employee - Individual employee onboarding</li>
                          <li>• Bulk Operations - Mass data import/export</li>
                          <li>• Learning Profiles - Personalized learning setup</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Target className="w-6 h-6 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-orange-800">Training Needs Analysis</h4>
                        <p className="text-sm text-gray-600 mb-2">Systematic skill gap identification</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• TNA Dashboard - Cycle overview and management</li>
                          <li>• Create Cycle - Launch new TNA initiatives</li>
                          <li>• Analytics - Advanced TNA insights</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <GraduationCap className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-purple-800">Programs</h4>
                        <p className="text-sm text-gray-600 mb-2">Training program creation and management</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• All Programs - Program catalog and search</li>
                          <li>• Create Program - Program design wizard</li>
                          <li>• Categories - Program classification system</li>
                          <li>• Trainers - Instructor management</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <BookOpen className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-red-800">Learning Paths</h4>
                        <p className="text-sm text-gray-600 mb-2">Structured learning journey design</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• All Paths - Learning path library</li>
                          <li>• Create Path - Learning journey builder</li>
                          <li>• Content Management - Resource integration</li>
                          <li>• Analytics - Path performance insights</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <ClipboardCheck className="w-6 h-6 text-teal-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-teal-800">Assessments</h4>
                        <p className="text-sm text-gray-600 mb-2">Evaluation and testing framework</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• All Assessments - Assessment catalog</li>
                          <li>• Create Assessment - Assessment builder</li>
                          <li>• Question Bank - Question repository</li>
                          <li>• Results - Performance analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Content & Resources</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Video className="w-4 h-4 text-indigo-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">Content Management</h5>
                          <p className="text-xs text-gray-600">Media library and creation tools</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Library className="w-4 h-4 text-pink-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">Digital Library</h5>
                          <p className="text-xs text-gray-600">Resource management system</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Advanced Features</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-yellow-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">AI Recommendations</h5>
                          <p className="text-xs text-gray-600">Intelligent learning suggestions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-cyan-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">MOOC Integration</h5>
                          <p className="text-xs text-gray-600">External platform connections</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Monitor className="w-4 h-4 text-slate-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">LTI Tools</h5>
                          <p className="text-xs text-gray-600">Learning tool interoperability</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">System Administration</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="w-4 h-4 text-emerald-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">Analytics & ROI</h5>
                          <p className="text-xs text-gray-600">Performance measurement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-red-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">Security</h5>
                          <p className="text-xs text-gray-600">Access control and compliance</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Settings className="w-4 h-4 text-gray-600 mt-1" />
                        <div>
                          <h5 className="text-sm font-medium">Settings</h5>
                          <p className="text-xs text-gray-600">System configuration</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue with remaining chapters - I'll include a few more key sections due to length constraints */}

        {/* Chapter 5: Training Needs Analysis */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">5. Training Needs Analysis (TNA)</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5.1 TNA Cycle Creation & Management</h2>
            
            <div className="bg-blue-50 border rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">TNA Cycle Lifecycle</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Planning & Design Phase</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Define cycle objectives, scope, and methodology for comprehensive needs assessment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Configuration Steps:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Set cycle name and description</li>
                          <li>• Define target population</li>
                          <li>• Configure assessment templates</li>
                          <li>• Establish timelines and deadlines</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Advanced Options:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Custom competency frameworks</li>
                          <li>• Multi-language support</li>
                          <li>• Integration with performance data</li>
                          <li>• Automated reminder schedules</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Launch & Deployment</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Activate the TNA cycle with automated notifications and progress tracking.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Launch Activities:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Stakeholder notifications</li>
                          <li>• Employee access provisioning</li>
                          <li>• Manager briefing materials</li>
                          <li>• Progress tracking setup</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Monitoring Tools:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Real-time completion dashboards</li>
                          <li>• Department-wise progress reports</li>
                          <li>• Quality assurance metrics</li>
                          <li>• Escalation triggers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Data Collection & Analysis</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Gather comprehensive training needs data with AI-powered analysis and insights.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Collection Methods:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Employee self-assessments</li>
                          <li>• Manager evaluations</li>
                          <li>• 360-degree feedback</li>
                          <li>• Performance data integration</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">AI Analysis Features:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Automated categorization</li>
                          <li>• Skill gap identification</li>
                          <li>• Priority ranking algorithms</li>
                          <li>• Trend pattern recognition</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">Results & Action Planning</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Transform insights into actionable training strategies and program recommendations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Output Deliverables:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Comprehensive TNA reports</li>
                          <li>• Priority training matrices</li>
                          <li>• Budget requirement estimates</li>
                          <li>• Implementation roadmaps</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Strategic Planning:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Training program mapping</li>
                          <li>• Resource allocation plans</li>
                          <li>• Timeline development</li>
                          <li>• Success metrics definition</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5.2 Employee TNI Process</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Self-Assessment Framework</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Assessment Categories</h4>
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-500 pl-3">
                        <h5 className="font-medium text-sm">Technical Skills</h5>
                        <p className="text-xs text-gray-600">Job-specific technical competencies and tools</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-3">
                        <h5 className="font-medium text-sm">Behavioral Competencies</h5>
                        <p className="text-xs text-gray-600">Soft skills and interpersonal abilities</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-3">
                        <h5 className="font-medium text-sm">Leadership Capabilities</h5>
                        <p className="text-xs text-gray-600">Management and leadership skills</p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-3">
                        <h5 className="font-medium text-sm">Compliance Requirements</h5>
                        <p className="text-xs text-gray-600">Mandatory and regulatory training</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Assessment Methods</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Self-rating scales (1-5 proficiency)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Gap analysis questionnaires</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Learning preference indicators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Career aspiration mapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Training priority ranking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 6: Training Program Management */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">6. Training Program Management</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6.1 Program Creation & Design</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Creating New Training Programs</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Basic Program Setup</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Program title and description</li>
                      <li>• Learning objectives and outcomes</li>
                      <li>• Target audience and prerequisites</li>
                      <li>• Duration and format selection</li>
                      <li>• Category and subcategory assignment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Advanced Configuration</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multi-session program structure</li>
                      <li>• Assessment integration</li>
                      <li>• Certification requirements</li>
                      <li>• Resource attachments</li>
                      <li>• Enrollment limits and waitlists</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6.2 Category Management</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Program Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Technical Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Leadership</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Soft Skills</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6.3 Trainer & Session Management</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Trainer Assignment</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Trainer profile management</li>
                  <li>• Expertise and qualification tracking</li>
                  <li>• Calendar integration and availability</li>
                  <li>• Performance ratings and feedback</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 7: Learning Paths */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">7. Learning Paths</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7.1 Learning Path Design</h2>
            
            <div className="space-y-6">
              <div className="bg-purple-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Creating Structured Learning Journeys</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-medium">Define Learning Objectives</h4>
                      <p className="text-sm text-gray-600">Set clear, measurable goals for the learning path</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-medium">Structure Content Sequence</h4>
                      <p className="text-sm text-gray-600">Arrange content in logical progression with dependencies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-medium">Add Assessments & Milestones</h4>
                      <p className="text-sm text-gray-600">Include checkpoints to validate learning progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7.2 Content Management & Integration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Content Types</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Training programs and sessions</li>
                  <li>• E-learning modules and videos</li>
                  <li>• Documents and resources</li>
                  <li>• External MOOC integrations</li>
                  <li>• Assessments and evaluations</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Management Features</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Drag-and-drop path builder</li>
                  <li>• Content versioning and updates</li>
                  <li>• Prerequisite management</li>
                  <li>• Adaptive path adjustments</li>
                  <li>• Multi-format content support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 8: Assessment & Evaluation */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">8. Assessment & Evaluation</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8.1 Assessment Creation</h2>
            
            <div className="space-y-6">
              <div className="bg-orange-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Building Comprehensive Assessments</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium mb-2">Multiple Choice</h4>
                    <p className="text-xs text-gray-600">Traditional single and multiple answer questions</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium mb-2">True/False</h4>
                    <p className="text-xs text-gray-600">Simple binary choice questions</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg bg-white">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium mb-2">Essay Questions</h4>
                    <p className="text-xs text-gray-600">Open-ended text responses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8.2 Question Bank Management</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Question Organization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Categorization by subject/topic</li>
                    <li>• Difficulty level tagging</li>
                    <li>• Learning objective mapping</li>
                    <li>• Question versioning and history</li>
                  </ul>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Import/export functionality</li>
                    <li>• Bulk question operations</li>
                    <li>• Quality review workflows</li>
                    <li>• Usage analytics and performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 9: Content Management */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">9. Content Management</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9.1 Content Library Organization</h2>
            
            <div className="space-y-6">
              <div className="bg-indigo-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Digital Asset Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Content Types Supported</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Video files (MP4, AVI, MOV)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Documents (PDF, DOC, PPT)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Interactive content (SCORM)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Web links and resources</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Organization Features</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Hierarchical folder structure</li>
                      <li>• Advanced tagging system</li>
                      <li>• Search and filtering capabilities</li>
                      <li>• Version control and history</li>
                      <li>• Access permissions and sharing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9.2 Content Creation Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Video Converter</h3>
                <p className="text-xs text-gray-600">Convert various video formats for optimal delivery</p>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">SCORM Package Creator</h3>
                <p className="text-xs text-gray-600">Generate SCORM-compliant learning packages</p>
              </div>
              
              <div className="border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">PPT to Video</h3>
                <p className="text-xs text-gray-600">Convert presentations to video format automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 10: Digital Library */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">10. Digital Library</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10.1 Resource Management</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Library Resource Types</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Physical Resources</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Books and reference materials</li>
                      <li>• Training manuals and guides</li>
                      <li>• Equipment and tools</li>
                      <li>• Audio/video materials</li>
                      <li>• Certification study materials</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Digital Resources</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• E-books and digital publications</li>
                      <li>• Online course subscriptions</li>
                      <li>• Software licenses</li>
                      <li>• Digital media collections</li>
                      <li>• Research databases</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10.2 Check-in/Check-out System</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Circulation Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">For Librarians:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Process check-outs and returns</li>
                      <li>• Manage overdue items and fines</li>
                      <li>• Track resource utilization</li>
                      <li>• Handle reservations and holds</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">For Users:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Browse and search catalog</li>
                      <li>• Make reservations online</li>
                      <li>• View borrowing history</li>
                      <li>• Receive automated reminders</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 11: Advanced Features */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">11. Advanced Features</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11.1 AI Recommendations</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Intelligent Learning Recommendations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">AI-Powered Features</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Personalized content suggestions</li>
                      <li>• Learning path optimization</li>
                      <li>• Similar user pattern analysis</li>
                      <li>• Predictive learning outcomes</li>
                      <li>• Adaptive content delivery</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Data Sources</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• User learning history</li>
                      <li>• Performance metrics</li>
                      <li>• Skill gap analysis</li>
                      <li>• Peer learning patterns</li>
                      <li>• Business objectives alignment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11.2 MOOC Integration & Management</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Supported Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">Coursera</div>
                    <div className="text-xs text-gray-600">Business</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm">edX</div>
                    <div className="text-xs text-gray-600">for Business</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-sm">Udemy</div>
                    <div className="text-xs text-gray-600">Business</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-sm">LinkedIn</div>
                    <div className="text-xs text-gray-600">Learning</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Complete Training Manager Workflow</h3>
                <p className="text-sm text-gray-700 mb-4">
                  This comprehensive guide outlines the step-by-step process for managing MOOC integrations, 
                  from initial setup to ongoing optimization.
                </p>

                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-blue-800">Phase 1: Initial Platform Setup</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-blue-400 pl-3">
                        <h5 className="font-medium text-sm">Step 1: Platform Integration</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Navigate to MOOC → Platform Management</li>
                          <li>• Click "Add Platform" for each provider</li>
                          <li>• Enter API credentials and client authentication details</li>
                          <li>• Configure automated sync schedules (daily/weekly)</li>
                          <li>• Test connections and monitor sync status</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-blue-400 pl-3">
                        <h5 className="font-medium text-sm">Step 2: Budget Planning</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Access Budget & Licensing section</li>
                          <li>• Set annual MOOC budget allocation</li>
                          <li>• Negotiate enterprise subscriptions with providers</li>
                          <li>• Allocate seat licenses per department</li>
                          <li>• Configure renewal alerts and spending thresholds</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-green-800">Phase 2: Course Catalog Curation</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-400 pl-3">
                        <h5 className="font-medium text-sm">Step 3: Course Discovery & Selection</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Browse 7,700+ courses in Course Catalog</li>
                          <li>• Use filters by provider, category, ratings, duration</li>
                          <li>• Preview courses to assess quality and relevance</li>
                          <li>• Add high-value courses to organizational catalog</li>
                          <li>• Map courses to job roles and skill requirements</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-green-400 pl-3">
                        <h5 className="font-medium text-sm">Step 4: Learning Path Creation</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Group related MOOC courses into structured paths</li>
                          <li>• Create role-based learning journeys</li>
                          <li>• Define prerequisites and recommended sequences</li>
                          <li>• Set completion timeframes and milestones</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-purple-800">Phase 3: Enrollment Management</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-purple-400 pl-3">
                        <h5 className="font-medium text-sm">Step 5: Strategic Enrollment Planning</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Navigate to Enrollment Management dashboard</li>
                          <li>• Review organizational skill gaps and training needs</li>
                          <li>• Identify target audiences for specific courses</li>
                          <li>• Plan bulk enrollments by department or role</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-purple-400 pl-3">
                        <h5 className="font-medium text-sm">Step 6: Bulk Enrollment Execution</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Use "Bulk Enroll" feature for mass enrollments</li>
                          <li>• Set enrollment deadlines and completion targets</li>
                          <li>• Assign mandatory vs. optional course statuses</li>
                          <li>• Communicate learning expectations to managers</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-purple-400 pl-3">
                        <h5 className="font-medium text-sm">Step 7: Individual Management</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Handle ad-hoc enrollment requests from employees</li>
                          <li>• Approve manager-nominated enrollments</li>
                          <li>• Manage seat allocation across departments</li>
                          <li>• Track seat utilization efficiency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-orange-800">Phase 4: Progress Monitoring</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-orange-400 pl-3">
                        <h5 className="font-medium text-sm">Step 8: Real-time Progress Tracking</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Monitor active enrollments across organization</li>
                          <li>• Review individual progress percentages</li>
                          <li>• Identify at-risk learners with overdue status</li>
                          <li>• Send automated reminders for overdue courses</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-orange-400 pl-3">
                        <h5 className="font-medium text-sm">Step 9: Intervention & Support</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Contact learners with low progress after 2 weeks</li>
                          <li>• Provide additional resources or study groups</li>
                          <li>• Adjust deadlines based on business priorities</li>
                          <li>• Escalate completion issues to line managers</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-red-800">Phase 5: Analytics & Optimization</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-red-400 pl-3">
                        <h5 className="font-medium text-sm">Step 10: Performance Analysis</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Access Analytics Dashboard for insights</li>
                          <li>• Review completion rates by department</li>
                          <li>• Analyze popular courses and engagement patterns</li>
                          <li>• Identify peak learning times for optimization</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-red-400 pl-3">
                        <h5 className="font-medium text-sm">Step 11: Data-Driven Decisions</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Adjust course offerings based on completion data</li>
                          <li>• Reallocate budgets to high-performing programs</li>
                          <li>• Negotiate better rates during renewal periods</li>
                          <li>• Remove low-engagement courses from catalog</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-teal-800">Phase 6: Continuous Optimization</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-teal-400 pl-3">
                        <h5 className="font-medium text-sm">Step 12: Monthly Reviews</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Generate comprehensive reports for leadership</li>
                          <li>• Review budget utilization and projections</li>
                          <li>• Analyze seat utilization efficiency</li>
                          <li>• Plan next quarter learning initiatives</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-teal-400 pl-3">
                        <h5 className="font-medium text-sm">Step 13: Platform Optimization</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Monitor platform sync status and API health</li>
                          <li>• Review new course releases from providers</li>
                          <li>• Update learning path recommendations</li>
                          <li>• Optimize seat distribution across departments</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-indigo-800">Phase 7: Reporting & Compliance</h4>
                    
                    <div className="space-y-3">
                      <div className="border-l-4 border-indigo-400 pl-3">
                        <h5 className="font-medium text-sm">Step 14: Stakeholder Reporting</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Create executive dashboards showing learning metrics</li>
                          <li>• Report certification achievements and ROI</li>
                          <li>• Demonstrate business impact of learning programs</li>
                          <li>• Provide compliance reports for mandatory training</li>
                        </ul>
                      </div>

                      <div className="border-l-4 border-indigo-400 pl-3">
                        <h5 className="font-medium text-sm">Step 15: Strategic Planning</h5>
                        <ul className="text-xs text-gray-700 mt-2 space-y-1">
                          <li>• Forecast future learning needs based on business strategy</li>
                          <li>• Plan budget requirements for next fiscal year</li>
                          <li>• Evaluate new MOOC provider opportunities</li>
                          <li>• Align learning strategy with organizational goals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-yellow-800">Daily Activities for Training Managers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Morning Routine:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Check platform sync status</li>
                      <li>• Review overnight course completions</li>
                      <li>• Monitor system alerts and notifications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Ongoing Activities:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Process new enrollment requests</li>
                      <li>• Monitor overdue learners and send reminders</li>
                      <li>• Analyze engagement data for interventions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-800">Best Practices & Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Enrollment Management:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Set realistic completion deadlines (6-8 weeks optimal)</li>
                      <li>• Communicate clear expectations to learners</li>
                      <li>• Monitor seat utilization to optimize costs</li>
                      <li>• Use department-specific learning paths</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Budget Optimization:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Negotiate multi-year contracts for better rates</li>
                      <li>• Track ROI through completion and performance metrics</li>
                      <li>• Right-size seat allocations based on usage data</li>
                      <li>• Plan renewals 90 days in advance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11.3 LTI Tools Integration</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Learning Tools Interoperability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Supported Tools:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Virtual classroom platforms</li>
                      <li>• Assessment and quiz tools</li>
                      <li>• Collaboration software</li>
                      <li>• Content authoring tools</li>
                      <li>• Analytics and reporting tools</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Features:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Single sign-on integration</li>
                      <li>• Grade passback functionality</li>
                      <li>• Seamless content embedding</li>
                      <li>• User provisioning automation</li>
                      <li>• Progress tracking sync</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 12: Analytics & ROI */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">12. Analytics & ROI</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12.1 Learning Analytics Dashboard</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Comprehensive Learning Insights</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <h4 className="font-medium">Engagement Metrics</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Course completion rates</li>
                      <li>• Time spent learning</li>
                      <li>• Resource utilization</li>
                      <li>• Assessment scores</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <h4 className="font-medium">Performance Analysis</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Skill development progress</li>
                      <li>• Learning objective achievement</li>
                      <li>• Competency gap closure</li>
                      <li>• Knowledge retention rates</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h4 className="font-medium">Organizational Impact</h4>
                    </div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Department-wise analytics</li>
                      <li>• Training effectiveness</li>
                      <li>• Cost per learner</li>
                      <li>• Business outcome correlation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12.2 ROI Computation Models</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Kirkpatrick Model Implementation</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 border rounded">
                    <div className="font-medium text-sm mb-1">Level 1</div>
                    <div className="text-xs text-gray-600">Reaction</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-medium text-sm mb-1">Level 2</div>
                    <div className="text-xs text-gray-600">Learning</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-medium text-sm mb-1">Level 3</div>
                    <div className="text-xs text-gray-600">Behavior</div>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <div className="font-medium text-sm mb-1">Level 4</div>
                    <div className="text-xs text-gray-600">Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 13: System Administration */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">13. System Administration</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.1 Security & Access Control</h2>
            
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Framework
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Authentication Methods</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Single Sign-On (SSO) integration</li>
                      <li>• LDAP/Active Directory sync</li>
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Session management and timeouts</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Data Protection</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Data encryption at rest and in transit</li>
                      <li>• Regular security audits</li>
                      <li>• Compliance monitoring (GDPR, SOC2)</li>
                      <li>• Backup and disaster recovery</li>
                      <li>• Access logging and monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.2 System Settings</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Configuration Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">General Settings:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Organization profile</li>
                      <li>• Branding and themes</li>
                      <li>• Language preferences</li>
                      <li>• Time zone configuration</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Learning Settings:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• Assessment policies</li>
                      <li>• Certification rules</li>
                      <li>• Enrollment workflows</li>
                      <li>• Progress tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Integration Settings:</h4>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• API configurations</li>
                      <li>• External system connections</li>
                      <li>• Notification preferences</li>
                      <li>• Data synchronization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 14: Best Practices & Troubleshooting */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">14. Best Practices & Troubleshooting</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14.1 Implementation Best Practices</h2>
            
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h3 className="font-semibold mb-2 text-green-800">For Training Managers</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Establish clear TNA cycles with regular intervals (quarterly/bi-annually)</li>
                  <li>• Maintain comprehensive skill matrices aligned with business objectives</li>
                  <li>• Leverage AI recommendations for data-driven decision making</li>
                  <li>• Implement consistent communication protocols throughout processes</li>
                  <li>• Regular system health checks and performance optimization</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h3 className="font-semibold mb-2 text-blue-800">For Department Managers</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Prompt review and approval of team training requests</li>
                  <li>• Align training initiatives with departmental strategic goals</li>
                  <li>• Balance individual development with team capacity</li>
                  <li>• Regular one-on-one discussions about learning progress</li>
                  <li>• Provide timely feedback on training effectiveness</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14.2 Common Issues & Solutions</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Login and Access Issues
                </h3>
                <div className="text-sm text-gray-700">
                  <p className="mb-2"><strong>Problem:</strong> Unable to access L-Kurve system</p>
                  <p className="mb-2"><strong>Solutions:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Clear browser cache and cookies</li>
                    <li>• Verify network connectivity and firewall settings</li>
                    <li>• Check with IT administrator for account status</li>
                    <li>• Try alternative browser or incognito mode</li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Data Synchronization Issues
                </h3>
                <div className="text-sm text-gray-700">
                  <p className="mb-2"><strong>Problem:</strong> Inconsistent data across modules</p>
                  <p className="mb-2"><strong>Solutions:</strong></p>
                  <ul className="ml-4 space-y-1">
                    <li>• Force refresh browser page (Ctrl+F5)</li>
                    <li>• Check system status page for maintenance updates</li>
                    <li>• Contact support for manual data synchronization</li>
                    <li>• Review recent bulk import operations for errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14.3 Support & Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  Technical Support
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> support@l-kurve.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Hours:</strong> 24/7 for critical issues</p>
                  <p><strong>Response Time:</strong> 4 hours for urgent issues</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Training Consultation
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> consulting@l-kurve.com</p>
                  <p><strong>Phone:</strong> +1 (555) 765-4321</p>
                  <p><strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM EST</p>
                  <p><strong>Services:</strong> Implementation, best practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Page Numbers */}
        <div className="mt-16 pt-8 border-t text-center text-sm text-gray-500">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">L-Kurve</h2>
            <p className="text-lg text-gray-600">Training Management System</p>
          </div>
          <p>© 2024 L-Kurve Training Management System</p>
          <p>Version 1.0 | Complete User Documentation</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>This document contains comprehensive information about all L-Kurve functionalities.</p>
            <p>For the latest updates, visit your L-Kurve system or contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDocumentation;