import React from 'react';
import { motion } from 'framer-motion';

function UserProfile() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-24 h-24 mx-auto mb-4"
      >
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces"
          alt="User Avatar"
          className="w-full h-full rounded-full object-cover border-2 border-primary-500"
        />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </motion.div>
      <h3 className="font-semibold text-gray-900">Alex Thompson</h3>
      <p className="text-sm text-gray-600">Data Science Cluster</p>
    </div>
  );
}

export default UserProfile;