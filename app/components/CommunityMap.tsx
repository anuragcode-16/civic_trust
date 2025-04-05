'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapComponents = dynamic(
  () => import('./MapComponents'),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
      <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
    </div>
  )}
);

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

interface CommunityMapProps {
  height?: string;
  width?: string;
  issues?: MapIssue[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (issue: MapIssue) => void;
}

const CommunityMap: React.FC<CommunityMapProps> = ({
  height = '600px',
  width = '100%',
  issues = [],
  center = [37.7749, -122.4194], // Default to San Francisco
  zoom = 13,
  onMarkerClick
}) => {
  const { isDarkMode } = useTheme();
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mockIssues] = useState<MapIssue[]>(issues.length ? issues : [
    {
      id: '1',
      title: 'Pothole on Main Street',
      description: 'Large pothole causing traffic hazards',
      category: 'Infrastructure',
      status: 'Open',
      location: {
        lat: center[0] + 0.01,
        lng: center[1] + 0.01,
        address: '123 Main St'
      },
      votes: 15,
      createdBy: 'John Doe',
      createdAt: '2023-04-01T12:00:00Z'
    },
    {
      id: '2',
      title: 'Broken Street Light',
      description: 'Street light not working at night, safety concern',
      category: 'Safety',
      status: 'In Progress',
      location: {
        lat: center[0] - 0.01,
        lng: center[1] - 0.008,
        address: '456 Oak Ave'
      },
      votes: 8,
      createdBy: 'Jane Smith',
      createdAt: '2023-04-02T10:30:00Z'
    },
    {
      id: '3',
      title: 'Graffiti on Public Building',
      description: 'Vandalism on the community center wall',
      category: 'Vandalism',
      status: 'Open',
      location: {
        lat: center[0] + 0.005,
        lng: center[1] - 0.015,
        address: '789 Pine St'
      },
      votes: 5,
      createdBy: 'Mike Johnson',
      createdAt: '2023-04-03T15:45:00Z'
    },
  ]);

  // Initialize component and check for client-side rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user location on component mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Infrastructure': '#3B82F6', // blue
      'Safety': '#EF4444',         // red
      'Vandalism': '#F59E0B',      // amber
      'Environment': '#10B981',    // green
      'Noise': '#8B5CF6',          // purple
      'Other': '#6B7280',          // gray
    };
    
    return colors[category] || colors['Other'];
  };

  return (
    <div style={{ height, width }} className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      {isMounted ? (
        <MapComponents 
          isDarkMode={isDarkMode}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
          currentLocation={currentLocation}
          mockIssues={mockIssues}
          zoom={zoom}
          getCategoryColor={getCategoryColor}
          onMarkerClick={onMarkerClick}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-500 dark:text-gray-400">Map loading...</div>
        </div>
      )}
      
      {/* Map overlay with information */}
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 shadow-md rounded-lg p-3 max-w-xs">
        <h3 className="font-medium text-sm text-gray-800 dark:text-white">Community Issues Map</h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
          Showing {mockIssues.length} reported issues in your area
        </p>
        <div className="mt-2 text-xs">
          <div className="flex flex-wrap gap-2">
            {['Infrastructure', 'Safety', 'Vandalism', 'Environment'].map(category => (
              <div key={category} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: getCategoryColor(category) }}></div>
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMap; 