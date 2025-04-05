import { ethers } from 'ethers';

// ABI for the CivicDAOFactory contract
const FACTORY_ABI = [
  "function createDAO(string name, string description, string location, string category, bool hasVotingWeights, bool hasFundVaults, bool requiresVerification) external returns (address)",
  "function getDaoCount() external view returns (uint256)",
  "function getDaosByCreator(address creator) external view returns (uint256[])",
  "function getDao(uint256 daoId) external view returns (tuple(address contractAddress, string name, string description, string location, string category, address creator, uint256 createdAt, bool hasVotingWeights, bool hasFundVaults, bool requiresVerification))"
];

// ABI for the CivicProposals contract
const DAO_ABI = [
  "function createProposal(string title, string description, string category, uint256 budgetInPaise, uint256 votingPeriodInDays) external returns (uint256)",
  "function castVote(uint256 proposalId, bool support) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposalCount() external view returns (uint256)",
  "function getProposal(uint256 proposalId) external view returns (uint256 id, string title, string description, string category, uint256 budget, address creator, uint256 createdAt, uint256 votingEndTime, uint256 votesFor, uint256 votesAgainst, bool executed, bool passed)",
  "function hasAddressVoted(uint256 proposalId, address voter) external view returns (bool)",
  "function getDAOConfig() external view returns (tuple(string name, string description, address admin, bool useWeightedVoting, bool requireVerification, bool allowFundAllocation, uint256 minimumVotingPeriod, uint256 proposalThreshold))",
  "function depositFunds() external payable",
  "function addComment(uint256 proposalId, string comment) external",
  "function getComment(uint256 proposalId, address user) external view returns (string)"
];

// Update these with actual contract addresses when deployed
const FACTORY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS || '';

/**
 * Create a new DAO using the factory contract
 * @param provider Ethereum provider from ethers.js
 * @param params DAO configuration parameters
 * @returns Address of the newly created DAO
 */
export async function createDAO(
  provider: ethers.providers.Web3Provider,
  params: {
    name: string;
    description: string;
    location: string;
    category: string;
    useWeightedVoting: boolean;
    requireVerification: boolean;
    allowFundAllocation: boolean;
    minimumVotingPeriod: number;
    proposalThreshold: number;
  }
) {
  try {
    const signer = provider.getSigner();
    const factory = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, signer);
    
    const tx = await factory.createDAO(
      params.name,
      params.description,
      params.location,
      params.category,
      params.useWeightedVoting,
      params.allowFundAllocation,
      params.requireVerification
    );
    
    const receipt = await tx.wait();
    
    // Parse event logs to get the new DAO address
    const event = receipt.events?.find(e => e.event === 'DAOCreated');
    if (!event) {
      throw new Error('DAO creation event not found');
    }
    
    return event.args?.daoAddress;
  } catch (error) {
    console.error('Error creating DAO:', error);
    throw error;
  }
}

/**
 * Get all DAOs created by a specific address
 * @param provider Ethereum provider from ethers.js
 * @param address Creator's address
 * @returns Array of DAO IDs
 */
export async function getDAOsByCreator(
  provider: ethers.providers.Web3Provider,
  address: string
) {
  try {
    const factory = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, provider);
    const daoIds = await factory.getDaosByCreator(address);
    
    // For each DAO ID, get the full DAO details
    const daos = await Promise.all(
      daoIds.map(async (id: ethers.BigNumber) => {
        const dao = await factory.getDao(id);
        return {
          id: id.toString(),
          address: dao.contractAddress,
          name: dao.name,
          description: dao.description,
          location: dao.location,
          category: dao.category,
          creator: dao.creator,
          createdAt: new Date(dao.createdAt.toNumber() * 1000),
          hasVotingWeights: dao.hasVotingWeights,
          hasFundVaults: dao.hasFundVaults,
          requiresVerification: dao.requiresVerification
        };
      })
    );
    
    return daos;
  } catch (error) {
    console.error('Error getting DAOs by creator:', error);
    throw error;
  }
}

/**
 * Get all DAOs in a specific category
 * @param provider Ethereum provider from ethers.js
 * @param category Category to filter by
 * @returns Array of DAO details
 */
export async function getDAOsByCategory(
  provider: ethers.providers.Web3Provider,
  category: string
) {
  try {
    const factory = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, provider);
    const daoCount = await factory.getDaoCount();
    
    // Get all DAOs and filter by category
    const daos = [];
    for (let i = 0; i < daoCount.toNumber(); i++) {
      const dao = await factory.getDao(i);
      if (dao.category === category) {
        daos.push({
          id: i.toString(),
          address: dao.contractAddress,
          name: dao.name,
          description: dao.description,
          location: dao.location,
          category: dao.category,
          creator: dao.creator,
          createdAt: new Date(dao.createdAt.toNumber() * 1000),
          hasVotingWeights: dao.hasVotingWeights,
          hasFundVaults: dao.hasFundVaults,
          requiresVerification: dao.requiresVerification
        });
      }
    }
    
    return daos;
  } catch (error) {
    console.error('Error getting DAOs by category:', error);
    throw error;
  }
}

/**
 * Get a specific DAO's details including its configuration
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @returns DAO details and configuration
 */
export async function getDAODetails(
  provider: ethers.providers.Web3Provider,
  daoAddress: string
) {
  try {
    const dao = new ethers.Contract(daoAddress, DAO_ABI, provider);
    const config = await dao.getDAOConfig();
    
    return {
      name: config.name,
      description: config.description,
      admin: config.admin,
      useWeightedVoting: config.useWeightedVoting,
      requireVerification: config.requireVerification,
      allowFundAllocation: config.allowFundAllocation,
      minimumVotingPeriod: config.minimumVotingPeriod.toNumber(),
      proposalThreshold: config.proposalThreshold.toNumber()
    };
  } catch (error) {
    console.error('Error getting DAO details:', error);
    throw error;
  }
}

/**
 * Create a new proposal in a DAO
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @param proposal Proposal details
 * @returns Proposal ID
 */
export async function createProposal(
  provider: ethers.providers.Web3Provider,
  daoAddress: string,
  proposal: {
    title: string;
    description: string;
    category: string;
    budgetInPaise: number;
    votingPeriodInDays: number;
  }
) {
  try {
    const signer = provider.getSigner();
    const dao = new ethers.Contract(daoAddress, DAO_ABI, signer);
    
    const tx = await dao.createProposal(
      proposal.title,
      proposal.description,
      proposal.category,
      ethers.utils.parseUnits(proposal.budgetInPaise.toString(), 0),
      proposal.votingPeriodInDays
    );
    
    const receipt = await tx.wait();
    
    // Parse event logs to get the new proposal ID
    const event = receipt.events?.find(e => e.event === 'ProposalCreated');
    if (!event) {
      throw new Error('Proposal creation event not found');
    }
    
    return event.args?.proposalId.toString();
  } catch (error) {
    console.error('Error creating proposal:', error);
    throw error;
  }
}

/**
 * Vote on a proposal
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @param proposalId ID of the proposal
 * @param support Whether to support the proposal
 */
export async function voteOnProposal(
  provider: ethers.providers.Web3Provider,
  daoAddress: string,
  proposalId: string,
  support: boolean
) {
  try {
    const signer = provider.getSigner();
    const dao = new ethers.Contract(daoAddress, DAO_ABI, signer);
    
    const tx = await dao.castVote(proposalId, support);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error voting on proposal:', error);
    throw error;
  }
}

/**
 * Execute a proposal after voting period ends
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @param proposalId ID of the proposal
 */
export async function executeProposal(
  provider: ethers.providers.Web3Provider,
  daoAddress: string,
  proposalId: string
) {
  try {
    const signer = provider.getSigner();
    const dao = new ethers.Contract(daoAddress, DAO_ABI, signer);
    
    const tx = await dao.executeProposal(proposalId);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error executing proposal:', error);
    throw error;
  }
}

/**
 * Get all proposals for a DAO
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @returns Array of proposal details
 */
export async function getDAOProposals(
  provider: ethers.providers.Web3Provider,
  daoAddress: string
) {
  try {
    const dao = new ethers.Contract(daoAddress, DAO_ABI, provider);
    const proposalCount = await dao.getProposalCount();
    
    // Get all proposals
    const proposals = [];
    for (let i = 0; i < proposalCount.toNumber(); i++) {
      const proposal = await dao.getProposal(i);
      proposals.push({
        id: proposal.id.toString(),
        title: proposal.title,
        description: proposal.description,
        category: proposal.category,
        budget: ethers.utils.formatUnits(proposal.budget, 0),
        creator: proposal.creator,
        createdAt: new Date(proposal.createdAt.toNumber() * 1000),
        votingEndTime: new Date(proposal.votingEndTime.toNumber() * 1000),
        votesFor: proposal.votesFor.toNumber(),
        votesAgainst: proposal.votesAgainst.toNumber(),
        executed: proposal.executed,
        passed: proposal.passed
      });
    }
    
    return proposals;
  } catch (error) {
    console.error('Error getting DAO proposals:', error);
    throw error;
  }
}

/**
 * Add a comment to a proposal
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @param proposalId ID of the proposal
 * @param comment Comment text
 */
export async function addCommentToProposal(
  provider: ethers.providers.Web3Provider,
  daoAddress: string,
  proposalId: string,
  comment: string
) {
  try {
    const signer = provider.getSigner();
    const dao = new ethers.Contract(daoAddress, DAO_ABI, signer);
    
    const tx = await dao.addComment(proposalId, comment);
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error adding comment to proposal:', error);
    throw error;
  }
}

/**
 * Deposit funds into the DAO vault
 * @param provider Ethereum provider from ethers.js
 * @param daoAddress Address of the DAO contract
 * @param amountInWei Amount to deposit in Wei
 */
export async function depositFunds(
  provider: ethers.providers.Web3Provider,
  daoAddress: string,
  amountInWei: string
) {
  try {
    const signer = provider.getSigner();
    const dao = new ethers.Contract(daoAddress, DAO_ABI, signer);
    
    const tx = await dao.depositFunds({ value: amountInWei });
    await tx.wait();
    
    return true;
  } catch (error) {
    console.error('Error depositing funds:', error);
    throw error;
  }
}