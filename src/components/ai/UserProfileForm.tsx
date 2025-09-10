import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, User, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileFormProps {
  onProfileUpdate?: () => void;
}

interface Skill {
  skill_name: string;
  proficiency_level: string;
  confidence_score: number;
  competency_id?: string;
}

const UserProfileForm = ({ onProfileUpdate }: UserProfileFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("skills");
  const [loading, setLoading] = useState(false);
  
  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ skill_name: "", proficiency_level: "beginner", confidence_score: 50 });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    job_role: "",
    career_goals: [] as string[],
    preferred_learning_style: "mixed",
    difficulty_preference: "adaptive",
    topics_of_interest: [] as string[],
    preferred_duration_minutes: 30
  });
  
  const [newCareerGoal, setNewCareerGoal] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [competencies, setCompetencies] = useState([]);

  useEffect(() => {
    loadUserProfile();
    loadCompetencies();
  }, []);

  const loadCompetencies = async () => {
    try {
      const { data, error } = await supabase
        .from('competencies')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      setCompetencies(data || []);
    } catch (error) {
      console.error('Error loading competencies:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [skillsResult, preferencesResult] = await Promise.all([
        supabase.from('user_skills').select('*').eq('user_id', user.id),
        supabase.from('learning_preferences').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      if (skillsResult.data) {
        setSkills(skillsResult.data);
      }

      if (preferencesResult.data) {
        setPreferences({
          job_role: preferencesResult.data.job_role || "",
          career_goals: preferencesResult.data.career_goals || [],
          preferred_learning_style: preferencesResult.data.preferred_learning_style || "mixed",
          difficulty_preference: preferencesResult.data.difficulty_preference || "adaptive",
          topics_of_interest: preferencesResult.data.topics_of_interest || [],
          preferred_duration_minutes: preferencesResult.data.preferred_duration_minutes || 30
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const addSkill = async () => {
    if (!newSkill.skill_name.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const skillData = {
        user_id: user.id,
        skill_name: newSkill.skill_name,
        proficiency_level: newSkill.proficiency_level,
        confidence_score: newSkill.confidence_score,
        source: 'self_reported'
      };

      const { error } = await supabase.from('user_skills').insert(skillData);
      if (error) throw error;

      setSkills([...skills, skillData]);
      setNewSkill({ skill_name: "", proficiency_level: "beginner", confidence_score: 50 });

      toast({
        title: "Skill Added",
        description: `${newSkill.skill_name} has been added to your profile`,
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (index: number) => {
    try {
      const skill = skills[index];
      if (skill.skill_name) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', user.id)
          .eq('skill_name', skill.skill_name);
      }

      const updatedSkills = skills.filter((_, i) => i !== index);
      setSkills(updatedSkills);

      toast({
        title: "Skill Removed",
        description: "Skill has been removed from your profile",
      });
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const addCareerGoal = () => {
    if (!newCareerGoal.trim() || preferences.career_goals.includes(newCareerGoal)) return;
    setPreferences({
      ...preferences,
      career_goals: [...preferences.career_goals, newCareerGoal]
    });
    setNewCareerGoal("");
  };

  const removeCareerGoal = (goal: string) => {
    setPreferences({
      ...preferences,
      career_goals: preferences.career_goals.filter(g => g !== goal)
    });
  };

  const addTopic = () => {
    if (!newTopic.trim() || preferences.topics_of_interest.includes(newTopic)) return;
    setPreferences({
      ...preferences,
      topics_of_interest: [...preferences.topics_of_interest, newTopic]
    });
    setNewTopic("");
  };

  const removeTopic = (topic: string) => {
    setPreferences({
      ...preferences,
      topics_of_interest: preferences.topics_of_interest.filter(t => t !== topic)
    });
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert learning preferences
      const { error } = await supabase
        .from('learning_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your learning profile has been updated successfully",
      });

      onProfileUpdate?.();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabContent = {
    skills: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Your Skills
          </h3>
          
          {skills.length > 0 && (
            <div className="grid gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{skill.skill_name}</span>
                    <Badge variant="secondary">{skill.proficiency_level}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {skill.confidence_score}% confident
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium">Add New Skill</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Skill name"
                value={newSkill.skill_name}
                onChange={(e) => setNewSkill({...newSkill, skill_name: e.target.value})}
              />
              <Select
                value={newSkill.proficiency_level}
                onValueChange={(value) => setNewSkill({...newSkill, proficiency_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Confidence %"
                  value={newSkill.confidence_score}
                  onChange={(e) => setNewSkill({...newSkill, confidence_score: parseInt(e.target.value) || 0})}
                />
                <Button onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    preferences: (
      <div className="space-y-6">
        <h3 className="font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Learning Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current Job Role</Label>
            <Select
              value={preferences.job_role}
              onValueChange={(value) => setPreferences({...preferences, job_role: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software_engineer">Software Engineer</SelectItem>
                <SelectItem value="data_scientist">Data Scientist</SelectItem>
                <SelectItem value="product_manager">Product Manager</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Learning Style</Label>
            <Select
              value={preferences.preferred_learning_style}
              onValueChange={(value) => setPreferences({...preferences, preferred_learning_style: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditory</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                <SelectItem value="reading_writing">Reading/Writing</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty Preference</Label>
            <Select
              value={preferences.difficulty_preference}
              onValueChange={(value) => setPreferences({...preferences, difficulty_preference: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="challenging">Challenging</SelectItem>
                <SelectItem value="adaptive">Adaptive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Session Duration (minutes)</Label>
            <Input
              type="number"
              min="15"
              max="180"
              value={preferences.preferred_duration_minutes}
              onChange={(e) => setPreferences({...preferences, preferred_duration_minutes: parseInt(e.target.value) || 30})}
            />
          </div>
        </div>
      </div>
    ),
    goals: (
      <div className="space-y-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Career Goals & Interests
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label>Career Goals</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.career_goals.map((goal, index) => (
                <Badge key={index} variant="default" className="flex items-center gap-1">
                  {goal}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCareerGoal(goal)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add career goal"
                value={newCareerGoal}
                onChange={(e) => setNewCareerGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCareerGoal()}
              />
              <Button onClick={addCareerGoal}>Add</Button>
            </div>
          </div>

          <div>
            <Label>Topics of Interest</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.topics_of_interest.map((topic, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {topic}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTopic(topic)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add topic of interest"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              />
              <Button onClick={addTopic}>Add</Button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Profile Setup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete your profile to get personalized learning recommendations powered by AI
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tabContent[activeTab as keyof typeof tabContent]}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveProfile} disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;