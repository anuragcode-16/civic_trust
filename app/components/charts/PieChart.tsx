'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface DataPoint {
  label: string;
  value: number;
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  isDarkMode?: boolean;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  doughnut?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = '',
  isDarkMode = false,
  height = 300,
  showLegend = true,
  colors,
  doughnut = false
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Default colors
  const defaultColors = [
    'rgba(79, 70, 229, 0.8)',   // Indigo
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(16, 185, 129, 0.8)',  // Green
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(245, 158, 11, 0.8)',  // Amber
    'rgba(139, 92, 246, 0.8)',  // Purple
    'rgba(236, 72, 153, 0.8)'   // Pink
  ];

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
    const colorPalette = colors || defaultColors;
    const backgroundColors = data.map((_, i) => colorPalette[i % colorPalette.length]);
    const borderColors = backgroundColors.map(color => color.replace('0.8)', '1)'));

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: doughnut ? 'doughnut' : 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
            hoverOffset: 10
          }
        ]
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
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + (val as number), 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, title, isDarkMode, colors, doughnut, showLegend]);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default PieChart; 