'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  isDarkMode?: boolean;
  height?: number;
  barColor?: string | string[];
  borderColor?: string | string[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  isDarkMode = false,
  height = 300,
  barColor = 'rgba(79, 70, 229, 0.8)',
  borderColor = 'rgba(79, 70, 229, 1)'
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);

    // Create colors array if barColor or borderColor is not an array
    const backgroundColor = Array.isArray(barColor) ? barColor : Array(data.length).fill(barColor);
    const borderColors = Array.isArray(borderColor) ? borderColor : Array(data.length).fill(borderColor);

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: values,
            backgroundColor,
            borderColor: borderColors,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 'flex',
            maxBarThickness: 40
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: !!title,
            position: 'top',
            labels: {
              color: isDarkMode ? '#e5e7eb' : '#374151'
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDarkMode ? '#e5e7eb' : '#111827',
            bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.8)',
            borderWidth: 1,
            padding: 10,
            displayColors: false
          }
        },
        scales: {
          x: {
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            ticks: {
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)'
            }
          },
          y: {
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            ticks: {
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)'
            },
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, xAxisLabel, yAxisLabel, isDarkMode, barColor, borderColor]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart; 