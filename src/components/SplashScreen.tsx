import React, { useEffect, useState } from 'react';
import { Shield, Satellite, Car } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo Section */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center mb-8 z-10"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
          <Shield className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-4xl mb-2 tracking-wider">DRISHTI</h1>
        <p className="text-lg opacity-90 max-w-xs">
          Driving & Roving Intelligence through Smartphone Handsets Interface
        </p>
      </motion.div>

      {/* Feature Icons */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex gap-8 mb-12 z-10"
      >
        <div className="text-center">
          <Satellite className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">GPS/NavIC</span>
        </div>
        <div className="text-center">
          <Car className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Collision Detection</span>
        </div>
        <div className="text-center">
          <Shield className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Safety Alerts</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-64 bg-white/20 rounded-full h-2 overflow-hidden mb-4 z-10">
        <motion.div
          className="h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm opacity-75 z-10"
      >
        Initializing safety systems... {progress}%
      </motion.p>

      {/* Bottom Branding */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-center z-10"
      >
        <p className="text-xs opacity-60">
          Frugal Innovation for Road Safety
        </p>
        <p className="text-xs opacity-40 mt-1">
          Powered by AI & Smartphone Sensors
        </p>
      </motion.div>
    </div>
  );
}