import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Users, Globe } from 'lucide-react';
import { Badge } from './ui/badge';

interface NetworkStatusProps {
  isOnline: boolean;
  peerCount: number;
  onModeChange: (isOnline: boolean) => void;
}

export function NetworkStatus({ isOnline, peerCount, onModeChange }: NetworkStatusProps) {
  const [networkStrength, setNetworkStrength] = useState(3);
  const [dataUsage, setDataUsage] = useState(0);

  useEffect(() => {
    // Simulate network strength fluctuation
    const interval = setInterval(() => {
      if (isOnline) {
        setNetworkStrength(Math.floor(Math.random() * 3) + 2); // 2-4 bars
        setDataUsage(prev => prev + Math.random() * 0.1); // Simulate data usage
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOnline]);

  const getSignalBars = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-3 ${
          i < networkStrength ? 'bg-green-500' : 'bg-gray-300'
        } rounded-sm`}
        style={{ height: `${(i + 1) * 3 + 3}px` }}
      />
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Network Status
        </h4>
        
        <button
          onClick={() => onModeChange(!isOnline)}
          className="text-xs px-2 py-1 rounded bg-muted hover:bg-accent transition-colors"
        >
          Switch to {isOnline ? 'Offline' : 'Online'}
        </button>
      </div>

      <div className="space-y-3">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm">
              {isOnline ? 'Online Mode' : 'Offline Mode'}
            </span>
          </div>
          
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? 'Connected' : 'Simulation'}
          </Badge>
        </div>

        {/* Signal Strength */}
        {isOnline && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Signal Strength</span>
            <div className="flex items-end gap-0.5">
              {getSignalBars()}
            </div>
          </div>
        )}

        {/* Peer Connection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Connected Peers</span>
          </div>
          <Badge variant="outline">{peerCount}</Badge>
        </div>

        {/* Data Usage */}
        {isOnline && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Data Usage</span>
            <span className="text-xs text-muted-foreground">
              {dataUsage.toFixed(2)} MB
            </span>
          </div>
        )}

        {/* Mode Description */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          {isOnline ? (
            <p>Real-time peer communication via Firebase. GPS tracking active.</p>
          ) : (
            <p>Simulated peer vehicles for testing. No network required.</p>
          )}
        </div>
      </div>
    </div>
  );
}