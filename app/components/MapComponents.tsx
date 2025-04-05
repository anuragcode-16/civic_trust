'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// MapRecenter component to handle view changes
const MapRecenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

interface MapIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  votes: number;
  createdBy: string;
  createdAt: string;
}

interface MapComponentsProps {
  isDarkMode: boolean;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  currentLocation: [number, number] | null;
  mockIssues: MapIssue[];
  zoom: number;
  getCategoryColor: (category: string) => string;
  onMarkerClick?: (issue: MapIssue) => void;
}

const MapComponents: React.FC<MapComponentsProps> = ({
  isDarkMode,
  mapCenter,
  setMapCenter,
  currentLocation,
  mockIssues,
  zoom,
  getCategoryColor,
  onMarkerClick
}) => {
  const [mapReady, setMapReady] = useState(false);

  // Initialize Leaflet icons on component mount
  useEffect(() => {
    // Fix for Leaflet default icons in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    setMapReady(true);
  }, []);

  // Custom marker icon based on category
  const createCustomIcon = (category: string) => {
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="background-color: ${getCategoryColor(category)}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Map tile layer URL - using OpenStreetMap (free)
  const tileLayerUrl = isDarkMode 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileLayerAttribution = isDarkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  if (!mapReady) {
    return <div style={{ height: '100%', width: '100%' }} className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url={tileLayerUrl}
        attribution={tileLayerAttribution}
      />
      
      {/* Recenter control component to handle center changes */}
      <MapRecenter position={mapCenter} />
      
      {/* Current location marker */}
      {currentLocation && (
        <Marker 
          position={currentLocation}
          icon={L.divIcon({
            className: 'current-location-marker',
            html: `<div style="background-color: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3B82F6;"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          })}
        >
          <Popup>
            <div className="font-medium">Your Location</div>
          </Popup>
        </Marker>
      )}
      
      {/* Issue markers */}
      {mockIssues.map(issue => (
        <Marker
          key={issue.id}
          position={[issue.location.lat, issue.location.lng]}
          icon={createCustomIcon(issue.category)}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(issue)
          }}
        >
          <Popup>
            <div className="font-medium">{issue.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{issue.location.address}</div>
            <div className="flex items-center mt-2">
              <span className="text-xs px-2 py-1 rounded-full mr-2" style={{ backgroundColor: `${getCategoryColor(issue.category)}30`, color: getCategoryColor(issue.category) }}>
                {issue.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {issue.status}
              </span>
            </div>
            <div className="mt-2 text-sm">{issue.description}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <span>👍 {issue.votes}</span>
              <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Map controls */}
      <div className="absolute bottom-5 right-5 z-[1000]">
        <button
          className="bg-white dark:bg-gray-800 shadow-md rounded-full p-2 mb-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => currentLocation && setMapCenter(currentLocation)}
          aria-label="Center on my location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
            <path d="M10 15a1 1 0 0 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </MapContainer>
  );
};

export default MapComponents; 