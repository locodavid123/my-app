import * as fs from 'fs';
import * as path from 'path';
import { Comment, AnalysisResult } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const ANALYSIS_FILE = path.join(DATA_DIR, 'analysis.json');

/**
 * Asegura que el directorio de datos existe
 */
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Lee comentarios del almacenamiento
 */
export function readComments(): Comment[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(COMMENTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading comments:', error);
    return [];
  }
}

/**
 * Guarda comentarios en almacenamiento
 */
export function saveComments(comments: Comment[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error saving comments:', error);
  }
}

/**
 * Añade nuevos comentarios
 */
export function addComments(newComments: Comment[]): Comment[] {
  const existing = readComments();
  const combined = [...existing, ...newComments];
  saveComments(combined);
  return combined;
}

/**
 * Lee el último análisis
 */
export function readLastAnalysis(): AnalysisResult | null {
  try {
    ensureDataDir();
    if (!fs.existsSync(ANALYSIS_FILE)) {
      return null;
    }
    const data = fs.readFileSync(ANALYSIS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analysis:', error);
    return null;
  }
}

/**
 * Guarda análisis
 */
export function saveAnalysis(analysis: AnalysisResult): void {
  try {
    ensureDataDir();
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

/**
 * Limpia todos los datos
 */
export function clearAllData(): void {
  try {
    ensureDataDir();
    if (fs.existsSync(COMMENTS_FILE)) {
      fs.unlinkSync(COMMENTS_FILE);
    }
    if (fs.existsSync(ANALYSIS_FILE)) {
      fs.unlinkSync(ANALYSIS_FILE);
    }
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
