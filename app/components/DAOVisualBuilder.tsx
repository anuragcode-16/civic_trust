'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTheme } from '../context/ThemeContext';

interface BuilderComponent {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  configOptions: any;
}

interface DAOVisualBuilderProps {
  onConfigUpdate: (config: any) => void;
}

export default function DAOVisualBuilder({ onConfigUpdate }: DAOVisualBuilderProps) {
  const { isDarkMode } = useTheme();
  
  // Available components for the builder
  const [availableComponents, setAvailableComponents] = useState<BuilderComponent[]>([
    {
      id: 'voting-simple',
      type: 'voting',
      title: 'Simple Voting',
      description: 'One person, one vote system',
      icon: '🗳️',
      configOptions: { useWeightedVoting: false }
    },
    {
      id: 'voting-weighted',
      type: 'voting',
      title: 'Weighted Voting',
      description: 'Votes weighted by user power',
      icon: '⚖️',
      configOptions: { useWeightedVoting: true }
    },
    {
      id: 'verification-aadhar',
      type: 'verification',
      title: 'Aadhaar Verification',
      description: 'Verify users with Aadhaar',
      icon: '🪪',
      configOptions: { requireVerification: true, verificationType: 'aadhar' }
    },
    {
      id: 'verification-none',
      type: 'verification',
      title: 'No Verification',
      description: 'Open access to all',
      icon: '🔓',
      configOptions: { requireVerification: false }
    },
    {
      id: 'funds-enabled',
      type: 'funds',
      title: 'Fund Management',
      description: 'Enable fund allocation and tracking',
      icon: '💰',
      configOptions: { allowFundAllocation: true }
    },
    {
      id: 'funds-disabled',
      type: 'funds',
      title: 'No Fund Management',
      description: 'Voting only, no fund allocation',
      icon: '📝',
      configOptions: { allowFundAllocation: false }
    },
    {
      id: 'voting-period-short',
      type: 'votingPeriod',
      title: 'Short Voting Period',
      description: '3 days minimum',
      icon: '⏱️',
      configOptions: { minimumVotingPeriod: 3 }
    },
    {
      id: 'voting-period-medium',
      type: 'votingPeriod',
      title: 'Medium Voting Period',
      description: '7 days minimum',
      icon: '📅',
      configOptions: { minimumVotingPeriod: 7 }
    },
    {
      id: 'voting-period-long',
      type: 'votingPeriod',
      title: 'Long Voting Period',
      description: '14 days minimum',
      icon: '🗓️',
      configOptions: { minimumVotingPeriod: 14 }
    },
    {
      id: 'threshold-majority',
      type: 'threshold',
      title: 'Simple Majority',
      description: '51% to pass proposals',
      icon: '✅',
      configOptions: { proposalThreshold: 51 }
    },
    {
      id: 'threshold-supermajority',
      type: 'threshold',
      title: 'Super Majority',
      description: '67% to pass proposals',
      icon: '✓✓',
      configOptions: { proposalThreshold: 67 }
    }
  ]);
  
  // Selected components that make up the DAO configuration
  const [selectedComponents, setSelectedComponents] = useState<BuilderComponent[]>([]);
  
  // Current configuration derived from selected components
  const [currentConfig, setCurrentConfig] = useState({
    useWeightedVoting: false,
    requireVerification: true,
    verificationType: 'none',
    allowFundAllocation: true,
    minimumVotingPeriod: 7,
    proposalThreshold: 51
  });
  
  // Handle drag end event
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) return;
    
    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'selected') {
        const newItems = [...selectedComponents];
        const [movedItem] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, movedItem);
        setSelectedComponents(newItems);
      }
    } else {
      // Moving between different lists
      if (source.droppableId === 'available' && destination.droppableId === 'selected') {
        const draggedComponent = availableComponents[source.index];
        
        // Check if we're trying to add a component of a type that already exists
        const existingComponentOfSameType = selectedComponents.find(
          comp => comp.type === draggedComponent.type
        );
        
        if (existingComponentOfSameType) {
          // Remove the existing component of the same type
          const filteredComponents = selectedComponents.filter(
            comp => comp.type !== draggedComponent.type
          );
          setSelectedComponents([...filteredComponents, draggedComponent]);
        } else {
          setSelectedComponents([...selectedComponents, draggedComponent]);
        }
        
        // Update the configuration
        updateConfiguration([...selectedComponents, draggedComponent]);
      } else if (source.droppableId === 'selected' && destination.droppableId === 'available') {
        // Removing from selected
        const newSelectedItems = [...selectedComponents];
        newSelectedItems.splice(source.index, 1);
        setSelectedComponents(newSelectedItems);
        
        // Update the configuration
        updateConfiguration(newSelectedItems);
      }
    }
  };
  
  // Update the configuration based on selected components
  const updateConfiguration = (components: BuilderComponent[]) => {
    // Start with default values
    const newConfig = {
      useWeightedVoting: false,
      requireVerification: true,
      verificationType: 'none',
      allowFundAllocation: true,
      minimumVotingPeriod: 7,
      proposalThreshold: 51
    };
    
    // Apply the configuration from each selected component
    components.forEach(component => {
      Object.assign(newConfig, component.configOptions);
    });
    
    setCurrentConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  return (
    <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-medium mb-4">Visual DAO Builder</h3>
      <p className="text-sm mb-6">Drag and drop components to configure your DAO</p>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available components */}
          <div>
            <h4 className="text-md font-medium mb-3">Available Components</h4>
            <Droppable droppableId="available">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-lg min-h-[300px] border ${
                    isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {availableComponents.map((component, index) => (
                    <Draggable key={component.id} draggableId={component.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 rounded-md flex items-center ${
                            isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                          } border shadow-sm cursor-pointer`}
                        >
                          <div className="text-2xl mr-3">{component.icon}</div>
                          <div>
                            <div className="font-medium">{component.title}</div>
                            <div className="text-xs opacity-70">{component.description}</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          
          {/* Selected components */}
          <div>
            <h4 className="text-md font-medium mb-3">Your DAO Configuration</h4>
            <Droppable droppableId="selected">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-lg min-h-[300px] border-2 ${
                    isDarkMode 
                      ? 'border-primary/30 bg-gray-700' 
                      : 'border-primary/30 bg-white'
                  }`}
                >
                  {selectedComponents.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px] text-center opacity-50">
                      <div>
                        <div className="text-4xl mb-2">⬅️</div>
                        <p>Drag components here to build your DAO</p>
                      </div>
                    </div>
                  ) : (
                    selectedComponents.map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 rounded-md flex items-center ${
                              isDarkMode ? 'bg-gray-600' : 'bg-white'
                            } border border-primary/30 shadow-sm`}
                          >
                            <div className="text-2xl mr-3">{component.icon}</div>
                            <div>
                              <div className="font-medium">{component.title}</div>
                              <div className="text-xs opacity-70">{component.description}</div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
      
      {/* Configuration Summary */}
      {selectedComponents.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-medium mb-3">Configuration Summary</h4>
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="font-medium mr-2">Voting System:</span>
                <span>{currentConfig.useWeightedVoting ? 'Weighted Voting' : 'Simple Voting (1 person, 1 vote)'}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Verification:</span>
                <span>{currentConfig.requireVerification ? `Required (${currentConfig.verificationType})` : 'Not Required'}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Fund Management:</span>
                <span>{currentConfig.allowFundAllocation ? 'Enabled' : 'Disabled'}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Minimum Voting Period:</span>
                <span>{currentConfig.minimumVotingPeriod} days</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium mr-2">Proposal Threshold:</span>
                <span>{currentConfig.proposalThreshold}% support required</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 