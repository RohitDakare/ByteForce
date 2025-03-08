import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Users, 
  Zap, 
  Bell, 
  Settings, 
  User,
  MessageSquare,
  LogOut,
  TrendingUp,
  GraduationCap,
  Briefcase,
  BookOpen,
  Bookmark,
  LineChart
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillCluster from './SkillCluster';
import UserProfile from './UserProfile';
import TrendingSkills from './TrendingSkills';
import PeerGrid from './PeerGrid';
import EducationPanel from './EducationPanel';
import Courses from './Courses';
import Watchlist from './Watchlist';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
}

function StatCard({ icon: Icon, title, value, change }: {
  icon: typeof Brain;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-50 rounded-lg">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-primary-600 mt-1">{change}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Sidebar({ activeSection, onSectionChange }: { 
  activeSection: string; 
  onSectionChange: (section: string) => void;
}) {
  const { logout } = useAuth();

  const menuItems = [
    { icon: User, label: 'Profile', action: () => onSectionChange('Profile') },
    { icon: BookOpen, label: 'Courses', action: () => onSectionChange('Courses') },
    { icon: Bookmark, label: 'Watchlist', action: () => onSectionChange('Watchlist') },
    { icon: LineChart, label: 'Progress', action: () => onSectionChange('Progress') },
    { icon: GraduationCap, label: 'Colleges', action: () => onSectionChange('Colleges') },
    { icon: Briefcase, label: 'Internships', action: () => onSectionChange('Internships') },
    { icon: Bell, label: 'Notifications', action: () => onSectionChange('Notifications') },
    { icon: MessageSquare, label: 'Messages', action: () => onSectionChange('Messages') },
    { icon: Settings, label: 'Settings', action: () => onSectionChange('Settings') },
    { icon: LogOut, label: 'Logout', action: logout }
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-6 fixed left-0 top-0 overflow-y-auto">
      <UserProfile />
      <nav className="mt-8">
        {menuItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 5 }}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              activeSection === item.label && item.label !== 'Logout'
                ? 'text-primary-600 bg-primary-50' 
                : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
            }`}
            onClick={item.action}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </div>
  );
}

function Dashboard() {
  const [activeSection, setActiveSection] = useState('Profile');
  const [watchlist, setWatchlist] = useState<Course[]>([]);

  const handleAddToWatchlist = (course: Course) => {
    if (watchlist.some(item => item.id === course.id)) {
      setWatchlist(watchlist.filter(item => item.id !== course.id));
    } else {
      setWatchlist([...watchlist, course]);
    }
  };

  const handleRemoveFromWatchlist = (courseId: number) => {
    setWatchlist(watchlist.filter(item => item.id !== courseId));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Courses':
        return <Courses watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} />;
      case 'Watchlist':
        return <Watchlist watchlist={watchlist} onRemoveFromWatchlist={handleRemoveFromWatchlist} />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Brain}
                title="Skills in Progress"
                value="5"
                change="+2 this week"
              />
              <StatCard
                icon={Target}
                title="Learning Goals"
                value="8"
                change="3 completed"
              />
              <StatCard
                icon={Users}
                title="Peer Connections"
                value="12"
                change="+4 new matches"
              />
              <StatCard
                icon={Zap}
                title="Activity Score"
                value="856"
                change="+123 points"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Skill Cluster</h2>
                  <SkillCluster />
                </div>
                <EducationPanel />
              </div>
              <div className="space-y-6">
                <TrendingSkills />
                <PeerGrid />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="pl-64 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {activeSection}
              </h1>
              <p className="text-gray-600 mt-2">
                {activeSection === 'Courses' 
                  ? 'Explore our curated collection of courses'
                  : activeSection === 'Watchlist'
                  ? 'Your saved courses for later'
                  : 'Build your future, one skill at a time'}
              </p>
            </div>
            {activeSection !== 'Watchlist' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white font-medium shadow-lg"
              >
                {activeSection === 'Courses' ? 'Browse All Courses' : 'Start Learning'}
              </motion.button>
            )}
          </div>

          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;