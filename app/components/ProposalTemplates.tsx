'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ProposalTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetEstimate: number; // In INR
  icon: string;
  votingPeriod: number; // In days
  steps?: string[];
}

interface ProposalTemplatesProps {
  onSelectTemplate: (template: ProposalTemplate) => void;
  categoryFilter?: string;
}

export default function ProposalTemplates({ onSelectTemplate, categoryFilter }: ProposalTemplatesProps) {
  const { isDarkMode } = useTheme();
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'sanitation', name: 'Sanitation & Cleanliness' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'social', name: 'Social Welfare' },
    { id: 'security', name: 'Security & Safety' },
    { id: 'technology', name: 'Technology' }
  ];
  
  const templates: ProposalTemplate[] = [
    {
      id: 'road-repair',
      title: 'Road Repair Project',
      description: 'Repair potholes and damaged sections of community roads for improved safety and accessibility.',
      category: 'infrastructure',
      budgetEstimate: 50000,
      icon: '🛣️',
      votingPeriod: 7,
      steps: [
        'Survey roads to identify areas needing repair',
        'Obtain quotes from local contractors',
        'Schedule repairs during non-peak hours',
        'Implement quality checks after completion',
        'Document before and after conditions'
      ]
    },
    {
      id: 'cleanliness-drive',
      title: 'Community Cleanliness Drive',
      description: 'Organize a community-wide cleanliness initiative to remove garbage, clean public spaces, and promote waste segregation.',
      category: 'sanitation',
      budgetEstimate: 15000,
      icon: '🧹',
      votingPeriod: 5,
      steps: [
        'Identify key areas requiring cleaning',
        'Procure cleaning supplies and equipment',
        'Recruit volunteers from the community',
        'Arrange for proper waste disposal',
        'Conduct awareness sessions on waste management'
      ]
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation System',
      description: 'Implement rainwater harvesting systems and promote water conservation practices in the community.',
      category: 'environment',
      budgetEstimate: 75000,
      icon: '💧',
      votingPeriod: 10,
      steps: [
        'Assess feasible locations for rainwater harvesting',
        'Design appropriate systems based on rainfall patterns',
        'Install collection and filtration systems',
        'Create maintenance schedule',
        'Conduct water conservation awareness programs'
      ]
    },
    {
      id: 'street-lights',
      title: 'Solar Street Lighting',
      description: 'Install solar-powered street lights to improve safety and reduce electricity costs.',
      category: 'infrastructure',
      budgetEstimate: 120000,
      icon: '💡',
      votingPeriod: 14,
      steps: [
        'Map locations requiring street lights',
        'Select appropriate solar lighting solutions',
        'Install solar panels and LED lights',
        'Set up maintenance protocol',
        'Evaluate lighting effectiveness after installation'
      ]
    },
    {
      id: 'health-camp',
      title: 'Community Health Camp',
      description: 'Organize a free health checkup camp for community members focusing on preventive healthcare.',
      category: 'health',
      budgetEstimate: 35000,
      icon: '🏥',
      votingPeriod: 7,
      steps: [
        'Partner with local healthcare providers',
        'Secure necessary medical equipment and supplies',
        'Advertise camp details to community members',
        'Set up registration system',
        'Arrange follow-up care for identified cases'
      ]
    },
    {
      id: 'skill-workshop',
      title: 'Youth Skill Development Workshop',
      description: 'Conduct skill development workshops for youth focusing on digital literacy, entrepreneurship, or vocational skills.',
      category: 'education',
      budgetEstimate: 25000,
      icon: '📚',
      votingPeriod: 7,
      steps: [
        'Identify relevant skills based on community needs',
        'Hire qualified instructors',
        'Prepare workshop materials and resources',
        'Set up venue with necessary equipment',
        'Issue certificates to participants'
      ]
    },
    {
      id: 'cctv-system',
      title: 'Community CCTV Surveillance',
      description: 'Install CCTV cameras at strategic locations to enhance security and deter criminal activities.',
      category: 'security',
      budgetEstimate: 80000,
      icon: '📹',
      votingPeriod: 10,
      steps: [
        'Identify key locations requiring surveillance',
        'Select appropriate camera systems',
        'Set up monitoring station',
        'Train community members on system operation',
        'Establish protocol for footage review and storage'
      ]
    },
    {
      id: 'community-wifi',
      title: 'Public WiFi Network',
      description: 'Establish free WiFi hotspots in common areas to improve digital access for all community members.',
      category: 'technology',
      budgetEstimate: 45000,
      icon: '📶',
      votingPeriod: 7,
      steps: [
        'Select internet service provider',
        'Install routers at strategic locations',
        'Set up access control system',
        'Create usage policy',
        'Monitor network performance and security'
      ]
    },
    {
      id: 'senior-support',
      title: 'Senior Citizen Support Program',
      description: 'Establish regular check-ins and assistance programs for elderly residents in the community.',
      category: 'social',
      budgetEstimate: 30000,
      icon: '👴',
      votingPeriod: 7,
      steps: [
        'Create registry of senior citizens',
        'Recruit volunteers for check-in system',
        'Establish emergency response protocol',
        'Organize regular social activities',
        'Arrange basic home maintenance services'
      ]
    },
    {
      id: 'waste-management',
      title: 'Waste Segregation and Management',
      description: 'Implement comprehensive waste segregation system and promote sustainable waste management practices.',
      category: 'sanitation',
      budgetEstimate: 60000,
      icon: '♻️',
      votingPeriod: 10,
      steps: [
        'Procure color-coded bins for different waste types',
        'Create waste collection schedule',
        'Establish composting facility for organic waste',
        'Partner with recycling agencies',
        'Conduct awareness workshops on waste segregation'
      ]
    }
  ];
  
  // Filter templates based on category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoryFilter = !categoryFilter || template.category === categoryFilter;
    
    return matchesCategory && matchesSearch && matchesCategoryFilter;
  });

  return (
    <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-medium mb-4">Proposal Templates</h3>
      <p className="text-sm mb-6">Choose from pre-designed templates for common civic initiatives</p>
      
      {/* Search and filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 text-gray-900'
            } focus:ring-primary focus:border-primary`}
          />
        </div>
        
        {!categoryFilter && (
          <div className="flex-1 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-700 hover:bg-gray-600' 
                : 'border-gray-200 bg-white hover:border-primary/30'
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{template.icon}</span>
              <h4 className="font-medium">{template.title}</h4>
            </div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {template.description}
            </p>
            <div className="flex justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
                ₹{template.budgetEstimate.toLocaleString('en-IN')}
              </span>
              <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {template.category.replace('-', ' ')}
              </span>
            </div>
          </div>
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className={`col-span-3 py-10 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No templates found. Try changing your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
} 