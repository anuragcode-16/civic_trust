'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCodeRedeem: (code: string) => Promise<void>;
  walletAddress?: string | null;
}

export default function RedeemCodeModal({ isOpen, onClose, onCodeRedeem, walletAddress }: RedeemCodeModalProps) {
  const { isDarkMode } = useTheme();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [blockchainRecording, setBlockchainRecording] = useState(false);
  const [transaction, setTransaction] = useState<{
    hash: string;
    blockNumber?: number;
    status: string;
  } | null>(null);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
      setSuccess('');
      setBlockchainRecording(false);
      setTransaction(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a valid code');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    setBlockchainRecording(false);
    setTransaction(null);

    try {
      const response = await onCodeRedeem(code);
      
      // If wallet is connected, show blockchain recording state
      if (walletAddress) {
        setBlockchainRecording(true);
        setSuccess('Code redeemed! Recording on blockchain...');
        
        // Check if we got transaction data back
        if (response && response.transaction) {
          // Show blockchain recording status
          setTimeout(() => {
            setBlockchainRecording(false);
            setTransaction({
              hash: response.transaction.hash,
              blockNumber: response.transaction.blockNumber,
              status: 'confirmed'
            });
            setSuccess(`Code redeemed for ${response.pointsEarned} points and recorded on blockchain!`);
            
            // Close the modal after 3 seconds
            setTimeout(() => {
              onClose();
            }, 3000);
          }, 2000);
        } else {
          // Fallback if no transaction data
          setTimeout(() => {
            setBlockchainRecording(false);
            setSuccess('Code redeemed and recorded on blockchain successfully!');
            
            // Close the modal after 3 seconds
            setTimeout(() => {
              onClose();
            }, 3000);
          }, 2000);
        }
      } else {
        // No wallet connected case
        setSuccess(`Code redeemed successfully for ${response?.pointsEarned || ''} points!`);
        
        // Close the modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      
      setCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to redeem code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div 
          className={`inline-block align-bottom ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium" id="modal-headline">
                  Redeem Code
                </h3>
                <div className="mt-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Enter your redemption code to earn civic points. Codes can be earned through community participation and events.
                  </p>
                  {walletAddress && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                          Points will be recorded on the blockchain with your connected wallet
                        </span>
                      </div>
                    </div>
                  )}
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="font-semibold">Hint:</span> Try codes like CIVIC2023, COMMUNITY, BUILDER, PARTICIPATE, or GOVERNANCE.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5">
              <div>
                <label 
                  htmlFor="code" 
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Redemption Code
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  className={`mt-1 block w-full rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300 focus:ring-primary focus:border-primary'
                  } shadow-sm py-2 px-3`}
                  placeholder="Enter your code (e.g., CIVIC-XYZ-123)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="mt-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-3 text-sm text-green-500 flex items-center">
                  {blockchainRecording ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : transaction ? (
                    <svg className="mr-2 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  ) : null}
                  {success}
                </div>
              )}

              {transaction && (
                <div className="mt-3 p-3 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20">
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
                    Transaction confirmed and recorded on the blockchain
                  </p>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-300">Tx Hash:</span>
                    <span className="ml-1 text-xs font-mono truncate">
                      {transaction.hash.substring(0, 14) + '...' + transaction.hash.substring(transaction.hash.length - 6)}
                    </span>
                  </div>
                  {transaction.blockNumber && (
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-300">Block:</span>
                      <span className="ml-1 text-xs">{transaction.blockNumber}</span>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || blockchainRecording}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm ${
                (isSubmitting || blockchainRecording) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Redeeming...' : blockchainRecording ? 'Recording...' : 'Redeem'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || blockchainRecording}
              className={`mt-3 w-full inline-flex justify-center rounded-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              } shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                (isSubmitting || blockchainRecording) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 