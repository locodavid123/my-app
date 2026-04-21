'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { MetricsCard } from '@/components/MetricsCard';
import { Charts } from '@/components/Charts';
import { CommentsTable } from '@/components/CommentsTable';
import { Comment, AnalysisMetrics } from '@/lib/types';

const DEFAULT_METRICS: AnalysisMetrics = {
  totalComments: 0,
  positive: 0,
  negative: 0,
  neutral: 0,
  positivePercentage: 0,
  negativePercentage: 0,
  neutralPercentage: 0,
  averageScore: 0,
  processingTime: 0,
};

export default function Home() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [metrics, setMetrics] = useState<AnalysisMetrics>(DEFAULT_METRICS);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [commentsRes, metricsRes] = await Promise.all([
        fetch('/api/comments'),
        fetch('/api/metrics'),
      ]);

      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData.data || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.data || DEFAULT_METRICS);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFileChange = async (newComments: Comment[]) => {
    setComments(newComments);
    // Recargar métricas después de agregar comentarios
    setTimeout(loadData, 500);
  };

  const handleClearData = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los datos?')) {
      fetch('/api/comments', { method: 'DELETE' })
        .then(() => {
          setComments([]);
          setMetrics(DEFAULT_METRICS);
        })
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🎯 Análisis de Sentimiento
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Plataforma escalable para análisis de comentarios
              </p>
            </div>
            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
            >
              🗑️ Limpiar Datos
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload */}
        <FileUpload onFileChange={handleFileChange} isLoading={isLoading} />

        {/* Metrics */}
        <MetricsCard metrics={metrics} accuracy={95} />

        {/* Charts */}
        {comments.length > 0 && <Charts metrics={metrics} />}

        {/* Comments Table */}
        <CommentsTable comments={comments} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 dark:text-gray-400">
          <p>
            💡 Proyecto de Análisis de Sentimiento | Big Data & NLP | 
            <span className="font-semibold"> Tecnologías: Next.js, React, Node.js, NLP</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
