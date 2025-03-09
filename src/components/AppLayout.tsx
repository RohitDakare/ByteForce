
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { BrainCog, LayoutDashboard, BookOpen, Users, Briefcase, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        navigate("/login");
        return;
      }
      
      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.session.user.id)
        .single();
        
      setUser(userData);
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-kronus-dark border-r border-white/10">
          <div className="flex items-center gap-2 px-4 py-6">
            <BrainCog className="h-6 w-6 text-kronus-purple" />
            <h1 className="text-lg font-bold text-gradient">Kronus</h1>
          </div>
          
          <SidebarContent className="px-2">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/courses")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Courses
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/community")}
              >
                <Users className="mr-2 h-5 w-5" />
                Community
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/opportunities")}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Opportunities
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="px-4 py-4">
            {user && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-kronus-purple/20 text-kronus-purple">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.full_name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Separator className="bg-white/10 mb-4" />
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            )}
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <SidebarTrigger />
            <h2 className="text-lg font-medium">Kronus Learning Platform</h2>
            <div className="w-8"></div> {/* For layout balance */}
          </div>
          
          <div className="h-[calc(100vh-65px)] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
