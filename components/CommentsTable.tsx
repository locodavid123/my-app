'use client';

import React, { useState } from 'react';
import { Comment } from '@/lib/types';

interface CommentsTableProps {
  comments: Comment[];
}

export const CommentsTable: React.FC<CommentsTableProps> = ({ comments }) => {
  const [sortBy, setSortBy] = useState<'score' | 'sentiment' | 'date'>('date');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

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

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      case 'neutral':
        return '😐';
      default:
        return '❓';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        💬 Comentarios Procesados
      </h3>

      {/* Controles */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filtrar:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          >
            <option value="all">Todos</option>
            <option value="positive">Positivos</option>
            <option value="negative">Negativos</option>
            <option value="neutral">Neutrales</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ordenar:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
          >
            <option value="date">Más Recientes</option>
            <option value="score">Por Score</option>
            <option value="sentiment">Por Sentimiento</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-end pb-2">
          Mostrando {sorted.length} de {comments.length} comentarios
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-300 dark:border-gray-600">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Sentimiento
              </th>
              <th className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Comentario
              </th>
              <th className="text-right px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Score
              </th>
              <th className="text-right px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Confianza
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No hay comentarios que mostrar
                </td>
              </tr>
            ) : (
              sorted.map((comment) => (
                <tr
                  key={comment.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSentimentColor(
                        comment.sentiment
                      )}`}
                    >
                      {getSentimentEmoji(comment.sentiment)} {comment.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100 max-w-xs truncate">
                    {comment.text}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                    {comment.score.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mx-auto">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${comment.confidence * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
