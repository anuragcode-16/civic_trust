'use client';

import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DocumentVaultProps {
  isVerified: boolean;
}

export default function DocumentVault({ isVerified }: DocumentVaultProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  // Sample documents data
  const documents = [
    { 
      id: 1, 
      name: 'Aadhaar Card', 
      type: 'identity', 
      issuer: 'UIDAI', 
      verified: true,
      lastVerified: '05 Apr 2023',
      icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
    },
    { 
      id: 2, 
      name: 'PAN Card', 
      type: 'identity',
      issuer: 'Income Tax Dept',
      verified: true,
      lastVerified: '02 Apr 2023',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    { 
      id: 3, 
      name: 'Voter ID Card', 
      type: 'identity',
      issuer: 'Election Commission',
      verified: true,
      lastVerified: '28 Mar 2023',
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
    },
    { 
      id: 4, 
      name: 'ABHA Health Record', 
      type: 'health',
      issuer: 'National Health Authority',
      verified: true, 
      lastVerified: '10 Mar 2023',
      icon: 'M4.5 12.75l6 6 9-13.5'
    },
    { 
      id: 5, 
      name: 'Diploma Certificate', 
      type: 'education',
      issuer: 'Mumbai University',
      verified: true,
      lastVerified: '15 Feb 2023',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
    },
    { 
      id: 6, 
      name: 'Domicile Certificate', 
      type: 'residence',
      issuer: 'Govt of Maharashtra',
      verified: true,
      lastVerified: '20 Jan 2023',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    { 
      id: 7, 
      name: 'Bank Statement', 
      type: 'financial',
      issuer: 'SBI Bank',
      verified: false,
      lastVerified: 'Pending',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
    },
    { 
      id: 8, 
      name: 'Income Certificate', 
      type: 'financial',
      issuer: 'Revenue Department',
      verified: false,
      lastVerified: 'Pending',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    },
  ];

  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === activeTab);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'identity', label: 'Identity' },
    { id: 'education', label: 'Education' },
    { id: 'health', label: 'Health' },
    { id: 'financial', label: 'Financial' },
    { id: 'residence', label: 'Residence' }
  ];

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium">Document Vault</h2>
        <button 
          className="px-3 py-1 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Add Document
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="px-6 overflow-x-auto whitespace-nowrap">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? `border-primary ${isDarkMode ? 'text-primary' : 'text-primary'}`
                    : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Document Grid */}
      {isVerified ? (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } cursor-pointer transition duration-150 ease-in-out`}
              >
                <div className="flex items-start">
                  <div className={`p-2 rounded-md ${doc.verified ? 'bg-green-100' : 'bg-yellow-100'} mr-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${doc.verified ? 'text-green-600' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={doc.icon} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                      {doc.issuer}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${doc.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doc.lastVerified}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="rounded-full bg-yellow-100 p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-lg font-medium mb-2">Verification Required</p>
          <p className={`text-sm text-center mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Please verify your identity to access your document vault
          </p>
        </div>
      )}
    </div>
  );
} 