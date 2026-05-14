'use client';

import React, { useState } from 'react';
import { Comment } from '@/lib/types';
import { FaceSmileIcon, FaceFrownIcon, ScaleIcon } from '@heroicons/react/24/solid';

const PAGE_SIZE = 25;

function getSentimentIcon(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return <FaceSmileIcon className="w-4 h-4 inline-block mr-1" />;
    case 'negative':
      return <FaceFrownIcon className="w-4 h-4 inline-block mr-1" />;
    case 'neutral':
      return <ScaleIcon className="w-4 h-4 inline-block mr-1" />;
    default:
      return null;
  }
}

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case 'positive':
      return 'bg-emerald-500 text-white shadow-sm shadow-emerald-200';
    case 'negative':
      return 'bg-rose-500 text-white shadow-sm shadow-rose-200';
    case 'neutral':
      return 'bg-slate-400 text-white shadow-sm shadow-slate-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

interface CommentsTableProps {
  comments: Comment[];
}

export const CommentsTable: React.FC<CommentsTableProps> = ({ comments }) => {
  const [sortBy, setSortBy] = useState<'score' | 'sentiment' | 'date'>('date');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [page, setPage] = useState(0);

  const filtered = comments.filter((c) => filter === 'all' || c.sentiment === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else if (sortBy === 'sentiment') {
      return a.sentiment.localeCompare(b.sentiment);
    } else {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const paginated = sorted.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const getSentimentIconFn = getSentimentIcon;
  const getSentimentColorFn = getSentimentColor;

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-400/5 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <h3 className="text-lg md:text-xl font-extrabold mb-6 text-slate-800 flex items-center gap-3 relative z-10">
        <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </span>
        Comentarios Procesados
      </h3>
      {/* Controles */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Filtrar:
          </label>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value as 'all' | 'positive' | 'negative' | 'neutral'); setPage(0); }}
            className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="all">Todos</option>
            <option value="positive">Positivos</option>
            <option value="negative">Negativos</option>
            <option value="neutral">Neutrales</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Ordenar:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'score' | 'sentiment' | 'date')}
            className="px-3 py-2 border border-slate-200 bg-white/80 text-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="date">Más Recientes</option>
            <option value="score">Por Score</option>
            <option value="sentiment">Por Sentimiento</option>
          </select>
        </div>

        <div className="text-sm font-medium text-slate-500 flex items-end pb-2">
          Mostrando {paginated.length} de {sorted.length} comentarios
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white/40 shadow-inner">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/50">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-slate-700">
                Sentimiento
              </th>
              <th className="text-left px-4 py-3 font-bold text-slate-700">
                Comentario
              </th>
              <th className="text-right px-4 py-3 font-bold text-slate-700">
                Score
              </th>
              <th className="text-right px-4 py-3 font-bold text-slate-700">
                Confianza
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500 font-medium">
                  No hay comentarios que mostrar
                </td>
              </tr>
            ) : (
              paginated.map((comment) => (
                <tr
                  key={comment.id}
                  className="border-b border-slate-100 hover:bg-white/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getSentimentColorFn(
                        comment.sentiment
                      )}`}
                    >
                      {getSentimentIconFn(comment.sentiment)} {comment.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-medium max-w-xs truncate">
                    {comment.text}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 font-semibold">
                    {comment.score.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden mx-auto shadow-inner border border-slate-300/50">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                        style={{ width: `${Math.round(comment.confidence * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            Página {safePage + 1} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
              disabled={safePage >= totalPages - 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
