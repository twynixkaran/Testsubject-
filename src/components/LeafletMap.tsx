import React, { useEffect, useRef, useState } from 'react';
import { AlertLevel } from '../App';

// Leaflet types and setup
declare global {
  interface Window {
    L: any;
  }
}

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

interface LeafletMapProps {
  vehicles: Vehicle[];
  hazardZones: HazardZone[];
  alertLevel: AlertLevel;
  safeDistance: number;
  onMapReady?: () => void;
}

export function LeafletMap({ vehicles, hazardZones, alertLevel, safeDistance, onMapReady }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const hazardMarkersRef = useRef<Map<string, any>>(new Map());
  const userCircleRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || isMapReady) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (!window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.L || !mapRef.current) return;

      // Default center (Delhi)
      const center = [28.6139, 77.2090];
      
      mapInstance.current = window.L.map(mapRef.current, {
        center,
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark theme tile layer
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);

      setIsMapReady(true);
      onMapReady?.();
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onMapReady]);

  // Update user vehicle and safety circle
  useEffect(() => {
    if (!isMapReady || !mapInstance.current || !window.L) return;

    const userVehicle = vehicles.find(v => v.type === 'user');
    if (!userVehicle) return;

    const { lat, lng, heading } = userVehicle;

    // Update/create user marker
    if (markersRef.current.has('user')) {
      const marker = markersRef.current.get('user');
      marker.setLatLng([lat, lng]);
    } else {
      const userIcon = window.L.divIcon({
        html: `<div class="user-vehicle" style="transform: rotate(${heading}deg)">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <div class="w-4 h-6 bg-blue-700 rounded-sm"></div>
          </div>
        </div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = window.L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance.current);
      markersRef.current.set('user', marker);
    }

    // Update/create safety circle
    if (userCircleRef.current) {
      userCircleRef.current.setLatLng([lat, lng]);
      userCircleRef.current.setRadius(safeDistance);
    } else {
      let circleColor = '#10b981'; // Green
      let fillOpacity = 0.1;

      if (alertLevel === 'WARNING') {
        circleColor = '#f59e0b'; // Yellow
        fillOpacity = 0.15;
      } else if (alertLevel === 'DANGER') {
        circleColor = '#ef4444'; // Red
        fillOpacity = 0.2;
      }

      userCircleRef.current = window.L.circle([lat, lng], {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity,
        radius: safeDistance,
        weight: 2
      }).addTo(mapInstance.current);
    }

    // Center map on user
    mapInstance.current.setView([lat, lng], 16);

  }, [vehicles, isMapReady, alertLevel, safeDistance]);

  // Update peer vehicles
  useEffect(() => {
    if (!isMapReady || !mapInstance.current || !window.L) return;

    const peerVehicles = vehicles.filter(v => v.type === 'peer');

    // Remove old peer markers
    markersRef.current.forEach((marker, id) => {
      if (id !== 'user' && !peerVehicles.find(v => v.id === id)) {
        mapInstance.current.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    // Add/update peer markers
    peerVehicles.forEach(vehicle => {
      const { id, lat, lng, heading, speed } = vehicle;

      if (markersRef.current.has(id)) {
        const marker = markersRef.current.get(id);
        marker.setLatLng([lat, lng]);
      } else {
        const peerIcon = window.L.divIcon({
          html: `<div class="peer-vehicle" style="transform: rotate(${heading}deg)">
            <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <div class="w-3 h-4 bg-yellow-700 rounded-sm"></div>
            </div>
            <div class="text-xs text-white bg-black bg-opacity-75 rounded px-1 mt-1">
              ${speed.toFixed(0)} km/h
            </div>
          </div>`,
          className: 'custom-marker',
          iconSize: [32, 40],
          iconAnchor: [16, 20]
        });

        const marker = window.L.marker([lat, lng], { icon: peerIcon }).addTo(mapInstance.current);
        markersRef.current.set(id, marker);
      }
    });

  }, [vehicles, isMapReady]);

  // Update hazard zones
  useEffect(() => {
    if (!isMapReady || !mapInstance.current || !window.L) return;

    // Remove old hazard markers
    hazardMarkersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    hazardMarkersRef.current.clear();

    // Add hazard zones
    hazardZones.forEach(hazard => {
      const { id, lat, lng, type, radius } = hazard;

      let color = '#f59e0b'; // Default yellow
      let icon = '⚠️';

      switch (type) {
        case 'intersection':
          color = '#f59e0b';
          icon = '🚦';
          break;
        case 'school':
          color = '#10b981';
          icon = '🏫';
          break;
        case 'hospital':
          color = '#ef4444';
          icon = '🏥';
          break;
      }

      // Hazard circle
      const circle = window.L.circle([lat, lng], {
        color,
        fillColor: color,
        fillOpacity: 0.1,
        radius,
        weight: 2,
        dashArray: '5, 5'
      }).addTo(mapInstance.current);

      // Hazard marker
      const hazardIcon = window.L.divIcon({
        html: `<div class="hazard-marker text-2xl">${icon}</div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = window.L.marker([lat, lng], { icon: hazardIcon }).addTo(mapInstance.current);
      
      hazardMarkersRef.current.set(id, { circle, marker });
    });

  }, [hazardZones, isMapReady]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
          🛰️ GPS Active
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
          Safe Distance: {safeDistance}m
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Other Vehicles</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚦</span>
          <span>Intersection</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏫</span>
          <span>School Zone</span>
        </div>
      </div>

      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading Map...</p>
          </div>
        </div>
      )}
    </div>
  );
}