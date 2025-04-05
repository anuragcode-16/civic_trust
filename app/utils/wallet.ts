declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Checks if MetaMask is installed
 * @returns boolean indicating if MetaMask is available
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum?.isMetaMask === true;
};

/**
 * Connect to MetaMask wallet
 * @returns The connected ethereum accounts
 */
export const connectWallet = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
  } catch (error: any) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

/**
 * Get the current network ID from MetaMask
 * @returns The chain ID in decimal
 */
export const getChainId = async (): Promise<number> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error: any) {
    throw new Error(`Failed to get chain ID: ${error.message}`);
  }
};

/**
 * Check if the current network is Polygon (Mainnet or Mumbai Testnet)
 * @returns boolean indicating if user is on a Polygon network
 */
export const isPolygonNetwork = async (): Promise<boolean> => {
  try {
    const chainId = await getChainId();
    // Polygon Mainnet: 137, Mumbai Testnet: 80001
    return chainId === 137 || chainId === 80001;
  } catch (error) {
    return false;
  }
};

/**
 * Switch to Polygon Mumbai Testnet
 */
export const switchToPolygonMumbai = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x13881' }], // Mumbai Testnet chain ID in hex
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      await addPolygonMumbaiNetwork();
    } else {
      throw new Error(`Failed to switch to Polygon Mumbai: ${error.message}`);
    }
  }
};

/**
 * Add Polygon Mumbai Testnet to MetaMask
 */
export const addPolygonMumbaiNetwork = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x13881', // Mumbai Testnet chain ID in hex
          chainName: 'Polygon Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        },
      ],
    });
  } catch (error: any) {
    throw new Error(`Failed to add Polygon Mumbai: ${error.message}`);
  }
};

/**
 * Listen for account changes on MetaMask
 * @param callback Function to call when accounts change
 */
export const listenForAccountChanges = (callback: (accounts: string[]) => void): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listen for network changes on MetaMask
 * @param callback Function to call when network changes
 */
export const listenForNetworkChanges = (callback: (chainId: number) => void): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', (chainId: string) => {
      callback(parseInt(chainId, 16));
    });
  }
};

/**
 * Format wallet address for display
 * @param address Ethereum address to format
 * @returns Shortened address for display
 */
export const formatAddress = (address: string): string => {
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}; 