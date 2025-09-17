import { ComingSoonPage } from "@/components/lti/ComingSoonPage";
import { Wrench } from "lucide-react";

const LTITools = () => {
  return (
    <ComingSoonPage
      title="LTI Tools"
      description="Browse, configure, and manage LTI tools from various providers to enhance your learning experience with interactive content and assessments."
      icon={<Wrench className="w-10 h-10 text-primary" />}
      features={[
        "Browse catalog of available LTI tools",
        "Configure tool-specific settings and permissions",
        "Manage tool placements within courses",
        "Monitor tool usage and performance metrics",
        "Handle tool updates and version management",
        "Custom tool deployment and configuration"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default LTITools;