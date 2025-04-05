'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import TokenPriceHistory from '../components/TokenPriceHistory';
import TokenAllocation from '../components/TokenAllocation';

// Type definitions for Ethereum window object
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      chainId: string;
      networkVersion: string;
    };
  }
}

export default function Wallet() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'transactions', 'send', 'settings'
  const [transactionType, setTransactionType] = useState('all'); // 'all', 'sent', 'received', 'rewards'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'
  
  // Send tokens form state
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');

  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState({ name: 'Unknown', chainId: '', gasPrice: '0.0000023' });

  // Mock wallet data based on connection state
  const walletData = {
    address: walletAddress || '0x71C7...976F',
    balance: 2500,
    tokenSymbol: 'CT',
    networkName: networkInfo.name,
    connected: isConnected
  };

  // Check if MetaMask is installed
  const checkIfMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask;
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!checkIfMetaMaskInstalled()) {
      setConnectionError('MetaMask is not installed. Please install MetaMask extension and try again.');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError('');
      
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);

        // Get chain ID and network info
        const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
        updateNetworkInfo(chainId);
      }
    } catch (error: any) {
      console.error('Error connecting to wallet:', error);
      setConnectionError(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    // Ask for confirmation before disconnecting
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      try {
        console.log('Disconnecting wallet...');
        
        // Clear wallet state
        setWalletAddress('');
        setIsConnected(false);
        setNetworkInfo({ name: 'Unknown', chainId: '', gasPrice: '0.0000023' });
        
        // Note: Due to how MetaMask works, a true "disconnection" is not possible
        // since MetaMask doesn't provide a method to programmatically disconnect.
        // The wallet is still connected in MetaMask, but our app no longer has access.
        
        // Show success message
        alert('Wallet disconnected successfully.');
        
        // Optional: Reset any user-specific data here
        // For example, if you have any cached transaction data specific to this user
        
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
        alert('Failed to disconnect wallet. Please try manually disconnecting in MetaMask.');
      }
    }
  };

  // Update network info based on chain ID
  const updateNetworkInfo = (chainId: string) => {
    let networkName = 'Unknown Network';
    
    // Convert chainId from hex to decimal
    const chainIdDecimal = parseInt(chainId, 16).toString();
    
    switch (chainIdDecimal) {
      case '1':
        networkName = 'Ethereum Mainnet';
        break;
      case '3':
        networkName = 'Ropsten Testnet';
        break;
      case '4':
        networkName = 'Rinkeby Testnet';
        break;
      case '5':
        networkName = 'Goerli Testnet';
        break;
      case '42':
        networkName = 'Kovan Testnet';
        break;
      case '56':
        networkName = 'Binance Smart Chain';
        break;
      case '137':
        networkName = 'Polygon Mainnet';
        break;
      case '80001':
        networkName = 'Polygon Mumbai';
        break;
      default:
        networkName = `Chain ID: ${chainIdDecimal}`;
    }
    
    setNetworkInfo({
      name: networkName,
      chainId: chainIdDecimal,
      gasPrice: '0.0000023'
    });
  };

  // Handle account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== walletAddress) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainId: string) => {
      // Handle chain change - refresh page as recommended by MetaMask
      updateNetworkInfo(chainId);
      //window.location.reload();
    };

    // Check if already connected
    const checkConnection = async () => {
      if (checkIfMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum!.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            
            // Get chain ID
            const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
            updateNetworkInfo(chainId);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    // Check connection on component mount
    checkConnection();

    // Set up event listeners if MetaMask is available
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Clean up event listeners on component unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletAddress]);

  // Mock transactions data
  const [transactions] = useState([
    { id: 1, type: 'Received', amount: 500, from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', to: walletData.address, date: '2025-04-01', status: 'Completed' },
    { id: 2, type: 'Sent', amount: 200, from: walletData.address, to: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', date: '2025-03-28', status: 'Completed' },
    { id: 3, type: 'Governance Reward', amount: 300, from: 'Treasury', to: walletData.address, date: '2025-03-20', status: 'Completed' },
    { id: 4, type: 'Event Attendance', amount: 100, from: 'Community Pool', to: walletData.address, date: '2025-03-15', status: 'Completed' },
    { id: 5, type: 'Sent', amount: 150, from: walletData.address, to: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2', date: '2025-03-10', status: 'Completed' },
    { id: 6, type: 'Received', amount: 250, from: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4', to: walletData.address, date: '2025-03-05', status: 'Completed' },
    { id: 7, type: 'Content Creation', amount: 350, from: 'Community Pool', to: walletData.address, date: '2025-02-28', status: 'Completed' },
    { id: 8, type: 'Sent', amount: 120, from: walletData.address, to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', date: '2025-02-20', status: 'Completed' },
  ]);

  // Function to get wallet details in readable format
  const getFormattedWalletDetails = () => {
    if (!isConnected) {
      return {
        displayAddress: 'Not Connected',
        shortAddress: 'Connect Wallet',
        explorerUrl: ''
      };
    }

    const displayAddress = formatAddress(walletAddress);
    
    // Get block explorer URL based on network
    let explorerUrl = '';
    if (networkInfo.chainId) {
      switch (networkInfo.chainId) {
        case '1': // Ethereum Mainnet
          explorerUrl = `https://etherscan.io/address/${walletAddress}`;
          break;
        case '137': // Polygon Mainnet
          explorerUrl = `https://polygonscan.com/address/${walletAddress}`;
          break;
        case '80001': // Polygon Mumbai
          explorerUrl = `https://mumbai.polygonscan.com/address/${walletAddress}`;
          break;
        default:
          // Use Etherscan as fallback
          explorerUrl = `https://etherscan.io/address/${walletAddress}`;
      }
    }

    return {
      displayAddress: displayAddress,
      shortAddress: walletAddress,
      explorerUrl
    };
  };

  // Copy wallet address to clipboard
  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
        .then(() => {
          // Could show a toast notification here
          console.log('Address copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy address: ', err);
        });
    }
  };

  // Open block explorer
  const openInExplorer = () => {
    const { explorerUrl } = getFormattedWalletDetails();
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  // Recent recipients from sent transactions
  const recentRecipients = transactions
    .filter(tx => tx.type === 'Sent')
    .map(tx => ({ address: tx.to, date: tx.date }))
    .reduce((unique, recipient) => {
      if (!unique.some(u => u.address === recipient.address)) {
        unique.push(recipient);
      }
      return unique;
    }, [] as { address: string, date: string }[])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Get only top 3 most recent

  // Token allocation data for pie chart
  const [tokenAllocation] = useState([
    { category: 'Available', value: 2500, color: '#6366F1' }, // Indigo
    { category: 'Staked in Governance', value: 1000, color: '#8B5CF6' }, // Purple
    { category: 'Locked in Projects', value: 500, color: '#EC4899' }  // Pink
  ]);

  // Calculate total tokens
  const totalTokens = tokenAllocation.reduce((sum, item) => sum + item.value, 0);

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Filter and sort transactions based on user selection
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by type
    if (transactionType !== 'all') {
      if (transactionType === 'sent') {
        filtered = filtered.filter(tx => tx.type === 'Sent');
      } else if (transactionType === 'received') {
        filtered = filtered.filter(tx => tx.type === 'Received');
      } else if (transactionType === 'rewards') {
        filtered = filtered.filter(tx => 
          tx.type === 'Governance Reward' || 
          tx.type === 'Event Attendance' || 
          tx.type === 'Content Creation'
        );
      }
    }
    
    // Sort
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === 'highest') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === 'lowest') {
      filtered.sort((a, b) => a.amount - b.amount);
    }
    
    return filtered;
  };

  // Get categories and their total amounts for the charts
  const getCategoryTotals = () => {
    const categories: Record<string, number> = {};
    
    transactions.forEach(tx => {
      if (tx.type === 'Sent') {
        categories['Sent'] = (categories['Sent'] || 0) + tx.amount;
      } else if (tx.type === 'Received') {
        categories['Received'] = (categories['Received'] || 0) + tx.amount;
      } else {
        categories['Rewards'] = (categories['Rewards'] || 0) + tx.amount;
      }
    });
    
    return Object.entries(categories).map(([category, total]) => ({ 
      category, 
      total 
    }));
  };

  // Handle form submission
  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientAddress || !sendAmount) return;
    
    // Clear previous states
    setSendSuccess(false);
    setSendError('');
    setTxHash('');
    setIsSending(true);
    
    try {
      // Validate input
      if (!recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
        throw new Error('Invalid recipient address');
      }
      
      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }
      
      if (amount > walletData.balance) {
        throw new Error('Insufficient balance');
      }
      
      // Check if MetaMask is connected
      if (!isConnected) {
        throw new Error('Wallet is not connected. Please connect your wallet first.');
      }
      
      // Simulate blockchain transaction with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction hash
      const mockTxHash = '0x' + Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setTxHash(mockTxHash);
      setSendSuccess(true);
      
      // In real implementation, we would send the transaction using Web3 here
      // const web3 = new Web3(window.ethereum);
      // const transaction = {
      //   from: walletAddress,
      //   to: recipientAddress,
      //   value: web3.utils.toWei(sendAmount, 'ether'),
      //   gas: 21000,
      //   gasPrice: web3.utils.toWei('10', 'gwei')
      // };
      // const receipt = await web3.eth.sendTransaction(transaction);
      // setTxHash(receipt.transactionHash);
      // setSendSuccess(true);
      
    } catch (error: any) {
      console.error('Error sending tokens:', error);
      setSendError(error.message || 'Failed to send tokens. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Select a recent recipient
  const selectRecipient = (address: string) => {
    setRecipientAddress(address);
  };

  // Export transactions to CSV
  const exportTransactionsToCSV = () => {
    try {
      // Get filtered transactions
      const transactions = getFilteredTransactions();
      
      if (transactions.length === 0) {
        alert('No transactions to export.');
        return;
      }
      
      // Define CSV headers
      const headers = ['Date', 'Type', 'Amount', 'From/To', 'Status'];
      
      // Format transaction data for CSV
      const csvData = transactions.map(tx => {
        const fromTo = tx.type === 'Sent' 
          ? `To: ${tx.to}`
          : `From: ${typeof tx.from === 'string' && tx.from.startsWith('0x') 
              ? tx.from 
              : tx.from}`;
          
        return [
          tx.date,
          tx.type,
          `${tx.type === 'Sent' ? '-' : '+'}${tx.amount} ${walletData.tokenSymbol}`,
          fromTo,
          tx.status
        ];
      });
      
      // Combine headers and data
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ct-wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      // Append to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Failed to export transactions. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Wallet header */}
        <div className="px-4 py-4 sm:px-0">
          <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow px-5 py-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  CivicTrust Wallet
                </h2>
              <div className="flex items-center space-x-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
              </div>
                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={isConnected ? disconnectWallet : connectWallet}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    isConnecting ? 'bg-gray-400 cursor-not-allowed' :
                    isConnected 
                      ? 'text-white bg-red-600 hover:bg-red-700' 
                      : 'text-white bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isConnecting ? 'Connecting...' : (isConnected ? 'Disconnect' : 'Connect Wallet')}
                </button>
              </div>
            </div>
            {connectionError && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {connectionError}
              </div>
            )}
          </div>
        </div>

        {/* Wallet tabs */}
        <div className="px-4 sm:px-0 mt-4">
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                    ? `bg-indigo-600 text-white`
                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`${
                    activeTab === 'transactions'
                    ? `bg-indigo-600 text-white`
                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  Transactions
                </button>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`${
                    activeTab === 'send'
                    ? `bg-indigo-600 text-white`
                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  Send Tokens
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`${
                    activeTab === 'settings'
                    ? `bg-indigo-600 text-white`
                    : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`
                } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  Settings
                </button>
              </nav>
            </div>
          <div className={`sm:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md`}>
            <select
              id="tabs"
              name="tabs"
              className={`block w-full pl-3 pr-10 py-2 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="transactions">Transactions</option>
              <option value="send">Send Tokens</option>
              <option value="settings">Settings</option>
            </select>
          </div>
        </div>

        {/* Wallet content */}
        <div className="mt-6 px-4 sm:px-0">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Wallet Info Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Balance Card */}
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                          <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</h3>
                        <p className="mt-1 text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                              {walletData.balance} {walletData.tokenSymbol}
                        </p>
                            </div>
                      </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">≈ ₹25000</div>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400 text-xs font-medium px-2 py-1 rounded">
                        +5.25%
                    </div>
                  </div>
                  </div>
                </div>

                {/* Network Card */}
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                            </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Network</h3>
                        <p className="mt-1 text-xl font-semibold text-purple-600 dark:text-purple-400">
                          {networkInfo.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Gas Price: {networkInfo.gasPrice} MATIC
                  </div>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
                  <div className="p-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121.5 9z" />
                        </svg>
                      </div>
                            </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</h3>
                        <p className="mt-1 text-xl font-semibold text-blue-600 dark:text-blue-400 truncate max-w-xs">
                          {isConnected ? formatAddress(walletAddress) : 'Not Connected'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button
                        onClick={copyAddressToClipboard}
                        disabled={!isConnected}
                        className={`text-sm ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400'} text-indigo-500 dark:text-indigo-400`}
                    >
                      Copy Address
                    </button>
                    <button
                        onClick={openInExplorer}
                        disabled={!isConnected}
                        className={`text-sm ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400'} text-indigo-500 dark:text-indigo-400`}
                    >
                      View in Explorer
                    </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Token Price History */}
                <TokenPriceHistory 
                  tokenSymbol={walletData.tokenSymbol}
                  tokenPrice={10.25}
                  percentageChange={12.3}
                />

                {/* Token Allocation */}
                <div>
                  <TokenAllocation 
                    data={tokenAllocation} 
                    totalTokens={totalTokens} 
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Activity
                  </h2>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                      View All
                  </a>
                  </div>
                <div className="mt-4">
                  <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} sm:rounded-lg`}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <tr>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Type
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Amount
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Details
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Date
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700`}>
                          {transactions.slice(0, 5).map((transaction) => (
                            <tr key={transaction.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {transaction.type}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${
                                  transaction.type === 'Sent' 
                                    ? 'text-red-600 dark:text-red-400' 
                                    : 'text-green-600 dark:text-green-400'
                                }`}>
                                  {transaction.type === 'Sent' ? '-' : '+'}{transaction.amount} {walletData.tokenSymbol}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {transaction.type === 'Sent' 
                                    ? `To: ${formatAddress(transaction.to)}`
                                    : typeof transaction.from === 'string' && transaction.from.startsWith('0x')
                                      ? `From: ${formatAddress(transaction.from)}`
                                      : `From: ${transaction.from}`
                                  }
                              </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {transaction.date}
                              </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.status === 'Completed'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
                                }`}>
                                  {transaction.status}
                                </span>
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
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              {/* Filter Controls */}
              <div className={`overflow-hidden shadow rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <label htmlFor="transaction-type" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Transaction Type
                      </label>
                      <select
                        id="transaction-type"
                        name="transaction-type"
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                        }`}
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                      >
                        <option value="all">All Transactions</option>
                        <option value="sent">Sent</option>
                        <option value="received">Received</option>
                        <option value="rewards">Rewards</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="sort-order" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Sort By
                      </label>
                      <select
                        id="sort-order"
                        name="sort-order"
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                        }`}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Amount</option>
                        <option value="lowest">Lowest Amount</option>
                      </select>
                    </div>
                    
                    <div className="flex-shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={exportTransactionsToCSV}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* Transactions Table */}
              <div className="mt-8">
                <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} sm:rounded-lg`}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Type
                                  </th>
                                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Amount
                                  </th>
                                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Details
                                  </th>
                                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Date
                                  </th>
                                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Status
                                  </th>
                                </tr>
                              </thead>
                      <tbody className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700`}>
                                {getFilteredTransactions().map((transaction) => (
                          <tr key={transaction.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {transaction.type}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className={`text-sm font-medium ${
                                        transaction.type === 'Sent' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                                      }`}>
                                        {transaction.type === 'Sent' ? '-' : '+'}{transaction.amount} {walletData.tokenSymbol}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {transaction.type === 'Sent' 
                                          ? `To: ${formatAddress(transaction.to)}`
                                  : typeof transaction.from === 'string' && transaction.from.startsWith('0x')
                                    ? `From: ${formatAddress(transaction.from)}`
                                    : `From: ${transaction.from}`
                                        }
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {transaction.date}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${
                                transaction.type === 'Received' || transaction.type === 'Governance Reward' || transaction.type === 'Event Attendance'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                        {transaction.status}
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
          )}

          {/* Send Tokens Tab */}
          {activeTab === 'send' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Send Form */}
              <div className="lg:col-span-2">
                <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Send Tokens
                    </h3>
                    <div className="mt-2 max-w-xl text-sm">
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Send CT tokens to another wallet address
                      </p>
                    </div>

                    {sendSuccess ? (
                      <div className="mt-6 rounded-md bg-green-50 dark:bg-green-900 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Transaction Successful</h3>
                            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                              <p>Your tokens have been sent successfully!</p>
                              {txHash && (
                                <div className="mt-3">
                                  <p className="font-medium">Transaction Hash:</p>
                                  <p className="mt-1 text-xs break-all">{txHash}</p>
                                  <button 
                                    className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                    onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${txHash}`, '_blank')}
                                  >
                                    View on Explorer
                                  </button>
                            </div>
                              )}
                            </div>
                            <div className="mt-4">
                              <button
                                type="button"
                                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                                onClick={() => {
                                  setRecipientAddress('');
                                  setSendAmount('');
                                  setMemo('');
                                  setSendSuccess(false);
                                  setTxHash('');
                                }}
                              >
                                Send Another Transaction
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form className="mt-5 sm:flex sm:items-center" onSubmit={handleSendSubmit}>
                        <div className="w-full space-y-6">
                          {sendError && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <p>{sendError}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label htmlFor="recipient" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Recipient Address
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="recipient"
                                id="recipient"
                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                                }`}
                                placeholder="0x..."
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                required
                                disabled={!isConnected}
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="amount" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Amount
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <input
                                type="number"
                                name="amount"
                                id="amount"
                                className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                                }`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                required
                                disabled={!isConnected}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className={`text-gray-500 sm:text-sm`}>
                                  {walletData.tokenSymbol}
                                </span>
                              </div>
                            </div>
                            <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Available Balance: {walletData.balance} {walletData.tokenSymbol}
                            </p>
                          </div>

                          <div>
                            <label htmlFor="memo" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Memo (Optional)
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="memo"
                                id="memo"
                                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''
                                }`}
                                placeholder="What's this transfer for?"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                disabled={!isConnected}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Network: {networkInfo.name}
                            </div>
                            <button
                              type="submit"
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                isSending || !isConnected ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                              disabled={isSending || !isConnected}
                            >
                              {isSending ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : 'Send Tokens'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Recipients and Tips */}
              <div>
                <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Recent Recipients
                    </h3>
                    <div className="mt-2 max-w-xl text-sm">
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
                        Quickly send to your recent contacts
                      </p>
                    </div>

                    <div className="mt-5 space-y-4">
                      {recentRecipients.length > 0 ? (
                        recentRecipients.map((recipient, index) => (
                          <div 
                            key={index} 
                            className={`p-4 border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} rounded-lg cursor-pointer transition-colors duration-150`}
                            onClick={() => selectRecipient(recipient.address)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                {recipient.address.substring(2, 4).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {formatAddress(recipient.address)}
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Last sent on {recipient.date}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No recent recipients found.
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3 className={`text-md leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Transaction Tips
                      </h3>
                      <ul className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} space-y-2 list-disc pl-5`}>
                        <li>Always double-check the recipient's address before sending.</li>
                        <li>Transaction fees are paid in MATIC on Polygon network.</li>
                        <li>Transactions are irreversible once confirmed.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Wallet Settings
                  </h3>
                  <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Configure your wallet preferences and security options
                    </p>

                  <div className="mt-6 space-y-6">
                    <div>
                      <h4 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Security Settings
                      </h4>
                      <div className="mt-3 space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                              id="require-confirmation"
                              name="require-confirmation"
                                type="checkbox"
                                defaultChecked
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                            <label htmlFor="require-confirmation" className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                              Require confirmation
                              </label>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                              Always confirm transactions before sending
                              </p>
                            </div>
                          </div>
                            </div>
                          </div>
                          
                    <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-end">
                            <button
                              type="button"
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                          Save Settings
                            </button>
                              </div>
                            </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 