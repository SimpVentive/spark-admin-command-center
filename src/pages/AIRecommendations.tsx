import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileForm from "@/components/ai/UserProfileForm";
import AIRecommendations from "@/components/ai/AIRecommendations";
import { Brain, User } from "lucide-react";

const AIRecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Learning</h1>
          <p className="text-muted-foreground">
            Complete your profile to get personalized learning recommendations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Learning Profile
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <UserProfileForm onProfileUpdate={() => setActiveTab("recommendations")} />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <AIRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIRecommendationsPage;