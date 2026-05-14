'use client';

import React, { useRef } from 'react';
import { Comment, AnalysisMetrics } from '@/lib/types';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface FileUploadProps {
  onFileChange: (data: Comment[], metrics: AnalysisMetrics) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [manualText, setManualText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 6000);
  };

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar extensión
    if (!file.name.toLowerCase().endsWith('.csv')) {
      showError('El archivo debe tener extensión .csv');
      clearFileInput();
      return;
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showError(`El archivo excede el tamaño máximo de ${MAX_FILE_SIZE_MB}MB`);
      clearFileInput();
      return;
    }

    // Validar archivo vacío
    if (file.size === 0) {
      showError('El archivo está vacío');
      clearFileInput();
      return;
    }

    setError(null);
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;

      // Validar que no sea solo cabecera
      const lines = csv.trim().split('\n');
      if (lines.length < 2) {
        showError('El CSV no contiene datos, solo tiene cabecera');
        setIsUploading(false);
        clearFileInput();
        return;
      }

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          showError(result.error || 'Error al procesar el archivo');
          setIsUploading(false);
          clearFileInput();
          return;
        }

        onFileChange(result.data, result.metrics);
      } catch {
        showError('Error de conexión al subir el archivo');
      } finally {
        setIsUploading(false);
        clearFileInput();
      }
    };
    reader.onerror = () => {
      showError('Error al leer el archivo. Verifique que sea un CSV válido.');
      setIsUploading(false);
      clearFileInput();
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    setError(null);
    setIsUploading(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: [manualText] }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        showError(result.error || 'Error al analizar el comentario');
        setIsUploading(false);
        return;
      }

      onFileChange(result.data, result.metrics);
      setManualText('');
    } catch {
      showError('Error de conexión al analizar el comentario');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

      <h2 className="text-lg md:text-xl font-extrabold mb-6 text-slate-800 flex items-center gap-3 relative z-10">
        <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </span>
        Ingesta de Datos
      </h2>

      {/* Error Banner */}
      {error && (
        <div className="relative z-10 mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-6 relative z-10">
        {/* Upload CSV */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-wait text-white rounded-2xl transition-all duration-300 active:scale-[0.98] font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/20"
          >
            {isUploading ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="animate-pulse">Procesando archivo...</span>
              </span>
            ) : (
              <>
                <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                Subir Archivo CSV
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 font-medium tracking-wide text-center mt-1">
            FORMATO REQUERIDO: CSV con columna <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">comment</span>, <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">text</span> o <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">message</span> | Máx: {MAX_FILE_SIZE_MB}MB
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200/80"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">o ingreso manual</span>
          <div className="flex-1 h-px bg-slate-200/80"></div>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Escribe un comentario aquí..."
            disabled={isUploading}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-white/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={!manualText.trim() || isUploading}
            className="px-6 py-3 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 text-indigo-600 rounded-2xl transition-all duration-300 font-bold border border-slate-200 shadow-sm flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            {isUploading ? (
              <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <span>Analizar</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
