'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function Proposals() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('active');
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  // Mock proposals data with useState to allow updates
  const [proposals, setProposals] = useState({
    active: [
      {
        id: 'PROP-2023-42',
        title: 'Community Garden Expansion Project',
        description: 'Expand the community garden in Central Park by 1500 sqft to accommodate more participants.',
        proposer: 'Anonymous #F45D',
        votes: { for: 235, against: 124, abstain: 56 },
        deadline: '2023-07-15T23:59:59',
        category: 'Environment',
        status: 'active'
      },
      {
        id: 'PROP-2023-43',
        title: 'Street Light Upgrade to LED',
        description: 'Replace all street lights in the downtown area with energy-efficient LED lights.',
        proposer: 'Anonymous #A32B',
        votes: { for: 312, against: 89, abstain: 42 },
        deadline: '2023-07-18T23:59:59',
        category: 'Infrastructure',
        status: 'active'
      },
    ],
    passed: [
      {
        id: 'PROP-2023-38',
        title: 'Weekly Farmer\'s Market Initiative',
        description: 'Establish a weekly farmer\'s market in the town square to promote local produce.',
        proposer: 'Anonymous #7C96',
        votes: { for: 456, against: 123, abstain: 78 },
        deadline: '2023-06-28T23:59:59',
        category: 'Economy',
        status: 'passed',
        implementation: '2023-08-01'
      },
      {
        id: 'PROP-2023-39',
        title: 'Public WiFi in Parks Project',
        description: 'Install free public WiFi access points in all major city parks.',
        proposer: 'Anonymous #9E4F',
        votes: { for: 512, against: 145, abstain: 93 },
        deadline: '2023-06-30T23:59:59',
        category: 'Technology',
        status: 'passed',
        implementation: '2023-09-15'
      },
    ],
    rejected: [
      {
        id: 'PROP-2023-36',
        title: 'Night-time Curfew Enforcement',
        description: 'Implement a 11 PM - 5 AM curfew in the downtown entertainment district.',
        proposer: 'Anonymous #D12A',
        votes: { for: 187, against: 423, abstain: 65 },
        deadline: '2023-06-20T23:59:59',
        category: 'Safety',
        status: 'rejected'
      },
    ]
  });

  // User's voting status to prevent duplicate votes
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});

  // Function to handle votes
  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    // Check if user has already voted
    if (userVotes[proposalId]) {
      alert(`You've already voted ${userVotes[proposalId]} on this proposal.`);
      return;
    }
    
    // Update the proposals state
    setProposals(prev => {
      // Find which tab the proposal is in
      const tabKey = Object.keys(prev).find(key => 
        prev[key as keyof typeof prev].some(p => p.id === proposalId)
      ) as keyof typeof prev;
      
      if (!tabKey) return prev;
      
      // Clone the proposals object to avoid direct mutation
      const updatedProposals = { ...prev };
      
      // Find the proposal and update its votes
      updatedProposals[tabKey] = updatedProposals[tabKey].map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            votes: {
              ...proposal.votes,
              [voteType]: proposal.votes[voteType] + 1
            }
          };
        }
        return proposal;
      });
      
      return updatedProposals;
    });
    
    // Record user's vote to prevent double voting
    setUserVotes(prev => ({
      ...prev,
      [proposalId]: voteType
    }));
    
    // Show success message
    alert(`Your vote has been recorded: ${voteType}`);
  };

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: '',
    deadline: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProposal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to submit proposal to blockchain
    alert('Proposal submitted successfully!');
    setShowProposalForm(false);
    setNewProposal({ title: '', description: '', category: '', deadline: '' });
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Proposals header */}
        <div className="px-4 py-6 sm:px-0">
          <div className={`rounded-lg shadow px-5 py-6 sm:px-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className={`text-2xl font-bold leading-7 sm:text-3xl sm:truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Governance Proposals
                </h2>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Participate in decentralized decision-making for our community
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  onClick={() => setShowProposalForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-4 sm:px-0 mt-4">
          <div className="hidden sm:block">
            <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`${
                    activeTab === 'active'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Active Proposals
                </button>
                <button
                  onClick={() => setActiveTab('passed')}
                  className={`${
                    activeTab === 'passed'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Passed
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`${
                    activeTab === 'rejected'
                      ? `${isDarkMode ? 'border-primary text-primary' : 'border-primary text-primary'}`
                      : `${isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
                >
                  Rejected
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Proposals List */}
        <div className="mt-6 px-4 sm:px-0">
          <ul className="space-y-4">
            {proposals[activeTab as keyof typeof proposals].map((proposal) => (
              <li key={proposal.id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {proposal.title}
                    </h3>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proposal.status === 'active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : proposal.status === 'passed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </div>
                  </div>
                  <p className={`mt-1 max-w-2xl text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {proposal.id} · Proposed by {proposal.proposer}
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Description
                      </dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        {proposal.description}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Category
                      </dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        {proposal.category}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Voting Status
                      </dt>
                      <dd className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500 font-medium">For: {proposal.votes.for}</span>
                            <span className="text-red-500 font-medium">Against: {proposal.votes.against}</span>
                            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Abstain: {proposal.votes.abstain}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="flex h-full">
                              <div 
                                className="bg-green-500 h-full" 
                                style={{ 
                                  width: `${proposal.votes.for / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain) * 100}%` 
                                }}
                              ></div>
                              <div 
                                className="bg-red-500 h-full" 
                                style={{ 
                                  width: `${proposal.votes.against / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain) * 100}%` 
                                }}
                              ></div>
                              <div 
                                className="bg-gray-400 h-full" 
                                style={{ 
                                  width: `${proposal.votes.abstain / (proposal.votes.for + proposal.votes.against + proposal.votes.abstain) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                    {proposal.status === 'active' && (
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Deadline
                        </dt>
                        <dd className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                          {new Date(proposal.deadline).toLocaleString()}
                        </dd>
                      </div>
                    )}
                    {proposal.status === 'passed' && 'implementation' in proposal && (
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Implementation Date
                        </dt>
                        <dd className={`mt-1 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>
                          {new Date(proposal.implementation).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {proposal.status === 'active' && (
                      <div className="py-4 sm:py-5 sm:px-6">
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => handleVote(proposal.id, 'for')}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                              userVotes[proposal.id] === 'for' 
                                ? 'bg-green-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                            }`}
                            disabled={!!userVotes[proposal.id]}
                          >
                            {userVotes[proposal.id] === 'for' ? '✓ Voted For' : 'Vote For'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVote(proposal.id, 'against')}
                            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                              userVotes[proposal.id] === 'against' 
                                ? 'bg-red-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            }`}
                            disabled={!!userVotes[proposal.id]}
                          >
                            {userVotes[proposal.id] === 'against' ? '✓ Voted Against' : 'Vote Against'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVote(proposal.id, 'abstain')}
                            className={`inline-flex justify-center py-2 px-4 border ${
                              userVotes[proposal.id] === 'abstain'
                                ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isDarkMode
                                  ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600'
                                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                            disabled={!!userVotes[proposal.id]}
                          >
                            {userVotes[proposal.id] === 'abstain' ? '✓ Abstained' : 'Abstain'}
                          </button>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Create Proposal Modal */}
        {showProposalForm && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className={`inline-block align-bottom ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}>
                <form onSubmit={handleSubmitProposal}>
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`} id="modal-title">
                          Create New Proposal
                        </h3>
                        <div className="mt-2">
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="title" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Title</label>
                              <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={newProposal.title}
                                onChange={handleInputChange}
                                className={`mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                                }`}
                                placeholder="Proposal title"
                              />
                            </div>
                            <div>
                              <label htmlFor="description" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Description</label>
                              <textarea
                                id="description"
                                name="description"
                                required
                                value={newProposal.description}
                                onChange={handleInputChange}
                                rows={4}
                                className={`mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                                }`}
                                placeholder="Detailed description of your proposal"
                              ></textarea>
                            </div>
                            <div>
                              <label htmlFor="category" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                              <select
                                id="category"
                                name="category"
                                required
                                value={newProposal.category}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${
                                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                                }`}
                              >
                                <option value="">Select a category</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Environment">Environment</option>
                                <option value="Safety">Safety</option>
                                <option value="Economy">Economy</option>
                                <option value="Technology">Technology</option>
                                <option value="Education">Education</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label htmlFor="deadline" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Voting Deadline</label>
                              <input
                                type="datetime-local"
                                name="deadline"
                                id="deadline"
                                required
                                value={newProposal.deadline}
                                onChange={handleInputChange}
                                className={`mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                                  isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Submit Proposal
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                        isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } shadow-sm px-4 py-2 bg-transparent text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 