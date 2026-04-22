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
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      shadowColor: 'shadow-blue-200',
    },
    {
      label: 'Positivos',
      value: metrics.positive,
      percentage: metrics.positivePercentage.toFixed(1),
      icon: '😊',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-200',
    },
    {
      label: 'Negativos',
      value: metrics.negative,
      percentage: metrics.negativePercentage.toFixed(1),
      icon: '😞',
      bgColor: 'bg-gradient-to-br from-rose-500 to-red-600',
      shadowColor: 'shadow-rose-200',
    },
    {
      label: 'Neutrales',
      value: metrics.neutral,
      percentage: metrics.neutralPercentage.toFixed(1),
      icon: '😐',
      bgColor: 'bg-gradient-to-br from-slate-500 to-slate-700',
      shadowColor: 'shadow-slate-200',
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: '✅',
      bgColor: 'bg-gradient-to-br from-violet-500 to-purple-700',
      shadowColor: 'shadow-violet-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bgColor} p-5 rounded-2xl shadow-lg ${card.shadowColor} transition-all hover:scale-105 hover:-translate-y-1 border border-white/10`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-2xl shadow-inner">
              {card.icon}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              {card.label}
            </p>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {card.value}
          </div>
          {card.percentage && (
            <div className="text-sm font-bold text-white/70 mt-1">
              {card.percentage}% del total
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
