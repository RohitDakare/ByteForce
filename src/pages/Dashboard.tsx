
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import AppLayout from "@/components/AppLayout";
import SkillCluster from "@/components/SkillCluster";
import RecommendedCourses from "@/components/RecommendedCourses";
import SkillProgress from "@/components/SkillProgress";

type Profile = {
  id: string;
  full_name: string;
  skills: string[];
  career_goal: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProfile(data as Profile);
          
          // If user hasn't completed onboarding, redirect to onboarding
          if (!data.onboarding_completed) {
            navigate("/onboarding");
          }
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [navigate, toast]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-xl">Loading your dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}</h1>
            <p className="text-muted-foreground">
              Your learning journey towards becoming a {profile?.career_goal}
            </p>
          </div>
          <div className="glass-card p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Overall Progress</div>
            <Progress value={33} className="h-2 mt-2" />
          </div>
        </div>

        <Card className="glass-card border-white/10">
          <CardHeader className="pb-2">
            <CardTitle>Your Skill Cluster</CardTitle>
            <CardDescription>
              Visualizing your skills and their connections
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <SkillCluster skills={profile?.skills || []} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-white/10 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Recommended Next Steps</CardTitle>
              <CardDescription>
                Personalized learning recommendations for your career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="courses">
                <TabsList className="bg-white/5">
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="courses" className="mt-4">
                  <RecommendedCourses skills={profile?.skills || []} goal={profile?.career_goal || ""} />
                </TabsContent>
                <TabsContent value="projects" className="mt-4">
                  <div className="text-muted-foreground text-center py-6">
                    Project recommendations coming soon!
                  </div>
                </TabsContent>
                <TabsContent value="resources" className="mt-4">
                  <div className="text-muted-foreground text-center py-6">
                    Resource recommendations coming soon!
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle>Skill Progress</CardTitle>
              <CardDescription>
                Track your improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillProgress skills={profile?.skills || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
