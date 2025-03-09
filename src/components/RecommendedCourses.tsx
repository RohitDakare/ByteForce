
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Star } from "lucide-react";
import { getCourseRecommendations } from "@/lib/api";
import { motion } from "framer-motion";

interface Course {
  id: string;
  title: string;
  provider: string;
  rating: number;
  skills: string[];
  level: string;
  url: string;
  duration: string;
}

interface RecommendedCoursesProps {
  skills: string[];
  goal: string;
}

const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({ skills, goal }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (skills.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch courses from API integration
        const recommendations = await getCourseRecommendations(skills, goal);
        setCourses(recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        // Fallback to mock data
        setTimeout(() => {
          const mockCourses = getMockCourses(skills, goal);
          setCourses(mockCourses);
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [skills, goal]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/5 border-white/5 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 w-3/4 bg-white/10 rounded"></div>
              <div className="h-4 w-1/2 bg-white/10 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-white/10 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No recommendations yet</h3>
        <p className="text-muted-foreground">
          Add more skills to your profile to get personalized course recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course, index) => (
        <motion.div 
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="glass-card hover:bg-white/5 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="flex items-center">
                {course.provider}
                <div className="flex items-center ml-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(course.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} 
                    />
                  ))}
                  <span className="ml-1 text-xs">{course.rating.toFixed(1)}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {course.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="bg-white/10">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Level: {course.level}</span>
                <span>{course.duration}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-kronus-purple to-kronus-blue hover:opacity-90 transition-opacity"
                onClick={() => window.open(course.url, "_blank")}
              >
                Enroll Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Mock data function for fallback
function getMockCourses(skills: string[], goal: string): Course[] {
  // Sample courses based on common skills and goals
  const coursesDatabase = [
    {
      id: "1",
      title: "Machine Learning Specialization",
      provider: "Coursera",
      rating: 4.8,
      skills: ["Python", "Machine Learning", "Data Analysis"],
      level: "Intermediate",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      duration: "3 months"
    },
    {
      id: "2",
      title: "React - The Complete Guide",
      provider: "Udemy",
      rating: 4.7,
      skills: ["JavaScript", "React", "Web Development"],
      level: "All Levels",
      url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
      duration: "40 hours"
    },
    {
      id: "3",
      title: "AWS Certified Solutions Architect",
      provider: "A Cloud Guru",
      rating: 4.9,
      skills: ["AWS", "Cloud", "DevOps"],
      level: "Advanced",
      url: "https://www.pluralsight.com/cloud-guru/courses/aws-certified-solutions-architect-associate",
      duration: "60 hours"
    },
    {
      id: "4",
      title: "Deep Learning Specialization",
      provider: "Coursera",
      rating: 4.9,
      skills: ["Python", "Deep Learning", "Neural Networks"],
      level: "Intermediate",
      url: "https://www.coursera.org/specializations/deep-learning",
      duration: "3 months"
    },
    {
      id: "5",
      title: "The Complete JavaScript Course",
      provider: "Udemy",
      rating: 4.7,
      skills: ["JavaScript", "Web Development", "HTML", "CSS"],
      level: "Beginner",
      url: "https://www.udemy.com/course/the-complete-javascript-course/",
      duration: "69 hours"
    },
    {
      id: "6",
      title: "Python for Data Science and Machine Learning",
      provider: "Udemy",
      rating: 4.6,
      skills: ["Python", "Data Science", "Machine Learning"],
      level: "Intermediate",
      url: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/",
      duration: "25 hours"
    }
  ];

  // Filter and return relevant courses based on skills and goals
  const relevantCourses = coursesDatabase.filter(course => {
    // Check if the course has any of the user's skills
    const hasRelevantSkill = course.skills.some(skill => 
      skills.includes(skill) || skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    // Check if the course is relevant to the career goal
    const isRelevantToGoal = 
      goal.toLowerCase().includes("data") && (course.skills.includes("Data Science") || course.skills.includes("Machine Learning")) ||
      goal.toLowerCase().includes("web") && (course.skills.includes("JavaScript") || course.skills.includes("React")) ||
      goal.toLowerCase().includes("cloud") && (course.skills.includes("AWS") || course.skills.includes("Cloud")) ||
      goal.toLowerCase().includes("machine learning") && (course.skills.includes("Machine Learning") || course.skills.includes("Deep Learning")) ||
      goal.toLowerCase().includes("full stack") && (course.skills.includes("JavaScript") || course.skills.includes("React"));
    
    return hasRelevantSkill || isRelevantToGoal;
  });

  // If no courses match, return some default recommendations
  return relevantCourses.length > 0 ? relevantCourses : coursesDatabase.slice(0, 3);
}

export default RecommendedCourses;
