import * as fs from 'fs/promises';
import * as path from 'path';
import { Comment, AnalysisResult } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const ANALYSIS_FILE = path.join(DATA_DIR, 'analysis.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function readComments(): Promise<Comment[]> {
  try {
    await ensureDataDir();
    await fs.access(COMMENTS_FILE);
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveComments(comments: Comment[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error saving comments:', error);
  }
}

export async function addComments(newComments: Comment[]): Promise<Comment[]> {
  const existing = await readComments();
  const combined = [...existing, ...newComments];
  await saveComments(combined);
  return combined;
}

export async function readLastAnalysis(): Promise<AnalysisResult | null> {
  try {
    await ensureDataDir();
    await fs.access(ANALYSIS_FILE);
    const data = await fs.readFile(ANALYSIS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function saveAnalysis(analysis: AnalysisResult): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(ANALYSIS_FILE, JSON.stringify(analysis, null, 2));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await ensureDataDir();
    await fs.unlink(COMMENTS_FILE).catch(() => {});
    await fs.unlink(ANALYSIS_FILE).catch(() => {});
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
