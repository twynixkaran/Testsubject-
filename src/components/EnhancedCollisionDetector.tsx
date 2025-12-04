import { useEffect, useRef } from 'react';
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

interface CollisionDetection {
  alertLevel: AlertLevel;
  distance?: number;
  threatType?: 'vehicle' | 'hazard' | 'intersection';
  threatId?: string;
}

interface EnhancedCollisionDetectorProps {
  vehicles: Vehicle[];
  hazardZones: HazardZone[];
  safeDistance: number;
  proximityMultiplier: number;
  onDetection: (detection: CollisionDetection) => void;
  enabled: boolean;
}

export function EnhancedCollisionDetector({
  vehicles,
  hazardZones,
  safeDistance,
  proximityMultiplier,
  onDetection,
  enabled
}: EnhancedCollisionDetectorProps) {
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      return;
    }

    detectionIntervalRef.current = setInterval(() => {
      performCollisionDetection();
    }, 200); // Check every 200ms for responsiveness

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [vehicles, hazardZones, safeDistance, proximityMultiplier, enabled]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const isVehicleApproaching = (userVehicle: Vehicle, otherVehicle: Vehicle): boolean => {
    const bearing = calculateBearing(
      userVehicle.lat, userVehicle.lng,
      otherVehicle.lat, otherVehicle.lng
    );
    
    // Check if other vehicle is roughly heading towards user
    const headingDifference = Math.abs(otherVehicle.heading - bearing);
    return headingDifference < 45 || headingDifference > 315;
  };

  const calculateTimeToCollision = (
    userVehicle: Vehicle, 
    otherVehicle: Vehicle, 
    distance: number
  ): number => {
    // Convert speeds from km/h to m/s
    const userSpeedMs = userVehicle.speed / 3.6;
    const otherSpeedMs = otherVehicle.speed / 3.6;
    
    // Calculate relative velocity
    const relativeVelocity = userSpeedMs + otherSpeedMs;
    
    if (relativeVelocity <= 0) return Infinity;
    
    return distance / relativeVelocity;
  };

  const performCollisionDetection = () => {
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (!userVehicle) {
      onDetection({ alertLevel: 'SAFE' });
      return;
    }

    let highestThreat: CollisionDetection = { alertLevel: 'SAFE' };

    // Check vehicle collisions
    const peerVehicles = vehicles.filter(v => v.type === 'peer');
    
    for (const peerVehicle of peerVehicles) {
      const distance = calculateDistance(
        userVehicle.lat, userVehicle.lng,
        peerVehicle.lat, peerVehicle.lng
      );

      // Dynamic safe distance based on speeds
      const speedFactor = Math.max(userVehicle.speed, peerVehicle.speed) / 50; // Normalize to 50 km/h
      const dynamicSafeDistance = safeDistance * (1 + speedFactor);
      const proximityDistance = dynamicSafeDistance * proximityMultiplier;

      let alertLevel: AlertLevel = 'SAFE';
      
      // Check if vehicles are approaching each other
      const isApproaching = isVehicleApproaching(userVehicle, peerVehicle);
      const ttc = calculateTimeToCollision(userVehicle, peerVehicle, distance);

      if (distance <= dynamicSafeDistance || (isApproaching && ttc <= 3)) {
        alertLevel = 'DANGER';
      } else if (distance <= proximityDistance || (isApproaching && ttc <= 6)) {
        alertLevel = 'WARNING';
      }

      if (alertLevel !== 'SAFE' && 
          (highestThreat.alertLevel === 'SAFE' || 
           (alertLevel === 'DANGER' && highestThreat.alertLevel === 'WARNING'))) {
        highestThreat = {
          alertLevel,
          distance,
          threatType: 'vehicle',
          threatId: peerVehicle.id
        };
      }
    }

    // Check hazard zone proximity
    for (const hazard of hazardZones) {
      const distance = calculateDistance(
        userVehicle.lat, userVehicle.lng,
        hazard.lat, hazard.lng
      );

      let alertLevel: AlertLevel = 'SAFE';
      
      // Different alert distances for different hazard types
      let warningDistance = hazard.radius * 2;
      let dangerDistance = hazard.radius;

      if (hazard.type === 'intersection') {
        warningDistance = hazard.radius * 3; // Larger warning for intersections
        dangerDistance = hazard.radius * 1.5;
      } else if (hazard.type === 'school') {
        warningDistance = hazard.radius * 2.5; // Moderate warning for schools
        dangerDistance = hazard.radius * 1.2;
      }

      if (distance <= dangerDistance) {
        alertLevel = 'DANGER';
      } else if (distance <= warningDistance) {
        alertLevel = 'WARNING';
      }

      if (alertLevel !== 'SAFE' && 
          (highestThreat.alertLevel === 'SAFE' || 
           (alertLevel === 'DANGER' && highestThreat.alertLevel === 'WARNING'))) {
        highestThreat = {
          alertLevel,
          distance,
          threatType: hazard.type === 'intersection' ? 'intersection' : 'hazard',
          threatId: hazard.id
        };
      }
    }

    onDetection(highestThreat);
  };

  return null; // This is a pure logic component
}