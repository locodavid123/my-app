'use client';

import React, { useRef } from 'react';

interface FileUploadProps {
  onFileChange: (data: any[]) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv }),
        });

        if (!response.ok) throw new Error('Upload failed');
        
        const result = await response.json();
        onFileChange(result.data);
      } catch (error) {
        alert('Error uploading file');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const handleManualInput = async () => {
    const text = prompt('Enter a comment:');
    if (text) {
      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comments: [text] }),
        });

        if (!response.ok) throw new Error('Failed');
        const result = await response.json();
        onFileChange(result.data);
      } catch (error) {
        alert('Error adding comment');
      }
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        📁 Cargar Comentarios
      </h2>
      
      <div className="flex gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-400 text-white rounded-xl transition-all active:scale-95 font-bold shadow-lg hover:shadow-sky-500/30"
        >
          {isLoading ? '⏳ Cargando...' : '📤 Cargar CSV'}
        </button>
        
        <button
          onClick={handleManualInput}
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-400 text-white rounded-xl transition-all active:scale-95 font-bold shadow-lg hover:shadow-emerald-500/30"
        >
          ✏️ Agregar Manual
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        💡 El CSV debe tener una columna llamada: comment, text, content o message
      </p>
    </div>
  );
};
