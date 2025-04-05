'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  organizer: string;
  description: string;
  category: string;
}

interface Project {
  id: string;
  title: string;
  progress: number;
  participants: number;
  description: string;
  category: string;
  createdAt: string;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  upvotes: number;
  reportedBy: string;
  location: string;
  category: string;
  description: string;
}

interface CommunityData {
  events: Event[];
  projects: Project[];
  issues: Issue[];
}

export default function Community() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('events');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationName, setLocationName] = useState('Loading location...');
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data - this will be replaced with MongoDB data
  const [communityData, setCommunityData] = useState<CommunityData>({
    events: [
      {
        id: 'event-1',
        title: 'Community Park Cleanup',
        date: '2023-07-15T09:00:00',
        location: 'Central Park',
        participants: 45,
        organizer: 'Anonymous #F45D',
        description: 'Join us for a community cleanup day at the park. Bring gloves and water!',
        category: 'Environment'
      },
      {
        id: 'event-2',
        title: 'Digital Literacy Workshop',
        date: '2023-07-18T14:00:00',
        location: 'Community Center',
        participants: 28,
        organizer: 'Anonymous #A32B',
        description: 'Learn basic computer skills, internet safety, and how to use online civic services.',
        category: 'Education'
      }
    ],
    projects: [
      {
        id: 'project-1',
        title: 'Smart Street Lighting Initiative',
        progress: 65,
        participants: 78,
        description: 'Implementing energy-efficient LED lights with motion sensors across downtown.',
        category: 'Infrastructure',
        createdAt: '2023-06-01'
      },
      {
        id: 'project-2',
        title: 'Community Garden Expansion',
        progress: 40,
        participants: 52,
        description: 'Expanding the community garden to include more plots and educational areas.',
        category: 'Environment',
        createdAt: '2023-06-15'
      }
    ],
    issues: [
      {
        id: 'issue-1',
        title: 'Broken Sidewalk on Main St',
        status: 'In Progress',
        upvotes: 45,
        reportedBy: 'Anonymous #D12A',
        location: 'Main St & 5th Ave',
        category: 'Infrastructure',
        description: 'Sidewalk has large cracks creating a tripping hazard for pedestrians.'
      },
      {
        id: 'issue-2',
        title: 'Noise Pollution from Construction',
        status: 'Under Review',
        upvotes: 32,
        reportedBy: 'Anonymous #9E4F',
        location: 'Park Avenue',
        category: 'Health',
        description: 'Construction noise starting before allowed hours and continuing after cutoff times.'
      }
    ]
  });

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Reverse geocode to get location name
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data && data[0]) {
                setLocationName(data[0].name);
              }
              setIsLoading(false);
            })
            .catch(() => {
              setLocationName('Your Location');
              setIsLoading(false);
            });
        },
        () => {
          setLocationName('Location access denied');
          setIsLoading(false);
        }
      );
    } else {
      setLocationName('Geolocation not supported');
      setIsLoading(false);
    }
  }, []);

  // Function to handle creating a new event (CRUD - Create)
  const handleCreateEvent = async (newEvent: Partial<Event>) => {
    try {
      setIsLoading(true);
      
      // This will be replaced with actual API call to MongoDB
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newEvent)
      // });
      // const data = await response.json();
      
      // Mock implementation
      const data = { ...newEvent, id: `event-${Date.now()}` } as Event;
      setCommunityData(prev => ({
        ...prev,
        events: [...prev.events, data]
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating event:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Community header */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Community Hub
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Connect with local initiatives in {locationName}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-4 sm:px-0 mt-4">
          <div className="hidden sm:block">
            <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`${
                    activeTab === 'events'
                      ? 'border-primary text-primary'
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`${
                    activeTab === 'projects'
                      ? 'border-primary text-primary'
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('issues')}
                  className={`${
                    activeTab === 'issues'
                      ? 'border-primary text-primary'
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Issues
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="mt-6 px-4 sm:px-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === 'events' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {communityData.events.map(event => (
                    <div key={event.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                      <div className="p-5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.category === 'Environment' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>{event.category}</span>
                        </div>
                        <h3 className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{event.description}</p>
                        <div className="mt-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-500">{event.location}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-500">{event.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-5 py-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Organized by {event.organizer}</span>
                          <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-primary hover:bg-primary-dark focus:outline-none">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {communityData.projects.map(project => (
                    <div key={project.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{project.description}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.category === 'Environment' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>{project.category}</span>
                        </div>
                        <div className="mt-5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-500">Progress</span>
                            <span className="text-sm font-medium text-gray-500">{project.progress}%</span>
                          </div>
                          <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-between items-center">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-500">{project.participants} participants</span>
                          </div>
                          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none">
                            Join Project
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'issues' && (
                <div className="space-y-6">
                  {communityData.issues.map(issue => (
                    <div key={issue.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{issue.title}</h3>
                          <div className="flex space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                            }`}>{issue.status}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              issue.category === 'Infrastructure' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                            }`}>{issue.category}</span>
                          </div>
                        </div>
                        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{issue.description}</p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-500">{issue.location}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 text-sm text-gray-500">Reported by {issue.reportedBy}</span>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-between items-center">
                          <div className="flex items-center">
                            <button className="flex items-center focus:outline-none text-gray-400 hover:text-primary">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
                              </svg>
                              <span className="ml-2 text-sm font-medium">{issue.upvotes}</span>
                            </button>
                          </div>
                          <div className="flex space-x-3">
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none">
                              Comment
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                              Follow
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
} 