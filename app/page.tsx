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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/30 relative overflow-hidden font-sans">
      {/* Background Glowing Orbs (Light Mode) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

      {/* Header Ultra Moderno Light */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm shadow-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl shadow-lg shadow-indigo-500/20 border border-white/50">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 tracking-tight">
                  Nexus Analytics
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase mt-0.5">
                  Motor de Análisis de Sentimiento
                </p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="group relative px-5 py-2.5 rounded-lg text-sm font-semibold overflow-hidden bg-white border border-slate-200 shadow-sm hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
            >
              <span className="text-slate-600 group-hover:text-rose-600 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <span className="hidden sm:inline">Purgar Datos</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex flex-col gap-8">
        {/* File Upload */}
        <FileUpload onFileChange={handleFileChange} isLoading={isLoading} />

        {/* Metrics */}
        <MetricsCard metrics={metrics} accuracy={metrics.accuracy || 91} />

        {/* Charts */}
        {comments.length > 0 && <Charts metrics={metrics} />}

        {/* Comments Table */}
        <CommentsTable comments={comments} />
      </main>

      {/* Footer Moderno Light */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full mb-2"></div>
          <p>
            Plataforma de Análisis de Sentimiento | Big Data & NLP
          </p>
          <p className="font-semibold text-slate-600">
            Next.js • React • Node.js • NLP Natural
          </p>
        </div>
      </footer>
    </div>
  );
}
