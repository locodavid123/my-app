import Sentiment from 'sentiment';
import { Comment } from '../types';

const sentiment = new Sentiment();

/**
 * Normaliza el texto para análisis
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Clasifica el sentimiento de un texto
 * Retorna: positive (score > 0), negative (score < 0), neutral (score = 0)
 */
export function classifySentiment(
  text: string
): {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
} {
  const result = sentiment.analyze(text);
  const normalizedScore = Math.min(Math.max(result.score / 10, -1), 1);

  let classification: 'positive' | 'negative' | 'neutral';
  if (result.score > 0) {
    classification = 'positive';
  } else if (result.score < 0) {
    classification = 'negative';
  } else {
    classification = 'neutral';
  }

  // Calcular confianza basada en la magnitud del score
  const confidence = Math.abs(normalizedScore);

  return {
    sentiment: classification,
    score: normalizedScore,
    confidence,
  };
}

/**
 * Analiza un array de textos
 */
export function analyzeTexts(texts: string[]): Comment[] {
  return texts.map((text, index) => {
    const normalized = normalizeText(text);
    const { sentiment: sentimentLabel, score, confidence } = classifySentiment(normalized);

    return {
      id: `comment-${Date.now()}-${index}`,
      text,
      sentiment: sentimentLabel,
      score,
      confidence,
      timestamp: new Date().toISOString(),
    };
  });
}

/**
 * Calcula métricas de un conjunto de comentarios
 */
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
    processingTime: 0, // Will be updated by API
  };
}
