
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrainCog, GraduationCap, LineChart, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <BrainCog className="h-8 w-8 text-kronus-purple" />
          <h1 className="text-2xl font-bold text-gradient">Kronus</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-kronus-purple to-kronus-blue hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Build your future,</span> <br />
            one skill at a time
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            AI-driven skill clustering & adaptive learning platform that connects you with the perfect resources, peers, and career opportunities.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/register")}
            className="bg-gradient-to-r from-kronus-purple to-kronus-blue hover:opacity-90 transition-opacity text-lg py-6 px-8"
          >
            Start Your Learning Journey
          </Button>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-black/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How Kronus Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-kronus-purple/20 flex items-center justify-center mb-4">
                  <BrainCog className="h-8 w-8 text-kronus-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Clustering</h3>
                <p className="text-muted-foreground">Groups users by skills, goals, and engagement patterns for a tailored experience.</p>
              </div>
              
              <div className="glass-card p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-kronus-blue/20 flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-kronus-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Adaptive Learning</h3>
                <p className="text-muted-foreground">Personalized learning paths that adjust in real-time based on your progress and goals.</p>
              </div>
              
              <div className="glass-card p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-kronus-accent/20 flex items-center justify-center mb-4">
                  <LineChart className="h-8 w-8 text-kronus-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">Job Market Pulse</h3>
                <p className="text-muted-foreground">Real-time industry data to align your learning with in-demand skills and opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section (Mock) */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Join a Growing Community</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-kronus-purple/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-kronus-purple" />
                  </div>
                  <div>
                    <p className="font-medium">Data Science Cluster</p>
                    <p className="text-sm text-muted-foreground">2,500+ members</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Connect with peers learning Python, SQL, machine learning, and data visualization.</p>
              </div>
              
              <div className="glass-card p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-kronus-blue/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-kronus-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Web Development Cluster</p>
                    <p className="text-sm text-muted-foreground">3,200+ members</p>
                  </div>
                </div>
                <p className="text-muted-foreground">Join developers learning React, Node.js, TypeScript, and modern web frameworks.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <BrainCog className="h-6 w-6 text-kronus-purple" />
            <span className="text-lg font-medium text-gradient">Kronus</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kronus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
