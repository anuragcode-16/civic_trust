// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title CivicProposals
 * @dev Manages civic proposals and voting for CivicTrust platform
 */
contract CivicProposals {
    // Struct to represent a proposal
    struct Proposal {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 budget; // Budget in INR (stored as paise)
        address creator; // Anonymous address of creator
        uint256 createdAt;
        uint256 votingEndTime;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool passed;
        // New fields for configurable DAOs
        mapping(address => uint256) weightedVotes; // For weighted voting
        mapping(address => string) comments; // For proposal discussion
    }

    // Configuration options for the DAO
    struct DAOConfig {
        string name;
        string description;
        address admin;
        bool useWeightedVoting;
        bool requireVerification;
        bool allowFundAllocation;
        uint256 minimumVotingPeriod;
        uint256 proposalThreshold; // minimum support needed to pass
    }

    // DAO configuration
    DAOConfig public config;
    
    // Array to store all proposals
    Proposal[] public proposals;
    
    // Mapping to track if an address has voted on a proposal
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // New mapping for user verification status (if verification required)
    mapping(address => bool) public isVerified;
    
    // New mapping for user voting weights (if weighted voting used)
    mapping(address => uint256) public votingPower;
    
    // Fund vault balance (if fund allocation enabled)
    uint256 public vaultBalance;
    
    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title, uint256 budget);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event FundsDeposited(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount, uint256 proposalId);
    event UserVerified(address indexed user);

    // Modifiers
    modifier proposalExists(uint256 proposalId) {
        require(proposalId < proposals.length, "Proposal does not exist");
        _;
    }

    modifier voteOpen(uint256 proposalId) {
        require(block.timestamp < proposals[proposalId].votingEndTime, "Voting period has ended");
        _;
    }

    modifier hasNotVoted(uint256 proposalId) {
        require(!hasVoted[proposalId][msg.sender], "Already voted on this proposal");
        _;
    }
    
    modifier onlyVerified() {
        require(!config.requireVerification || isVerified[msg.sender], "User not verified");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == config.admin, "Only admin can perform this action");
        _;
    }

    /**
     * @dev Constructor to initialize the DAO with configuration
     * @param name Name of the DAO
     * @param description Description of the DAO
     * @param useWeightedVoting Whether to use weighted voting
     * @param requireVerification Whether to require user verification
     * @param allowFundAllocation Whether to allow fund allocation
     * @param minimumVotingPeriod Minimum voting period in days
     * @param proposalThreshold Minimum percentage of votes needed to pass a proposal
     */
    constructor(
        string memory name,
        string memory description,
        bool useWeightedVoting,
        bool requireVerification,
        bool allowFundAllocation,
        uint256 minimumVotingPeriod,
        uint256 proposalThreshold
    ) {
        config = DAOConfig({
            name: name,
            description: description,
            admin: msg.sender,
            useWeightedVoting: useWeightedVoting,
            requireVerification: requireVerification,
            allowFundAllocation: allowFundAllocation,
            minimumVotingPeriod: minimumVotingPeriod,
            proposalThreshold: proposalThreshold
        });
        
        // Admin is automatically verified
        if (requireVerification) {
            isVerified[msg.sender] = true;
        }
        
        // Admin starts with 1 voting power by default
        if (useWeightedVoting) {
            votingPower[msg.sender] = 1;
        }
    }

    /**
     * @dev Creates a new proposal
     * @param title Title of the proposal
     * @param description Detailed description of the proposal
     * @param category Category of the proposal (e.g., "Infrastructure", "Environment")
     * @param budgetInPaise Budget in INR paise (1 INR = 100 paise)
     * @param votingPeriodInDays Number of days the voting will be open
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory category,
        uint256 budgetInPaise,
        uint256 votingPeriodInDays
    ) external onlyVerified returns (uint256) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(votingPeriodInDays >= config.minimumVotingPeriod, "Voting period too short");
        
        // If fund allocation is enabled, check budget against vault balance
        if (config.allowFundAllocation) {
            require(budgetInPaise <= vaultBalance, "Requested budget exceeds available funds");
        }

        uint256 proposalId = proposals.length;
        
        Proposal storage newProposal = proposals.push();
        newProposal.id = proposalId;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.category = category;
        newProposal.budget = budgetInPaise;
        newProposal.creator = msg.sender;
        newProposal.createdAt = block.timestamp;
        newProposal.votingEndTime = block.timestamp + (votingPeriodInDays * 1 days);
        newProposal.votesFor = 0;
        newProposal.votesAgainst = 0;
        newProposal.executed = false;
        newProposal.passed = false;
        
        emit ProposalCreated(proposalId, msg.sender, title, budgetInPaise);
        
        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param proposalId ID of the proposal
     * @param support True for supporting the proposal, false for voting against
     */
    function castVote(uint256 proposalId, bool support) 
        external 
        proposalExists(proposalId) 
        voteOpen(proposalId) 
        hasNotVoted(proposalId)
        onlyVerified
    {
        hasVoted[proposalId][msg.sender] = true;
        
        // Handle weighted voting if enabled
        if (config.useWeightedVoting) {
            uint256 weight = votingPower[msg.sender] > 0 ? votingPower[msg.sender] : 1;
            
            if (support) {
                proposals[proposalId].votesFor += weight;
            } else {
                proposals[proposalId].votesAgainst += weight;
            }
        } else {
            if (support) {
                proposals[proposalId].votesFor += 1;
            } else {
                proposals[proposalId].votesAgainst += 1;
            }
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    /**
     * @dev Add a comment to a proposal
     * @param proposalId ID of the proposal
     * @param comment The comment text
     */
    function addComment(uint256 proposalId, string memory comment)
        external
        proposalExists(proposalId)
        onlyVerified
    {
        proposals[proposalId].comments[msg.sender] = comment;
    }

    /**
     * @dev Execute a proposal after voting period ends
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) 
        external 
        proposalExists(proposalId)
        onlyVerified
    {
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.votingEndTime, "Voting period not ended");
        
        proposal.executed = true;
        
        // Calculate if proposal passed based on DAO rules
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 supportPercentage = totalVotes > 0 ? (proposal.votesFor * 100) / totalVotes : 0;
        proposal.passed = supportPercentage >= config.proposalThreshold;
        
        emit ProposalExecuted(proposalId, proposal.passed);
        
        // If proposal passed and fund allocation is enabled, allocate funds
        if (proposal.passed && config.allowFundAllocation && proposal.budget > 0) {
            require(proposal.budget <= vaultBalance, "Insufficient funds in vault");
            vaultBalance -= proposal.budget;
            emit FundsWithdrawn(proposal.creator, proposal.budget, proposalId);
        }
    }
    
    /**
     * @dev Deposit funds into the DAO vault
     */
    function depositFunds() external payable {
        require(config.allowFundAllocation, "Fund allocation not enabled");
        vaultBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Verify a user (only admin can do this)
     * @param user Address of the user to verify
     */
    function verifyUser(address user) external onlyAdmin {
        require(config.requireVerification, "Verification not required");
        isVerified[user] = true;
        emit UserVerified(user);
    }
    
    /**
     * @dev Set voting power for a user (only admin can do this)
     * @param user Address of the user
     * @param power Voting power to assign
     */
    function setVotingPower(address user, uint256 power) external onlyAdmin {
        require(config.useWeightedVoting, "Weighted voting not enabled");
        votingPower[user] = power;
    }

    /**
     * @dev Get the total number of proposals
     * @return The total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return id Proposal ID
     * @return title Proposal title
     * @return description Proposal description
     * @return category Proposal category
     * @return budget Proposal budget
     * @return creator Proposal creator address
     * @return createdAt Creation timestamp
     * @return votingEndTime End of voting period
     * @return votesFor Votes in favor
     * @return votesAgainst Votes against
     * @return executed Whether proposal has been executed
     * @return passed Whether proposal passed
     */
    function getProposal(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            string memory category,
            uint256 budget,
            address creator,
            uint256 createdAt,
            uint256 votingEndTime,
            uint256 votesFor,
            uint256 votesAgainst,
            bool executed,
            bool passed
        )
    {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.budget,
            proposal.creator,
            proposal.createdAt,
            proposal.votingEndTime,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.executed,
            proposal.passed
        );
    }

    /**
     * @dev Check if an address has voted on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     * @return Whether the address has voted
     */
    function hasAddressVoted(uint256 proposalId, address voter) 
        external 
        view 
        proposalExists(proposalId) 
        returns (bool) 
    {
        return hasVoted[proposalId][voter];
    }
    
    /**
     * @dev Get user comment on a proposal
     * @param proposalId ID of the proposal
     * @param user Address of the user
     * @return Comment made by the user
     */
    function getComment(uint256 proposalId, address user)
        external
        view
        proposalExists(proposalId)
        returns (string memory)
    {
        return proposals[proposalId].comments[user];
    }
    
    /**
     * @dev Get DAO configuration
     * @return DAO configuration details
     */
    function getDAOConfig() external view returns (DAOConfig memory) {
        return config;
    }
} 