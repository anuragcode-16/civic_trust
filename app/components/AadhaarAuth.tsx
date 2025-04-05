'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

interface AadhaarAuthProps {
  onVerificationComplete: (status: boolean, data?: {
    uid: string;
    name: string;
    maskedAadhaar: string;
    state: string;
    district: string;
  }) => void;
  verificationMode?: 'full' | 'anonymous';
}

export default function AadhaarAuth({ onVerificationComplete, verificationMode = 'anonymous' }: AadhaarAuthProps) {
  const { isDarkMode } = useTheme();
  
  const [verificationStep, setVerificationStep] = useState<'input' | 'otp' | 'processing' | 'success' | 'error'>('input');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Format Aadhaar number with spaces for readability
  const formatAadhaar = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    let formatted = '';
    
    for (let i = 0; i < digitsOnly.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digitsOnly[i];
    }
    
    return formatted;
  };
  
  // Handle Aadhaar number input
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
  };
  
  // Handle OTP input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const otpValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(otpValue);
  };
  
  // Request OTP
  const requestOtp = async () => {
    // Validation
    const digitsOnly = aadhaarNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // In a production environment, this would call an actual API endpoint
      // Here we're simulating an API call with setTimeout
      // const response = await axios.post('/api/aadhaar/request-otp', { 
      //   aadhaarNumber: digitsOnly,
      //   verificationMode 
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful response
      const mockResponse = {
        success: true,
        transactionId: 'TX-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      };
      
      setTransactionId(mockResponse.transactionId);
      setVerificationStep('otp');
    } catch (error: any) {
      console.error('OTP request failed:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify OTP
  const verifyOtp = async () => {
    // Validation
    if (otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setVerificationStep('processing');
    
    try {
      // In a production environment, this would call an actual API endpoint
      // const response = await axios.post('/api/aadhaar/verify-otp', { 
      //   transactionId,
      //   otp,
      //   verificationMode 
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful verification
      setVerificationStep('success');
      
      const digitsOnly = aadhaarNumber.replace(/\D/g, '');
      const lastFour = digitsOnly.slice(-4);
      
      // Mock user data that would come from Aadhaar in real implementation
      const mockUserData = {
        uid: `xxxx-xxxx-${lastFour}`,
        name: verificationMode === 'full' ? 'Raj Kumar' : 'Anonymous User',
        maskedAadhaar: `xxxx xxxx ${lastFour}`,
        state: 'Maharashtra',
        district: 'Mumbai'
      };
      
      // Notify parent component of successful verification
      onVerificationComplete(true, mockUserData);
      
      // In a real implementation, you would store the verification hash or token
      // in localStorage or in a state management system to maintain the user's verified status
      localStorage.setItem('aadhaarVerified', 'true');
      localStorage.setItem('aadhaarVerificationMode', verificationMode);
      localStorage.setItem('aadhaarHash', mockUserData.uid);
      
    } catch (error: any) {
      setVerificationStep('error');
      console.error('OTP verification failed:', error);
      setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      onVerificationComplete(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset the verification process
  const resetVerification = () => {
    setVerificationStep('input');
    setAadhaarNumber('');
    setOtp('');
    setErrorMessage('');
    setTransactionId('');
  };

  return (
    <div className={`p-6 rounded-lg shadow-md max-w-md mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-center mb-6">
        <div className="relative h-16 w-32">
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-blue-100 text-blue-600 rounded-lg">
            Aadhaar
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-6">
        {verificationMode === 'anonymous' ? 'Anonymous Aadhaar Verification' : 'Aadhaar Verification'}
      </h2>
      
      {verificationMode === 'anonymous' && (
        <div className={`mb-6 p-3 rounded-md text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            <span className="font-bold">Privacy Notice:</span> With Anonymous Verification, your personal details from Aadhaar will not be stored or shared. Only a verification hash will be created to confirm your identity.
          </p>
        </div>
      )}
      
      {/* Input Step */}
      {verificationStep === 'input' && (
        <>
          <div className="mb-4">
            <label htmlFor="aadhaar" className="block text-sm font-medium mb-1">
              Enter Aadhaar Number
            </label>
            <input
              type="text"
              id="aadhaar"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              placeholder="XXXX XXXX XXXX"
              className={`w-full px-4 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              } focus:ring-primary focus:border-primary text-center text-lg tracking-wider`}
              maxLength={14}
            />
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <button
            onClick={requestOtp}
            disabled={isLoading}
            className={`w-full py-2.5 px-5 rounded-md text-white ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
            } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
          >
            {isLoading ? 'Sending OTP...' : 'Request OTP'}
          </button>
        </>
      )}
      
      {/* OTP Step */}
      {verificationStep === 'otp' && (
        <>
          <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            An OTP has been sent to the mobile number linked with your Aadhaar {aadhaarNumber}.
          </p>
          
          <div className="mb-2">
            <label htmlFor="otp" className="block text-sm font-medium mb-1">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="XXXXXX"
              className={`w-full px-4 py-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 text-gray-900'
              } focus:ring-primary focus:border-primary text-center text-lg tracking-wider`}
              maxLength={6}
            />
          </div>
          
          <div className="mb-4">
            <p className="text-xs text-gray-500">Transaction ID: {transactionId}</p>
          </div>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={resetVerification}
              disabled={isLoading}
              className={`flex-1 py-2.5 px-5 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              } font-medium focus:outline-none hover:bg-opacity-80 transition-colors`}
            >
              Back
            </button>
            
            <button
              onClick={verifyOtp}
              disabled={isLoading}
              className={`flex-1 py-2.5 px-5 rounded-md text-white ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
              } font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </>
      )}
      
      {/* Processing Step */}
      {verificationStep === 'processing' && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p>Verifying your Aadhaar...</p>
          <p className="text-sm mt-2 opacity-70">Please wait while we securely verify your identity</p>
        </div>
      )}
      
      {/* Success Step */}
      {verificationStep === 'success' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-500 mb-2">Verification Successful</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your identity has been verified successfully.
          </p>
          {verificationMode === 'anonymous' && (
            <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your Aadhaar details are not stored, only a verification proof is created.
            </p>
          )}
        </div>
      )}
      
      {/* Error Step */}
      {verificationStep === 'error' && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-500 mb-2">Verification Failed</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {errorMessage || 'We could not verify your identity. Please try again.'}
          </p>
          <button
            onClick={resetVerification}
            className="mt-4 py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 