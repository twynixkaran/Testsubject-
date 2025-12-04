import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Volume2, VolumeX, Vibrate } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertLevel } from '../App';

interface AlertSystemProps {
  alertLevel: AlertLevel;
  settings: {
    visualAlerts: boolean;
    audioAlerts: boolean;
    vibrationAlerts: boolean;
    sensitivity: string;
  };
}

export function AlertSystem({ alertLevel, settings }: AlertSystemProps) {
  const [alertHistory, setAlertHistory] = useState<Array<{
    time: string;
    level: AlertLevel;
    message: string;
  }>>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    // Add to alert history when level changes
    const now = new Date().toLocaleTimeString();
    let message = '';
    
    switch (alertLevel) {
      case 'DANGER':
        message = 'COLLISION RISK DETECTED - Immediate action required';
        // Simulate haptic feedback
        if (settings.vibrationAlerts && 'vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
        // Audio alert simulation
        if (settings.audioAlerts && audioEnabled) {
          playAlertSound('danger');
        }
        break;
      case 'WARNING':
        message = 'Potential collision risk - Maintain safe distance';
        if (settings.vibrationAlerts && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        if (settings.audioAlerts && audioEnabled) {
          playAlertSound('warning');
        }
        break;
      case 'SAFE':
        message = 'All clear - Safe to proceed';
        break;
    }

    if (message) {
      setAlertHistory(prev => [
        { time: now, level: alertLevel, message },
        ...prev.slice(0, 4) // Keep last 5 alerts
      ]);
    }
  }, [alertLevel, settings, audioEnabled]);

  const playAlertSound = (type: 'warning' | 'danger') => {
    // Simulate audio feedback with Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'danger') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.3);
      }

      oscillator.start();
    } catch (error) {
      console.log('Audio not available');
    }
  };

  const getAlertColor = () => {
    switch (alertLevel) {
      case 'DANGER': return 'border-red-500 bg-red-50';
      case 'WARNING': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getAlertIcon = () => {
    switch (alertLevel) {
      case 'DANGER': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'WARNING': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default: return <Shield className="w-6 h-6 text-green-600" />;
    }
  };

  const getAlertMessage = () => {
    switch (alertLevel) {
      case 'DANGER': return 'COLLISION RISK DETECTED';
      case 'WARNING': return 'MAINTAIN SAFE DISTANCE';
      default: return 'ALL SYSTEMS CLEAR';
    }
  };

  return (
    <Card className={`${getAlertColor()} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getAlertIcon()}
            Alert System
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="h-8 w-8 p-0"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            {settings.vibrationAlerts && (
              <Vibrate className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Alert */}
        <div className="text-center space-y-2">
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${
              alertLevel === 'DANGER' ? 'border-red-500 text-red-700' :
              alertLevel === 'WARNING' ? 'border-yellow-500 text-yellow-700' :
              'border-green-500 text-green-700'
            }`}
          >
            {alertLevel}
          </Badge>
          <p className="text-sm">{getAlertMessage()}</p>
        </div>

        {/* Alert Settings Status */}
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span className={settings.visualAlerts ? 'text-green-600' : 'text-gray-400'}>
            Visual: {settings.visualAlerts ? 'ON' : 'OFF'}
          </span>
          <span className={settings.audioAlerts && audioEnabled ? 'text-green-600' : 'text-gray-400'}>
            Audio: {settings.audioAlerts && audioEnabled ? 'ON' : 'OFF'}
          </span>
          <span className={settings.vibrationAlerts ? 'text-green-600' : 'text-gray-400'}>
            Haptic: {settings.vibrationAlerts ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Alert History */}
        {alertHistory.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="text-sm mb-2">Recent Alerts</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {alertHistory.map((alert, index) => (
                <div key={index} className="text-xs p-2 rounded bg-muted">
                  <div className="flex justify-between items-start">
                    <span className={`
                      ${alert.level === 'DANGER' ? 'text-red-600' :
                        alert.level === 'WARNING' ? 'text-yellow-600' :
                        'text-green-600'}
                    `}>
                      {alert.level}
                    </span>
                    <span className="text-muted-foreground">{alert.time}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}