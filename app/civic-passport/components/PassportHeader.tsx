'use client';

import { useTheme } from '../../context/ThemeContext';

interface PassportHeaderProps {
  isVerified: boolean;
  onVerify: () => void;
}

export default function PassportHeader({ isVerified, onVerify }: PassportHeaderProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
      <div className="px-6 py-5 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Civic Passport</h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 md:mb-0`}>
              Your portable civic identity for seamless access to government services
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isVerified ? 'Verified' : 'Verification Required'}
              </span>
            </div>
            
            <button
              onClick={onVerify}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                isVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-dark'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {isVerified ? 'View Verification' : 'Verify Identity'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Information bar */}
      <div className={`${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} px-6 py-3 grid grid-cols-1 md:grid-cols-3 gap-4`}>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
          <span className="text-sm">Aadhaar Linked</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm">14 Documents Stored</span>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">Current State: Maharashtra</span>
        </div>
      </div>
    </div>
  );
} 