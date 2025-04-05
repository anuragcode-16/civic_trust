'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import PassportHeader from './components/PassportHeader';
import PassportCard from './components/PassportCard';
import DocumentVault from './components/DocumentVault';
import CivicScore from './components/CivicScore';
import AccessLogs from './components/AccessLogs';
import VerificationModal from './components/VerificationModal';

export default function CivicPassportPage() {
  const { isDarkMode } = useTheme();
  const [isVerified, setIsVerified] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading of passport data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyIdentity = () => {
    setShowVerificationModal(true);
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
    setShowVerificationModal(false);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {showVerificationModal && (
        <VerificationModal 
          onClose={() => setShowVerificationModal(false)} 
          onVerificationComplete={handleVerificationComplete}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PassportHeader onVerify={handleVerifyIdentity} isVerified={isVerified} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-1">
              <PassportCard isVerified={isVerified} />
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6">
                <DocumentVault isVerified={isVerified} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CivicScore isVerified={isVerified} />
                  <AccessLogs isVerified={isVerified} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 