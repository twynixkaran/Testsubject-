import React from 'react';
import { Activity, TrendingUp, Clock, Shield, AlertTriangle, Users, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertLevel } from '../App';

interface Vehicle {
  id: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  type: 'user' | 'peer';
}

interface HazardZone {
  id: string;
  lat: number;
  lng: number;
  type: 'intersection' | 'school' | 'hospital';
  radius: number;
}

interface SensorData {
  gps: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  speed: number;
  heading: number;
  nearbyVehicles: number;
  obstacleDetected: boolean;
}

interface StatusPageProps {
  vehicles: Vehicle[];
  hazardZones: HazardZone[];
  alertLevel: AlertLevel;
  sensorData: SensorData;
}

export function StatusPage({ vehicles, hazardZones, alertLevel, sensorData }: StatusPageProps) {
  const [systemUptime] = React.useState(Math.floor(Math.random() * 120) + 30); // Mock uptime
  const [alertsToday] = React.useState(Math.floor(Math.random() * 15) + 3); // Mock alerts

  const getSystemHealth = () => {
    if (alertLevel === 'DANGER') return { score: 60, status: 'Critical' };
    if (alertLevel === 'WARNING') return { score: 80, status: 'Warning' };
    return { score: 95, status: 'Excellent' };
  };

  const systemHealth = getSystemHealth();

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">System Health</span>
                <Badge variant={systemHealth.score > 90 ? "default" : 
                              systemHealth.score > 70 ? "secondary" : "destructive"}>
                  {systemHealth.status}
                </Badge>
              </div>
              <Progress value={systemHealth.score} className="w-full" />
              <div className="text-xs text-muted-foreground">
                {systemHealth.score}% operational
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">GPS Accuracy</span>
                <span className="text-sm text-green-600">
                  ±{sensorData.gps.accuracy}m
                </span>
              </div>
              <Progress 
                value={Math.max(0, 100 - (sensorData.gps.accuracy * 10))} 
                className="w-full" 
              />
              <div className="text-xs text-muted-foreground">
                High precision tracking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Update Rate</span>
                <span className="text-sm">30 FPS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Alert Latency</span>
                <span className="text-sm text-green-600">&lt;200ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Detection Accuracy</span>
                <span className="text-sm text-green-600">94%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Battery Usage</span>
                <span className="text-sm text-yellow-600">18%/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Data Usage</span>
                <span className="text-sm">2.1 MB/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Network Latency</span>
                <span className="text-sm text-green-600">45ms</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DRISHTI Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            DRISHTI Workflow Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">1. Data Collection</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              GPS, IMU, Camera sensors operational
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">2. Position Calculation</span>
              <Badge variant="default">Running</Badge>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              Extended Kalman Filter fusion active
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">3. Obstacle Detection</span>
              <Badge variant={sensorData.obstacleDetected ? "destructive" : "default"}>
                {sensorData.obstacleDetected ? 'Detected' : 'Clear'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              YOLOv8 AI vision + P2P communication
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">4. Risk Assessment</span>
              <Badge variant={
                alertLevel === 'DANGER' ? "destructive" :
                alertLevel === 'WARNING' ? "secondary" : "default"
              }>
                {alertLevel}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              Time-to-Collision algorithm running
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">5. Alert System</span>
              <Badge variant="default">Ready</Badge>
            </div>
            <div className="text-xs text-muted-foreground ml-4">
              Multi-modal warning system armed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Real-time Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Active Vehicles</span>
                <Badge variant="secondary">{vehicles.length}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-red-500" />
                <span className="text-sm">Hazard Zones</span>
                <Badge variant="secondary">{hazardZones.length}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Alerts Today</span>
                <Badge variant="secondary">{alertsToday}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm">Uptime</span>
                <Badge variant="secondary">{systemUptime}min</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-center space-y-1">
              <div className="text-sm">Current Position</div>
              <div className="text-xs text-muted-foreground">
                {sensorData.gps.lat.toFixed(6)}, {sensorData.gps.lng.toFixed(6)}
              </div>
              <div className="text-xs text-muted-foreground">
                Speed: {sensorData.speed.toFixed(1)} m/s | Heading: {sensorData.heading.toFixed(0)}°
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}