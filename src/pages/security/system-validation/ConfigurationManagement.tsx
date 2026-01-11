import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function SVConfigurationManagement() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Button variant="ghost" onClick={() => navigate("/security/system-validation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to System Validation
        </Button>
        <div className="flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Configuration Management (CMDB)</h1>
            <p className="text-muted-foreground">Manage configuration items, baselines, and change records.</p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>CMDB Console</CardTitle>
          <CardDescription>Placeholder page — wire to your CMDB data source when ready.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page is now reachable from “Manage CMDB”.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
