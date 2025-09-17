import { ComingSoonPage } from "@/components/lti/ComingSoonPage";
import { FileText } from "lucide-react";

const GradePassback = () => {
  return (
    <ComingSoonPage
      title="Grade Passback"
      description="Automatically receive and manage grades from LTI tools, synchronize assessment results, and maintain comprehensive gradebooks."
      icon={<FileText className="w-10 h-10 text-primary" />}
      features={[
        "Automatic grade synchronization from LTI tools",
        "Configure grade passback settings and mappings",
        "Monitor grade delivery status and errors",
        "Maintain comprehensive gradebook records",
        "Handle multiple grading scales and formats",
        "Generate grade reports and analytics"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default GradePassback;