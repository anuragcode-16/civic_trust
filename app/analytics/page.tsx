'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import CommunityMap from '../components/CommunityMap';
import GeminiInsights from '../components/GeminiInsights';

// Define the MapIssue interface to match what CommunityMap expects
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

export default function Analytics() {
  const { isDarkMode } = useTheme();
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year', 'all'
  const [activeTab, setActiveTab] = useState('engagement'); // 'engagement', 'governance', 'community'
  const [selectedIssue, setSelectedIssue] = useState<MapIssue | null>(null);

  // Mock data for charts
  const [engagementData] = useState({
    userActivity: [
      { date: 'Jan', active: 3200, new: 450 },
      { date: 'Feb', active: 3500, new: 420 },
      { date: 'Mar', active: 3800, new: 510 },
      { date: 'Apr', active: 4200, new: 580 },
      { date: 'May', active: 4500, new: 620 },
      { date: 'Jun', active: 5000, new: 700 },
    ],
    issuesByCategory: [
      { category: 'Infrastructure', count: 420, percentComplete: 65 },
      { category: 'Sanitation', count: 350, percentComplete: 78 },
      { category: 'Education', count: 280, percentComplete: 42 },
      { category: 'Safety', count: 320, percentComplete: 58 },
      { category: 'Environment', count: 390, percentComplete: 35 },
    ],
    topLocalities: [
      { name: 'Green Park', issues: 178, participation: 85 },
      { name: 'Riverside', issues: 145, participation: 72 },
      { name: 'Central District', issues: 210, participation: 68 },
      { name: 'Tech Hub', issues: 132, participation: 90 },
      { name: 'Heritage Zone', issues: 165, participation: 64 },
    ]
  });

  const [governanceData] = useState({
    proposalStats: [
      { status: 'Active', count: 32 },
      { status: 'Passed', count: 87 },
      { status: 'Rejected', count: 45 },
    ],
    voterParticipation: [
      { month: 'Jan', participation: 34 },
      { month: 'Feb', participation: 38 },
      { month: 'Mar', participation: 42 },
      { month: 'Apr', participation: 45 },
      { month: 'May', participation: 52 },
      { month: 'Jun', participation: 58 },
    ],
    tokenDistribution: [
      { category: 'Community Treasury', percentage: 40 },
      { category: 'Staked for Governance', percentage: 25 },
      { category: 'Active Circulation', percentage: 20 },
      { category: 'Development Fund', percentage: 15 },
    ]
  });

  const [communityData] = useState({
    topContributors: [
      { id: 'Anonymous #F45D', contributions: 87, tokens: 2450 },
      { id: 'Anonymous #A32B', contributions: 65, tokens: 1820 },
      { id: 'Anonymous #7C96', contributions: 58, tokens: 1640 },
      { id: 'Anonymous #9E4F', contributions: 52, tokens: 1475 },
      { id: 'Anonymous #D12A', contributions: 49, tokens: 1380 },
    ],
    issueResolutionTime: [
      { category: 'Infrastructure', avgDays: 12 },
      { category: 'Sanitation', avgDays: 5 },
      { category: 'Education', avgDays: 18 },
      { category: 'Safety', avgDays: 3 },
      { category: 'Environment', avgDays: 15 },
    ],
    communityGrowth: [
      { month: 'Jan', members: 3500 },
      { month: 'Feb', members: 4200 },
      { month: 'Mar', members: 5100 },
      { month: 'Apr', members: 6300 },
      { month: 'May', members: 7800 },
      { month: 'Jun', members: 9500 },
    ]
  });

  // Helper functions for charts
  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key])) * 1.1; // Add 10% padding
  };

  // Export analytics data to CSV
  const exportAnalyticsData = () => {
    try {
      // Determine which data to export based on active tab
      let dataToExport: any[] = [];
      let filename = '';
      let headers: string[] = [];

      // Summary statistics that should be included in all exports
      const summaryStats = [
        {
          metric: 'Summary Statistics',
          statistic: 'Active Users',
          value: '5,000',
          change: '+12.5%',
          period: timeRange
        },
        {
          metric: 'Summary Statistics',
          statistic: 'Issues Resolved',
          value: '1,780',
          change: '+8.2%',
          period: timeRange
        },
        {
          metric: 'Summary Statistics',
          statistic: 'Avg. Response Time',
          value: '8 days',
          change: '-2.3 days',
          period: timeRange
        },
        {
          metric: 'Summary Statistics',
          statistic: 'Total Tokens Distributed',
          value: '350,000 CT',
          change: '+45,000 CT',
          period: timeRange
        }
      ];

      switch (activeTab) {
        case 'engagement':
          // Start with summary stats
          dataToExport = [...summaryStats];
          
          // Add user activity data
          engagementData.userActivity.forEach(item => {
            dataToExport.push({
              metric: 'User Activity',
              period: item.date,
              activeUsers: item.active,
              newUsers: item.new
            });
          });
          
          // Add issues by category
          engagementData.issuesByCategory.forEach(item => {
            dataToExport.push({
              metric: 'Issues by Category',
              category: item.category,
              count: item.count,
              percentComplete: item.percentComplete
            });
          });
          
          // Add top localities
          engagementData.topLocalities.forEach(item => {
            dataToExport.push({
              metric: 'Top Localities',
              locality: item.name,
              issues: item.issues,
              participation: item.participation
            });
          });
          
          filename = 'civic-engagement-analytics';
          headers = ['metric', 'statistic', 'value', 'change', 'period', 'activeUsers', 'newUsers', 'category', 'count', 'percentComplete', 'locality', 'issues', 'participation'];
          break;
          
        case 'governance':
          // Start with summary stats
          dataToExport = [...summaryStats];
          
          // Add proposal stats
          governanceData.proposalStats.forEach(item => {
            dataToExport.push({
              metric: 'Proposal Statistics',
              status: item.status,
              count: item.count
            });
          });
          
          // Add voter participation
          governanceData.voterParticipation.forEach(item => {
            dataToExport.push({
              metric: 'Voter Participation',
              month: item.month,
              participation: item.participation
            });
          });
          
          // Add token distribution
          governanceData.tokenDistribution.forEach(item => {
            dataToExport.push({
              metric: 'Token Distribution',
              category: item.category,
              percentage: item.percentage
            });
          });
          
          filename = 'governance-analytics';
          headers = ['metric', 'statistic', 'value', 'change', 'period', 'status', 'count', 'month', 'participation', 'category', 'percentage'];
          break;
          
        case 'community':
          // Start with summary stats
          dataToExport = [...summaryStats];
          
          // Add top contributors
          communityData.topContributors.forEach(item => {
            dataToExport.push({
              metric: 'Top Contributors',
              id: item.id,
              contributions: item.contributions,
              tokens: item.tokens
            });
          });
          
          // Add issue resolution time
          communityData.issueResolutionTime.forEach(item => {
            dataToExport.push({
              metric: 'Issue Resolution Time',
              category: item.category,
              avgDays: item.avgDays
            });
          });
          
          // Add community growth
          communityData.communityGrowth.forEach(item => {
            dataToExport.push({
              metric: 'Community Growth',
              month: item.month,
              members: item.members
            });
          });
          
          filename = 'community-analytics';
          headers = ['metric', 'statistic', 'value', 'change', 'period', 'id', 'contributions', 'tokens', 'category', 'avgDays', 'month', 'members'];
          break;
      }
      
      // Add time range to filename
      filename = `${filename}-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Convert data to CSV format
      const csvRows = [];
      
      // Add headers
      csvRows.push(headers.join(','));
      
      // Add data rows
      for (const row of dataToExport) {
        const values = headers.map(header => {
          const value = row[header] || '';
          // Handle values with commas
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        });
        csvRows.push(values.join(','));
      }
      
      // Create CSV content
      const csvContent = csvRows.join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Add to document, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      // Show a success message
      console.log(`Analytics data exported as ${filename}`);
      
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      alert('Failed to export analytics data. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Analytics header */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Civic Analytics
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Privacy-preserving insights into community engagement
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-3 md:mt-0 md:ml-4">
                <div className="relative inline-block text-left">
                  <select
                    id="time-range"
                    name="time-range"
                    className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${
                      isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                    }`}
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={exportAnalyticsData}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Export Data
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
                  onClick={() => setActiveTab('engagement')}
                  className={`${
                    activeTab === 'engagement'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Civic Engagement
                </button>
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`${
                    activeTab === 'governance'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Governance
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`${
                    activeTab === 'community'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Community
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 px-4 sm:px-0">
          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-primary bg-opacity-20">
                        <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Active Users</dt>
                          <dd>
                            <div className="text-lg font-medium text-primary">5,000</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-5 py-3`}>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">+12.5%</span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-blue-500 bg-opacity-20">
                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Issues Resolved</dt>
                          <dd>
                            <div className="text-lg font-medium text-blue-500">1,780</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-5 py-3`}>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">+8.2%</span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-green-500 bg-opacity-20">
                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Avg. Response Time</dt>
                          <dd>
                            <div className="text-lg font-medium text-green-500">8 days</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-5 py-3`}>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">-2.3 days</span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden shadow rounded-lg`}>
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-md bg-purple-500 bg-opacity-20">
                        <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Total Tokens Distributed</dt>
                          <dd>
                            <div className="text-lg font-medium text-purple-500">350,000 CT</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} px-5 py-3`}>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">+45,000 CT</span>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Activity Chart */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    User Activity
                  </h3>
                  <div className="mt-4 h-64">
                    <BarChart 
                      data={engagementData.userActivity.map(item => ({
                        label: item.date,
                        value: item.active
                      }))}
                      title="Monthly Active Users"
                      xAxisLabel="Month"
                      yAxisLabel="Users"
                      isDarkMode={isDarkMode}
                      barColor="rgba(79, 70, 229, 0.8)"
                      borderColor="rgba(79, 70, 229, 1)"
                      height={250}
                    />
                  </div>
                </div>
              </div>

              {/* Issues by Category & Top Localities */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Issues by Category */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Issues by Category
                    </h3>
                    <div className="mt-4">
                      <PieChart
                        data={engagementData.issuesByCategory.map(item => ({
                          label: item.category,
                          value: item.count
                        }))}
                        title="Distribution of Issues"
                        isDarkMode={isDarkMode}
                        height={300}
                        showLegend={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Top Localities */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Top Active Localities
                    </h3>
                    <div className="mt-4">
                      <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                                  <tr>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                      Locality
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                      Issues
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                      Participation
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                                  {engagementData.topLocalities.map((locality, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {locality.name}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                          {locality.issues}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`}>
                                            {locality.participation}%
                                          </span>
                                          <div className={`w-24 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
                                            <div
                                              className="h-full bg-primary rounded-full"
                                              style={{ width: `${locality.participation}%` }}
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Governance Tab */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Proposal Status
                    </h3>
                    <div className="mt-4">
                      <PieChart
                        data={governanceData.proposalStats.map(item => ({
                          label: item.status,
                          value: item.count
                        }))}
                        isDarkMode={isDarkMode}
                        height={250}
                        showLegend={true}
                        colors={['rgba(16, 185, 129, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)']}
                      />
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Voter Participation
                    </h3>
                    <div className="mt-4">
                      <LineChart
                        labels={governanceData.voterParticipation.map(item => item.month)}
                        datasets={[
                          {
                            label: 'Participation Rate (%)',
                            data: governanceData.voterParticipation.map(item => item.participation),
                            borderColor: 'rgba(79, 70, 229, 1)',
                            backgroundColor: 'rgba(79, 70, 229, 0.2)'
                          }
                        ]}
                        isDarkMode={isDarkMode}
                        height={250}
                        yAxisLabel="Participation (%)"
                      />
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Token Distribution
                    </h3>
                    <div className="mt-4">
                      <PieChart
                        data={governanceData.tokenDistribution.map(item => ({
                          label: item.category,
                          value: item.percentage
                        }))}
                        isDarkMode={isDarkMode}
                        height={250}
                        showLegend={true}
                        doughnut={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              {/* Community Growth Chart */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Community Growth
                  </h3>
                  <div className="mt-4">
                    <LineChart
                      labels={communityData.communityGrowth.map(item => item.month)}
                      datasets={[
                        {
                          label: 'Members',
                          data: communityData.communityGrowth.map(item => item.members),
                          borderColor: 'rgba(16, 185, 129, 1)',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          fill: true
                        }
                      ]}
                      isDarkMode={isDarkMode}
                      height={300}
                      yAxisLabel="Members"
                    />
                  </div>
                </div>
              </div>

              {/* Top Contributors & Issue Resolution */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Top Contributors */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Top Contributors
                    </h3>
                    <div className="mt-4">
                      <BarChart
                        data={communityData.topContributors.map(item => ({
                          label: item.id,
                          value: item.contributions
                        }))}
                        isDarkMode={isDarkMode}
                        height={300}
                        barColor="rgba(139, 92, 246, 0.8)"
                        borderColor="rgba(139, 92, 246, 1)"
                        xAxisLabel="Contributor ID"
                        yAxisLabel="Contributions"
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Resolution Time */}
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Issue Resolution Time
                    </h3>
                    <div className="mt-4">
                      <BarChart
                        data={communityData.issueResolutionTime.map(item => ({
                          label: item.category,
                          value: item.avgDays
                        }))}
                        isDarkMode={isDarkMode}
                        height={300}
                        barColor="rgba(245, 158, 11, 0.8)"
                        borderColor="rgba(245, 158, 11, 1)"
                        xAxisLabel="Category"
                        yAxisLabel="Days"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Map */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Civic Issues Map
                  </h3>
                  <div className="mt-4">
                    <CommunityMap
                      height="400px"
                      issues={[
                        {
                          id: '1',
                          title: 'Road Maintenance Needed',
                          description: 'Road needs urgent repairs due to potholes',
                          category: 'Infrastructure',
                          status: 'Open',
                          location: {
                            lat: 40.7128,
                            lng: -74.0060,
                          },
                          votes: 24,
                          createdBy: 'Citizen1',
                          createdAt: '2023-06-12T09:30:00Z'
                        },
                        {
                          id: '2',
                          title: 'Park Cleanup Initiative',
                          description: 'Volunteers needed for park cleanup',
                          category: 'Environment',
                          status: 'In Progress',
                          location: {
                            lat: 40.7328,
                            lng: -73.9860,
                          },
                          votes: 45,
                          createdBy: 'Citizen2',
                          createdAt: '2023-06-10T14:45:00Z'
                        },
                        {
                          id: '3',
                          title: 'Street Light Out',
                          description: 'Street light not functioning on Main Street',
                          category: 'Safety',
                          status: 'Open',
                          location: {
                            lat: 40.7028,
                            lng: -74.0160,
                          },
                          votes: 12,
                          createdBy: 'Citizen3',
                          createdAt: '2023-06-14T18:20:00Z'
                        },
                        {
                          id: '4',
                          title: 'School Renovation',
                          description: 'Public school needs renovation of playground',
                          category: 'Education',
                          status: 'Planning',
                          location: {
                            lat: 40.7228,
                            lng: -73.9960,
                          },
                          votes: 78,
                          createdBy: 'Citizen4',
                          createdAt: '2023-06-08T11:15:00Z'
                        },
                        {
                          id: '5',
                          title: 'Waste Collection Issue',
                          description: 'Irregular waste collection in neighborhood',
                          category: 'Sanitation',
                          status: 'Open',
                          location: {
                            lat: 40.7158,
                            lng: -74.0190,
                          },
                          votes: 36,
                          createdBy: 'Citizen5',
                          createdAt: '2023-06-11T08:00:00Z'
                        }
                      ]}
                      onMarkerClick={setSelectedIssue}
                    />
                  </div>
                  {selectedIssue && (
                    <div className="mt-4 p-4 rounded-md bg-opacity-10 bg-primary border border-primary">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedIssue.title}</h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Category: <span className="font-medium">{selectedIssue.category}</span>
                          </p>
                        </div>
                        <div className="bg-primary bg-opacity-20 px-2 py-1 rounded text-sm text-primary font-medium">
                          {selectedIssue.status}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedIssue.votes} votes</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gemini AI Insights */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                <div className="px-4 py-5 sm:p-6">
                  <GeminiInsights
                    prompt="Analyze this civic engagement data and provide insights about community participation trends and areas that need improvement."
                    title="AI-Powered Civic Insights"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}