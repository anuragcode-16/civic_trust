import axios from 'axios';

export interface DAOConfig {
  name: string;
  description: string;
  category: string;
  location: string;
  useWeightedVoting: boolean;
  requireVerification: boolean;
  allowFundAllocation: boolean;
  minimumVotingPeriod: number;
  proposalThreshold: number;
  customLogo?: File | null;
  primaryColor: string;
}

export interface ProposalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetEstimate: number;
  icon: string;
  votingPeriod: number;
  steps?: string[];
}

export interface DAODeploymentResult {
  success: boolean;
  message: string;
  data?: {
    daoId: string;
    contractAddress: string;
    txHash: string;
    blockNumber: number;
    createdAt: string;
    [key: string]: any;
  };
  error?: string;
}

/**
 * Deploy a new DAO with the provided configuration
 */
export async function deployDAO(
  config: DAOConfig, 
  selectedTemplates?: ProposalTemplate[]
): Promise<DAODeploymentResult> {
  try {
    // Handle logo file if present
    let logoUrl = null;
    if (config.customLogo) {
      logoUrl = await uploadLogo(config.customLogo);
    }
    
    // Prepare the full DAO configuration
    const fullConfig = {
      ...config,
      logoUrl,
      proposalTemplates: selectedTemplates || [],
      creatorInfo: {
        aadhaarVerified: localStorage.getItem('aadhaarVerified') === 'true',
        verificationMode: localStorage.getItem('aadhaarVerificationMode') || 'anonymous',
        aadhaarHash: localStorage.getItem('aadhaarHash') || null,
      }
    };
    
    // Make API call to create DAO
    const response = await axios.post('/api/dao/create', fullConfig);
    
    return {
      success: true,
      message: 'DAO deployed successfully',
      data: response.data.data
    };
  } catch (error: any) {
    console.error('Error deploying DAO:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to deploy DAO',
      error: error.message
    };
  }
}

/**
 * Upload logo file to storage (mocked)
 */
async function uploadLogo(file: File): Promise<string> {
  try {
    // In a real implementation, this would upload the file to cloud storage
    // Here we're creating a mock URL
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
    
    // Create object URL for the file (this would be a cloud storage URL in production)
    const objectUrl = URL.createObjectURL(file);
    
    return objectUrl;
  } catch (error) {
    console.error('Error uploading logo:', error);
    throw new Error('Failed to upload logo');
  }
}

/**
 * Get DAO deployment status (for long-running deployments)
 */
export async function getDAODeploymentStatus(deploymentId: string): Promise<any> {
  try {
    // In a real implementation, this would check deployment status
    // For now, we'll just return success
    return {
      success: true,
      status: 'completed',
      contractAddress: '0x' + Array(40).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('')
    };
  } catch (error) {
    console.error('Error checking deployment status:', error);
    throw new Error('Failed to check deployment status');
  }
} 