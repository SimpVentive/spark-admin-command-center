import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CostAnalysis = () => {
  const { data: costData = [], isLoading } = useQuery({
    queryKey: ["roi-costs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("roi_cost_entries").select("*").order("category");
      if (error) throw error;
      return (data || []).map((item) => ({
        ...item,
        budget: Number(item.budget),
        actual: Number(item.actual),
        variance: Number(item.actual) - Number(item.budget),
      }));
    },
  });

  const totalBudget = costData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = costData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cost Analysis</h1>
        <p className="text-muted-foreground">Training budget and expenditure analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Actual</p>
                <p className="text-2xl font-bold">${totalActual.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {totalVariance < 0 ? <TrendingDown className="h-8 w-8 text-green-600" /> : <TrendingUp className="h-8 w-8 text-red-600" />}
              <div>
                <p className="text-sm text-muted-foreground">Variance</p>
                <p className={`text-2xl font-bold ${totalVariance < 0 ? "text-green-600" : "text-red-600"}`}>
                  {totalVariance < 0 ? "-" : "+"}${Math.abs(totalVariance).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cost Breakdown</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : costData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cost entries yet. Add budget data to see the breakdown.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.period}</TableCell>
                    <TableCell className="text-right">${item.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.actual.toLocaleString()}</TableCell>
                    <TableCell className={`text-right ${item.variance < 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.variance < 0 ? "-" : "+"}${Math.abs(item.variance).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.variance <= 0 ? "default" : "destructive"}>
                        {item.variance <= 0 ? "Under Budget" : "Over Budget"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CostAnalysis;
