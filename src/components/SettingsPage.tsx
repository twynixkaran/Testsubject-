import React from 'react';
import { Settings, Volume2, Eye, Vibrate, Shield, Gauge, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';

interface SettingsPageProps {
  settings: {
    visualAlerts: boolean;
    audioAlerts: boolean;
    vibrationAlerts: boolean;
    sensitivity: string;
    autobrake: boolean;
    safeDistance: number;
    proximityMultiplier: number;
  };
  onSettingsChange: (settings: any) => void;
}

export function SettingsPage({ settings, onSettingsChange }: SettingsPageProps) {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {/* Alert Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Alert Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm">Visual Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Color-coded warning displays
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.visualAlerts}
                onCheckedChange={(checked) => updateSetting('visualAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-sm">Audio Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Sound warnings and notifications
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.audioAlerts}
                onCheckedChange={(checked) => updateSetting('audioAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="text-sm">Vibration Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    Haptic feedback for immediate attention
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.vibrationAlerts}
                onCheckedChange={(checked) => updateSetting('vibrationAlerts', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-sm">Sensitivity Level</div>
                  <div className="text-xs text-muted-foreground">
                    Collision detection sensitivity
                  </div>
                </div>
              </div>
              <Select value={settings.sensitivity} onValueChange={(value) => updateSetting('sensitivity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Relaxed detection</SelectItem>
                  <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                  <SelectItem value="high">High - Aggressive detection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm">Safe Distance</div>
                  <div className="text-xs text-muted-foreground">
                    Minimum safe following distance
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>20m</span>
                  <span>{settings.safeDistance}m</span>
                  <span>100m</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={settings.safeDistance}
                  onChange={(e) => updateSetting('safeDistance', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-sm">Proximity Sensitivity</div>
                  <div className="text-xs text-muted-foreground">
                    Warning distance multiplier
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>1.5x</span>
                  <span>{settings.proximityMultiplier}x</span>
                  <span>3.0x</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="3.0"
                  step="0.1"
                  value={settings.proximityMultiplier}
                  onChange={(e) => updateSetting('proximityMultiplier', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                <div>
                  <div className="text-sm">Auto-brake Assist</div>
                  <div className="text-xs text-muted-foreground">
                    Emergency braking suggestions
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.autobrake}
                onCheckedChange={(checked) => updateSetting('autobrake', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Sensor Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">GPS/NavIC</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">IMU Sensors</span>
              <span className="text-sm text-green-600">Calibrated</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Camera (AI Vision)</span>
              <span className="text-sm text-green-600">Running</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Wi-Fi/Bluetooth</span>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            About DRISHTI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>
              <strong>DRISHTI</strong> - Driving & Roving Intelligence through 
              Smartphone Handsets Interface
            </p>
            <p className="text-muted-foreground">
              A collaborative smartphone-based navigation and anti-collision 
              system that transforms ordinary smartphones into intelligent 
              safety co-pilots for vehicles.
            </p>
          </div>

          <Separator />

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Version:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Algorithm:</span>
              <span>YOLOv8 + EKF</span>
            </div>
            <div className="flex justify-between">
              <span>NavIC Support:</span>
              <span>Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>AI Model:</span>
              <span>Collision Detection v2.1</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-800">
              <strong>Safety Notice:</strong> DRISHTI is an assistance system. 
              Always maintain full attention while driving and follow traffic rules.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}