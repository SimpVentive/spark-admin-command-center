import { ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function SVEnvironmentManagement() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Button variant="ghost" onClick={() => navigate("/security/system-validation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to System Validation
        </Button>
        <div className="flex items-center gap-2">
          <Layers className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Environment Control</h1>
            <p className="text-muted-foreground">Segregation, promotion gates, and environment controls.</p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Environments</CardTitle>
          <CardDescription>Placeholder page — define dev/test/prod promotion workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This page is now reachable from “Environment Control”.</p>
        </CardContent>
      </Card>
    </div>
  );
}
