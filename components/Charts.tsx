'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { AnalysisMetrics } from '@/lib/types';

interface ChartsProps {
  metrics: AnalysisMetrics;
}

export const Charts: React.FC<ChartsProps> = ({ metrics }) => {
  const sentimentData = [
    { name: 'Positivos', value: metrics.positive, fill: '#A7F3D0' },
    { name: 'Negativos', value: metrics.negative, fill: '#FECACA' },
    { name: 'Neutrales', value: metrics.neutral, fill: '#E5E7EB' },
  ];

  const percentageData = [
    { name: 'Positivos', value: metrics.positivePercentage, fill: '#A7F3D0' },
    { name: 'Negativos', value: metrics.negativePercentage, fill: '#FECACA' },
    { name: 'Neutrales', value: metrics.neutralPercentage, fill: '#E5E7EB' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Pie Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
          📊 Distribución de Sentimientos
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sentimentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">
          📈 Porcentaje por Sentimiento
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={percentageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {percentageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
