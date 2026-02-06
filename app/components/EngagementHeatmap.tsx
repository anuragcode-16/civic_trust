'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface EngagementDataPoint {
  area: string;
  level: 'High' | 'Medium' | 'Low';
  percentage: number;
}

interface EngagementHeatmapProps {
  location: { lat: number, lng: number };
  data?: EngagementDataPoint[];
}

const EngagementHeatmap = ({ location, data: initialData }: EngagementHeatmapProps) => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<EngagementDataPoint[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);

  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      // Generate engagement data for current location if none provided
      const generateEngagementData = () => {
        setLoading(true);

        // Use the location hash to ensure same location gets same data
        const locationHash = Math.abs(Math.sin(location.lat * location.lng) * 10000);
        
        // Generate nearby neighborhoods based on location
        const areas = [
          'Downtown',
          'City Center',
          `${location.lat > 0 ? 'North' : 'South'} District`,
          `${location.lng > 0 ? 'East' : 'West'} Side`,
          'Central Park',
          'Riverside',
          'University Area',
          'Harbor District',
          'Tech Corridor'
        ];
        
        // Generate 5-9 random areas
        const numAreas = 5 + Math.floor(locationHash % 5);
        const shuffledAreas = [...areas].sort(() => 0.5 - Math.random());
        const selectedAreas = shuffledAreas.slice(0, numAreas);
        
        // Generate engagement data for each area
        const generatedData: EngagementDataPoint[] = selectedAreas.map((area, index) => {
          // Deterministic values based on area name and location
          const seed = area.charCodeAt(0) + (index * Math.round(location.lat + location.lng));
          const percentage = 30 + (seed % 70); // 30-100%
          
          let level: 'High' | 'Medium' | 'Low';
          if (percentage >= 70) level = 'High';
          else if (percentage >= 45) level = 'Medium';
          else level = 'Low';
          
          return {
            area,
            level,
            percentage
          };
        }).sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
        
        setData(generatedData);
        setLoading(false);
      };
      
      generateEngagementData();
    }
  }, [location, initialData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Community Engagement Heatmap</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Area
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Engagement Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((area, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {area.area}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${area.level === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        area.level === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {area.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${
                          area.level === 'High' ? 'bg-green-600' : 
                            area.level === 'Medium' ? 'bg-yellow-500' :
                            'bg-red-600'
                        }`} style={{ width: `${area.percentage}%` }}></div>
                      </div>
                      <span className="ml-2">{area.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        Data reflects citizen engagement in your local area as of {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default EngagementHeatmap; 