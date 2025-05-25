import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShirtIcon } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-full p-4 mb-4"
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1] 
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <ShirtIcon size={64} className="text-blue-600" />
        </motion.div>
        <motion.h1
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Virtual Closet
        </motion.h1>
        <motion.p
          className="text-blue-100 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Your personal style assistant
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SplashScreen;