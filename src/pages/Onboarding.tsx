
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCog, Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

// Sample skills data
const SKILLS_DATA = {
  "Programming": ["Python", "JavaScript", "Java", "C++", "Ruby", "Go", "TypeScript", "PHP", "Swift", "Kotlin"],
  "Data Science": ["Machine Learning", "Data Analysis", "Statistics", "SQL", "Data Visualization", "Natural Language Processing", "Deep Learning", "Big Data", "R", "Pandas"],
  "Web Development": ["HTML", "CSS", "React", "Node.js", "Angular", "Vue.js", "Next.js", "Express", "Django", "Ruby on Rails"],
  "Cloud": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "DevOps", "Serverless", "CI/CD", "Terraform", "Microservices"],
  "Design": ["UI/UX", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign", "Prototyping", "User Research", "Responsive Design"]
};

const CAREER_GOALS = [
  "Software Engineer",
  "Data Scientist",
  "Full Stack Developer",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Product Manager",
  "UX Designer",
  "Cybersecurity Specialist",
  "AI Research Scientist"
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [customGoal, setCustomGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      } else {
        toast({
          title: "Maximum skills reached",
          description: "You can select up to 5 skills. Remove one to add another.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setCustomGoal("");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const careerGoal = selectedGoal === "Other" ? customGoal : selectedGoal;
      
      // Update user profile with skills and goals
      const { error } = await supabase
        .from('profiles')
        .update({ 
          skills: selectedSkills,
          career_goal: careerGoal,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your profile has been set up successfully!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-kronus-dark to-black">
      <div className="flex items-center gap-2 mb-8">
        <BrainCog className="h-8 w-8 text-kronus-purple" />
        <h1 className="text-2xl font-bold text-gradient">Kronus</h1>
      </div>

      <Card className="w-full max-w-3xl glass-card">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Set up your learning profile</CardTitle>
          <CardDescription className="text-center">
            Help us personalize your experience ({step}/2)
          </CardDescription>
          <div className="w-full bg-white/10 h-2 rounded-full mt-4">
            <div 
              className="bg-gradient-to-r from-kronus-purple to-kronus-blue h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium">Select your skills (up to 5)</h3>
              <div className="space-y-4">
                {Object.entries(SKILLS_DATA).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <Badge 
                          key={skill}
                          variant={selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            selectedSkills.includes(skill) 
                              ? "bg-kronus-purple hover:bg-kronus-purple/90" 
                              : "hover:bg-white/10"
                          }`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          {selectedSkills.includes(skill) && <Check className="mr-1 h-3 w-3" />}
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-white">{selectedSkills.length}/5</span> skills selected
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium">What's your career goal?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CAREER_GOALS.map(goal => (
                  <Button
                    key={goal}
                    type="button"
                    variant={selectedGoal === goal ? "default" : "outline"}
                    className={`justify-start h-auto p-4 ${
                      selectedGoal === goal 
                        ? "bg-kronus-purple hover:bg-kronus-purple/90" 
                        : "hover:bg-white/10"
                    }`}
                    onClick={() => handleGoalSelect(goal)}
                  >
                    {selectedGoal === goal && <Check className="mr-2 h-4 w-4" />}
                    {goal}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={selectedGoal === "Other" ? "default" : "outline"}
                  className={`justify-start h-auto p-4 ${
                    selectedGoal === "Other" 
                      ? "bg-kronus-purple hover:bg-kronus-purple/90" 
                      : "hover:bg-white/10"
                  }`}
                  onClick={() => handleGoalSelect("Other")}
                >
                  {selectedGoal === "Other" && <Check className="mr-2 h-4 w-4" />}
                  Other
                </Button>
              </div>
              
              {selectedGoal === "Other" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Specify your career goal:</h4>
                  <Input 
                    placeholder="E.g., Blockchain Developer" 
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              className="border-white/10 hover:bg-white/5"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 2 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={selectedSkills.length === 0}
              className="bg-gradient-to-r from-kronus-purple to-kronus-blue hover:opacity-90 transition-opacity"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || (!selectedGoal || (selectedGoal === "Other" && !customGoal))}
              className="bg-gradient-to-r from-kronus-purple to-kronus-blue hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
