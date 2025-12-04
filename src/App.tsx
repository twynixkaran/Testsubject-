import React, { useState, useEffect } from 'react';
import { PhoneMockup } from './components/PhoneMockup';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { LeafletMap } from './components/LeafletMap';
import { SensorDisplay } from './components/SensorDisplay';
import { AlertSystem } from './components/AlertSystem';
import { FullScreenAlert } from './components/FullScreenAlert';
import { ControlPanel } from './components/ControlPanel';
import { Navigation } from './components/Navigation';
import { StatusPage } from './components/StatusPage';
import { SettingsPage } from './components/SettingsPage';
import { GPSTracker } from './components/GPSTracker';
import { NetworkStatus } from './components/NetworkStatus';
import { EnhancedCollisionDetector } from './components/EnhancedCollisionDetector';

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

export type AlertLevel = 'SAFE' | 'WARNING' | 'DANGER';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('drive');
  const [isOnlineMode, setIsOnlineMode] = useState(false);
  const [showFullScreenAlert, setShowFullScreenAlert] = useState(false);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'user', lat: 28.6139, lng: 77.2090, speed: 0, heading: 0, type: 'user' }
  ]);
  
  const [hazardZones] = useState<HazardZone[]>([
    { id: 'intersection-1', lat: 28.6150, lng: 77.2095, type: 'intersection', radius: 50 },
    { id: 'school-1', lat: 28.6130, lng: 77.2085, type: 'school', radius: 30 },
    { id: 'hospital-1', lat: 28.6160, lng: 77.2100, type: 'hospital', radius: 40 },
  ]);
  
  const [alertLevel, setAlertLevel] = useState<AlertLevel>('SAFE');
  const [alertDistance, setAlertDistance] = useState<number | undefined>();
  const [alertThreatType, setAlertThreatType] = useState<'vehicle' | 'hazard' | 'intersection'>('vehicle');
  
  const [sensorData, setSensorData] = useState<SensorData>({
    gps: { lat: 28.6139, lng: 77.2090, accuracy: 2.5 },
    speed: 0,
    heading: 0,
    nearbyVehicles: 0,
    obstacleDetected: false
  });
  
  const [settings, setSettings] = useState({
    visualAlerts: true,
    audioAlerts: true,
    vibrationAlerts: true,
    sensitivity: 'medium',
    autobrake: false,
    safeDistance: 50,
    proximityMultiplier: 2.0
  });

  // Peer vehicle simulation for offline mode
  useEffect(() => {
    if (isOnlineMode) return;

    const interval = setInterval(() => {
      setVehicles(prev => prev.map(vehicle => {
        if (vehicle.type === 'peer') {
          // Simulate realistic vehicle movement
          const speed = vehicle.speed / 3600; // Convert km/h to degrees per second (rough)
          const latChange = Math.cos(vehicle.heading * Math.PI / 180) * speed * 0.001;
          const lngChange = Math.sin(vehicle.heading * Math.PI / 180) * speed * 0.001;
          
          let newLat = vehicle.lat + latChange;
          let newLng = vehicle.lng + lngChange;
          let newHeading = vehicle.heading;
          
          // Boundary management (Delhi area bounds)
          if (newLat < 28.610 || newLat > 28.620 || newLng < 77.205 || newLng > 77.215) {
            newHeading = (vehicle.heading + 180) % 360;
            newLat = vehicle.lat;
            newLng = vehicle.lng;
          }
          
          return { 
            ...vehicle, 
            lat: newLat, 
            lng: newLng, 
            heading: newHeading,
            speed: Math.max(10, vehicle.speed + (Math.random() - 0.5) * 5) // Speed variation
          };
        }
        return vehicle;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnlineMode]);

  // Update sensor data
  useEffect(() => {
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (userVehicle) {
      setSensorData(prev => ({
        ...prev,
        gps: {
          lat: userVehicle.lat,
          lng: userVehicle.lng,
          accuracy: prev.gps.accuracy
        },
        speed: userVehicle.speed,
        heading: userVehicle.heading,
        nearbyVehicles: vehicles.filter(v => v.type === 'peer').length,
        obstacleDetected: hazardZones.length > 0
      }));
    }
  }, [vehicles, hazardZones]);

  const handleGPSUpdate = (position: any) => {
    setVehicles(prev => prev.map(vehicle => {
      if (vehicle.type === 'user') {
        return {
          ...vehicle,
          lat: position.lat,
          lng: position.lng,
          speed: position.speed,
          heading: position.heading
        };
      }
      return vehicle;
    }));

    setSensorData(prev => ({
      ...prev,
      gps: {
        lat: position.lat,
        lng: position.lng,
        accuracy: position.accuracy
      }
    }));
  };

  const handleCollisionDetection = (detection: any) => {
    setAlertLevel(detection.alertLevel);
    setAlertDistance(detection.distance);
    setAlertThreatType(detection.threatType || 'vehicle');

    // Show full screen alert for danger
    if (detection.alertLevel === 'DANGER' && settings.visualAlerts) {
      setShowFullScreenAlert(true);
    }
  };

  const addPeerVehicle = () => {
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (!userVehicle) return;

    const newVehicle: Vehicle = {
      id: `peer-${Date.now()}`,
      lat: userVehicle.lat + (Math.random() - 0.5) * 0.002,
      lng: userVehicle.lng + (Math.random() - 0.5) * 0.002,
      speed: Math.random() * 40 + 20, // 20-60 km/h
      heading: Math.random() * 360,
      type: 'peer'
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const resetSimulation = () => {
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (userVehicle) {
      setVehicles([userVehicle]);
    }
    setAlertLevel('SAFE');
    setShowFullScreenAlert(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'network':
        return (
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <NetworkStatus
              isOnline={isOnlineMode}
              peerCount={vehicles.filter(v => v.type === 'peer').length}
              onModeChange={setIsOnlineMode}
            />
            <SensorDisplay sensorData={sensorData} />
            <div className="space-y-2">
              <button
                onClick={addPeerVehicle}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg"
              >
                Add Test Vehicle
              </button>
              <button
                onClick={resetSimulation}
                className="w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-lg"
              >
                Reset Simulation
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPage 
            settings={settings}
            onSettingsChange={setSettings}
          />
        );
      case 'status':
        return (
          <StatusPage 
            vehicles={vehicles}
            hazardZones={hazardZones}
            alertLevel={alertLevel}
            sensorData={sensorData}
          />
        );
      default: // drive
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1">
              <LeafletMap
                vehicles={vehicles}
                hazardZones={hazardZones}
                alertLevel={alertLevel}
                safeDistance={settings.safeDistance}
              />
            </div>
            
            <div className="p-3 space-y-3 bg-card border-t">
              <AlertSystem 
                alertLevel={alertLevel}
                settings={settings}
              />
              
              {/* Speed Display */}
              <div className="text-center">
                <div className="text-2xl">
                  {vehicles.find(v => v.type === 'user')?.speed.toFixed(0) || '0'}
                  <span className="text-sm text-muted-foreground ml-1">km/h</span>
                </div>
              </div>
            </div>

            <GPSTracker
              onPositionUpdate={handleGPSUpdate}
              simulationMode={!isOnlineMode}
              enableHighAccuracy={true}
            />

            <EnhancedCollisionDetector
              vehicles={vehicles}
              hazardZones={hazardZones}
              safeDistance={settings.safeDistance}
              proximityMultiplier={settings.proximityMultiplier}
              onDetection={handleCollisionDetection}
              enabled={true}
            />
          </div>
        );
    }
  };

  if (showSplash) {
    return (
      <PhoneMockup>
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </PhoneMockup>
    );
  }

  return (
    <PhoneMockup>
      <div className="h-full flex flex-col bg-background text-foreground">
        <Header alertLevel={alertLevel} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderPage()}
        </main>
        
        <Navigation 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <FullScreenAlert
          alertLevel={alertLevel}
          isVisible={showFullScreenAlert}
          onDismiss={() => setShowFullScreenAlert(false)}
          distance={alertDistance}
          threatType={alertThreatType}
        />
      </div>
    </PhoneMockup>
  );
}