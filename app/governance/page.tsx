'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import axios from 'axios';

interface DAO {
  daoId: string;
  name: string;
  description: string;
  category: string;
  contractAddress: string;
  createdAt: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  createdAt: string;
  endDate: string;
  votesFor: number;
  votesAgainst: number;
  creator: string;
  category: string;
}

export default function Governance() {
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const daoId = searchParams.get('dao');
  
  const [dao, setDao] = useState<DAO | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('proposals');
  
  useEffect(() => {
    if (!daoId) return;
    
    const fetchDaoDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real implementation, this would be an API call
        // const response = await axios.get(`/api/dao/${daoId}`);
        // const fetchedDao = response.data.data;
        
        // For now, we'll mock the data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock DAO data
        const mockDao: DAO = {
          daoId: daoId,
          name: daoId.includes('abc') ? 'Green Valley Panchayat' : 'Sunshine RWA',
          description: daoId.includes('abc') 
            ? 'Governing body for Green Valley development initiatives'
            : 'Resident Welfare Association for Sunshine Apartments',
          category: daoId.includes('abc') ? 'Panchayat' : 'Resident Welfare Association',
          contractAddress: '0x' + Array(40).fill(0).map(() => 
            Math.floor(Math.random() * 16).toString(16)).join(''),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Mock proposals
        const mockProposals: Proposal[] = [
          {
            id: 'prop_1',
            title: 'Build a New Community Center',
            description: 'Proposal to allocate funds for the construction of a new community center that will serve as a hub for local activities and gatherings.',
            status: 'active',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            votesFor: 15,
            votesAgainst: 5,
            creator: '0x3a4e98b1f7196cdc971d2f40f42bbafd97af3cf5',
            category: 'Infrastructure'
          },
          {
            id: 'prop_2',
            title: 'Monthly Cleaning Drive',
            description: 'Organizing a monthly cleaning drive in the community with volunteer participation and minimal budget allocation for supplies.',
            status: 'passed',
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            votesFor: 35,
            votesAgainst: 2,
            creator: '0x8f2e3a6599a1f0ae3c1c91b9aed9811cc9087c1a',
            category: 'Environment'
          },
          {
            id: 'prop_3',
            title: 'Street Light Maintenance Budget',
            description: 'Allocate budget for replacing broken street lights and improving overall street lighting in the community.',
            status: 'rejected',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
            votesFor: 10,
            votesAgainst: 25,
            creator: '0x3a4e98b1f7196cdc971d2f40f42bbafd97af3cf5',
            category: 'Safety'
          }
        ];
        
        setDao(mockDao);
        setProposals(mockProposals);
      } catch (error: any) {
        console.error('Error fetching DAO details:', error);
        setError(error.message || 'Failed to fetch DAO details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDaoDetails();
  }, [daoId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'executed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate voting progress percentage
  const calculateProgress = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    if (total === 0) return 0;
    return Math.round((votesFor / total) * 100);
  };
  
  if (!daoId) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No DAO Selected</h2>
          <p className="mb-6">Please select a DAO from your dashboard to manage.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        ) : error ? (
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
        ) : dao ? (
          <>
            {/* DAO Header */}
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-3xl sm:truncate`}>
                  {dao.name}
                </h2>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      dao.category === 'Panchayat' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {dao.category}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="truncate">Created: {formatDate(dao.createdAt)}</span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-mono truncate">Contract: {dao.contractAddress.substring(0, 6)}...{dao.contractAddress.substring(dao.contractAddress.length - 4)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                  href={`/proposals/new?dao=${dao.daoId}`}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Create Proposal
                </Link>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-4 max-w-3xl">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {dao.description}
              </p>
            </div>
            
            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`${
                    activeTab === 'proposals'
                      ? `border-primary ${isDarkMode ? 'text-primary' : 'text-primary-800'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Proposals
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`${
                    activeTab === 'members'
                      ? `border-primary ${isDarkMode ? 'text-primary' : 'text-primary-800'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Members
                </button>
                <button
                  onClick={() => setActiveTab('treasury')}
                  className={`${
                    activeTab === 'treasury'
                      ? `border-primary ${isDarkMode ? 'text-primary' : 'text-primary-800'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Treasury
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`${
                    activeTab === 'settings'
                      ? `border-primary ${isDarkMode ? 'text-primary' : 'text-primary-800'}`
                      : `border-transparent ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-700 hover:border-gray-300`
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Settings
                </button>
              </nav>
            </div>
            
            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'proposals' && (
                <div>
                  {proposals.length === 0 ? (
                    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6 text-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium">No proposals</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new proposal.</p>
                      <div className="mt-6">
                        <Link
                          href={`/proposals/new?dao=${dao.daoId}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          New Proposal
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {proposals.map(proposal => (
                        <div key={proposal.id} className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
                          <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between">
                              <div>
                                <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {proposal.title}
                                </h3>
                                <div className="mt-1 max-w-2xl text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                  </span>
                                  <span className="ml-2 text-gray-500">{proposal.category}</span>
                                </div>
                              </div>
                              <Link
                                href={`/proposals/${proposal.id}?dao=${dao.daoId}`}
                                className={`text-sm ${isDarkMode ? 'text-primary-400' : 'text-primary-600'} hover:text-primary-800`}
                              >
                                View Details
                              </Link>
                            </div>
                            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {proposal.description.length > 150 
                                ? proposal.description.substring(0, 150) + '...' 
                                : proposal.description}
                            </p>
                            
                            {/* Voting progress */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  {proposal.status === 'active' 
                                    ? `Ends on ${formatDate(proposal.endDate)}` 
                                    : `Ended on ${formatDate(proposal.endDate)}`}
                                </div>
                                <div className="text-sm font-medium">
                                  {calculateProgress(proposal.votesFor, proposal.votesAgainst)}% Approval
                                </div>
                              </div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    proposal.status === 'passed' 
                                      ? 'bg-green-500' 
                                      : proposal.status === 'rejected' 
                                        ? 'bg-red-500' 
                                        : 'bg-blue-500'
                                  }`} 
                                  style={{ width: `${calculateProgress(proposal.votesFor, proposal.votesAgainst)}%` }}>
                                </div>
                              </div>
                              <div className="mt-1 flex justify-between text-xs text-gray-500">
                                <span>{proposal.votesFor} For</span>
                                <span>{proposal.votesAgainst} Against</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'members' && (
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
                  <h3 className="text-lg font-medium mb-4">Members</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    This feature will allow you to view and manage DAO members.
                  </p>
                  <div className="text-center py-8">
                    <p>Members management coming soon</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'treasury' && (
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
                  <h3 className="text-lg font-medium mb-4">Treasury</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage financial assets and view transaction history.
                  </p>
                  <div className="text-center py-8">
                    <p>Treasury management coming soon</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
                  <h3 className="text-lg font-medium mb-4">Settings</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure DAO settings and governance parameters.
                  </p>
                  <div className="text-center py-8">
                    <p>Settings management coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
} 