import React, { useRef, useEffect } from 'react';
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

interface MapVisualizationProps {
  vehicles: Vehicle[];
  obstacles: Obstacle[];
  alertLevel: AlertLevel;
}

export function MapVisualization({ vehicles, obstacles, alertLevel }: MapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw collision zones based on alert level
    const userVehicle = vehicles.find(v => v.type === 'user');
    if (userVehicle) {
      let zoneRadius = 50;
      let zoneColor = 'rgba(34, 197, 94, 0.2)'; // Green for safe

      if (alertLevel === 'WARNING') {
        zoneRadius = 75;
        zoneColor = 'rgba(234, 179, 8, 0.3)'; // Yellow for warning
      } else if (alertLevel === 'DANGER') {
        zoneRadius = 100;
        zoneColor = 'rgba(239, 68, 68, 0.4)'; // Red for danger
      }

      ctx.fillStyle = zoneColor;
      ctx.beginPath();
      ctx.arc(userVehicle.x, userVehicle.y, zoneRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw zone border
      ctx.strokeStyle = zoneColor.replace('0.2', '0.6').replace('0.3', '0.8').replace('0.4', '1');
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(obstacle.x - 10, obstacle.y - 10, 20, 20);
      
      // Draw obstacle label
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.fillText('OBS', obstacle.x - 12, obstacle.y + 25);
    });

    // Draw vehicles
    vehicles.forEach(vehicle => {
      ctx.save();
      ctx.translate(vehicle.x, vehicle.y);
      ctx.rotate(vehicle.heading * Math.PI / 180);

      if (vehicle.type === 'user') {
        // User vehicle - distinctive blue
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#1e40af';
      } else {
        // Other vehicles - orange/red
        ctx.fillStyle = '#f97316';
        ctx.strokeStyle = '#ea580c';
      }

      ctx.lineWidth = 2;

      // Draw vehicle body (rounded rectangle)
      ctx.beginPath();
      ctx.roundRect(-15, -8, 30, 16, 4);
      ctx.fill();
      ctx.stroke();

      // Draw direction indicator
      ctx.fillStyle = vehicle.type === 'user' ? '#1e40af' : '#ea580c';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(10, -5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.fill();

      // Draw vehicle ID
      ctx.restore();
      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      const label = vehicle.type === 'user' ? 'YOU' : vehicle.id.slice(-3);
      ctx.fillText(label, vehicle.x - 12, vehicle.y - 20);

      // Draw speed indicator
      if (vehicle.speed > 0) {
        ctx.fillStyle = '#666';
        ctx.font = '8px sans-serif';
        ctx.fillText(`${vehicle.speed.toFixed(1)}m/s`, vehicle.x - 15, vehicle.y + 30);
      }
    });

    // Draw legend
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText('Legend:', 10, 25);
    
    // User vehicle legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(10, 35, 15, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Your Vehicle', 35, 44);
    
    // Other vehicle legend
    ctx.fillStyle = '#f97316';
    ctx.fillRect(10, 55, 15, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Other Vehicles', 35, 64);
    
    // Obstacle legend
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(10, 75, 15, 10);
    ctx.fillStyle = '#000';
    ctx.fillText('Obstacles', 35, 84);

  }, [vehicles, obstacles, alertLevel]);

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b border-border">
        <h3>Live Map Visualization</h3>
        <p className="text-sm text-muted-foreground">
          Real-time vehicle tracking and collision zones
        </p>
      </div>
      
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-auto border border-border rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="px-4 py-2 bg-muted border-t border-border">
        <div className="flex justify-between text-sm">
          <span>Vehicles: {vehicles.length}</span>
          <span>Obstacles: {obstacles.length}</span>
          <span>Status: {alertLevel}</span>
        </div>
      </div>
    </div>
  );
}