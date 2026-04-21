'use client';

import React from 'react';
import { AnalysisMetrics } from '@/lib/types';

interface MetricsCardProps {
  metrics: AnalysisMetrics;
  accuracy?: number;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  metrics,
  accuracy = 95 
}) => {
  const cards = [
    {
      label: 'Total Procesados',
      value: metrics.totalComments,
      icon: '📊',
      color: 'bg-blue-50 dark:bg-blue-900',
    },
    {
      label: 'Positivos',
      value: metrics.positive,
      percentage: metrics.positivePercentage.toFixed(1),
      icon: '😊',
      color: 'bg-green-50 dark:bg-green-900',
    },
    {
      label: 'Negativos',
      value: metrics.negative,
      percentage: metrics.negativePercentage.toFixed(1),
      icon: '😞',
      color: 'bg-red-50 dark:bg-red-900',
    },
    {
      label: 'Neutrales',
      value: metrics.neutral,
      percentage: metrics.neutralPercentage.toFixed(1),
      icon: '😐',
      color: 'bg-gray-50 dark:bg-gray-800',
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: '✅',
      color: 'bg-purple-50 dark:bg-purple-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.color} p-4 rounded-lg shadow-md transition-transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{card.icon}</span>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {card.label}
            </p>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {card.value}
          </div>
          {card.percentage && (
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {card.percentage}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
