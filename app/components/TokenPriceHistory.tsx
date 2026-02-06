'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import TokenPriceChart from './TokenPriceChart';

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

interface TokenPriceHistoryProps {
  tokenSymbol: string;
  tokenPrice: number;
  percentageChange: number;
}

export default function TokenPriceHistory({ 
  tokenSymbol, 
  tokenPrice, 
  percentageChange 
}: TokenPriceHistoryProps) {
  const { isDarkMode } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D');
  
  const timeframes: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  
  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
      <div className="p-5">
        <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Token Price History
        </h3>
        
        <div className="flex items-center mt-2">
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{tokenPrice.toFixed(2)}
          </span>
          <span className={`ml-2 px-2 py-0.5 rounded text-sm font-medium ${
            percentageChange >= 0 
              ? 'text-green-500 bg-green-50 dark:bg-green-900 dark:text-green-400' 
              : 'text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-400'
          }`}>
            {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
          </span>
        </div>
        
        {/* Price indicator showing current price vs opening */}
        <div className="flex items-center mt-1 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Today: ₹10.16</span>
          <span className="mx-2 text-gray-400 dark:text-gray-500">→</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">₹{tokenPrice.toFixed(2)}</span>
        </div>
        
        <div className="h-64 mt-4">
          <TokenPriceChart 
            timeframe={selectedTimeframe} 
            tokenSymbol={tokenSymbol} 
          />
        </div>
        
        <div className="grid grid-cols-6 gap-1 mt-4">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`py-2 text-xs font-medium rounded-md transition-colors focus:outline-none ${
                selectedTimeframe === timeframe
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 