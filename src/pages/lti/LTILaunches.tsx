import { ComingSoonPage } from "@/components/lti/ComingSoonPage";
import { Rocket } from "lucide-react";

const LTILaunches = () => {
  return (
    <ComingSoonPage
      title="LTI Launches"
      description="Monitor and manage LTI tool launches, track user sessions, and analyze tool usage patterns across your organization."
      icon={<Rocket className="w-10 h-10 text-primary" />}
      features={[
        "Real-time monitoring of LTI tool launches",
        "Track user sessions and activity logs",
        "Analyze tool usage patterns and engagement",
        "Debug launch failures and connection issues",
        "Generate usage reports and analytics",
        "Manage launch context and user data"
      ]}
      expectedDate="Q1 2025"
    />
  );
};

export default LTILaunches;