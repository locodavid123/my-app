import natural from 'natural';
import { promises as fs } from 'fs';
import path from 'path';
import { Comment } from '../types';

let classifier: natural.BayesClassifier | null = null;

async function loadClassifier(): Promise<natural.BayesClassifier> {
  if (classifier) return classifier;
  try {
    const modelPath = path.join(process.cwd(), 'data', 'trained-model.json');
    await fs.access(modelPath);
    const modelData = JSON.parse(await fs.readFile(modelPath, 'utf8'));
    classifier = natural.BayesClassifier.restore(modelData, natural.PorterStemmerEs);
  } catch {
    classifier = new natural.BayesClassifier(natural.PorterStemmerEs);
  }
  return classifier;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

export async function classifySentiment(
  text: string
): Promise<{
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}> {
  const model = await loadClassifier();

  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidenceScore = 0;

  try {
    sentiment = model.classify(text) as 'positive' | 'negative' | 'neutral';
    const classifications = model.getClassifications(text);

    const totalValue = classifications.reduce((sum, c) => sum + c.value, 0);
    const topClassification = classifications.find(c => c.label === sentiment);

    confidenceScore = (totalValue > 0 && topClassification) ? (topClassification.value / totalValue) : 0;
  } catch (e) {
    console.error("Error en clasificación ML:", e);
  }

  let score = 0;
  if (sentiment === 'positive') score = confidenceScore;
  else if (sentiment === 'negative') score = -confidenceScore;

  return {
    sentiment,
    score,
    confidence: confidenceScore,
  };
}

export async function analyzeTexts(texts: string[]): Promise<Comment[]> {
  const results: Comment[] = [];
  for (let index = 0; index < texts.length; index++) {
    const normalized = normalizeText(texts[index]);
    const { sentiment, score, confidence } = await classifySentiment(normalized);

    results.push({
      id: `comment-${Date.now()}-${index}`,
      text: texts[index],
      sentiment,
      score,
      confidence,
      timestamp: new Date().toISOString(),
    });
  }
  return results;
}

export function calculateMetrics(comments: Comment[]) {
  const total = comments.length;
  const positive = comments.filter((c) => c.sentiment === 'positive').length;
  const negative = comments.filter((c) => c.sentiment === 'negative').length;
  const neutral = comments.filter((c) => c.sentiment === 'neutral').length;
  const averageScore = comments.reduce((sum, c) => sum + c.score, 0) / total || 0;

  return {
    totalComments: total,
    positive,
    negative,
    neutral,
    positivePercentage: total > 0 ? (positive / total) * 100 : 0,
    negativePercentage: total > 0 ? (negative / total) * 100 : 0,
    neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
    averageScore,
    processingTime: 0,
    accuracy: 0,
  };
}

export async function getModelAccuracy(): Promise<number> {
  try {
    const metricsPath = path.join(process.cwd(), 'data', 'model-metrics.json');
    await fs.access(metricsPath);
    const data = JSON.parse(await fs.readFile(metricsPath, 'utf8'));
    return data.accuracy ?? 0;
  } catch {
    return 0;
  }
}
