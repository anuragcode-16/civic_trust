'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface TokenAllocationProps {
  data: {
    category: string;
    value: number;
    color: string;
  }[];
  totalTokens: number;
  isDarkMode?: boolean;
}

export default function TokenAllocation({ data, totalTokens, isDarkMode: propIsDarkMode }: TokenAllocationProps) {
  const { isDarkMode: contextIsDarkMode } = useTheme();
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextIsDarkMode;

  // Custom Label component for inner text
  const renderCustomizedLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <text 
        x={cx} 
        y={cy} 
        textAnchor="middle" 
        dominantBaseline="central"
        className={`text-xl font-semibold ${isDarkMode ? 'fill-white' : 'fill-gray-800'}`}
      >
        {totalTokens}
      </text>
    );
  };

  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
      <div className="p-5">
        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Token Allocation
        </h3>
        
        <div className="flex flex-col md:flex-row items-center mt-6">
          {/* Pie chart */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    stroke={isDarkMode ? '#1F2937' : '#FFFFFF'}
                    strokeWidth={1.5}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {renderCustomizedLabel({ cx: '50%', cy: '50%' })}
                  <Tooltip 
                    formatter={(value: number) => [`${value} CT`, 'Amount']} 
                    contentStyle={{ 
                      background: isDarkMode ? '#1F2937' : '#FFFFFF',
                      border: isDarkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
                      color: isDarkMode ? '#F3F4F6' : '#1F2937',
                      borderRadius: '0.375rem'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Legend */}
          <div className="w-full md:w-1/2 flex flex-col space-y-3 mt-4 md:mt-0">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <div className="ml-2 flex justify-between w-full">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {entry.category}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {entry.value} CT
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {((entry.value / totalTokens) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total
            </span>
            <span className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {totalTokens} CT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 