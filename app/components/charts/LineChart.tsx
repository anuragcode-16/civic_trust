'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
}

interface LineChartProps {
  labels: string[];
  datasets: Dataset[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  isDarkMode?: boolean;
  height?: number;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  labels,
  datasets,
  title = '',
  xAxisLabel = '',
  yAxisLabel = '',
  isDarkMode = false,
  height = 300,
  showLegend = true
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const defaultColors = [
    'rgba(79, 70, 229, 1)',   // Indigo
    'rgba(59, 130, 246, 1)',  // Blue
    'rgba(16, 185, 129, 1)',  // Green
    'rgba(239, 68, 68, 1)',   // Red
    'rgba(245, 158, 11, 1)',  // Amber
    'rgba(139, 92, 246, 1)',  // Purple
    'rgba(236, 72, 153, 1)'   // Pink
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare datasets
    const chartDatasets = datasets.map((dataset, index) => {
      const borderColor = dataset.borderColor || defaultColors[index % defaultColors.length];
      const backgroundColor = dataset.backgroundColor || borderColor.replace('1)', '0.1)');
      return {
        label: dataset.label,
        data: dataset.data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
        pointBackgroundColor: borderColor,
        pointBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
        pointHoverBackgroundColor: borderColor,
        pointHoverBorderColor: borderColor,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: dataset.fill !== undefined ? dataset.fill : true
      };
    });

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: chartDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!title,
            text: title,
            color: isDarkMode ? '#e5e7eb' : '#374151',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: showLegend,
            position: 'top',
            labels: {
              color: isDarkMode ? '#e5e7eb' : '#374151',
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: isDarkMode ? '#e5e7eb' : '#111827',
            bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
            borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.8)',
            borderWidth: 1,
            padding: 10,
            boxPadding: 3
          }
        },
        scales: {
          x: {
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: isDarkMode ? '#e5e7eb' : '#374151',
              padding: {
                top: 10
              }
            },
            ticks: {
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)',
              tickLength: 8
            }
          },
          y: {
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: isDarkMode ? '#e5e7eb' : '#374151',
              padding: {
                bottom: 10
              }
            },
            ticks: {
              color: isDarkMode ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(203, 213, 225, 0.5)'
            },
            beginAtZero: true
          }
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, datasets, title, xAxisLabel, yAxisLabel, isDarkMode, showLegend]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart; 