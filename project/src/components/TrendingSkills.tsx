import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const trendingSkills = [
  { name: 'Python + AWS', change: '+25%', color: 'text-primary-600' },
  { name: 'React Native', change: '+18%', color: 'text-primary-600' },
  { name: 'Data Science', change: '+15%', color: 'text-primary-600' },
];

function TrendingSkills() {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Trending Skills</h2>
      </div>
      <div className="space-y-4">
        {trendingSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
          >
            <span className="text-gray-700">{skill.name}</span>
            <div className="flex items-center gap-1">
              <ArrowUpRight className={`w-4 h-4 ${skill.color}`} />
              <span className={skill.color}>{skill.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TrendingSkills;