import React from 'react';
import { Plus, Car, Square, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface ControlPanelProps {
  onAddVehicle: () => void;
  onAddObstacle: () => void;
  onReset: () => void;
  onMove: (direction: string, speed: number) => void;
  userSpeed: number;
}

export function ControlPanel({ 
  onAddVehicle, 
  onAddObstacle, 
  onReset, 
  onMove, 
  userSpeed 
}: ControlPanelProps) {
  const [speed, setSpeed] = React.useState([2]);
  const [isMoving, setIsMoving] = React.useState(false);

  const handleMove = (direction: string) => {
    setIsMoving(true);
    onMove(direction, speed[0]);
    setTimeout(() => setIsMoving(false), 200);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Scenario Controls */}
        <div className="space-y-3">
          <h4 className="text-sm">Test Scenario</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddVehicle}
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <Car className="w-3 h-3" />
              Vehicle
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddObstacle}
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <Square className="w-3 h-3" />
              Obstacle
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm">Movement Speed</h4>
            <span className="text-sm text-muted-foreground">{speed[0]} m/s</span>
          </div>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            max={5}
            min={0.5}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Directional Controls */}
        <div className="space-y-3">
          <h4 className="text-sm">Vehicle Movement</h4>
          <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto">
            <div></div>
            <Button
              variant={isMoving ? "default" : "outline"}
              size="sm"
              onMouseDown={() => handleMove('up')}
              className="h-10 w-10 p-0"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
            <div></div>
            
            <Button
              variant={isMoving ? "default" : "outline"}
              size="sm"
              onMouseDown={() => handleMove('left')}
              className="h-10 w-10 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              YOU
            </div>
            <Button
              variant={isMoving ? "default" : "outline"}
              size="sm"
              onMouseDown={() => handleMove('right')}
              className="h-10 w-10 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <div></div>
            <Button
              variant={isMoving ? "default" : "outline"}
              size="sm"
              onMouseDown={() => handleMove('down')}
              className="h-10 w-10 p-0"
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
            <div></div>
          </div>
        </div>

        {/* Current Status */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Speed:</span>
            <span>{userSpeed.toFixed(1)} m/s</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Use directional controls to test collision scenarios
          </div>
        </div>
      </CardContent>
    </Card>
  );
}