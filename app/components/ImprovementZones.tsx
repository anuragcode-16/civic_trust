'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ImprovementZone {
  id: string;
  name: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  issueCount: number;
  categories: string[];
  description: string;
}

interface ImprovementZonesProps {
  location: { lat: number, lng: number };
  data?: ImprovementZone[];
}

const ImprovementZones = ({ location, data: initialData }: ImprovementZonesProps) => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<ImprovementZone[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      // Generate improvement zones for current location if none provided
      const generateZones = () => {
        setLoading(true);

        // Use location hash to ensure consistent data for same locations
        const locationHash = Math.abs(Math.sin(location.lat * location.lng) * 10000);
        
        // Base zone names on location
        const zoneNames = [
          'Downtown Corridor',
          'Waterfront District',
          'Historic Center',
          'University District',
          'Industrial Park',
          'Arts District',
          'Residential Zones',
          'Business District',
          'Transit Hub'
        ];
        
        const categories = [
          'Infrastructure', 'Safety', 'Environment', 
          'Public Services', 'Transportation', 'Recreation'
        ];
        
        // Generate 3-6 improvement zones
        const numZones = 3 + Math.floor(locationHash % 4);
        const shuffledZones = [...zoneNames].sort(() => 0.5 - Math.random());
        const selectedZones = shuffledZones.slice(0, numZones);
        
        const priorities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = 
          ['Critical', 'High', 'High', 'Medium', 'Medium', 'Medium', 'Low'];
        
        const generateDescription = (name: string, priority: string, categories: string[]) => {
          const descriptions = [
            `The ${name} requires ${priority.toLowerCase()} priority attention due to issues in ${categories.join(' and ')}.`,
            `${priority} necessity for improvement in the ${name}, particularly focusing on ${categories.join(' and ')}.`,
            `Citizen reports indicate ${priority.toLowerCase()} concerns in ${name} related to ${categories.join(' and ')}.`,
            `Analysis shows ${priority.toLowerCase()} priority improvements needed in ${name} for ${categories.join(' and ')}.`
          ];
          
          const index = Math.floor((locationHash + name.length) % descriptions.length);
          return descriptions[index];
        };
        
        // Generate zones
        const generatedData: ImprovementZone[] = selectedZones.map((name, index) => {
          const seed = name.charCodeAt(0) + (index * Math.round(location.lat + location.lng));
          
          // Determine priority - weighted toward higher priorities
          const priorityIndex = Math.floor(seed % priorities.length);
          const priority = priorities[priorityIndex];
          
          // Determine issues count based on priority
          let issueCount;
          switch (priority) {
            case 'Critical': issueCount = 15 + (seed % 11); break; // 15-25
            case 'High': issueCount = 8 + (seed % 8); break; // 8-15
            case 'Medium': issueCount = 4 + (seed % 5); break; // 4-8
            case 'Low': issueCount = 1 + (seed % 4); break; // 1-4
            default: issueCount = seed % 10;
          }
          
          // Select 1-3 categories
          const numCategories = 1 + Math.floor((seed % 3));
          const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
          const selectedCategories = shuffledCategories.slice(0, numCategories);
          
          // Generate description
          const description = generateDescription(name, priority, selectedCategories);
          
          return {
            id: `zone-${index}-${seed}`,
            name,
            priority,
            issueCount,
            categories: selectedCategories,
            description
          };
        }).sort((a, b) => {
          // Sort by priority (Critical first)
          const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        setData(generatedData);
        setLoading(false);
      };
      
      generateZones();
    }
  }, [location, initialData]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Priority Improvement Zones</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((zone) => (
            <div 
              key={zone.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-900"
                onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(zone.priority)}`}>
                    {zone.priority}
                  </span>
                  <h3 className="font-medium text-gray-900 dark:text-white">{zone.name}</h3>
                </div>
                <div className="flex items-center">
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {zone.issueCount} issue{zone.issueCount !== 1 ? 's' : ''}
                  </span>
                  <button className="ml-2 text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedZone === zone.id ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {expandedZone === zone.id && (
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {zone.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {zone.categories.map((category, index) => (
                      <span 
                        key={index} 
                        className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    View detailed report
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        Priority zones are determined based on issue density, urgency, and community impact
      </div>
    </div>
  );
};

export default ImprovementZones; 