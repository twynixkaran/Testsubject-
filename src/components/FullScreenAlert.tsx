import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertLevel } from '../App';

interface FullScreenAlertProps {
  alertLevel: AlertLevel;
  isVisible: boolean;
  onDismiss: () => void;
  distance?: number;
  threatType?: 'vehicle' | 'hazard' | 'intersection';
}

export function FullScreenAlert({ 
  alertLevel, 
  isVisible, 
  onDismiss, 
  distance, 
  threatType = 'vehicle' 
}: FullScreenAlertProps) {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (!isVisible || alertLevel === 'SAFE') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Schedule dismiss for next tick to avoid setState during render
          setTimeout(() => onDismiss(), 0);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, alertLevel, onDismiss]);

  useEffect(() => {
    if (isVisible && alertLevel !== 'SAFE') {
      setTimeLeft(5);
    }
  }, [isVisible, alertLevel]);

  const getAlertConfig = () => {
    switch (alertLevel) {
      case 'DANGER':
        return {
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          icon: AlertTriangle,
          title: 'COLLISION RISK',
          message: 'IMMEDIATE ACTION REQUIRED',
          pulseColor: 'bg-red-400'
        };
      case 'WARNING':
        return {
          bgColor: 'bg-yellow-500',
          textColor: 'text-black',
          icon: AlertTriangle,
          title: 'PROXIMITY ALERT',
          message: 'MAINTAIN SAFE DISTANCE',
          pulseColor: 'bg-yellow-300'
        };
      default:
        return {
          bgColor: 'bg-green-600',
          textColor: 'text-white',
          icon: Shield,
          title: 'ALL CLEAR',
          message: 'SAFE TO PROCEED',
          pulseColor: 'bg-green-400'
        };
    }
  };

  const config = getAlertConfig();
  const Icon = config.icon;

  const getThreatMessage = () => {
    if (distance) {
      switch (threatType) {
        case 'vehicle':
          return `Vehicle detected ${distance.toFixed(0)}m ahead`;
        case 'hazard':
          return `Hazard zone ${distance.toFixed(0)}m ahead`;
        case 'intersection':
          return `Intersection ${distance.toFixed(0)}m ahead`;
        default:
          return `Object detected ${distance.toFixed(0)}m ahead`;
      }
    }
    return 'Check surroundings carefully';
  };

  return (
    <AnimatePresence>
      {isVisible && alertLevel !== 'SAFE' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed inset-0 z-50 ${config.bgColor} ${config.textColor} flex flex-col items-center justify-center`}
        >
          {/* Pulsing Background Effect */}
          <motion.div
            className={`absolute inset-0 ${config.pulseColor}`}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Content */}
          <div className="text-center z-10 space-y-6">
            {/* Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: alertLevel === 'DANGER' ? [0, 5, -5, 0] : [0]
              }}
              transition={{ 
                duration: alertLevel === 'DANGER' ? 0.5 : 1, 
                repeat: Infinity 
              }}
              className="flex justify-center"
            >
              <Icon className="w-24 h-24" />
            </motion.div>

            {/* Alert Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl tracking-wider"
            >
              {config.title}
            </motion.h1>

            {/* Alert Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl opacity-90"
            >
              {config.message}
            </motion.p>

            {/* Threat Details */}
            {distance && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black bg-opacity-30 rounded-lg p-4 mx-8"
              >
                <p className="text-lg">{getThreatMessage()}</p>
              </motion.div>
            )}

            {/* Action Instructions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              {alertLevel === 'DANGER' && (
                <div className="space-y-1">
                  <p className="text-lg">⚠️ BRAKE IMMEDIATELY</p>
                  <p className="text-sm opacity-75">Reduce speed and increase following distance</p>
                </div>
              )}
              {alertLevel === 'WARNING' && (
                <div className="space-y-1">
                  <p className="text-lg">⚡ REDUCE SPEED</p>
                  <p className="text-sm opacity-75">Maintain awareness of surroundings</p>
                </div>
              )}
            </motion.div>

            {/* Auto-dismiss countdown */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 text-sm opacity-75"
            >
              <span>Auto-dismiss in</span>
              <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center">
                {timeLeft}
              </div>
              <span>seconds</span>
            </motion.div>
          </div>

          {/* Dismiss Instruction */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-8 text-center text-sm opacity-75"
          >
            <p>Tap anywhere or wait to dismiss</p>
          </motion.div>

          {/* Tap to dismiss overlay */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onDismiss}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}