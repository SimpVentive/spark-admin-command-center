import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAIInsights from "@/components/ai/AdminAIInsights";
import ContentManagementAI from "@/components/ai/ContentManagementAI";
import LearningPathAnalytics from "@/components/ai/LearningPathAnalytics";
import { Brain, BarChart3, FileText, Users } from "lucide-react";

const AIAdminPage = () => {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Admin Center</h1>
          <p className="text-muted-foreground">
            Intelligent insights and automated content management for learning administrators
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content AI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Path Analytics
          </TabsTrigger>
          <TabsTrigger value="learners" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Learner Intelligence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <AdminAIInsights />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentManagementAI />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <LearningPathAnalytics />
        </TabsContent>

        <TabsContent value="learners" className="mt-6">
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Learner Intelligence Dashboard</h3>
            <p className="text-muted-foreground">Advanced learner analytics and AI-powered insights coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAdminPage;