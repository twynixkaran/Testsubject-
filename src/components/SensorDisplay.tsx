import React from 'react';
import { Satellite, Navigation, Gauge, Users, AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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

interface SensorDisplayProps {
  sensorData: SensorData;
}

export function SensorDisplay({ sensorData }: SensorDisplayProps) {
  const formatCoordinate = (coord: number) => coord.toFixed(6);
  
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 3) return 'text-green-600';
    if (accuracy <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Sensor Data
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* GPS/NavIC Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-blue-500" />
              <span className="text-sm">GPS/NavIC Position</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>Lat: {formatCoordinate(sensorData.gps.lat)}</div>
              <div>Lng: {formatCoordinate(sensorData.gps.lng)}</div>
              <div className={`${getAccuracyColor(sensorData.gps.accuracy)}`}>
                Accuracy: ±{sensorData.gps.accuracy}m
              </div>
            </div>
          </div>

          {/* Motion Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-green-500" />
              <span className="text-sm">Motion Sensors</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Gauge className="w-3 h-3" />
                Speed: {sensorData.speed.toFixed(1)} m/s
              </div>
              <div>Heading: {sensorData.heading.toFixed(0)}°</div>
            </div>
          </div>
        </div>

        {/* Detection Status */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Nearby Vehicles</span>
              <Badge variant="secondary">{sensorData.nearbyVehicles}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm">Obstacle Detection</span>
              <Badge 
                variant={sensorData.obstacleDetected ? "destructive" : "secondary"}
              >
                {sensorData.obstacleDetected ? 'Detected' : 'Clear'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Sensor Health */}
        <div className="border-t pt-4">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>GPS Signal:</span>
              <span className="text-green-600">Strong</span>
            </div>
            <div className="flex justify-between">
              <span>IMU Calibration:</span>
              <span className="text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span>Camera Status:</span>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}