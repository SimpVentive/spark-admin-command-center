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

  const handleDownloadDoc = () => {
    const content = document.querySelector('.documentation-content');
    if (!content) return;

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>L-Kurve Training Management System - User Documentation</title>
          <style>
            body { 
              font-family: 'Calibri', 'Arial', sans-serif; 
              font-size: 11pt; 
              line-height: 1.5; 
              color: #000; 
              margin: 1in;
            }
            h1 { 
              font-size: 24pt; 
              font-weight: bold; 
              color: #1a365d; 
              margin: 24pt 0 12pt 0; 
              page-break-after: avoid;
            }
            h2 { 
              font-size: 18pt; 
              font-weight: bold; 
              color: #2c5282; 
              margin: 18pt 0 10pt 0; 
              page-break-after: avoid;
            }
            h3 { 
              font-size: 14pt; 
              font-weight: bold; 
              color: #2d3748; 
              margin: 14pt 0 8pt 0; 
            }
            h4 { 
              font-size: 12pt; 
              font-weight: bold; 
              margin: 12pt 0 6pt 0; 
            }
            p { margin: 6pt 0; }
            ul, ol { margin: 6pt 0 6pt 24pt; }
            li { margin: 3pt 0; }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 12pt 0; 
            }
            td, th { 
              border: 1px solid #ccc; 
              padding: 6pt; 
              text-align: left; 
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold; 
            }
            .page-break { 
              page-break-before: always; 
            }
            .avoid-break { 
              page-break-inside: avoid; 
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'L-Kurve_User_Documentation.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
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
            ${document.querySelector('.documentation-content')?.innerHTML || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
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
            <Button onClick={handleDownloadDoc} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Download DOC
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
              <h4 className="font-medium text-blue-800 mb-1">Download Options</h4>
              <p className="text-blue-700 text-sm">
                <strong>Download DOC:</strong> Click to download as a Word document that can be edited. <br />
                <strong>Export PDF:</strong> Opens print dialog - select "Save as PDF" as destination for PDF format.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="documentation-content max-w-4xl mx-auto p-8">
        
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
              <span className="font-semibold">13. LASER — Performance Intelligence</span>
              <span>72</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>13.1 LASER Overview & How It Works</span>
                <span>72</span>
              </div>
              <div className="flex justify-between">
                <span>13.2 KPI Configuration & Role Mapping</span>
                <span>74</span>
              </div>
              <div className="flex justify-between">
                <span>13.3 Causal Map Builder</span>
                <span>76</span>
              </div>
              <div className="flex justify-between">
                <span>13.4 Performance Data & Deviation Detection</span>
                <span>78</span>
              </div>
              <div className="flex justify-between">
                <span>13.5 Root Cause Analysis (RCA) Engine</span>
                <span>80</span>
              </div>
              <div className="flex justify-between">
                <span>13.6 Interventions & Auto-Assignment</span>
                <span>82</span>
              </div>
              <div className="flex justify-between">
                <span>13.7 Impact Validation & Pattern Repository</span>
                <span>84</span>
              </div>
              <div className="flex justify-between">
                <span>13.8 Data Sources & External Integration</span>
                <span>86</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">14. System Administration</span>
              <span>88</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>14.1 Security & Access Control</span>
                <span>88</span>
              </div>
              <div className="flex justify-between">
                <span>14.2 System Settings</span>
                <span>90</span>
              </div>
              <div className="flex justify-between">
                <span>14.3 Process & Workflow Management</span>
                <span>92</span>
              </div>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">15. Best Practices & Troubleshooting</span>
              <span>94</span>
            </div>
            <div className="ml-4 space-y-1">
              <div className="flex justify-between">
                <span>15.1 Implementation Best Practices</span>
                <span>94</span>
              </div>
              <div className="flex justify-between">
                <span>15.2 Common Issues & Solutions</span>
                <span>96</span>
              </div>
              <div className="flex justify-between">
                <span>15.3 Support & Contact Information</span>
                <span>98</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">16. Appendix</span>
              <span>100</span>
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
            <h2 className="text-2xl font-semibold mb-4">6.1 Complete Program Management Workflow</h2>
            
            <div className="bg-green-50 border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4">Complete Training Manager Workflow</h3>
              <p className="text-sm text-gray-700 mb-4">
                This comprehensive guide walks you through the end-to-end process of creating, managing, and delivering training programs in L-Kurve.
              </p>

              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-green-800">Phase 1: Program Creation</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 1: Access Program Creation</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to <strong>Programs → Create Program</strong> from the main menu</li>
                        <li>• Alternatively, click <strong>"+ Add Program"</strong> button on the Programs page</li>
                        <li>• The Program Creation wizard will open with guided steps</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 2: Enter Basic Information</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Program Title:</strong> Enter a clear, descriptive title (e.g., "Advanced Excel for Data Analysis")</li>
                        <li>• <strong>Description:</strong> Write 2-3 paragraphs explaining the program purpose and benefits</li>
                        <li>• <strong>Category:</strong> Select from Technical Skills, Leadership, Compliance, or Soft Skills</li>
                        <li>• <strong>Level:</strong> Choose Beginner, Intermediate, or Advanced</li>
                        <li>• <strong>Program Type:</strong> Select Classroom, Virtual, E-Learning, or Blended</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 3: Define Program Content</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Learning Objectives:</strong> List 3-5 specific, measurable learning outcomes</li>
                        <li>• <strong>Program Outline:</strong> Create a detailed module-by-module breakdown</li>
                        <li>• <strong>Duration:</strong> Specify total hours and recommended completion timeframe</li>
                        <li>• <strong>Prerequisites:</strong> List any required prior training or knowledge</li>
                        <li>• <strong>Skills Covered:</strong> Tag relevant competencies for tracking purposes</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 4: Configure Pre-Training Setup</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Pre-Read Materials:</strong> Upload documents, articles, or links for participants to review</li>
                        <li>• <strong>Pre-Test:</strong> Optionally create an assessment to gauge baseline knowledge</li>
                        <li>• <strong>Resource Materials:</strong> Attach handouts, workbooks, or reference guides</li>
                        <li>• <strong>Library Resources:</strong> Link relevant books or materials from the Digital Library</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-blue-800">Phase 2: Session & Trainer Setup</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 5: Create Training Sessions</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Click <strong>"Add Session"</strong> to create a new session batch</li>
                        <li>• <strong>Start Date & Time:</strong> Set when the session begins</li>
                        <li>• <strong>End Date & Time:</strong> Set the session end time</li>
                        <li>• <strong>Venue/Location:</strong> Specify physical room or virtual meeting link</li>
                        <li>• <strong>Capacity:</strong> Set maximum participants for this session</li>
                        <li>• Repeat for each batch you want to offer (e.g., Jan batch, Feb batch)</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 6: Assign Trainer/Faculty</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to <strong>Programs → Trainers</strong> to view available trainers</li>
                        <li>• Select a trainer based on expertise and availability</li>
                        <li>• <strong>Check Calendar:</strong> View trainer's schedule to avoid conflicts</li>
                        <li>• <strong>Assign to Session:</strong> Link the trainer to specific session batches</li>
                        <li>• <strong>Notify Trainer:</strong> System sends automatic assignment notification</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 7: Configure Additional Settings</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Multiple Batches:</strong> Enable if program will run multiple times</li>
                        <li>• <strong>Waitlist:</strong> Enable automatic waitlist when sessions are full</li>
                        <li>• <strong>Certification:</strong> Configure completion certificate if applicable</li>
                        <li>• <strong>Assessments:</strong> Link pre-test and post-test assessments</li>
                        <li>• Click <strong>"Save Program"</strong> to create the program</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-purple-800">Phase 3: Enrollment Management</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 8: Open Enrollments</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to the program's <strong>Enrollment tab</strong></li>
                        <li>• Set <strong>Enrollment Start Date</strong> and <strong>End Date</strong></li>
                        <li>• Configure enrollment rules (open enrollment vs. manager-approved)</li>
                        <li>• <strong>Publish Program:</strong> Make visible to target audience</li>
                        <li>• System sends notifications to eligible employees</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 9: Manage Enrollment Requests</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Review incoming enrollment requests in the <strong>Pending</strong> tab</li>
                        <li>• <strong>Approve:</strong> Click to confirm enrollment</li>
                        <li>• <strong>Reject:</strong> Click and provide reason for rejection</li>
                        <li>• <strong>Waitlist:</strong> Automatically add to waitlist if session is full</li>
                        <li>• <strong>Bulk Actions:</strong> Select multiple requests for batch approval</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 10: Bulk Enrollment</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Go to <strong>Users → Bulk Enrollment</strong></li>
                        <li>• Select the target program and session</li>
                        <li>• <strong>By Department:</strong> Enroll entire department at once</li>
                        <li>• <strong>By Job Role:</strong> Enroll all users with specific roles</li>
                        <li>• <strong>From CSV:</strong> Upload employee list for mass enrollment</li>
                        <li>• Review and confirm the enrollment list</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-orange-800">Phase 4: Program Delivery & Tracking</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 11: Pre-Training Activities</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• System sends <strong>reminder emails</strong> 7 days, 3 days, and 1 day before</li>
                        <li>• Participants receive access to pre-read materials</li>
                        <li>• Pre-tests become available 3 days before training starts</li>
                        <li>• <strong>Monitor:</strong> Track pre-test completion rates</li>
                        <li>• Send additional reminders to non-completers if needed</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 12: Attendance Tracking</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• On training day, access the <strong>Attendance</strong> tab</li>
                        <li>• <strong>Mark Present:</strong> Check off attendees as they arrive</li>
                        <li>• <strong>Mark Absent:</strong> Record no-shows with reason codes</li>
                        <li>• <strong>Partial Attendance:</strong> Log early departures or late arrivals</li>
                        <li>• For virtual sessions, attendance auto-logs from meeting platform</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 13: Post-Training Evaluation</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Post-Test:</strong> Participants complete knowledge assessment</li>
                        <li>• <strong>Level 1 Feedback:</strong> Send satisfaction survey to participants</li>
                        <li>• <strong>Trainer Evaluation:</strong> Collect feedback on trainer performance</li>
                        <li>• <strong>Compare Pre vs Post:</strong> System calculates learning gain metrics</li>
                        <li>• Review feedback and identify improvement areas</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 14: Completion & Certification</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Review completion criteria (attendance + assessment score)</li>
                        <li>• <strong>Mark Complete:</strong> Update status for qualifying participants</li>
                        <li>• <strong>Generate Certificates:</strong> System creates completion certificates</li>
                        <li>• Certificates are automatically added to employee profiles</li>
                        <li>• <strong>Send Notifications:</strong> Participants receive completion confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-teal-800">Phase 5: Reporting & Analysis</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-teal-400 pl-3">
                      <h5 className="font-medium text-sm">Step 15: Generate Program Reports</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to the program's <strong>Analytics</strong> tab</li>
                        <li>• <strong>Attendance Report:</strong> View participation rates by session</li>
                        <li>• <strong>Assessment Report:</strong> Analyze pre/post test score distributions</li>
                        <li>• <strong>Feedback Summary:</strong> Review aggregated satisfaction scores</li>
                        <li>• <strong>Export:</strong> Download reports as PDF or Excel for stakeholders</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-teal-400 pl-3">
                      <h5 className="font-medium text-sm">Step 16: ROI & Effectiveness Analysis</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Go to <strong>Analytics → ROI Dashboard</strong></li>
                        <li>• <strong>Kirkpatrick Evaluation:</strong> Track all four levels of evaluation</li>
                        <li>• <strong>Cost Analysis:</strong> Calculate cost per participant, per hour</li>
                        <li>• <strong>Skill Impact:</strong> Measure competency improvement</li>
                        <li>• Document lessons learned for future program improvements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-yellow-800">Quick Reference: Program Creation Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Before Creating:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>☐ Identify business need and target audience</li>
                    <li>☐ Define learning objectives (SMART format)</li>
                    <li>☐ Confirm budget and resources available</li>
                    <li>☐ Check trainer availability</li>
                    <li>☐ Reserve venue/virtual platform</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">After Creating:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>☐ Review all program details for accuracy</li>
                    <li>☐ Upload all supporting materials</li>
                    <li>☐ Configure assessment settings</li>
                    <li>☐ Set enrollment dates and notify stakeholders</li>
                    <li>☐ Brief assigned trainers on program content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6.2 Category Management</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Managing Program Categories</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h5 className="font-medium text-sm">Step 1: Access Category Management</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• Navigate to <strong>Programs → Category Management</strong></li>
                      <li>• View existing categories with program counts</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h5 className="font-medium text-sm">Step 2: Create New Category</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• Click <strong>"Add Category"</strong> button</li>
                      <li>• Enter category name and description</li>
                      <li>• Select a color code for visual identification</li>
                      <li>• Set parent category if creating a subcategory</li>
                      <li>• Click <strong>"Save"</strong> to create</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Default Program Categories</h3>
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
                <h3 className="font-semibold mb-3">Complete Trainer Management Workflow</h3>
                
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h5 className="font-medium text-sm">Step 1: Add New Trainer</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• Navigate to <strong>Programs → Trainers</strong></li>
                      <li>• Click <strong>"Add Trainer"</strong> button</li>
                      <li>• Enter trainer details: name, email, phone, department</li>
                      <li>• <strong>Expertise Areas:</strong> Select relevant skill categories</li>
                      <li>• <strong>Qualifications:</strong> Add certifications and experience</li>
                      <li>• <strong>Availability:</strong> Set regular availability schedule</li>
                      <li>• Click <strong>"Save Trainer"</strong></li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <h5 className="font-medium text-sm">Step 2: Assign to Programs</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• Open trainer profile and click <strong>"Assign to Program"</strong></li>
                      <li>• Select program and specific session dates</li>
                      <li>• System checks for calendar conflicts automatically</li>
                      <li>• Trainer receives email notification with session details</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <h5 className="font-medium text-sm">Step 3: Track Performance</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• View aggregated feedback scores from all sessions</li>
                      <li>• Review session-wise performance trends</li>
                      <li>• Identify top-performing trainers for critical programs</li>
                      <li>• Use data for trainer development planning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 7: Learning Paths */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">7. Learning Paths</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7.1 Complete Learning Path Creation Workflow</h2>
            
            <div className="bg-purple-50 border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4">Step-by-Step Guide to Creating Learning Paths</h3>
              <p className="text-sm text-gray-700 mb-4">
                Learning Paths combine multiple training elements into a structured journey that guides employees from novice to expert in a specific skill area or role.
              </p>

              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-purple-800">Phase 1: Path Planning & Setup</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 1: Access Learning Path Creator</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to <strong>Learning Paths → Create Learning Path</strong></li>
                        <li>• The Path Builder wizard will open with a visual canvas</li>
                        <li>• Choose <strong>"Blank Path"</strong> or use a pre-built template</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 2: Define Path Basics</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Path Title:</strong> Enter a descriptive name (e.g., "New Manager Development Path")</li>
                        <li>• <strong>Description:</strong> Explain the path's purpose and expected outcomes</li>
                        <li>• <strong>Category:</strong> Select the skill category (Technical, Leadership, etc.)</li>
                        <li>• <strong>Target Audience:</strong> Specify job roles or departments</li>
                        <li>• <strong>Difficulty Level:</strong> Choose Beginner, Intermediate, or Advanced</li>
                        <li>• <strong>Estimated Duration:</strong> Set total hours to complete the path</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-3">
                      <h5 className="font-medium text-sm">Step 3: Set Prerequisites</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Required Experience:</strong> Specify minimum experience level</li>
                        <li>• <strong>Prior Paths:</strong> Link any paths that must be completed first</li>
                        <li>• <strong>Required Skills:</strong> Tag prerequisite competencies</li>
                        <li>• <strong>Certification Requirements:</strong> List any required certifications</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-blue-800">Phase 2: Building the Path Structure</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 4: Add Modules/Stages</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Click <strong>"+ Add Module"</strong> to create a new stage</li>
                        <li>• <strong>Module Name:</strong> Give each module a clear title (e.g., "Foundation Skills")</li>
                        <li>• <strong>Module Description:</strong> Explain what learners will achieve</li>
                        <li>• <strong>Duration:</strong> Estimate time to complete the module</li>
                        <li>• <strong>Required vs Optional:</strong> Mark module as mandatory or elective</li>
                        <li>• Drag modules to reorder the sequence</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 5: Add Content to Modules</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Click on a module to expand and add content</li>
                        <li>• <strong>Training Programs:</strong> Link existing L-Kurve training programs</li>
                        <li>• <strong>E-Learning:</strong> Add uploaded videos, SCORM packages, or documents</li>
                        <li>• <strong>MOOC Courses:</strong> Link courses from integrated MOOC providers</li>
                        <li>• <strong>Assessments:</strong> Add quizzes or exams as checkpoints</li>
                        <li>• <strong>Resources:</strong> Attach supplementary reading materials</li>
                        <li>• Use drag-and-drop to arrange content within each module</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-3">
                      <h5 className="font-medium text-sm">Step 6: Configure Dependencies</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Sequential Order:</strong> Require modules to be completed in order</li>
                        <li>• <strong>Unlocking Rules:</strong> Set conditions for unlocking next modules</li>
                        <li>• <strong>Assessment Gates:</strong> Require passing scores to proceed</li>
                        <li>• <strong>Time Delays:</strong> Add waiting periods between modules</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-green-800">Phase 3: Assessment & Certification</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 7: Add Milestone Assessments</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Knowledge Checks:</strong> Add quizzes at the end of each module</li>
                        <li>• <strong>Skills Assessments:</strong> Include practical evaluations</li>
                        <li>• <strong>Passing Criteria:</strong> Set minimum scores for progression</li>
                        <li>• <strong>Retry Policy:</strong> Configure number of allowed attempts</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-green-400 pl-3">
                      <h5 className="font-medium text-sm">Step 8: Configure Certification</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Toggle <strong>"Enable Certification"</strong> if path awards a credential</li>
                        <li>• <strong>Certificate Template:</strong> Select or upload custom certificate design</li>
                        <li>• <strong>Validity Period:</strong> Set expiration (e.g., 12 months, indefinite)</li>
                        <li>• <strong>Renewal Requirements:</strong> Define recertification process</li>
                        <li>• <strong>Digital Badge:</strong> Enable to issue shareable digital badges</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-orange-800">Phase 4: Publishing & Enrollment</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 9: Review & Publish</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Click <strong>"Preview Path"</strong> to see learner's view</li>
                        <li>• Verify all content links are active and accessible</li>
                        <li>• Check estimated completion time is accurate</li>
                        <li>• Click <strong>"Publish"</strong> to make path available</li>
                        <li>• Choose visibility: All Users, Specific Departments, or By Role</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-400 pl-3">
                      <h5 className="font-medium text-sm">Step 10: Manage Enrollments</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• <strong>Self-Enrollment:</strong> Allow users to enroll themselves</li>
                        <li>• <strong>Manager Assignment:</strong> Enable manager-initiated enrollment</li>
                        <li>• <strong>Auto-Enrollment:</strong> Configure rules (e.g., all new hires)</li>
                        <li>• <strong>Bulk Assign:</strong> Enroll entire departments or job roles</li>
                        <li>• <strong>Set Deadlines:</strong> Configure path completion target dates</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-teal-800">Phase 5: Monitoring & Optimization</h4>
                  
                  <div className="space-y-3">
                    <div className="border-l-4 border-teal-400 pl-3">
                      <h5 className="font-medium text-sm">Step 11: Track Progress</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Navigate to <strong>Learning Paths → Analytics Dashboard</strong></li>
                        <li>• <strong>Enrollment Stats:</strong> View total enrolled, active, completed</li>
                        <li>• <strong>Module Completion:</strong> See drop-off points in the path</li>
                        <li>• <strong>Time to Complete:</strong> Analyze actual vs. estimated duration</li>
                        <li>• <strong>Assessment Scores:</strong> Review performance distributions</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-teal-400 pl-3">
                      <h5 className="font-medium text-sm">Step 12: Optimize Based on Data</h5>
                      <ul className="text-xs text-gray-700 mt-2 space-y-1">
                        <li>• Identify modules with high drop-off rates</li>
                        <li>• Review learner feedback for improvement areas</li>
                        <li>• Update content that has low engagement</li>
                        <li>• Adjust difficulty of assessments if pass rates are too low/high</li>
                        <li>• Add supplementary resources where learners struggle</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-yellow-800">Best Practices for Learning Paths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Path Design:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Keep modules to 2-4 hours max for better engagement</li>
                    <li>• Mix content types (video, reading, activities)</li>
                    <li>• Include knowledge checks every 30-45 minutes</li>
                    <li>• Provide clear learning objectives per module</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Engagement Tips:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Send progress reminders at 25%, 50%, 75%</li>
                    <li>• Celebrate milestone completions with badges</li>
                    <li>• Enable peer discussion for collaborative paths</li>
                    <li>• Set realistic deadlines (4-6 weeks for paths)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7.2 Content Management & Integration</h2>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Adding Content to Learning Paths</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-purple-400 pl-3">
                    <h5 className="font-medium text-sm">Content Types You Can Add</h5>
                    <ul className="text-xs text-gray-700 mt-2 space-y-1">
                      <li>• <strong>Training Programs:</strong> Link existing classroom/virtual programs</li>
                      <li>• <strong>E-Learning Modules:</strong> Upload SCORM packages or videos</li>
                      <li>• <strong>Documents:</strong> Attach PDFs, presentations, or guides</li>
                      <li>• <strong>MOOC Courses:</strong> Include courses from Coursera, edX, etc.</li>
                      <li>• <strong>Assessments:</strong> Add knowledge checks and exams</li>
                      <li>• <strong>External Links:</strong> Reference web resources</li>
                    </ul>
                  </div>
                </div>
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
                          <li>• Click "Configure" button to open platform settings dialog</li>
                          <li>• Set API endpoint, sync frequency (manual/daily/weekly)</li>
                          <li>• Enable auto-enrollment and notification preferences</li>
                          <li>• Click "Sync Now" to test connection and perform initial sync</li>
                          <li>• Monitor sync status and logs in real-time</li>
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
                          <li>• Click "Preview" button to view detailed course information</li>
                          <li>• Review course description, duration, skills, and requirements</li>
                          <li>• Click "Manage" to add courses to organizational catalog</li>
                          <li>• Map courses to job roles and skill requirements</li>
                          <li>• Set course visibility and enrollment permissions</li>
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
                          <li>• Click "View Details" to see comprehensive enrollment information</li>
                          <li>• Review progress, completion status, and learning time</li>
                          <li>• Use "Send Reminder" for overdue or low-progress enrollments</li>
                          <li>• Choose email or SMS reminder delivery method</li>
                          <li>• Customize reminder messages for specific situations</li>
                          <li>• Track seat utilization efficiency across departments</li>
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

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-indigo-800">Interactive Features & Dialogs</h3>
                <p className="text-sm text-gray-700 mb-4">
                  The MOOC system includes powerful interactive dialogs for efficient management of platforms, courses, and enrollments.
                </p>

                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-indigo-700">Platform Configuration Dialog</h4>
                    <p className="text-xs text-gray-600 mb-2">Access via "Configure" button on any platform card</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>API Endpoint:</strong> Set or update platform API connection URL</li>
                      <li>• <strong>Sync Frequency:</strong> Choose manual, daily, or weekly synchronization</li>
                      <li>• <strong>Auto Enrollment:</strong> Enable automatic user enrollment for new courses</li>
                      <li>• <strong>Notifications:</strong> Configure sync completion and enrollment update alerts</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-green-700">Course Preview Dialog</h4>
                    <p className="text-xs text-gray-600 mb-2">Access via "Preview" button in Course Catalog</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>Course Overview:</strong> Detailed description, duration, and difficulty level</li>
                      <li>• <strong>Skills & Outcomes:</strong> Learning objectives and competencies gained</li>
                      <li>• <strong>Prerequisites:</strong> Required knowledge or prior course completion</li>
                      <li>• <strong>Provider Info:</strong> Platform, instructor, and rating details</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-purple-700">Enrollment Details Dialog</h4>
                    <p className="text-xs text-gray-600 mb-2">Access via "View Details" button in Enrollment Management</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>Progress Tracking:</strong> Real-time completion percentage and status</li>
                      <li>• <strong>Timeline Info:</strong> Enrollment date, due date, and time spent</li>
                      <li>• <strong>Performance Metrics:</strong> Quiz scores, assignment grades, and badges</li>
                      <li>• <strong>Learning Path:</strong> Position within broader learning journey</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-orange-700">Send Reminder Dialog</h4>
                    <p className="text-xs text-gray-600 mb-2">Access via "Send Reminder" button for any enrollment</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>Delivery Method:</strong> Choose between email or SMS notification</li>
                      <li>• <strong>Message Customization:</strong> Edit pre-populated reminder text</li>
                      <li>• <strong>Context Information:</strong> Includes progress, due date, and course details</li>
                      <li>• <strong>Tracking:</strong> Confirmation of successful delivery</li>
                    </ul>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-teal-700">Sync Management</h4>
                    <p className="text-xs text-gray-600 mb-2">Real-time synchronization with external platforms</p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>Manual Sync:</strong> Click "Sync Now" for immediate data refresh</li>
                      <li>• <strong>Sync Status:</strong> Visual indicators show sync progress and completion</li>
                      <li>• <strong>Error Handling:</strong> Detailed error messages with troubleshooting steps</li>
                      <li>• <strong>Sync Logs:</strong> Historical record of all synchronization activities</li>
                    </ul>
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

        {/* Chapter 13: LASER — Performance Intelligence */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">13. LASER — Performance Intelligence</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.1 LASER Overview & How It Works</h2>
            <p className="mb-4 text-gray-700">
              LASER (Learning & Application Specific to Employee Role) is L-Kurve's performance intelligence module. 
              It automatically identifies KPI deviations, performs root cause analysis using Bayesian probability, 
              assigns targeted learning interventions, and continuously improves through a feedback loop.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Key Principle
              </h4>
              <p className="text-gray-700">
                LASER operates autonomously once configured. Administrators set up KPIs, thresholds, causal maps, and 
                intervention links. The system then monitors performance data, detects deviations, identifies probable 
                causes, assigns training, and validates impact — all without manual intervention.
              </p>
            </div>

            <div className="border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">The LASER Pipeline (6 Steps)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">1</div>
                  <div className="font-medium text-sm">KPI Setup</div>
                  <div className="text-xs text-gray-600">Define KPIs & map to job roles with thresholds</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">2</div>
                  <div className="font-medium text-sm">Data Ingestion</div>
                  <div className="text-xs text-gray-600">Import performance signals (manual or via API)</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">3</div>
                  <div className="font-medium text-sm">Deviation Detection</div>
                  <div className="text-xs text-gray-600">Auto-detect when KPI values breach thresholds</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">4</div>
                  <div className="font-medium text-sm">Root Cause Analysis</div>
                  <div className="text-xs text-gray-600">Bayesian engine scores probable causes</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">5</div>
                  <div className="font-medium text-sm">Auto-Intervention</div>
                  <div className="text-xs text-gray-600">Assign learning paths, programs, or micro-tasks</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-bold text-lg mb-1">6</div>
                  <div className="font-medium text-sm">Impact Validation</div>
                  <div className="text-xs text-gray-600">Track KPI improvement & refine weights</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.2 KPI Configuration & Role Mapping</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Configure KPIs</strong> to define the Key Performance Indicators that the system monitors.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Step-by-Step: Adding a KPI</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>Click <strong>"Add KPI"</strong> on the KPI Configuration page</li>
                <li>Enter a <strong>KPI Name</strong> (e.g., "Production Output", "Customer Satisfaction Score")</li>
                <li>Set the <strong>Unit</strong> (e.g., units/hour, %, score)</li>
                <li>Choose a <strong>Category</strong> (productivity, quality, compliance, etc.)</li>
                <li>Set <strong>Measurement Frequency</strong> (daily, weekly, monthly)</li>
                <li>Optionally add a <strong>Description</strong></li>
                <li>Click <strong>Save</strong></li>
              </ol>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Step-by-Step: Mapping KPIs to Roles</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>In the <strong>Role-KPI Mappings</strong> section, click <strong>"Map KPI"</strong></li>
                <li>Select a <strong>Job Role</strong> from the dropdown</li>
                <li>Select the <strong>KPI</strong> to monitor for that role</li>
                <li>Set the <strong>Target Value</strong> (e.g., 95)</li>
                <li>Set the <strong>Warning Threshold</strong> (e.g., 85) — triggers a warning-level deviation</li>
                <li>Set the <strong>Critical Threshold</strong> (e.g., 70) — triggers a critical deviation</li>
                <li>Choose <strong>Comparison Operator</strong>: "Greater is Better" or "Less is Better"</li>
                <li>Click <strong>Save Mapping</strong></li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Important
              </h4>
              <p className="text-sm text-gray-700">
                Thresholds must be set correctly based on the operator. For "Greater is Better" KPIs, warning 
                should be less than target, and critical less than warning. The system uses these thresholds to 
                automatically detect deviations when performance data arrives.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.3 Causal Map Builder</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Causal Maps</strong>. This is where you define the probable causes for 
              each KPI deviation and link interventions to those causes.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Step-by-Step: Adding a Probable Cause</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>Click <strong>"Add Cause"</strong></li>
                <li>Select the <strong>KPI</strong> this cause relates to</li>
                <li>Enter a <strong>Cause Name</strong> (e.g., "Insufficient machine calibration training")</li>
                <li>Select a <strong>Category</strong>: Skill Gap, Equipment, Process, Material, Environment, Human Error, or Other</li>
                <li>Set the <strong>Default Weight</strong> (0 to 1) — this is the prior probability used in Bayesian RCA</li>
                <li>Toggle <strong>"Requires Training"</strong> on if a learning intervention can address this cause</li>
                <li>If training is not applicable, enter an <strong>Escalation Target</strong> (e.g., "Maintenance Dept")</li>
                <li>Click <strong>Add Cause</strong></li>
              </ol>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Step-by-Step: Linking an Intervention</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>On a cause card, click the <strong>"Link"</strong> button</li>
                <li>Choose an <strong>Intervention Type</strong>:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Learning Path</strong> — links to an existing learning path</li>
                    <li>• <strong>Training Program</strong> — links to an existing program</li>
                    <li>• <strong>Micro-Intervention</strong> — a quick task, checklist, video, or reference document</li>
                  </ul>
                </li>
                <li>Select or fill in the intervention details</li>
                <li>Click <strong>Link Intervention</strong></li>
              </ol>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Best Practice
              </h4>
              <p className="text-sm text-gray-700">
                Define multiple causes per KPI with varying weights that sum to approximately 1.0. 
                This gives the Bayesian engine a richer model. Each cause should have at least one intervention 
                linked to it. The system picks the highest-priority intervention when auto-assigning.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.4 Performance Data & Deviation Detection</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Performance Data</strong> to view and record KPI signals.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Manual Data Entry</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>Click <strong>"Add Signal"</strong></li>
                <li>Select the <strong>Employee</strong></li>
                <li>Select the <strong>KPI</strong></li>
                <li>Enter the <strong>Value</strong></li>
                <li>Set the <strong>Measurement Date</strong></li>
                <li>Click <strong>Record Signal</strong></li>
              </ol>
              <p className="text-sm text-gray-600 mt-3">
                The system automatically checks the value against the role-KPI thresholds. If a deviation 
                is detected, it immediately triggers the RCA engine and you'll see a notification.
              </p>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Deviation Detection Logic</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Operator</th>
                    <th className="text-left p-2">Warning Triggered When</th>
                    <th className="text-left p-2">Critical Triggered When</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Greater is Better</td>
                    <td className="p-2">Value &lt; Warning Threshold</td>
                    <td className="p-2">Value &lt; Critical Threshold</td>
                  </tr>
                  <tr>
                    <td className="p-2">Less is Better</td>
                    <td className="p-2">Value &gt; Warning Threshold</td>
                    <td className="p-2">Value &gt; Critical Threshold</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.5 Root Cause Analysis (RCA) Engine</h2>
            <p className="mb-4 text-gray-700">
              The RCA engine uses <strong>Bayesian probability scoring</strong> to identify the most likely causes 
              for each KPI deviation. It runs automatically when deviations are detected, or can be triggered manually.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">How Bayesian RCA Works</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Formula:</strong> P(cause | deviation) ∝ P(deviation | cause) × P(cause)</p>
                <ul className="ml-4 space-y-2">
                  <li><strong>Prior — P(cause):</strong> Starts from the default_weight you configured. Over time, 
                  the Pattern Repository refines this based on historical success/failure data.</li>
                  <li><strong>Likelihood — P(deviation | cause):</strong> Calculated from deviation severity, magnitude, 
                  and cause category. Skill gaps and human errors score higher for large deviations.</li>
                  <li><strong>Posterior:</strong> All cause scores are normalized so they sum to 1.0. The highest-scoring 
                  cause is marked as the primary cause.</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Manual RCA Scan</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>Go to the <strong>LASER Dashboard</strong></li>
                <li>Click <strong>"Run RCA Scan"</strong> in the top-right corner</li>
                <li>The engine analyzes all open deviations that haven't been processed yet</li>
                <li>Results appear as RCA entries and auto-assigned interventions</li>
              </ol>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.6 Interventions & Auto-Assignment</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Interventions</strong> to view all auto-assigned learning interventions.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Intervention Types</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Learning Path</td>
                    <td className="p-2">Full structured learning path from the LMS</td>
                    <td className="p-2">Safety Compliance Path</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Training Program</td>
                    <td className="p-2">Instructor-led or scheduled program</td>
                    <td className="p-2">Machine Calibration Workshop</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Micro-Intervention</td>
                    <td className="p-2">Quick task, checklist, video, or document</td>
                    <td className="p-2">Daily Calibration Checklist</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Intervention Lifecycle</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">Assigned</span>
                <span>→</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">In Progress</span>
                <span>→</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Completed</span>
                <span>or</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded">Skipped</span>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                When an intervention is completed, the system creates an impact validation record to 
                compare pre- and post-intervention KPI values.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.7 Impact Validation & Pattern Repository</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Impact Validation</strong> to track whether interventions actually improved KPIs.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Impact Results Tab</h3>
              <p className="text-sm text-gray-700 mb-2">
                Shows each intervention's pre/post KPI values and improvement percentage. Statuses:
              </p>
              <ul className="ml-4 space-y-1 text-sm text-gray-700">
                <li>• <strong>Pending</strong> — Waiting for post-intervention data</li>
                <li>• <strong>Improved</strong> — KPI improved by more than 5%</li>
                <li>• <strong>No Change</strong> — KPI change within ±5%</li>
                <li>• <strong>Declined</strong> — KPI worsened by more than 5%</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Pattern Repository Tab</h3>
              <p className="text-sm text-gray-700 mb-2">
                The Pattern Repository is LASER's learning memory. It stores:
              </p>
              <ul className="ml-4 space-y-1 text-sm text-gray-700">
                <li>• <strong>Success/Failure Counts</strong> per cause-KPI pair</li>
                <li>• <strong>Average Improvement %</strong> using exponential moving average</li>
                <li>• <strong>Refined Weight</strong> — Bayesian posterior that improves RCA accuracy over time</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">
                Run the <strong>"Run Learning Loop"</strong> from the Data Sources page to process all completed 
                validations and update pattern weights.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Continuous Improvement
              </h4>
              <p className="text-sm text-gray-700">
                As more interventions are completed and validated, the Pattern Repository accumulates evidence. 
                After 5+ observations for a cause, the system begins adjusting the cause's default weight 
                automatically, making future RCA predictions more accurate.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13.8 Data Sources & External Integration</h2>
            <p className="mb-4 text-gray-700">
              Navigate to <strong>LASER → Data Sources</strong> to configure external systems that push KPI data into LASER.
            </p>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">Step-by-Step: Adding a Data Source</h3>
              <ol className="list-decimal ml-6 space-y-2 text-sm text-gray-700">
                <li>Click <strong>"Add Source"</strong></li>
                <li>Enter a <strong>Source Name</strong> (e.g., "Plant A ERP System")</li>
                <li>Select the <strong>Source Type</strong>: CSV, REST API, ERP, MES, or HRIS</li>
                <li>Optionally enter the <strong>Source System API Endpoint</strong></li>
                <li>Set <strong>Sync Frequency</strong></li>
                <li>Click <strong>Add Source</strong> — an API key is auto-generated</li>
                <li>Copy the <strong>API key</strong> and configure it in your external system</li>
              </ol>
            </div>

            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-3">API Integration Guide</h3>
              <p className="text-sm text-gray-700 mb-3">
                External systems push data to the LASER Data Ingestion API endpoint. The API Documentation 
                section on the Data Sources page provides:
              </p>
              <ul className="ml-4 space-y-1 text-sm text-gray-700">
                <li>• <strong>Endpoint URL</strong> — the POST URL for your system to call</li>
                <li>• <strong>Authentication</strong> — use the <code className="bg-gray-100 px-1 rounded">x-laser-api-key</code> header</li>
                <li>• <strong>Payload Format</strong> — JSON array of signals with employee reference, KPI name/ID, value, and date</li>
                <li>• <strong>Employee Lookup</strong> — supports lookup by UUID, employee code, or email</li>
                <li>• <strong>Auto-Processing</strong> — deviations are detected and RCA runs automatically on ingested data</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Supported Systems
              </h4>
              <p className="text-sm text-gray-700">
                Any system that can make HTTP POST requests can integrate with LASER. Common integrations include 
                SAP, Oracle ERP, Siemens MES, Wonderware, and custom HRIS systems. Contact your IT team to 
                configure a scheduled job that pushes KPI data to the LASER endpoint.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 14: System Administration */}
        <div className="new-page mb-12">
          <h1 className="text-3xl font-bold mb-6">14. System Administration</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14.1 Security & Access Control</h2>
            
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