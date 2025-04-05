'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import RedeemCodeModal from '../../components/RedeemCodeModal';
import { ethers } from 'ethers';

interface CivicScoreProps {
  isVerified: boolean;
}

interface PointsHistoryItem {
  source: string;
  points: number;
  date?: string;
  timestamp?: string;
  code?: string;
}

export default function CivicScore({ isVerified }: CivicScoreProps) {
  const { isDarkMode } = useTheme();
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryItem[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  
  // MetaMask wallet integration
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletInfo, setWalletInfo] = useState<{
    network: string;
    chainId: string;
    balance: string;
    displayName?: string;
    avatar?: string;
  } | null>(null);
  
  // Sample civic score data
  const [civicData, setCivicData] = useState({
    score: 78,
    level: 'Active Citizen',
    activities: [
      { name: 'Voting', count: 3, icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
      { name: 'Community Meetings', count: 5, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
      { name: 'Digital Participation', count: 12, icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    ],
    rewards: [
      { name: 'Priority Service', unlocked: true },
      { name: 'Fee Discounts', unlocked: true },
      { name: 'Direct Communication', unlocked: false },
    ]
  });

  // Transaction details modal
  const [selectedTx, setSelectedTx] = useState<{
    hash: string;
    points: number;
    source: string;
    date: string;
  } | null>(null);

  // Check if MetaMask is available
  useEffect(() => {
    const checkMetaMask = async () => {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Remove any existing listeners to prevent duplicates
          window.ethereum.removeAllListeners('accountsChanged');
          window.ethereum.removeAllListeners('chainChanged');
          window.ethereum.removeAllListeners('connect');
          window.ethereum.removeAllListeners('disconnect');
          
          console.log('Setting up MetaMask event listeners');
          
          // Check if already connected
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            console.log('Found connected account:', accounts[0]);
            setWalletAddress(accounts[0]);
            fetchWalletInfo(accounts[0]);
          } else {
            console.log('No connected accounts found');
            // Clear wallet state if no accounts found
            setWalletAddress(null);
            setWalletInfo(null);
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
            console.log('MetaMask accounts changed:', newAccounts);
            if (newAccounts.length === 0) {
              // User disconnected their wallet
              setWalletAddress(null);
              setWalletInfo(null);
              
              // Refresh points data without wallet
              if (isVerified) {
                fetchUserPoints();
              }
            } else {
              setWalletAddress(newAccounts[0]);
              fetchWalletInfo(newAccounts[0]);
            }
          });

          // Listen for chain changes
          window.ethereum.on('chainChanged', (chainId: string) => {
            console.log('MetaMask chain changed:', chainId);
            // Handle the new chain
            if (walletAddress) {
              fetchWalletInfo(walletAddress);
            }
          });
          
          // Listen for connection events
          window.ethereum.on('connect', (connectInfo: { chainId: string }) => {
            console.log('MetaMask connected:', connectInfo);
          });
          
          // Listen for disconnect events
          window.ethereum.on('disconnect', (error: { code: number; message: string }) => {
            console.log('MetaMask disconnected:', error);
            setWalletAddress(null);
            setWalletInfo(null);
            if (isVerified) {
              fetchUserPoints();
            }
          });
        } catch (error) {
          console.error('Failed to connect to MetaMask:', error);
        }
      } else {
        console.log('MetaMask not detected');
      }
    };
    
    checkMetaMask();
    
    // Clean up event listeners
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('Cleaning up MetaMask event listeners');
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('connect');
        window.ethereum.removeAllListeners('disconnect');
      }
    };
  }, []);

  // Connect to MetaMask with improved error handling
  const connectWallet = async () => {
    setWalletConnecting(true);
    setWalletError(null);
    
    if (typeof window === 'undefined') {
      setWalletError('Browser environment not available');
      setWalletConnecting(false);
      return;
    }
    
    if (!window.ethereum) {
      setWalletError('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      setWalletConnecting(false);
      return;
    }
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        console.log('Connected to account:', accounts[0]);
        setWalletAddress(accounts[0]);
        await fetchWalletInfo(accounts[0]);
      } else {
        setWalletError('No accounts found. Please create an account in MetaMask.');
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      // Handle specific error codes
      if (error.code === 4001) {
        setWalletError('Connection rejected. Please approve the connection request in MetaMask.');
      } else if (error.code === -32002) {
        setWalletError('Connection request already pending. Please check your MetaMask extension.');
      } else {
        setWalletError(error.message || 'Failed to connect to MetaMask. Please try again.');
      }
    } finally {
      setWalletConnecting(false);
    }
  };

  // Fetch points on component mount
  useEffect(() => {
    fetchUserPoints();
  }, [isVerified]);

  // Fetch wallet information with improved reliability
  const fetchWalletInfo = async (address: string) => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    
    try {
      // Get network information
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      let network = 'Unknown Network';
      
      // Map chainId to network name
      switch (chainId) {
        case '0x1':
          network = 'Ethereum Mainnet';
          break;
        case '0x5':
          network = 'Goerli Testnet';
          break;
        case '0xaa36a7':
          network = 'Sepolia Testnet';
          break;
        case '0x89':
          network = 'Polygon';
          break;
        case '0x13881':
          network = 'Mumbai Testnet';
          break;
        case '0xa':
          network = 'Optimism';
          break;
        case '0xa4b1':
          network = 'Arbitrum One';
          break;
        default:
          network = `Chain ${chainId}`;
      }
      
      console.log(`Connected to network: ${network} (${chainId})`);
      
      // Get ETH balance with retry logic
      let balanceHex;
      try {
        balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
      } catch (error) {
        console.error('Error fetching balance, retrying:', error);
        // Wait a moment and retry once
        await new Promise(resolve => setTimeout(resolve, 500));
        balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
      }
      
      // Convert from wei (hex) to ETH
      const balanceWei = parseInt(balanceHex, 16);
      const balanceETH = balanceWei / 1e18;
      const formattedBalance = balanceETH.toFixed(4);
      
      // Try to get ENS name if on Mainnet (can be expensive on other networks)
      let displayName = formatAddress(address);
      if (chainId === '0x1' && typeof window.ethereum.request === 'function') {
        try {
          // This is a simplification - real ENS resolution would use the ENS registry
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const ensName = await provider.lookupAddress(address);
          if (ensName) {
            displayName = ensName;
          }
        } catch (error) {
          console.log('ENS resolution not available', error);
        }
      }
      
      setWalletInfo({
        network,
        chainId,
        balance: formattedBalance,
        displayName
      });
      
      // Fetch points data again with wallet
      if (isVerified) {
        fetchUserPoints(address);
      }
      
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  // Disconnect wallet - simplified for demo mode
  const disconnectWallet = () => {
    console.log('Disconnecting wallet in demo mode');
    
    // Simply clear state variables
    setWalletAddress(null);
    setWalletInfo(null);
    setWalletError(null);
    
    // Force refresh points data
    if (isVerified) {
      fetchUserPoints();
    }
    
    // For demo purposes, we'll just manually reset and ignore event handlers
    // This ensures it works even if MetaMask isn't fully connected
    
    // Add a small timeout to make the disconnection feel more realistic
    setTimeout(() => {
      console.log('Wallet disconnected successfully');
    }, 500);
  };

  // Fetch user points data with or without a wallet address
  const fetchUserPoints = async (walletAddress?: string) => {
    if (!isVerified) return;
    
    try {
      setLoading(true);
      
      // Add the wallet address to the request if available
      const url = walletAddress 
        ? `/api/user/points?wallet=${walletAddress}`
        : '/api/user/points';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch points data');
      }
      
      const data = await response.json();
      
      // Format history items to match our component's expected format
      const formattedHistory = data.history.map((item: any) => ({
        source: item.code ? `Code: ${item.code}` : item.source,
        points: item.points,
        date: item.timestamp ? new Date(item.timestamp).toISOString().split('T')[0] : undefined
      }));
      
      setPointsHistory(formattedHistory);
      setTotalPoints(data.points);
      
      // Update civic score based on points
      setCivicData(prev => ({
        ...prev,
        score: Math.min(100, 50 + Math.floor(data.points / 20)) // Simple formula to derive score from points
      }));
    } catch (error) {
      console.error('Error fetching points data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Calculate score percentage for the circular progress
  const circumference = 2 * Math.PI * 40; // 40 is the radius
  const strokeDashoffset = circumference - (civicData.score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle viewing transaction details
  const viewTransactionDetails = (item: PointsHistoryItem) => {
    if (!walletAddress || !item.source.startsWith('Code:')) return;
    
    // Generate a mock transaction hash based on the code and date
    const mockTxHash = `0x${Array.from(item.source + item.date)
      .map(c => c.charCodeAt(0).toString(16))
      .join('')
      .substring(0, 64)}`;
    
    setSelectedTx({
      hash: mockTxHash,
      points: item.points,
      source: item.source,
      date: item.date || new Date().toISOString().split('T')[0],
    });
  };

  // Open transaction in block explorer
  const openInExplorer = () => {
    if (!selectedTx || !walletInfo) return;
    
    // Determine the block explorer URL based on the network
    let explorerBaseUrl = 'https://etherscan.io';
    
    switch (walletInfo.chainId) {
      case '0x5':
        explorerBaseUrl = 'https://goerli.etherscan.io';
        break;
      case '0xaa36a7':
        explorerBaseUrl = 'https://sepolia.etherscan.io';
        break;
      case '0x89':
        explorerBaseUrl = 'https://polygonscan.com';
        break;
      case '0x13881':
        explorerBaseUrl = 'https://mumbai.polygonscan.com';
        break;
    }
    
    // Open the transaction in a new tab
    window.open(`${explorerBaseUrl}/tx/${selectedTx.hash}`, '_blank');
  };

  const handleRedeemCode = async (code: string) => {
    try {
      const response = await fetch('/api/user/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          walletAddress: walletAddress || undefined // Attach wallet if connected
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem code');
      }

      // Update the points history with the new redemption
      setPointsHistory(prev => [
        ...prev,
        {
          source: `Code: ${code.toUpperCase()}`,
          points: data.pointsEarned,
          date: new Date().toISOString().split('T')[0],
        },
      ]);

      // Update total points
      setTotalPoints(data.totalPoints);

      // Update the civic score
      setCivicData(prev => ({
        ...prev,
        score: Math.min(100, 50 + Math.floor(data.totalPoints / 20)),
      }));

      // Return the entire response data for access to transaction info
      return data;
    } catch (error: any) {
      return Promise.reject(error);
    }
  };

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden h-full`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Civic Reputation Score</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Non-tradeable, blockchain-verified civic participation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {walletAddress ? (
            <div className="flex items-center">
              <div className="flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md text-sm">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {walletInfo?.displayName || formatAddress(walletAddress)}
                {walletInfo && (
                  <span className="ml-1 text-xs opacity-75">
                    ({walletInfo.balance} ETH)
                  </span>
                )}
              </div>
              <button
                onClick={disconnectWallet}
                className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={walletConnecting}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {walletConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
          
          {isVerified && (
            <button
              onClick={() => setIsRedeemModalOpen(true)}
              className="px-3 py-1.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Redeem Code
            </button>
          )}
        </div>
      </div>

      {/* Wallet Info Banner */}
      {walletAddress && walletInfo && (
        <div className={`px-4 py-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'} flex items-center justify-between`}>
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Connected to <span className="font-medium">{walletInfo.network}</span>
            </span>
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Balance: <span className="font-medium">{walletInfo.balance} ETH</span>
          </span>
        </div>
      )}

      {/* Wallet Error Banner */}
      {walletError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{walletError}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setWalletError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {isVerified ? (
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={isDarkMode ? '#374151' : '#E5E7EB'}
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className={getScoreColor(civicData.score)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(civicData.score)}`}>{civicData.score}</div>
                    <div className="text-xs">SCORE</div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-1">Level: {civicData.level}</p>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Next Review: 3 months
                  </div>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {walletAddress ? 'Wallet Connected' : 'NFT Backed'}
                  </div>
                  <div className="mt-2 block">
                    <span className={`text-sm font-semibold ${getScoreColor(civicData.score)}`}>
                      {totalPoints} total points earned
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Recent Activities</h3>
                <div className="grid grid-cols-3 gap-2">
                  {civicData.activities.map((activity, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-700' 
                          : 'border-gray-200 bg-gray-50'
                      } flex flex-col items-center justify-center text-center`}
                    >
                      <div className="p-1.5 rounded-full bg-primary-50 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} />
                        </svg>
                      </div>
                      <p className="text-xs font-medium leading-none mb-1">{activity.name}</p>
                      <p className={`text-xs font-bold ${getScoreColor(civicData.score)}`}>{activity.count}x</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points History Section */}
              <div className="mt-5">
                <h3 className="text-sm font-medium mb-3">Points History</h3>
                <div className={`rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        {walletAddress && (
                          <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verified
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {pointsHistory.length === 0 ? (
                        <tr>
                          <td colSpan={walletAddress ? 4 : 3} className="px-4 py-4 text-center text-sm text-gray-500">
                            No points history yet. Redeem a code to earn points!
                          </td>
                        </tr>
                      ) : (
                        pointsHistory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm font-medium">
                              {item.source}
                            </td>
                            <td className="px-4 py-2 text-sm text-right font-semibold text-green-500">
                              +{item.points}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-500">
                              {item.date}
                            </td>
                            {walletAddress && (
                              <td className="px-4 py-2 text-sm text-right">
                                {item.source.startsWith('Code:') ? (
                                  <button 
                                    onClick={() => viewTransactionDetails(item)}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                                  >
                                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    On-chain
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-1.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Off-chain
                                  </span>
                                )}
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-medium mb-3">Rewards & Benefits</h3>
                <div className="space-y-2">
                  {civicData.rewards.map((reward, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center p-2 rounded-lg ${
                        reward.unlocked
                          ? isDarkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
                          : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <div className={`p-1 rounded-full ${
                        reward.unlocked
                          ? 'bg-green-100 text-green-600'
                          : isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                      } mr-3`}>
                        {reward.unlocked ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs font-medium ${
                        reward.unlocked
                          ? isDarkMode ? 'text-green-400' : 'text-green-800'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {reward.name}
                      </span>
                    </div>
                  ))}

                  {/* Blockchain-specific rewards - only shown when wallet is connected */}
                  {walletAddress && (
                    <>
                      <div className="flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                        <div className="p-1 rounded-full bg-blue-100 text-blue-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                          On-chain Verification Badge
                        </span>
                      </div>
                      <div className="flex items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                        <div className="p-1 rounded-full bg-blue-100 text-blue-600 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                          Token-gated Community Access
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">Not Verified</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You need to verify your civic identity to view your reputation score.
          </p>
          <div className="mt-6">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div 
              className={`inline-block align-bottom ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Blockchain Transaction Details
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Hash:</p>
                        <p className="text-sm font-mono break-all">{selectedTx.hash}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Source:</p>
                        <p className="text-sm font-medium">{selectedTx.source}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Points:</p>
                        <p className="text-sm font-medium text-green-500">+{selectedTx.points}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date:</p>
                        <p className="text-sm">{selectedTx.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                        <p className="text-sm text-green-500 flex items-center">
                          <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                          </svg>
                          Confirmed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <button
                  type="button"
                  onClick={openInExplorer}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  View on Explorer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                    isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-700'
                  } shadow-sm px-4 py-2 text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Code Modal */}
      <RedeemCodeModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        onCodeRedeem={handleRedeemCode}
        walletAddress={walletAddress}
      />
    </div>
  );
} 