import React, { createContext, useContext, useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';

interface SkillResponse {
  id: number;
  name: string;
  level: number;
  category: string;
}

interface Skill extends SkillResponse {
  visual: {
    scale: number;
    emissiveIntensity: number;
    rotationSpeed: number;
    floatIntensity: number;
  };
}

interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
}

interface AppContextType {
  user: User | null;
  skills: Skill[];
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  refreshSkills: () => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id' | 'visual'>) => Promise<void>;
  updateSkill: (id: number, skill: Partial<Omit<Skill, 'id' | 'visual'>>) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fetch skills whenever user changes
  useEffect(() => {
    if (user) {
      refreshSkills();
    } else {
      setSkills([]);
    }
  }, [user]);

  const refreshSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await skillsAPI.getSkills();
      const data = response as SkillResponse[];
      
      // Transform API response into our Skill interface with visual parameters
      const validatedSkills: Skill[] = data.map((skill) => ({
        ...skill,
        visual: {
          scale: 0.2 + (skill.level * 0.08), // Scale based on skill level
          emissiveIntensity: 0.2 * (skill.level / 3), // Glow intensity based on skill level
          rotationSpeed: 0.5 + (skill.level * 0.2), // Rotation speed based on skill level
          floatIntensity: 0.05 + (skill.level * 0.02) // Float intensity based on skill level
        }
      }));
      
      setSkills(validatedSkills);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load skills');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skill: Omit<Skill, 'id' | 'visual'>) => {
    try {
      setLoading(true);
      setError(null);
      await skillsAPI.addSkill(skill);
      await refreshSkills();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSkill = async (id: number, skill: Partial<Omit<Skill, 'id' | 'visual'>>) => {
    try {
      setLoading(true);
      setError(null);
      await skillsAPI.updateSkill(id, skill);
      await refreshSkills();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await skillsAPI.deleteSkill(id);
      await refreshSkills();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete skill');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSkills([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        skills,
        loading,
        error,
        setUser,
        refreshSkills,
        addSkill,
        updateSkill,
        deleteSkill,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
