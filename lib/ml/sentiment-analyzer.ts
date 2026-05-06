import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { Comment } from '../types';

let classifier: natural.BayesClassifier | null = null;

function loadClassifier() {
  if (classifier) return classifier;
  try {
    const modelPath = path.join(process.cwd(), 'data', 'trained-model.json');
    if (fs.existsSync(modelPath)) {
      const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      classifier = natural.BayesClassifier.restore(modelData, natural.PorterStemmerEs);
    } else {
      classifier = new natural.BayesClassifier(natural.PorterStemmerEs);
    }
  } catch (error) {
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

export function classifySentiment(
  text: string
): {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
} {
  const model = loadClassifier();
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let confidenceScore = 0;

  try {
    sentiment = model.classify(text) as 'positive' | 'negative' | 'neutral';
    const classifications = model.getClassifications(text);
    
    // La librería 'natural' devuelve probabilidades conjuntas muy pequeñas.
    // Para obtener un porcentaje de confianza real (0 a 1), normalizamos los valores:
    const totalValue = classifications.reduce((sum, c) => sum + c.value, 0);
    const topClassification = classifications.find(c => c.label === sentiment);
    
    confidenceScore = (totalValue > 0 && topClassification) ? (topClassification.value / totalValue) : 0;
  } catch (e) {
    console.error("Error en clasificación ML:", e);
  }

  // Asignar el score basado en el sentimiento y la confianza normalizada
  let score = 0;
  if (sentiment === 'positive') score = confidenceScore; // 0 a 1
  else if (sentiment === 'negative') score = -confidenceScore; // -1 a 0
  else score = 0; // Neutral es 0

  return {
    sentiment,
    score,
    confidence: confidenceScore,
  };
}

export function analyzeTexts(texts: string[]): Comment[] {
  return texts.map((text, index) => {
    const normalized = normalizeText(text);
    const { sentiment, score, confidence } = classifySentiment(normalized);

    return {
      id: `comment-${Date.now()}-${index}`,
      text,
      sentiment,
      score,
      confidence,
      timestamp: new Date().toISOString(),
    };
  });
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
  };
}
