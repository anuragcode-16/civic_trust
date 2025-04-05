'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
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

export default function NewProposal() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const daoId = searchParams.get('dao');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dao, setDao] = useState<DAO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    budget: '',
    votingPeriod: '7',
    attachments: null as File[] | null,
  });
  
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
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
        
        setDao(mockDao);
      } catch (error: any) {
        console.error('Error fetching DAO details:', error);
        setError(error.message || 'Failed to fetch DAO details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDaoDetails();
  }, [daoId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files) {
        setFormData({
          ...formData,
          [name]: fileInput.files
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!daoId) return;
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // In a real implementation, this would be an API call
      // const response = await axios.post('/api/proposals/create', {
      //   ...formData,
      //   daoId
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the governance page with success message
      router.push(`/governance?dao=${daoId}&proposalCreated=true`);
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      setSubmitError(error.message || 'Failed to create proposal');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!daoId) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No DAO Selected</h2>
          <p className="mb-6">Please select a DAO from your dashboard to create a proposal.</p>
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
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 ${isDarkMode ? 'text-white' : 'text-gray-900'} sm:text-3xl sm:truncate`}>
                  Create New Proposal
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  for {dao.name}
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                  href={`/governance?dao=${dao.daoId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
            
            {/* Proposal Form */}
            <div className={`mt-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-6 sm:px-6`}>
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="mb-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error creating proposal</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{submitError}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Title *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary focus:border-primary' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        } shadow-sm sm:text-sm`}
                        placeholder="Enter a clear, concise title for your proposal"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Description *
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={5}
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary focus:border-primary' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        } shadow-sm sm:text-sm`}
                        placeholder="Provide a detailed description of your proposal"
                      />
                    </div>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Include relevant information such as the purpose, expected outcomes, and implementation details.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="category" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Category *
                      </label>
                      <div className="mt-1">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary focus:border-primary' 
                              : 'border-gray-300 focus:ring-primary focus:border-primary'
                          } shadow-sm sm:text-sm`}
                        >
                          <option value="Infrastructure">Infrastructure</option>
                          <option value="Environment">Environment</option>
                          <option value="Community">Community</option>
                          <option value="Safety">Safety</option>
                          <option value="Governance">Governance</option>
                          <option value="Technology">Technology</option>
                          <option value="Finance">Finance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="budget" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Budget (₹)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="budget"
                          id="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className={`block w-full rounded-md ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary focus:border-primary' 
                              : 'border-gray-300 focus:ring-primary focus:border-primary'
                          } shadow-sm sm:text-sm`}
                          placeholder="e.g., 100000"
                        />
                      </div>
                      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Leave blank if no budget is required
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="votingPeriod" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Voting Period *
                    </label>
                    <div className="mt-1">
                      <select
                        id="votingPeriod"
                        name="votingPeriod"
                        value={formData.votingPeriod}
                        onChange={handleInputChange}
                        className={`block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary focus:border-primary' 
                            : 'border-gray-300 focus:ring-primary focus:border-primary'
                        } shadow-sm sm:text-sm`}
                      >
                        <option value="3">3 days</option>
                        <option value="5">5 days</option>
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="attachments" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Attachments
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        name="attachments"
                        id="attachments"
                        multiple
                        onChange={handleInputChange}
                        className={`block w-full ${
                          isDarkMode 
                            ? 'text-gray-200 file:bg-gray-700 file:text-gray-200 file:border-gray-600' 
                            : 'text-gray-700 file:bg-gray-100 file:text-gray-700 file:border-gray-300'
                        } file:cursor-pointer file:rounded-md file:border file:border-solid file:px-3 file:py-2 file:mr-4 file:font-medium file:text-sm`}
                      />
                    </div>
                    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload any supporting documents (max 5MB per file)
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Link
                    href={`/governance?dao=${dao.daoId}`}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      isSubmitting ? 'bg-primary-300' : 'bg-primary hover:bg-primary-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Proposal'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
} 