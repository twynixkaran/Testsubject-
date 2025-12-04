import React from 'react';
import { AlertTriangle, Shield, Wifi, Battery, Satellite } from 'lucide-react';
import { Badge } from './ui/badge';
import { AlertLevel } from '../App';

interface HeaderProps {
  alertLevel: AlertLevel;
}

export function Header({ alertLevel }: HeaderProps) {
  const getStatusColor = () => {
    switch (alertLevel) {
      case 'DANGER': return 'bg-red-500';
      case 'WARNING': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusIcon = () => {
    switch (alertLevel) {
      case 'DANGER': return <AlertTriangle className="w-4 h-4" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg leading-tight">DRISHTI</h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Collision Avoidance System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* System Status */}
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} text-white border-none`}
          >
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs">{alertLevel}</span>
            </span>
          </Badge>

          {/* Connection Status */}
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-green-500" />
            <Satellite className="w-4 h-4 text-blue-500" />
            <Battery className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>NavIC/GPS Active</span>
        <span>Network: Connected</span>
        <span>Battery: 87%</span>
      </div>
    </header>
  );
}