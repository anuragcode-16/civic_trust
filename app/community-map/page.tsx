'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import GeminiInsights from '../components/GeminiInsights';
import EngagementHeatmap from '../components/EngagementHeatmap';
import ImprovementZones from '../components/ImprovementZones';
import CommunityInitiatives from '../components/CommunityInitiatives';

// User location state and geolocation setup
const DEFAULT_LOCATION = { lat: 37.7749, lng: -122.4194 }; // San Francisco as default

// List of mock civic issues
const mockIssues = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic hazards',
    category: 'Infrastructure',
    status: 'Open',
    location: 'Downtown - 123 Main St',
    votes: 15,
    createdBy: 'John Doe',
    createdAt: '2023-04-01T12:00:00Z',
    coords: { lat: 37.7749, lng: -122.4194 } // San Francisco coordinates
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light not working at night, safety concern',
    category: 'Safety',
    status: 'In Progress',
    location: 'Westside - 456 Oak Ave',
    votes: 8,
    createdBy: 'Jane Smith',
    createdAt: '2023-04-02T10:30:00Z',
    coords: { lat: 37.7849, lng: -122.4294 } // Slightly north
  },
  {
    id: '3',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on the community center wall',
    category: 'Vandalism',
    status: 'Open',
    location: 'City Center - 789 Pine St',
    votes: 5,
    createdBy: 'Mike Johnson',
    createdAt: '2023-04-03T15:45:00Z',
    coords: { lat: 37.7649, lng: -122.4094 } // Slightly south
  },
  {
    id: '4',
    title: 'Park Cleanup Needed',
    description: 'Excessive litter in community park',
    category: 'Environment',
    status: 'Open',
    location: 'East Park - 101 Park Ave',
    votes: 12,
    createdBy: 'Sarah Wilson',
    createdAt: '2023-04-04T09:15:00Z',
    coords: { lat: 37.7749, lng: -122.4094 } // Slightly east
  }
];

// Mock engagement data for heatmap view
const engagementData = [
  { area: 'Downtown', level: 'High', percentage: 85 },
  { area: 'City Center', level: 'High', percentage: 78 },
  { area: 'Westside', level: 'Medium', percentage: 65 },
  { area: 'East Park', level: 'Medium', percentage: 55 },
  { area: 'Industrial District', level: 'Low', percentage: 32 },
  { area: 'University Area', level: 'High', percentage: 80 }
];

// Add a helper function for consistent date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function CommunityMapPage() {
  const { isDarkMode } = useTheme();
  const [activeView, setActiveView] = useState<'issues' | 'heatmap' | 'improvements' | 'initiatives' | 'map'>('map');
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(15);
  const [mockIssues, setMockIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  
  // Fetch statistics from the API
  const [communityStats, setCommunityStats] = useState({
    activeIssues: 0,
    resolvedThisMonth: 0,
    totalContributors: 0,
    engagementScore: 0,
    tokenPrice: {
      current: 0,
      history: []
    },
    activities: [],
    tasks: {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0
    },
    impact: {
      issuesResolved: 0,
      communitySatisfaction: 0,
      responseTime: 0,
      participationRate: 0,
      tokenDistributed: 0
    },
    contributors: []
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          fetchIssuesFromAPI(userPos);
        },
        (error) => {
          console.error("Error getting location:", error);
          fetchIssuesFromAPI(DEFAULT_LOCATION);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      fetchIssuesFromAPI(DEFAULT_LOCATION);
    }
  }, []);

  // Fetch issues from the API with proper error handling
  const fetchIssuesFromAPI = async (location: {lat: number, lng: number}) => {
    try {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/issues?lat=${location.lat}&lng=${location.lng}`);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        
        const data = await response.json();
        
        if (data.issues && data.issues.length > 0) {
          // Transform API data to match expected format
          const formattedIssues = data.issues.map((issue: any) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            category: issue.category,
            status: issue.status,
            location: issue.location?.address || "Unknown location",
            votes: issue.votes || 0,
            createdBy: issue.createdBy || "Anonymous",
            createdAt: issue.createdAt,
            coords: { 
              lat: issue.location?.coordinates ? issue.location.coordinates[1] : location.lat,
              lng: issue.location?.coordinates ? issue.location.coordinates[0] : location.lng
            },
            comments: issue.comments || 0,
            impactScore: issue.impactScore || 50,
            contributions: issue.contributions || 0
          }));
          
          setMockIssues(formattedIssues);
          setSelectedIssue(formattedIssues[0]);
          return;
        }
      } catch (apiError) {
        console.warn("API error, falling back to local generation:", apiError);
      }
      
      // Fallback to generating issues locally
      generateLocalIssues(location);
    } catch (error) {
      console.error("Error in issue fetching process:", error);
      generateLocalIssues(location);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock issues around the user's location
  const generateLocalIssues = (location: {lat: number, lng: number}) => {
    // Categories for civic issues
    const categories = ['Infrastructure', 'Safety', 'Environment', 'Vandalism'];
    
    // Types of issues per category
    const issueTypes = {
      'Infrastructure': ['Pothole', 'Broken Sidewalk', 'Street Light Out', 'Water Leak', 'Fallen Tree'],
      'Safety': ['Dangerous Intersection', 'Missing Street Sign', 'Abandoned Vehicle', 'Blocked Fire Hydrant'],
      'Environment': ['Illegal Dumping', 'Park Cleanup', 'Graffiti', 'Overgrown Vegetation'],
      'Vandalism': ['Damaged Public Property', 'Broken Bench', 'Vandalized Bus Stop', 'Defaced Sign']
    };
    
    // Create 5-8 random issues around the location
    const numIssues = Math.floor(Math.random() * 4) + 5;
    const issues = [];
    
    for (let i = 0; i < numIssues; i++) {
      // Random offset from user location (within ~1km)
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      // Pick random category and issue type
      const category = categories[Math.floor(Math.random() * categories.length)];
      const issueList = issueTypes[category as keyof typeof issueTypes];
      const issueType = issueList[Math.floor(Math.random() * issueList.length)];
      
      // Random date in the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      issues.push({
        id: `issue-${i + 1}`,
        title: `${issueType} on ${['Main St', 'Oak Ave', 'Park Rd', 'Center Blvd', 'Pine St'][Math.floor(Math.random() * 5)]}`,
        description: `Local residents reported this ${category.toLowerCase()} issue that needs attention.`,
        category: category,
        status: ['Open', 'In Progress', 'Open'][Math.floor(Math.random() * 3)], // Bias toward "Open"
        location: `${Math.floor(Math.random() * 1000) + 100} ${['Main St', 'Oak Ave', 'Park Rd', 'Center Blvd', 'Pine St'][Math.floor(Math.random() * 5)]}`,
        votes: Math.floor(Math.random() * 20) + 1,
        createdBy: ['Alex Smith', 'Jamie Lee', 'Taylor Jones', 'Casey Kim', 'Morgan Wells'][Math.floor(Math.random() * 5)],
        createdAt: date.toISOString(),
        coords: { 
          lat: location.lat + latOffset, 
          lng: location.lng + lngOffset 
        }
      });
    }
    
    setMockIssues(issues);
    setSelectedIssue(issues[0]);
  };

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

  // Mock insights from Gemini AI
  const mockInsights = [
    "Based on the community data, we've detected a 27% increase in infrastructure issues in the downtown area over the last month.",
    "The engagement heatmap shows that the community center and library have the highest civic participation rates.",
    "Your neighborhood has resolved 15 issues this quarter, placing it in the top 10% of active communities."
  ];

  // Get MapURL for OpenStreetMap using the user's location
  const getMapUrl = () => {
    const centerCoords = selectedIssue?.coords || userLocation;
    
    // We need to incorporate the zoom level and make it interactive
    return `https://www.openstreetmap.org/export/embed.html?bbox=${centerCoords.lng-0.03/zoom}%2C${centerCoords.lat-0.015/zoom}%2C${centerCoords.lng+0.03/zoom}%2C${centerCoords.lat+0.015/zoom}&amp;layer=mapnik&amp;marker=${centerCoords.lat}%2C${centerCoords.lng}`;
  };
  
  // Get AI generated insights based on location and selected issue
  const getGeminiInsights = () => {
    if (!selectedIssue) return [];
    
    // These would ideally be generated by Gemini AI API in a real implementation
    const insights = [
      `This ${selectedIssue.category.toLowerCase()} issue is among the ${selectedIssue.votes > 10 ? 'most reported' : 'emerging concerns'} in this neighborhood.`,
      `Based on historical data, similar ${selectedIssue.category.toLowerCase()} issues in this area typically take ${selectedIssue.id.endsWith('1') ? 14 : selectedIssue.id.endsWith('2') ? 21 : selectedIssue.id.endsWith('3') ? 7 : 18} days to resolve.`,
      `Local resolution rate for ${selectedIssue.category.toLowerCase()} issues is ${selectedIssue.id.endsWith('1') ? 76 : selectedIssue.id.endsWith('2') ? 82 : selectedIssue.id.endsWith('3') ? 69 : 77}%, which is ${selectedIssue.id.endsWith('2') ? 'above' : 'near'} the city average.`
    ];
    
    return insights;
  };

  // Fetch community statistics with proper error handling
  const fetchCommunityStats = async (location: {lat: number, lng: number}) => {
    try {
      try {
        const response = await fetch(`/api/community-stats?lat=${location.lat}&lng=${location.lng}`);
        if (!response.ok) throw new Error(`API returned status ${response.status}`);
        
        const data = await response.json();
        
        if (data) {
          setCommunityStats(data);
          return;
        }
      } catch (apiError) {
        console.warn("Stats API error, using defaults:", apiError);
      }
      
      // If API fails, use default stats
      setCommunityStats({
        activeIssues: mockIssues.length,
        resolvedThisMonth: 8,
        totalContributors: 53,
        engagementScore: 86,
        tokenPrice: {
          current: 1.25,
          history: [
            { date: "2023-01-01", price: "0.75" },
            { date: "2023-02-01", price: "0.90" },
            { date: "2023-03-01", price: "1.05" },
            { date: "2023-04-01", price: "1.15" },
            { date: "2023-05-01", price: "1.25" }
          ]
        }
      });
    } catch (error) {
      console.error("Error fetching community statistics:", error);
    }
  };
  
  // When user location is set, fetch community stats
  useEffect(() => {
    if (userLocation) {
      fetchCommunityStats(userLocation);
    }
  }, [userLocation]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Community Map</h1>
          
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'map' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveView('map')}
            >
              Map
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'issues' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveView('issues')}
            >
              Issues
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'heatmap' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveView('heatmap')}
            >
              Engagement
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'improvements' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveView('improvements')}
            >
              Improvements
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'initiatives' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveView('initiatives')}
            >
              Initiatives
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="xl:col-span-2">
            {activeView === 'map' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Interactive Community Map</h2>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded px-2">
                      <button 
                        onClick={() => setZoom(prev => Math.max(prev - 1, 12))}
                        className="text-sm font-bold w-6 h-6 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-xs">{zoom}</span>
                      <button 
                        onClick={() => setZoom(prev => Math.min(prev + 1, 18))}
                        className="text-sm font-bold w-6 h-6 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedIssue(selectedIssue); // Refresh the map
                        // Recenter to user location
                        navigator.geolocation?.getCurrentPosition(
                          (position) => {
                            const userPos = {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude
                            };
                            setUserLocation(userPos);
                          },
                          (error) => console.error("Error refreshing location:", error),
                          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                        );
                      }} 
                      className="text-xs px-3 py-1 bg-primary text-white rounded-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                      </svg>
                      Refresh Map
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  {isLoading ? (
                    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading map and nearby issues...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                      <iframe
                        src={getMapUrl()}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="OpenStreetMap"
                        className="w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen
                      ></iframe>
                      
                      {/* Add a transparent overlay to intercept all clicks that aren't on markers */}
                      <div className="absolute inset-0" 
                        onClick={() => {/* Intercept clicks to prevent iframe interactions */}}
                      ></div>

                      {/* Interactive marker overlays */}
                      <div className="absolute inset-0 pointer-events-none">
                        {mockIssues.map(issue => {
                          // Calculate position relative to the center of the map
                          // This is an approximation and would need adjustment based on map size and zoom
                          const centerLat = selectedIssue?.coords.lat || userLocation.lat;
                          const centerLng = selectedIssue?.coords.lng || userLocation.lng;
                          
                          // Calculate offsets (these are approximations and need calibration)
                          const latRange = 0.03 / zoom;
                          const lngRange = 0.06 / zoom;
                          
                          const latOffset = (issue.coords.lat - centerLat) / latRange;
                          const lngOffset = (issue.coords.lng - centerLng) / lngRange;
                          
                          const top = 50 - (latOffset * 50); // Convert to percentage (0-100%)
                          const left = 50 + (lngOffset * 50); // Convert to percentage (0-100%)
                          
                          // Only show markers within the visible map area (with some buffer)
                          if (top < -10 || top > 110 || left < -10 || left > 110) {
                            return null;
                          }
                          
                          let bgColor;
                          // Set marker color based on category
                          switch(issue.category) {
                            case 'Infrastructure': bgColor = 'bg-blue-500'; break;
                            case 'Safety': bgColor = 'bg-red-500'; break;
                            case 'Vandalism': bgColor = 'bg-orange-500'; break;
                            case 'Environment': bgColor = 'bg-green-500'; break;
                            default: bgColor = 'bg-gray-500'; break;
                          }
                          
                          return (
                            <div 
                              key={issue.id}
                              className="absolute cursor-pointer group z-10 pointer-events-auto"
                              style={{ 
                                left: `${left}%`, 
                                top: `${top}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIssue(issue);
                              }}
                            >
                              <div 
                                className={`${bgColor} rounded-full border-2 border-white shadow-lg
                                  ${selectedIssue?.id === issue.id ? 'h-6 w-6 animate-pulse' : 'h-4 w-4'}
                                `} 
                              />
                              <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 transition-opacity">
                                <div className="bg-black bg-opacity-75 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  {issue.title}
                                </div>
                                <div className="w-2 h-2 bg-black bg-opacity-75 rotate-45 transform left-1/2 -translate-x-1/2 absolute"></div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* User location marker */}
                        <div 
                          className="absolute cursor-pointer z-20"
                          style={{ 
                            left: '50%', 
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="h-4 w-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg">
                            <div className="absolute -inset-1 bg-indigo-400 rounded-full opacity-30 animate-ping"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Map legend */}
                  <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded shadow-md text-xs">
                    <div className="font-medium mb-1">Map Legend</div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        <span>Infrastructure</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span>Safety</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                        <span>Vandalism</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span>Environment</span>
                      </div>
                      <div className="flex items-center mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-indigo-600 mr-1"></div>
                        <span>Your Location</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!isLoading && mockIssues.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {mockIssues.map(issue => (
                      <button 
                        key={issue.id}
                        className={`p-2 text-xs rounded border transition-colors ${
                          selectedIssue?.id === issue.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: getCategoryColor(issue.category) }}
                          />
                          <span className="truncate">{issue.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : activeView === 'issues' ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
                <h2 className="text-lg font-semibold mb-6">Civic Issues in Your Community</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockIssues.map(issue => (
                    <div 
                      key={issue.id}
                      className={`p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                        selectedIssue && selectedIssue.id === issue.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{issue.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          issue.status === 'Open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                          issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-1"
                          style={{ backgroundColor: getCategoryColor(issue.category) }}
                        ></span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{issue.category}</span>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {issue.location}
                      </div>
                      
                      <div className="mt-2 text-sm">{issue.description}</div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>👍 {issue.votes}</span>
                        <span>Created: {formatDate(issue.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeView === 'heatmap' ? (
              <EngagementHeatmap location={userLocation} />
            ) : activeView === 'improvements' ? (
              <ImprovementZones location={userLocation} />
            ) : (
              <CommunityInitiatives location={userLocation} />
            )}
          </div>
          
          {/* Sidebar with issue details or insights */}
          <div className="xl:col-span-1 space-y-6">
            {/* Selected issue details */}
            {selectedIssue && (activeView === 'map' || activeView === 'issues') ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{selectedIssue.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedIssue.status === 'Open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    selectedIssue.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {selectedIssue.status}
                  </span>
                </div>
                
                <div className="mt-2 text-sm">
                  <span className="text-xs px-2 py-1 rounded-full" 
                    style={{ 
                      backgroundColor: `${getCategoryColor(selectedIssue.category)}20`,
                      color: getCategoryColor(selectedIssue.category)
                    }}>
                    {selectedIssue.category}
                  </span>
                </div>
                
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {selectedIssue.description}
                </p>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedIssue.location}
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reported on {formatDate(selectedIssue.createdAt)}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <button className="flex items-center text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {selectedIssue.votes} Votes
                    </button>
                  </div>
                  <button className="bg-primary text-white rounded-lg px-3 py-1 text-sm">
                    Add Comment
                  </button>
                </div>
                
                {/* Display AI insights about this issue - GeminiInsights now has fallback mechanisms */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <GeminiInsights 
                    prompt={`Analyze this civic issue near ${userLocation.lat.toFixed(4)},${userLocation.lng.toFixed(4)}: ${selectedIssue.title} - ${selectedIssue.description}`}
                    location={userLocation}
                    issue={selectedIssue.title}
                    category={selectedIssue.category}
                    title="Gemini Civic Analysis"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {activeView === 'issues' ? 'Select an Issue' : 
                   activeView === 'heatmap' ? 'Engagement Insights' :
                   activeView === 'improvements' ? 'Improvement Insights' :
                   activeView === 'initiatives' ? 'Initiatives Impact' : 'Community Overview'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  {activeView === 'issues' 
                    ? 'Click on any issue in the list to view its details.' 
                    : activeView === 'heatmap'
                    ? 'Our AI has analyzed the engagement patterns in your community.'
                    : activeView === 'improvements'
                    ? 'Priority zones have been identified based on community needs.'
                    : activeView === 'initiatives'
                    ? 'These initiatives represent ongoing community efforts.'
                    : 'View the map to explore community issues and initiatives.'}
                </p>
                <GeminiInsights
                  prompt={
                    activeView === 'issues' 
                      ? "Analyze the civic issue map and provide insights about current community issues." 
                      : activeView === 'heatmap'
                      ? "Analyze the engagement heatmap and provide insights about community participation."
                      : activeView === 'improvements'
                      ? "Analyze the improvement zones and provide recommendations for the community."
                      : activeView === 'initiatives'
                      ? "Analyze the community initiatives and provide insights about their collective impact."
                      : "Provide an overview of the community civic landscape."
                  }
                  title={
                    activeView === 'issues' ? 'Issue Insights' :
                    activeView === 'heatmap' ? 'Engagement Analysis' :
                    activeView === 'improvements' ? 'Zone Recommendations' :
                    activeView === 'initiatives' ? 'Initiative Impacts' :
                    'Community Overview'
                  }
                  location={userLocation}
                />
              </div>
            )}
            
            {/* Additional stats or information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Local Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Issues</p>
                  <p className="text-2xl font-bold">{communityStats.activeIssues || mockIssues.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Resolved This Month</p>
                  <p className="text-2xl font-bold">{communityStats.resolvedThisMonth || 8}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contributors</p>
                  <p className="text-2xl font-bold">{communityStats.totalContributors || 53}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Score</p>
                  <p className="text-2xl font-bold">{communityStats.engagementScore || 86}%</p>
                </div>
              </div>
              
              {/* Add token price history */}
              {communityStats.tokenPrice?.history?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Token Price History</h3>
                  <div className="h-40 relative">
                    <div className="absolute inset-0 flex items-end">
                      {communityStats.tokenPrice.history.map((item: any, index: number) => {
                        const maxPrice = Math.max(...communityStats.tokenPrice.history.map((i: any) => parseFloat(i.price)));
                        const percentage = (parseFloat(item.price) / maxPrice) * 100;
                        
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full mx-1 rounded-t bg-primary"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <p className="text-xs mt-1 truncate w-full text-center">
                              {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-center text-sm mt-2">
                    Current: <span className="font-semibold">${communityStats.tokenPrice.current}</span>
                  </p>
                </div>
              )}
              
              {/* Add top contributors */}
              {communityStats.contributors?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Top Contributors</h3>
                  <div className="space-y-2">
                    {communityStats.contributors.slice(0, 3).map((contributor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                            {contributor.name.charAt(0)}
                          </div>
                          <span>{contributor.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="px-2 py-1 rounded bg-primary/10 text-primary">
                            {contributor.contributions} contributions
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Add Activities, Tasks, and Impact panels */}
            <div className="space-y-6 mt-6">
              {communityStats.activities?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                  <div className="space-y-3">
                    {communityStats.activities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm">{activity.type.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-sm font-medium">{activity.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {communityStats.tasks && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Community Tasks</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Completed</span>
                        <span className="text-sm font-bold text-green-500">
                          {Math.round((communityStats.tasks.completed / communityStats.tasks.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(communityStats.tasks.completed / communityStats.tasks.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">In Progress</span>
                        <span className="text-sm font-bold text-blue-500">
                          {Math.round((communityStats.tasks.inProgress / communityStats.tasks.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(communityStats.tasks.inProgress / communityStats.tasks.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Pending</span>
                        <span className="text-sm font-bold text-yellow-500">
                          {Math.round((communityStats.tasks.pending / communityStats.tasks.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(communityStats.tasks.pending / communityStats.tasks.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col justify-center items-center">
                      <span className="text-sm mb-1">Total Tasks</span>
                      <span className="text-xl font-bold">{communityStats.tasks.total}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {communityStats.impact && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Community Impact</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Satisfaction</span>
                        <span className="text-sm font-medium">{communityStats.impact.communitySatisfaction}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${communityStats.impact.communitySatisfaction}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Participation Rate</span>
                        <span className="text-sm font-medium">{communityStats.impact.participationRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${communityStats.impact.participationRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Issues Resolved</p>
                        <p className="text-lg font-bold">{communityStats.impact.issuesResolved}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Response</p>
                        <p className="text-lg font-bold">{communityStats.impact.responseTime}h</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 