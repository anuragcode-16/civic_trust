// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CivicProposals.sol";

/**
 * @title CivicDAOFactory
 * @dev Factory contract that creates customized DAO instances for local communities
 */
contract CivicDAOFactory {
    // Struct to track created DAOs
    struct CivicDAO {
        address contractAddress;
        string name;
        string description;
        string location;
        string category; // e.g., "Panchayat", "RWA", "Student Club", "NGO"
        address creator;
        uint256 createdAt;
        bool hasVotingWeights;
        bool hasFundVaults;
        bool requiresVerification;
    }
    
    // Array of all created DAOs
    CivicDAO[] public daos;
    
    // Mapping of addresses to their created DAOs
    mapping(address => uint256[]) public creatorToDaos;
    
    // Events
    event DAOCreated(address indexed daoAddress, string name, address indexed creator);
    
    /**
     * @dev Creates a new DAO instance with customized parameters
     * @param name Name of the DAO
     * @param description Description of the DAO's purpose
     * @param location Geographic location (e.g., city, district)
     * @param category Type of organization (e.g., "Panchayat", "RWA")
     * @param hasVotingWeights Whether the DAO uses weighted voting
     * @param hasFundVaults Whether the DAO includes fund management vaults
     * @param requiresVerification Whether the DAO requires identity verification
     */
    function createDAO(
        string memory name,
        string memory description,
        string memory location,
        string memory category,
        bool hasVotingWeights,
        bool hasFundVaults,
        bool requiresVerification
    ) external returns (address) {
        // Create a new CivicProposals contract
        CivicProposals newDAO = new CivicProposals();
        
        // Store DAO information
        uint256 daoId = daos.length;
        CivicDAO memory civicDAO = CivicDAO({
            contractAddress: address(newDAO),
            name: name,
            description: description,
            location: location,
            category: category,
            creator: msg.sender,
            createdAt: block.timestamp,
            hasVotingWeights: hasVotingWeights,
            hasFundVaults: hasFundVaults,
            requiresVerification: requiresVerification
        });
        
        daos.push(civicDAO);
        creatorToDaos[msg.sender].push(daoId);
        
        emit DAOCreated(address(newDAO), name, msg.sender);
        
        return address(newDAO);
    }
    
    /**
     * @dev Get the total number of DAOs created
     * @return The total count of DAOs
     */
    function getDaoCount() external view returns (uint256) {
        return daos.length;
    }
    
    /**
     * @dev Get all DAOs created by a specific address
     * @param creator Address of the DAO creator
     * @return Array of DAO IDs created by the address
     */
    function getDaosByCreator(address creator) external view returns (uint256[] memory) {
        return creatorToDaos[creator];
    }
    
    /**
     * @dev Get DAO details by ID
     * @param daoId ID of the DAO
     * @return DAO information
     */
    function getDao(uint256 daoId) external view returns (CivicDAO memory) {
        require(daoId < daos.length, "DAO does not exist");
        return daos[daoId];
    }
    
    /**
     * @dev Get all DAOs in a specific category
     * @param category Category to filter by (e.g., "Panchayat", "RWA")
     * @return Array of DAO IDs matching the category
     */
    function getDaosByCategory(string memory category) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count matching DAOs
        for (uint256 i = 0; i < daos.length; i++) {
            if (keccak256(bytes(daos[i].category)) == keccak256(bytes(category))) {
                count++;
            }
        }
        
        // Populate result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < daos.length; i++) {
            if (keccak256(bytes(daos[i].category)) == keccak256(bytes(category))) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
} 