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
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
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
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleManualInput = async () => {
    const text = prompt('Enter a comment:');
    if (text) {
      setIsUploading(true);
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
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
      
      <h2 className="text-lg md:text-xl font-extrabold mb-6 text-slate-800 flex items-center gap-3">
        <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </span>
        Ingesta de Datos
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isLoading}
          className="group flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white rounded-2xl transition-all duration-300 active:scale-[0.98] font-bold shadow-lg shadow-indigo-600/30 border border-indigo-400/20"
        >
          {isUploading || isLoading ? (
            <span className="animate-pulse flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Procesando...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              Subir Archivo CSV
            </>
          )}
        </button>
        
        <button
          onClick={handleManualInput}
          disabled={isUploading || isLoading}
          className="group flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-2xl transition-all duration-300 active:scale-[0.98] font-bold border border-slate-200 shadow-sm"
        >
          <svg className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Ingreso Manual
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <p className="mt-5 text-xs text-slate-500 font-medium tracking-wide">
        FORMATO REQUERIDO: CSV con columna base <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">comment</span>, <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">text</span> o <span className="text-indigo-700 px-2 py-0.5 bg-indigo-500/10 rounded font-mono">message</span>
      </p>
    </div>
  );
};
