'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import DAOVisualBuilder from '../components/DAOVisualBuilder';
import ProposalTemplates from '../components/ProposalTemplates';
import AadhaarAuth from '../components/AadhaarAuth';
import CivicCharterGenerator from '../components/CivicCharterGenerator';
import { deployDAO, DAOConfig, ProposalTemplate, DAODeploymentResult } from '../lib/daoService';

export default function Builder() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DAODeploymentResult | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  
  // User verification state
  const [userVerified, setUserVerified] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  // DAO Configuration State
  const [daoConfig, setDaoConfig] = useState<DAOConfig>({
    name: '',
    description: '',
    category: 'Panchayat', // Default category
    location: '',
    useWeightedVoting: false,
    requireVerification: true,
    allowFundAllocation: true,
    minimumVotingPeriod: 3, // Default 3 days
    proposalThreshold: 51, // Default 51%
    customLogo: null,
    primaryColor: '#3B82F6', // Default primary color (blue)
  });
  
  // Selected proposal templates
  const [selectedTemplates, setSelectedTemplates] = useState<ProposalTemplate[]>([]);
  
  // Categories for DAO
  const categories = [
    { id: 'panchayat', name: 'Panchayat' },
    { id: 'rwa', name: 'Resident Welfare Association' },
    { id: 'student', name: 'Student Club/Council' },
    { id: 'ngo', name: 'NGO/Civic Organization' },
    { id: 'smart-city', name: 'Smart City Initiative' },
    { id: 'other', name: 'Other' }
  ];
  
  // Template presets for faster configuration
  const templates = [
    {
      id: 'panchayat-basic',
      name: 'Panchayat Basic',
      description: 'Simple setup for village panchayats with basic voting',
      config: {
        category: 'Panchayat',
        useWeightedVoting: false,
        requireVerification: true,
        allowFundAllocation: true,
        minimumVotingPeriod: 7,
        proposalThreshold: 51
      }
    },
    {
      id: 'rwa-advanced',
      name: 'RWA Advanced',
      description: 'Advanced setup for housing societies with weighted voting based on unit size',
      config: {
        category: 'Resident Welfare Association',
        useWeightedVoting: true,
        requireVerification: true,
        allowFundAllocation: true,
        minimumVotingPeriod: 3,
        proposalThreshold: 60
      }
    },
    {
      id: 'student-council',
      name: 'Student Council',
      description: 'Setup for student groups with equal voting rights and minimal verification',
      config: {
        category: 'Student Club/Council',
        useWeightedVoting: false,
        requireVerification: false,
        allowFundAllocation: true,
        minimumVotingPeriod: 2,
        proposalThreshold: 51
      }
    }
  ];
  
  // Check if user was previously verified
  useEffect(() => {
    const isVerified = localStorage.getItem('aadhaarVerified') === 'true';
    if (isVerified) {
      setUserVerified(true);
      // Try to get user data from localStorage
      try {
        const district = localStorage.getItem('district');
        const state = localStorage.getItem('state');
        const aadhaarHash = localStorage.getItem('aadhaarHash');
        
        if (aadhaarHash) {
          setUserData({
            uid: aadhaarHash,
            state: state || 'Unknown',
            district: district || 'Unknown'
          });
          
          // Auto-populate location if available
          if (state && district && !daoConfig.location) {
            setDaoConfig(prev => ({
              ...prev,
              location: `${district}, ${state}`
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      }
    }
  }, []);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setDaoConfig({
        ...daoConfig,
        [name]: checkbox.checked
      });
    } else if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        setDaoConfig({
          ...daoConfig,
          [name]: fileInput.files[0]
        });
      }
    } else {
      setDaoConfig({
        ...daoConfig,
        [name]: value
      });
    }
  };
  
  // Handle visual builder configuration update
  const handleVisualConfigUpdate = (config: any) => {
    setDaoConfig({
      ...daoConfig,
      ...config
    });
  };
  
  // Apply template configuration
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setDaoConfig({
        ...daoConfig,
        ...template.config
      });
    }
  };
  
  // Add selected proposal template
  const handleAddProposalTemplate = (template: ProposalTemplate) => {
    // Check if already selected
    if (!selectedTemplates.some(t => t.id === template.id)) {
      setSelectedTemplates([...selectedTemplates, template]);
    }
  };
  
  // Remove selected proposal template
  const handleRemoveProposalTemplate = (templateId: string) => {
    setSelectedTemplates(selectedTemplates.filter(t => t.id !== templateId));
  };
  
  // Handle verification completion
  const handleVerificationComplete = (status: boolean, data?: any) => {
    setUserVerified(status);
    if (data) {
      setUserData(data);
      
      // Auto-populate location if available from Aadhaar
      if (data.state && data.district) {
        setDaoConfig({
          ...daoConfig,
          location: `${data.district}, ${data.state}`
        });
        
        // Store in localStorage for future use
        localStorage.setItem('district', data.district);
        localStorage.setItem('state', data.state);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsDeploying(true);
      setDeploymentError(null);
      
      // Store DAO info in localStorage for the dashboard to retrieve
      localStorage.setItem('lastDaoName', daoConfig.name);
      localStorage.setItem('lastDaoDescription', daoConfig.description);
      localStorage.setItem('lastDaoCategory', daoConfig.category);
      
      // Call the deployment service
      const result = await deployDAO(daoConfig, selectedTemplates);
      
      setDeploymentResult(result);
      
      if (result.success) {
        // Wait for 3 seconds before redirecting to allow user to see success message
        setTimeout(() => {
          router.push(`/dashboard?daoCreated=true&daoId=${result.data?.daoId}`);
        }, 3000);
      } else {
        setDeploymentError(result.message);
      }
    } catch (error: any) {
      console.error('Error deploying DAO:', error);
      setDeploymentError(error.message || 'Failed to deploy DAO');
    } finally {
      setIsDeploying(false);
    }
  };
  
  // Navigation between steps
  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!daoConfig.name || !daoConfig.description || !daoConfig.location) {
        return; // Don't proceed if required fields are missing
      }
    }
    
    setCurrentStep(current => Math.min(current + 1, 4));
    
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 1));
    
    // Scroll to top when changing steps
    window.scrollTo(0, 0);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Builder header */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center">
              <h2 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Civic DAO Builder
              </h2>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Create a custom DAO for your community in minutes - no coding required
              </p>
              
              {/* Steps indicators */}
              <div className="mt-6 w-full max-w-3xl">
                <nav className="flex items-center justify-between">
                  <ol className="flex items-center w-full">
                    {[
                      {step: 1, name: 'Basic Info'},
                      {step: 2, name: 'Governance Rules'},
                      {step: 3, name: 'Appearance'},
                      {step: 4, name: 'Review & Deploy'}
                    ].map((item) => (
                      <li key={item.step} className={`relative ${item.step === 4 ? '' : 'pr-8'} ${item.step !== 1 ? 'pl-8' : ''} flex-1`}>
                        <div className="flex items-center">
                          <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                            currentStep >= item.step
                              ? 'bg-primary text-white'
                              : `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                          }`}>
                            <span>{item.step}</span>
                            {item.step !== 4 && (
                              <div className={`absolute top-4 right-[-30px] h-0.5 w-16 ${
                                currentStep > item.step 
                                  ? 'bg-primary' 
                                  : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                              }`} />
                            )}
                          </div>
                          <span className={`ml-3 text-sm font-medium ${
                            currentStep >= item.step
                              ? `${isDarkMode ? 'text-white' : 'text-gray-900'}`
                              : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                          }`}>
                            {item.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        {/* Builder form */}
        <div className="mt-8 px-4 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium leading-6">DAO Basic Information</h3>
                  
                  {/* User verification */}
                  {!userVerified && (
                    <div className="mb-8">
                      <div className="mb-4">
                        <h4 className="text-md font-medium mb-2">Verify Your Identity</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          To create a DAO, please verify your identity with Aadhaar
                        </p>
                      </div>
                      <AadhaarAuth onVerificationComplete={handleVerificationComplete} />
                    </div>
                  )}
                  
                  {userVerified && (
                    <>
                      {/* Templates selection */}
                      <div>
                        <label className="block text-sm font-medium">Start with a template (optional)</label>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                          {templates.map((template) => (
                            <div 
                              key={template.id} 
                              className={`relative rounded-lg border p-4 cursor-pointer hover:border-primary ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-white'}`}
                              onClick={() => applyTemplate(template.id)}
                            >
                              <h4 className="text-sm font-medium">{template.name}</h4>
                              <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                {template.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium">
                            DAO Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={daoConfig.name}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } focus:border-primary focus:ring-primary sm:text-sm`}
                            placeholder="e.g., Green Valley Panchayat DAO"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={daoConfig.category}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } focus:border-primary focus:ring-primary sm:text-sm`}
                            required
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="description" className="block text-sm font-medium">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={daoConfig.description}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } focus:border-primary focus:ring-primary sm:text-sm`}
                            placeholder="Describe the purpose and goals of your DAO"
                            required
                          />
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="location" className="block text-sm font-medium">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={daoConfig.location}
                            onChange={handleInputChange}
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } focus:border-primary focus:ring-primary sm:text-sm`}
                            placeholder="e.g., Mumbai, Maharashtra"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!userVerified || !daoConfig.name || !daoConfig.description || !daoConfig.location}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        userVerified && daoConfig.name && daoConfig.description && daoConfig.location
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Governance Rules */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium leading-6">DAO Governance Rules</h3>
                  
                  {/* Visual builder */}
                  <DAOVisualBuilder onConfigUpdate={handleVisualConfigUpdate} />
                  
                  {/* Proposal Templates */}
                  <div className="mt-8">
                    <h4 className="text-md font-medium mb-4">Include Proposal Templates</h4>
                    <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Select proposal templates to include in your DAO (optional)
                    </p>
                    
                    <ProposalTemplates 
                      onSelectTemplate={handleAddProposalTemplate}
                    />
                    
                    {/* Selected templates */}
                    {selectedTemplates.length > 0 && (
                      <div className="mt-6">
                        <h5 className="text-sm font-medium mb-3">Selected Templates</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedTemplates.map(template => (
                            <div 
                              key={template.id}
                              className={`p-3 rounded-md border flex items-center justify-between ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{template.icon}</span>
                                <span className="font-medium text-sm">{template.title}</span>
                              </div>
                              <button 
                                type="button"
                                onClick={() => handleRemoveProposalTemplate(template.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Appearance */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium leading-6">DAO Appearance</h3>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="customLogo" className="block text-sm font-medium">
                        Upload Custom Logo (optional)
                      </label>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-block h-12 w-12 rounded-full overflow-hidden ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          {daoConfig.customLogo ? (
                            <img
                              src={URL.createObjectURL(daoConfig.customLogo)}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          )}
                        </span>
                        <input
                          id="customLogo"
                          name="customLogo"
                          type="file"
                          className="sr-only"
                          onChange={handleInputChange}
                          accept="image/*"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('customLogo')?.click()}
                          className={`ml-5 py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium ${
                            isDarkMode 
                              ? 'bg-gray-700 text-white hover:bg-gray-600' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="primaryColor" className="block text-sm font-medium">
                        Primary Color
                      </label>
                      <div className="mt-1 flex items-center">
                        <div
                          className="h-8 w-8 rounded-full"
                          style={{ backgroundColor: daoConfig.primaryColor }}
                        />
                        <input
                          type="color"
                          id="primaryColor"
                          name="primaryColor"
                          value={daoConfig.primaryColor}
                          onChange={handleInputChange}
                          className="ml-3 p-1 h-8 w-12 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Charter preview */}
                  <div className="mt-8">
                    <CivicCharterGenerator daoConfig={daoConfig} />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Review & Deploy */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium leading-6">Review and Deploy DAO</h3>
                  
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <h4 className="font-medium mb-4">Summary</h4>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Basic Information</p>
                        <ul className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          <li>Name: {daoConfig.name}</li>
                          <li>Category: {daoConfig.category}</li>
                          <li>Location: {daoConfig.location}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Governance Rules</p>
                        <ul className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          <li>Voting System: {daoConfig.useWeightedVoting ? 'Weighted' : 'Simple (1 person, 1 vote)'}</li>
                          <li>Verification Required: {daoConfig.requireVerification ? 'Yes' : 'No'}</li>
                          <li>Fund Allocation: {daoConfig.allowFundAllocation ? 'Enabled' : 'Disabled'}</li>
                          <li>Minimum Voting Period: {daoConfig.minimumVotingPeriod} days</li>
                          <li>Proposal Threshold: {daoConfig.proposalThreshold}%</li>
                        </ul>
                      </div>
                      
                      {selectedTemplates.length > 0 && (
                        <div className="sm:col-span-2">
                          <p className="text-sm font-medium">Included Proposal Templates</p>
                          <ul className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {selectedTemplates.map(template => (
                              <li key={template.id}>{template.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {!isDeploying && !deploymentResult && (
                      <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                        <p>
                          <span className="font-bold">Important:</span> Once deployed, some DAO parameters cannot be changed. Please review carefully before proceeding.
                        </p>
                      </div>
                    )}
                    
                    {/* Deployment Status */}
                    {isDeploying && (
                      <div className="mt-4 p-4 flex flex-col items-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
                        <p className="text-center font-medium">Deploying your DAO...</p>
                        <p className="text-sm text-center opacity-70 mt-1">This may take a few moments. Please do not close this page.</p>
                      </div>
                    )}
                    
                    {/* Deployment Success */}
                    {deploymentResult && deploymentResult.success && (
                      <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <p className="font-medium">DAO Successfully Deployed!</p>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          <p>Contract Address: <span className="font-mono">{deploymentResult.data?.contractAddress}</span></p>
                          <p className="mt-1">Transaction Hash: <span className="font-mono">{deploymentResult.data?.txHash.slice(0, 10)}...{deploymentResult.data?.txHash.slice(-8)}</span></p>
                          <p className="mt-3">Redirecting to your new DAO dashboard...</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Deployment Error */}
                    {deploymentError && (
                      <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p className="font-medium">Deployment Failed</p>
                        </div>
                        <p className="mt-2 text-sm">{deploymentError}</p>
                        <p className="mt-2 text-sm">Please try again or contact support if the issue persists.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isDeploying}
                      className={`py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                        isDeploying
                          ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                          : isDarkMode 
                            ? 'bg-gray-700 text-white hover:bg-gray-600' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isDeploying || !!deploymentResult}
                      className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isDeploying || !!deploymentResult
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isDeploying ? 'Deploying...' : deploymentResult ? 'Deployed' : 'Deploy DAO'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 