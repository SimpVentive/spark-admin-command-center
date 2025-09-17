import { ComingSoonPage } from "@/components/lti/ComingSoonPage";
import { Plug } from "lucide-react";

const LTIProviders = () => {
  return (
    <ComingSoonPage
      title="LTI Providers"
      description="Manage and configure Learning Tools Interoperability (LTI) providers to seamlessly integrate external learning tools with your training platform."
      icon={<Plug className="w-10 h-10 text-primary" />}
      features={[
        "Register and configure LTI 1.3 compliant providers",
        "Manage provider authentication and security settings",
        "Monitor provider status and connection health",
        "Configure deep linking capabilities",
        "Handle provider-specific settings and parameters",
        "Automated provider discovery and registration"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default LTIProviders;