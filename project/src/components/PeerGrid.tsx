import React from 'react';
import { Users, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const peers = [
  {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
    skills: ['Python', 'ML'],
    online: true,
  },
  {
    name: 'Mike Ross',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
    skills: ['AWS', 'Data'],
    online: false,
  },
  {
    name: 'Lisa Kim',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
    skills: ['Python', 'AWS'],
    online: true,
  },
];

function PeerGrid() {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Peers in Your Cluster</h2>
      </div>
      <div className="grid gap-4">
        {peers.map((peer, index) => (
          <motion.div
            key={peer.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg"
          >
            <div className="relative">
              <img
                src={peer.avatar}
                alt={peer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  peer.online ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{peer.name}</h3>
              <p className="text-sm text-gray-600">{peer.skills.join(' • ')}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PeerGrid;