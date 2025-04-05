'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface PriceDataPoint {
  date: string;
  price: number;
}

interface TokenPriceChartProps {
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
  tokenSymbol: string;
}

export default function TokenPriceChart({ timeframe, tokenSymbol }: TokenPriceChartProps) {
  const { isDarkMode } = useTheme();
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Generate mock price data based on timeframe
  useEffect(() => {
    setIsLoading(true);
    
    // Get current date
    const endDate = new Date();
    let startDate = new Date();
    
    // Set start date based on timeframe
    switch (timeframe) {
      case '1D':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    // Generate data points
    const numPoints = timeframe === '1D' ? 24 : 30; // 24 hours for 1D, 30 points for other timeframes
    const data: PriceDataPoint[] = [];
    
    // Base price (₹10.25 as seen in the image)
    const basePrice = 10.16; // Initial price will be 10.16 to match with design
    const targetLastPrice = 10.25; // End price will be 10.25 showing +12.3% increase from earlier
    
    // Generate data with a clear upward trend (matching +12.3% in the image)
    for (let i = 0; i < numPoints; i++) {
      const pointDate = new Date(startDate.getTime() + ((endDate.getTime() - startDate.getTime()) / numPoints) * i);
      
      // Create a smooth uptrend with some variation
      const progressFactor = i / numPoints; // 0 to 1 based on position
      
      // Base progression from start to end price
      const priceDiff = targetLastPrice - basePrice;
      const progressivePrice = basePrice + (priceDiff * progressFactor);
      
      // Sinusoidal variation to create waves in the graph
      const waveAmplitude = 0.15; // Smaller amplitude for more natural look
      const waveFactor = Math.sin(i / (numPoints / 8) * Math.PI) * waveAmplitude;
      
      // Small random noise for natural look
      const noiseComponent = (Math.random() - 0.5) * 0.04;
      
      const price = progressivePrice + waveFactor + noiseComponent;
      
      data.push({
        date: pointDate.toISOString().split('T')[0],
        price: Number(price.toFixed(2))
      });
    }
    
    // Sort data by date
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Ensure exactly the right prices at start and end
    if (data.length > 0) {
      data[0].price = basePrice;
      data[data.length-1].price = targetLastPrice;
    }
    
    // Simulate API loading
    setTimeout(() => {
      setPriceData(data);
      setIsLoading(false);
    }, 300);
  }, [timeframe]);

  // Update dimensions when component mounts or window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.clientWidth,
          height: chartRef.current.clientHeight
        });
      }
    };

    // Initial update
    updateDimensions();

    // Listen for resize events
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Return min and max values for scaling
  const getMinMaxValues = () => {
    if (priceData.length === 0) return { min: 0, max: 0 };

    const prices = priceData.map(d => d.price);
    let min = Math.min(...prices);
    let max = Math.max(...prices);
    
    // Add some padding to the min/max for better visualization
    const range = max - min;
    const padding = range * 0.2;
    min = Math.max(0, min - padding * 0.5); // Less padding at bottom
    max = max + padding * 1.5; // More padding at top
    
    return { min, max };
  };

  // Generate the path for the chart line
  const generatePath = () => {
    if (priceData.length === 0 || dimensions.width === 0) return '';
    
    const { min, max } = getMinMaxValues();
    const height = dimensions.height - 20; // More padding for better visibility
    const width = dimensions.width - 10; // Subtract some padding
    
    return priceData.map((point, i) => {
      const x = (i / (priceData.length - 1)) * width + 5; // Add 5px padding
      const y = height - ((point.price - min) / (max - min)) * height + 10; // Add 10px padding
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  // Generate the path for the area under the chart
  const generateAreaPath = () => {
    if (priceData.length === 0 || dimensions.width === 0) return '';
    
    const { min, max } = getMinMaxValues();
    const height = dimensions.height - 20;
    const width = dimensions.width - 10;
    
    let path = priceData.map((point, i) => {
      const x = (i / (priceData.length - 1)) * width + 5;
      const y = height - ((point.price - min) / (max - min)) * height + 10;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
    
    // Complete the path to form a closed shape for filling
    const lastX = width + 5;
    const firstX = 5;
    path += ` L ${lastX},${height + 10} L ${firstX},${height + 10} Z`;
    
    return path;
  };

  // Determine if the price trend is positive
  const isPriceUp = () => {
    if (priceData.length < 2) return true;
    
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    
    return lastPrice >= firstPrice;
  };

  // Generate price tooltip points
  const generatePricePoints = () => {
    if (priceData.length < 5) return [];
    
    // Only show a few points to avoid clutter
    const pointsToShow = 6;
    const step = Math.floor(priceData.length / pointsToShow);
    const result = [];
    
    for (let i = 0; i < priceData.length; i += step) {
      if (result.length < pointsToShow && i < priceData.length) {
        result.push(priceData[i]);
      }
    }
    
    // Always include the last point
    if (!result.includes(priceData[priceData.length - 1])) {
      result.pop(); // Remove last one
      result.push(priceData[priceData.length - 1]); // Add the actual last price point
    }
    
    return result;
  };

  // Draw price data points for the selected points
  const drawDataPoints = () => {
    if (priceData.length === 0 || dimensions.width === 0) return null;
    
    const { min, max } = getMinMaxValues();
    const height = dimensions.height - 20;
    const width = dimensions.width - 10;
    
    const dataPoints = generatePricePoints();
    
    return dataPoints.map((point, index) => {
      const i = priceData.indexOf(point);
      const x = (i / (priceData.length - 1)) * width + 5;
      const y = height - ((point.price - min) / (max - min)) * height + 10;
      
      return (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="3.5"
            fill={isDarkMode ? '#1F2937' : 'white'}
            stroke="#6366F1"
            strokeWidth="2"
          />
          {/* Optional label above the dot
          <text
            x={x}
            y={y - 8}
            textAnchor="middle"
            fill={isDarkMode ? "#D1D5DB" : "#6B7280"}
            fontSize="8"
            fontWeight="medium"
          >
            ₹{point.price}
          </text> */}
        </g>
      );
    });
  };

  // Generate horizontal grid lines
  const generateGridLines = () => {
    const { min, max } = getMinMaxValues();
    const height = dimensions.height - 20;
    const width = dimensions.width - 10;
    
    // Create 4 evenly spaced grid lines
    const lines = 4;
    const gridLines = [];
    
    for (let i = 0; i <= lines; i++) {
      const y = height * (i / lines) + 10;
      // Value at this grid line (rounded to 2 decimal places)
      const value = max - ((max - min) * (i / lines));
      
      gridLines.push(
        <line
          key={`grid-${i}`}
          x1="5"
          y1={y}
          x2={width + 5}
          y2={y}
          stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="1"
        />
      );
    }
    
    return gridLines;
  };

  // Generate vertical grid lines
  const generateVerticalGridLines = () => {
    const width = dimensions.width - 10;
    const height = dimensions.height - 20;
    
    // Create 6 vertical grid lines
    const lines = 6;
    const gridLines = [];
    
    for (let i = 0; i <= lines; i++) {
      const x = width * (i / lines) + 5;
      
      gridLines.push(
        <line
          key={`vgrid-${i}`}
          x1={x}
          y1="10"
          x2={x}
          y2={height + 10}
          stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="1"
        />
      );
    }
    
    return gridLines;
  };

  return (
    <div className={`w-full h-full ${isLoading ? 'opacity-70' : ''}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="h-full">
          <div className="h-full w-full relative" ref={chartRef} style={{ minHeight: '200px' }}>
            <svg width="100%" height="100%" className="relative z-10">
              {/* Grid lines */}
              <g className="grid-lines">
                {generateGridLines()}
                {generateVerticalGridLines()}
              </g>
              
              {/* Chart gradient background */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop 
                    offset="0%" 
                    stopColor="#6366F1" 
                    stopOpacity="0.2" 
                  />
                  <stop 
                    offset="100%" 
                    stopColor="#6366F1" 
                    stopOpacity="0" 
                  />
                </linearGradient>
              </defs>
              
              {/* Area under the line */}
              <path
                d={generateAreaPath()}
                fill="url(#areaGradient)"
                className="transition-all duration-300 ease-in-out"
              />
              
              {/* Main line */}
              <path
                d={generatePath()}
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 ease-in-out"
              />
              
              {/* Data points */}
              {drawDataPoints()}
              
              {/* Current price dot */}
              {priceData.length > 0 && (
                <circle
                  cx={(dimensions.width - 10) + 5}
                  cy={dimensions.height - 20 - ((priceData[priceData.length - 1].price - getMinMaxValues().min) / (getMinMaxValues().max - getMinMaxValues().min)) * (dimensions.height - 20) + 10}
                  r="4"
                  fill="#6366F1"
                  className="transition-all duration-300 ease-in-out"
                />
              )}
            </svg>
          </div>
          
          {/* Small price indicator at the start of the graph */}
          {priceData.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">₹{priceData[0].price.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 