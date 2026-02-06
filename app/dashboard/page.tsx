'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useTheme } from '@/context/ThemeContext';
import axios from 'axios';

interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'community' | 'opportunity' | 'service' | 'other';
  provider: string;
  imageUrl: string; 
  availability: 'available' | 'limited' | 'coming_soon';
}

interface CivicScore {
  totalPoints: number;
  level: string;
  nextLevelPoints: number;
  pointsHistory: {
    id: string;
    activity: string;
    points: number;
    date: string;
    source: string;
  }[];
}

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  
  const [redemptionOptions, setRedemptionOptions] = useState<RedemptionOption[]>([]);
  const [civicScore, setCivicScore] = useState<CivicScore | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    // Fetch user's civic score and redemption options
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real application, we would fetch from an API
        // For now, we'll use mock data
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock civic score data
        const mockCivicScore: CivicScore = {
          totalPoints: 750,
          level: 'Silver',
          nextLevelPoints: 1000,
          pointsHistory: [
            {
              id: '1',
              activity: 'Community Cleanup',
              points: 100,
              date: '2023-06-15',
              source: 'Event'
            },
            {
              id: '2',
              activity: 'Voting in Local Election',
              points: 200,
              date: '2023-05-20',
              source: 'Governance'
            },
            {
              id: '3',
              activity: 'Code Redemption: CIVIC2023',
              points: 150,
              date: '2023-04-28',
              source: 'Code'
            },
            {
              id: '4',
              activity: 'Survey Participation',
              points: 50,
              date: '2023-04-10',
              source: 'Participation'
            },
            {
              id: '5',
              activity: 'Reporting Infrastructure Issue',
              points: 75,
              date: '2023-03-05',
              source: 'Contribution'
            },
            {
              id: '6',
              activity: 'Code Redemption: COMMUNITY',
              points: 175,
              date: '2023-02-15',
              source: 'Code'
            },
          ]
        };
        
        // Mock redemption options
        const mockRedemptionOptions: RedemptionOption[] = [
          {
            id: '1',
            title: 'Priority Service at Municipal Office',
            description: 'Skip the line for municipal services with your civic points',
            pointsCost: 200,
            category: 'service',
            provider: 'Municipal Corporation',
            imageUrl: '/assets/municipal-service.jpg',
            availability: 'available'
          },
          {
            id: '2',
            title: 'Community Garden Plot',
            description: 'Reserve a plot in the community garden for a season',
            pointsCost: 350,
            category: 'community',
            provider: 'Parks Department',
            imageUrl: '/assets/garden-plot.jpg',
            availability: 'limited'
          },
          {
            id: '3',
            title: 'Local Business Discount',
            description: '15% discount at participating local businesses',
            pointsCost: 150,
            category: 'service',
            provider: 'Local Business Association',
            imageUrl: '/assets/discount-card.jpg',
            availability: 'available'
          },
          {
            id: '4',
            title: 'Leadership Training',
            description: 'Access to leadership workshop for community advocates',
            pointsCost: 500,
            category: 'opportunity',
            provider: 'Civic Leadership Institute',
            imageUrl: '/assets/leadership-training.jpg',
            availability: 'coming_soon'
          },
          {
            id: '5',
            title: 'Public Transit Pass',
            description: 'Monthly public transportation pass',
            pointsCost: 300,
            category: 'service',
            provider: 'Transportation Authority',
            imageUrl: '/assets/transit-pass.jpg',
            availability: 'available'
          },
          {
            id: '6',
            title: 'Community Event Ticket',
            description: 'Ticket to upcoming community festival',
            pointsCost: 100,
            category: 'community',
            provider: 'Cultural Affairs Office',
            imageUrl: '/assets/event-ticket.jpg',
            availability: 'limited'
          },
          {
            id: '7',
            title: 'Job Fair Priority Access',
            description: 'VIP early access to municipal job fair',
            pointsCost: 250,
            category: 'opportunity',
            provider: 'Employment Department',
            imageUrl: '/assets/job-fair.jpg',
            availability: 'coming_soon'
          },
          {
            id: '8',
            title: 'Free Parking Pass',
            description: '10-day parking pass for municipal lots',
            pointsCost: 180,
            category: 'service',
            provider: 'Parking Authority',
            imageUrl: '/assets/parking-pass.jpg',
            availability: 'available'
          }
        ];
        
        setCivicScore(mockCivicScore);
        setRedemptionOptions(mockRedemptionOptions);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Hide success message after 5 seconds
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Function to redeem points for an option
  const redeemPoints = async (option: RedemptionOption) => {
    if (!civicScore) return;
    
    // Check if user has enough points
    if (civicScore.totalPoints < option.pointsCost) {
      alert(`You don't have enough points to redeem this option. You need ${option.pointsCost} points.`);
      return;
    }
    
    // For demo purposes, we'll just update the state
    // In a real app, this would make an API call
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update civic score
      setCivicScore({
        ...civicScore,
        totalPoints: civicScore.totalPoints - option.pointsCost,
        pointsHistory: [
          {
            id: `redemption-${Date.now()}`,
            activity: `Redeemed: ${option.title}`,
            points: -option.pointsCost,
            date: new Date().toISOString().split('T')[0],
            source: 'Redemption'
          },
          ...civicScore.pointsHistory
        ]
      });
      
      // Show success message
      setSuccessMessage(`You have successfully redeemed ${option.title}!`);
      setShowSuccess(true);
    } catch (error: any) {
      console.error('Error redeeming points:', error);
      alert('Failed to redeem points. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter redemption options by category
  const filteredOptions = selectedCategory === 'all' 
    ? redemptionOptions 
    : redemptionOptions.filter(option => option.category === selectedCategory);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-3xl sm:truncate`}>
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/civic-passport"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
              View Civic Passport
            </Link>
          </div>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="mt-6">
          {isLoading && !civicScore ? (
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
              <div className="animate-pulse flex flex-col space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
              <div className="text-red-500 text-center">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Civic Score Card */}
              <div className="lg:col-span-1">
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <div className="px-5 py-6">
                    <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Your Civic Score
                    </h3>
                    
                    {civicScore && (
                      <div className="mt-4">
                        <div className="flex flex-col items-center">
                          <div className="relative rounded-full w-32 h-32 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 mb-4">
                            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                              {civicScore.totalPoints}
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Current Level
                            </p>
                            <h4 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {civicScore.level}
                            </h4>
                            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {civicScore.nextLevelPoints - civicScore.totalPoints} points until next level
                            </p>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full mt-4">
                            <div className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${isDarkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                                    Progress
                                  </span>
                                </div>
                                <div className={`text-right text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {Math.round((civicScore.totalPoints / civicScore.nextLevelPoints) * 100)}%
                                </div>
                              </div>
                              <div className={`overflow-hidden h-2 text-xs flex rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div
                                  style={{ width: `${(civicScore.totalPoints / civicScore.nextLevelPoints) * 100}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Recent activity */}
              <div className="mt-6">
                          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Recent Activity
                          </h4>
                          <ul className="mt-3 divide-y divide-gray-200 dark:divide-gray-700">
                            {civicScore.pointsHistory.slice(0, 5).map((activity) => (
                              <li key={activity.id} className="py-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {activity.activity}
                                    </p>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {formatDate(activity.date)} · {activity.source}
                                    </p>
                                  </div>
                                  <div className={`text-sm font-semibold ${
                                    activity.points > 0 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {activity.points > 0 ? '+' : ''}{activity.points}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4">
                <Link
                              href="/civic-passport/history"
                              className={`text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300`}
                >
                              View full history →
                </Link>
              </div>
            </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Redemption Options */}
              <div className="lg:col-span-2">
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <div className="px-5 py-6">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-lg font-medium leading-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Redeem Your Points
                      </h3>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {civicScore?.totalPoints || 0} points available
                      </span>
                    </div>
                    
                    {/* Category filters */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCategory === 'all'
                            ? 'bg-indigo-600 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setSelectedCategory('community')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCategory === 'community'
                            ? 'bg-indigo-600 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Community
                      </button>
                      <button
                        onClick={() => setSelectedCategory('service')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCategory === 'service'
                            ? 'bg-indigo-600 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Services
                      </button>
                      <button
                        onClick={() => setSelectedCategory('opportunity')}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedCategory === 'opportunity'
                            ? 'bg-indigo-600 text-white'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Opportunities
                      </button>
                    </div>
                    
                    {/* Redemption options grid */}
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {filteredOptions.map((option) => (
                        <div 
                          key={option.id} 
                          className={`border rounded-lg overflow-hidden ${
                            isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200'
                          }`}
                        >
                          <div className="h-40 bg-gray-200 relative">
                            {/* We would use a real image here, but for now use a color */}
                            <div className={`absolute inset-0 ${
                              option.category === 'community' ? 'bg-blue-400' :
                              option.category === 'service' ? 'bg-green-400' :
                              'bg-purple-400'
                            } flex items-center justify-center`}>
                              <span className="text-white text-lg font-medium">
                                {option.category === 'community' ? 'Community' :
                                 option.category === 'service' ? 'Service' :
                                 'Opportunity'}
                              </span>
                            </div>
                            
                            {/* Availability tag */}
                            {option.availability !== 'available' && (
                              <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${
                                option.availability === 'limited' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {option.availability === 'limited' ? 'Limited' : 'Coming Soon'}
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h4 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {option.title}
                              </h4>
                              <div className={`text-sm font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {option.pointsCost} pts
                              </div>
                                  </div>
                            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {option.description}
                            </p>
                            <div className={`mt-3 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Provided by {option.provider}
                                    </div>
                            <div className="mt-4">
                              <button
                                onClick={() => redeemPoints(option)}
                                disabled={isLoading || 
                                          option.availability !== 'available' || 
                                          (civicScore && civicScore.totalPoints < option.pointsCost)}
                                className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                                  ${isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : option.availability !== 'available' 
                                      ? 'bg-gray-400 cursor-not-allowed' 
                                      : civicScore && civicScore.totalPoints < option.pointsCost 
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                  }`}
                              >
                                {option.availability !== 'available' 
                                  ? option.availability === 'limited' ? 'Limited Availability' : 'Coming Soon'
                                  : civicScore && civicScore.totalPoints < option.pointsCost 
                                    ? 'Not Enough Points' 
                                    : 'Redeem'}
                              </button>
                                    </div>
                                  </div>
                                </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 