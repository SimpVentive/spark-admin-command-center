import ProgramCategoryManagement from "@/components/ProgramCategoryManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/programs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Program Category Management</h1>
          <p className="text-muted-foreground">Manage program categories and subcategories</p>
        </div>
      </div>

      <ProgramCategoryManagement showManagement={true} />
    </div>
  );
};

export default CategoryManagement;