import { useEffect } from 'react';
import { AlertLevel } from '../App';

interface Vehicle {
  id: string;
  x: number;
  y: number;
  speed: number;
  heading: number;
  type: 'user' | 'other';
}

interface Obstacle {
  id: string;
  x: number;
  y: number;
  type: 'static' | 'dynamic';
}

interface CollisionDetectorProps {
  vehicles: Vehicle[];
  obstacles: Obstacle[];
  onAlertChange: (level: AlertLevel) => void;
  settings: {
    sensitivity: string;
  };
}

export function CollisionDetector({ 
  vehicles, 
  obstacles, 
  onAlertChange, 
  settings 
}: CollisionDetectorProps) {
  
  useEffect(() => {
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (!userVehicle) return;

    let alertLevel: AlertLevel = 'SAFE';
    
    // Get sensitivity multiplier
    const sensitivityMultiplier = {
      'low': 0.7,
      'medium': 1.0,
      'high': 1.3
    }[settings.sensitivity] || 1.0;

    // Check collision with other vehicles
    const otherVehicles = vehicles.filter(v => v.type === 'other');
    
    for (const vehicle of otherVehicles) {
      const distance = Math.sqrt(
        Math.pow(userVehicle.x - vehicle.x, 2) + 
        Math.pow(userVehicle.y - vehicle.y, 2)
      );

      // Calculate Time-to-Collision (TTC)
      const relativeVelocityX = 
        Math.cos(userVehicle.heading * Math.PI / 180) * userVehicle.speed -
        Math.cos(vehicle.heading * Math.PI / 180) * vehicle.speed;
      
      const relativeVelocityY = 
        Math.sin(userVehicle.heading * Math.PI / 180) * userVehicle.speed -
        Math.sin(vehicle.heading * Math.PI / 180) * vehicle.speed;
      
      const relativeSpeed = Math.sqrt(
        Math.pow(relativeVelocityX, 2) + 
        Math.pow(relativeVelocityY, 2)
      );

      const ttc = relativeSpeed > 0 ? distance / relativeSpeed : Infinity;

      // Dynamic safety distance based on speed
      const baseSafetyDistance = 50;
      const speedFactor = Math.max(userVehicle.speed, vehicle.speed);
      const dynamicSafetyDistance = baseSafetyDistance + (speedFactor * 10);
      
      const adjustedSafetyDistance = dynamicSafetyDistance * sensitivityMultiplier;

      // Alert level logic
      if (distance < adjustedSafetyDistance * 0.5 || ttc < 2) {
        alertLevel = 'DANGER';
        break;
      } else if (distance < adjustedSafetyDistance || ttc < 4) {
        alertLevel = 'WARNING';
      }
    }

    // Check collision with obstacles
    for (const obstacle of obstacles) {
      const distance = Math.sqrt(
        Math.pow(userVehicle.x - obstacle.x, 2) + 
        Math.pow(userVehicle.y - obstacle.y, 2)
      );

      const obstacleWarningDistance = 60 * sensitivityMultiplier;
      const obstacleDangerDistance = 30 * sensitivityMultiplier;

      if (distance < obstacleDangerDistance) {
        alertLevel = 'DANGER';
        break;
      } else if (distance < obstacleWarningDistance && alertLevel === 'SAFE') {
        alertLevel = 'WARNING';
      }
    }

    // Predictive path analysis for moving vehicles
    if (alertLevel === 'SAFE' && userVehicle.speed > 0) {
      for (const vehicle of otherVehicles) {
        if (vehicle.speed > 0) {
          // Project positions 3 seconds into the future
          const futureUserX = userVehicle.x + 
            Math.cos(userVehicle.heading * Math.PI / 180) * userVehicle.speed * 3;
          const futureUserY = userVehicle.y + 
            Math.sin(userVehicle.heading * Math.PI / 180) * userVehicle.speed * 3;
          
          const futureVehicleX = vehicle.x + 
            Math.cos(vehicle.heading * Math.PI / 180) * vehicle.speed * 3;
          const futureVehicleY = vehicle.y + 
            Math.sin(vehicle.heading * Math.PI / 180) * vehicle.speed * 3;

          const futureDistance = Math.sqrt(
            Math.pow(futureUserX - futureVehicleX, 2) + 
            Math.pow(futureUserY - futureVehicleY, 2)
          );

          if (futureDistance < 40 * sensitivityMultiplier) {
            alertLevel = 'WARNING';
            break;
          }
        }
      }
    }

    onAlertChange(alertLevel);
  }, [vehicles, obstacles, onAlertChange, settings.sensitivity]);

  // This is a pure logic component, no render needed
  return null;
}