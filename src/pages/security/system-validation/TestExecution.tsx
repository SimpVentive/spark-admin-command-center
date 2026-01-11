import { ArrowLeft, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function SVTestExecution() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Button variant="ghost" onClick={() => navigate("/security/system-validation")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to System Validation
        </Button>
        <div className="flex items-center gap-2">
          <TestTube className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Test Manager</h1>
            <p className="text-muted-foreground">Track test cases, executions, and evidence.</p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Test Executions</CardTitle>
          <CardDescription>Placeholder page — connect to your test management system.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This page is now reachable from “Test Manager”.</p>
        </CardContent>
      </Card>
    </div>
  );
}
