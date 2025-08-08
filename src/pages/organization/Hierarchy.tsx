
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WYSIWYGOrgChart from "@/components/WYSIWYGOrgChart";

const Hierarchy = () => {
  const { toast } = useToast();

  const handleExportChart = () => {
    toast({
      title: "Export Started",
      description: "Organizational chart is being exported as PDF...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporting Structure</h1>
          <p className="text-muted-foreground">View and edit organizational hierarchy and reporting relationships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportChart} className="gap-2">
            <Download className="h-4 w-4" />
            Export Chart
          </Button>
        </div>
      </div>

      <WYSIWYGOrgChart />
    </div>
  );
};

export default Hierarchy;
