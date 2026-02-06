'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface DAOConfig {
  name: string;
  description: string;
  category: string;
  location: string;
  useWeightedVoting: boolean;
  requireVerification: boolean;
  allowFundAllocation: boolean;
  minimumVotingPeriod: number;
  proposalThreshold: number;
}

interface CivicCharterGeneratorProps {
  daoConfig: DAOConfig;
  onDownload?: () => void;
}

export default function CivicCharterGenerator({ daoConfig, onDownload }: CivicCharterGeneratorProps) {
  const { isDarkMode } = useTheme();
  const [generatedCharter, setGeneratedCharter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate the charter document based on the DAO configuration
  const generateCharter = () => {
    setIsGenerating(true);
    
    // In a real implementation, this could call an API that uses AI to generate a more customized charter
    // For now, we'll use a template-based approach
    
    setTimeout(() => {
      const charter = `
# CIVIC CHARTER

## ${daoConfig.name}

**Date of Establishment:** ${new Date().toLocaleDateString('en-IN')}

## ARTICLE I: PURPOSE AND MISSION

${daoConfig.name} is established as a Decentralized Autonomous Organization (DAO) with the purpose of facilitating transparent governance for ${daoConfig.category} in ${daoConfig.location}. 

**Mission Statement:** ${daoConfig.description}

## ARTICLE II: MEMBERSHIP

1. **Eligibility:** Any individual who is a stakeholder in the community may become a member of the organization.

2. **Verification Requirement:** ${daoConfig.requireVerification ? 
    'Members must verify their identity through the approved verification process before participating in governance activities.' : 
    'Identity verification is not required for participation, though members are encouraged to verify their identity for enhanced trust.'}

3. **Voting Rights:** ${daoConfig.useWeightedVoting ? 
    'Members have voting rights proportional to their assigned voting power, which is determined by criteria established by the DAO administrators.' : 
    'All verified members have equal voting rights on a one-member, one-vote basis.'}

## ARTICLE III: GOVERNANCE STRUCTURE

1. **Decision Making:** The primary decision-making body is the collective membership of the DAO through proposal voting.

2. **Proposals:** Any member may submit proposals for consideration by the DAO in accordance with the established process.

3. **Voting Process:**
   - Voting period: Minimum ${daoConfig.minimumVotingPeriod} days for all proposals
   - Approval threshold: ${daoConfig.proposalThreshold}% majority required for a proposal to pass
   - ${daoConfig.useWeightedVoting ? 'Weighted voting system applies based on member voting power' : 'Equal voting weight for all eligible members'}

4. **Transparency:** All proposals, votes, and governance actions are recorded on a public ledger (blockchain) for transparency.

## ARTICLE IV: FINANCIAL MANAGEMENT

1. **Fund Allocation:** ${daoConfig.allowFundAllocation ? 
    'The DAO may allocate funds for approved proposals. All financial transactions are recorded on the blockchain for transparency and accountability.' : 
    'This DAO does not include fund allocation capabilities. Any financial matters must be handled outside the DAO structure.'}

2. **Treasury Management:** ${daoConfig.allowFundAllocation ? 
    'The DAO treasury is managed through smart contracts with multi-signature requirements for security. Funds can only be disbursed through successful proposal execution.' : 
    'Not applicable as fund allocation is not enabled for this DAO.'}

## ARTICLE V: AMENDMENT PROCESS

1. This charter may be amended through the standard proposal and voting process.
2. Charter amendments require a ${Math.max(daoConfig.proposalThreshold + 10, 75)}% majority to pass.
3. The voting period for charter amendments shall be no less than ${Math.max(daoConfig.minimumVotingPeriod * 2, 14)} days.

## ARTICLE VI: LEGAL COMPLIANCE

1. This DAO operates in compliance with applicable laws and regulations of India.
2. In case of conflict between this charter and applicable laws, the laws shall prevail.
3. The DAO and its members shall adhere to principles of ethical conduct and good governance.

## ARTICLE VII: DISSOLUTION

1. The DAO may be dissolved through a proposal requiring a 75% supermajority vote.
2. Upon dissolution, any remaining assets shall be distributed as determined by the final dissolution proposal.

---

**Endorsed by:** [Founding Members]
**Blockchain Record:** [Transaction Hash]
**Digital Signature:** [Signature]
      `;
      
      setGeneratedCharter(charter);
      setIsGenerating(false);
    }, 2000);
  };
  
  // Generate the charter when the component mounts or when config changes
  useEffect(() => {
    if (daoConfig.name) {
      generateCharter();
    }
  }, [daoConfig]);
  
  // Handle downloading the charter as a text file
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCharter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${daoConfig.name.replace(/\s+/g, '-').toLowerCase()}-charter.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div className={`rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium">CivicCharter Generator</h3>
        <p className="text-sm mt-1 opacity-70">
          Automatically generate a governance charter for your DAO
        </p>
      </div>
      
      <div className="p-4">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
            <p>Generating your Civic Charter...</p>
          </div>
        ) : (
          <>
            <div className={`p-4 rounded border max-h-[500px] overflow-y-auto font-mono text-sm ${
              isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              {generatedCharter.split('\n').map((line, index) => {
                // Add styling for different header levels
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-xl font-bold my-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-lg font-bold my-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-base font-bold my-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('**')) {
                  return <p key={index} className="font-bold my-1">{line}</p>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4 my-1">{line.substring(2)}</li>;
                } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                  return <li key={index} className="ml-4 my-1">{line.substring(3)}</li>;
                } else if (line === '---') {
                  return <hr key={index} className="my-4 border-gray-300 dark:border-gray-700" />;
                } else if (line === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="my-1">{line}</p>;
                }
              })}
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={generateCharter}
                className={`px-4 py-2 rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Regenerate
              </button>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Download Charter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 