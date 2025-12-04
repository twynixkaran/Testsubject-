import { useEffect, useRef } from 'react';

interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number;
  heading: number;
}

interface GPSTrackerProps {
  onPositionUpdate: (position: GPSPosition) => void;
  onError?: (error: string) => void;
  enableHighAccuracy?: boolean;
  simulationMode?: boolean;
}

export function GPSTracker({ 
  onPositionUpdate, 
  onError, 
  enableHighAccuracy = true,
  simulationMode = false 
}: GPSTrackerProps) {
  const watchIdRef = useRef<number | null>(null);
  const simulationRef = useRef<any>(null);

  useEffect(() => {
    if (simulationMode) {
      startSimulation();
    } else {
      startGPSTracking();
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
    };
  }, [simulationMode, enableHighAccuracy]);

  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported by this browser');
      startSimulation(); // Fallback to simulation
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge: 1000
    };

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, speed, heading } = position.coords;
      
      onPositionUpdate({
        lat: latitude,
        lng: longitude,
        accuracy: accuracy || 5,
        speed: speed ? speed * 3.6 : 0, // Convert m/s to km/h
        heading: heading || 0
      });
    };

    const errorCallback = (error: GeolocationPositionError) => {
      let errorMessage = 'GPS error: ';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out';
          break;
        default:
          errorMessage += 'Unknown GPS error';
          break;
      }
      
      onError?.(errorMessage);
      startSimulation(); // Fallback to simulation
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );
  };

  const startSimulation = () => {
    // Delhi coordinates for simulation
    let currentLat = 28.6139;
    let currentLng = 77.2090;
    let currentHeading = 0;
    let currentSpeed = 0;

    // Simulate movement patterns
    const routes = [
      // Route 1: North-South movement
      { latDelta: 0.0001, lngDelta: 0, duration: 20 },
      // Route 2: East-West movement  
      { latDelta: 0, lngDelta: 0.0001, duration: 15 },
      // Route 3: Diagonal movement
      { latDelta: 0.0001, lngDelta: 0.0001, duration: 25 },
      // Route 4: Circular movement
      { latDelta: -0.0001, lngDelta: 0, duration: 10 },
    ];

    let routeIndex = 0;
    let stepCount = 0;
    let maxSteps = routes[0].duration;

    simulationRef.current = setInterval(() => {
      const route = routes[routeIndex];
      
      // Update position
      currentLat += route.latDelta / maxSteps;
      currentLng += route.lngDelta / maxSteps;
      
      // Calculate heading based on movement
      if (route.latDelta > 0) currentHeading = 0;   // North
      else if (route.latDelta < 0) currentHeading = 180; // South
      if (route.lngDelta > 0) currentHeading = 90;  // East
      else if (route.lngDelta < 0) currentHeading = 270; // West
      if (route.latDelta > 0 && route.lngDelta > 0) currentHeading = 45; // NE
      
      // Simulate realistic speed variations (0-60 km/h)
      currentSpeed = 20 + Math.sin(stepCount * 0.1) * 15 + Math.random() * 10;
      
      stepCount++;
      
      // Move to next route
      if (stepCount >= maxSteps) {
        routeIndex = (routeIndex + 1) % routes.length;
        stepCount = 0;
        maxSteps = routes[routeIndex].duration;
      }

      onPositionUpdate({
        lat: currentLat,
        lng: currentLng,
        accuracy: 2 + Math.random() * 3, // 2-5m accuracy simulation
        speed: Math.max(0, currentSpeed),
        heading: currentHeading
      });
    }, 1000); // Update every second
  };

  // This is a pure logic component
  return null;
}