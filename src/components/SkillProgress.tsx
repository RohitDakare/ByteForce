
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Progress } from "@/components/ui/progress";

interface SkillProgressProps {
  skills: string[];
}

const SkillProgress: React.FC<SkillProgressProps> = ({ skills }) => {
  // Generate random progress for each skill (in a real app, this would come from user data)
  const skillProgress = skills.map(skill => ({
    name: skill,
    progress: Math.floor(Math.random() * 100)
  }));

  // Sort by progress
  skillProgress.sort((a, b) => b.progress - a.progress);

  if (skills.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-muted-foreground">No skills selected yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skillProgress.map(skill => (
        <div key={skill.name} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span>{skill.name}</span>
            <span className="text-muted-foreground">{skill.progress}%</span>
          </div>
          <Progress value={skill.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default SkillProgress;
