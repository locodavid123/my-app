export const APP_NAME = 'Nexus Analytics';
export const APP_DESCRIPTION = 'Motor de Análisis de Sentimiento';
export const STORAGE_DIR = 'data';
export const COMMENTS_FILE = 'comments.json';
export const ANALYSIS_FILE = 'analysis.json';
export const MODEL_METRICS_FILE = 'model-metrics.json';

export const CSV_TEXT_COLUMNS = ['comment', 'text', 'content', 'message', 'comentario'];
export const MAX_CSV_SIZE_MB = 5;

export const SENTIMENT_LABELS = {
  positive: 'Positivo',
  negative: 'Negativo',
  neutral: 'Neutral',
} as const;
