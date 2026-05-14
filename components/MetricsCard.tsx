'use client';

import React from 'react';
import { AnalysisMetrics } from '@/lib/types';
import { 
  ChartBarIcon, 
  FaceSmileIcon, 
  FaceFrownIcon, 
  ScaleIcon, 
  SparklesIcon 
} from '@heroicons/react/24/solid';

interface MetricsCardProps {
  metrics: AnalysisMetrics;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  metrics 
}) => {
  const accuracy = metrics.accuracy > 0 ? metrics.accuracy : 0;

  const cards = [
    {
      label: 'Total Procesados',
      value: metrics.totalComments,
      icon: <ChartBarIcon className="w-6 h-6 text-white" />,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
    },
    {
      label: 'Positivos',
      value: metrics.positive,
      percentage: metrics.positivePercentage.toFixed(1),
      icon: <FaceSmileIcon className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      label: 'Negativos',
      value: metrics.negative,
      percentage: metrics.negativePercentage.toFixed(1),
      icon: <FaceFrownIcon className="w-6 h-6 text-rose-500" />,
      bgColor: 'bg-gradient-to-br from-rose-500 to-red-600',
    },
    {
      label: 'Neutrales',
      value: metrics.neutral,
      percentage: metrics.neutralPercentage.toFixed(1),
      icon: <ScaleIcon className="w-6 h-6 text-slate-500" />,
      bgColor: 'bg-gradient-to-br from-slate-500 to-slate-700',
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: <SparklesIcon className="w-6 h-6 text-violet-500" />,
      bgColor: 'bg-gradient-to-br from-violet-500 to-purple-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300"
        >
          {/* Resplandor decorativo (Light) */}
          <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-[50px] opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500 ${card.bgColor}`} />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${card.bgColor} bg-opacity-[0.15] border border-white shadow-sm text-2xl`}>
              {card.icon}
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-1">
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-slate-500 transition-colors">
              {card.label}
            </p>
            <div className="text-4xl font-black text-slate-800 tracking-tight">
              {card.value}
            </div>
            {card.percentage && (
              <div className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${card.bgColor} shadow-sm`} />
                {card.percentage}% del total
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
