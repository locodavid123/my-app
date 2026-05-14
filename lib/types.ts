export interface Comment {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  timestamp: string;
  source?: string;
}

export interface AnalysisMetrics {
  totalComments: number;
  positive: number;
  negative: number;
  neutral: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  averageScore: number;
  processingTime: number;
  accuracy: number;
}

export interface ModelMetrics {
  accuracy: number;
  totalTestSamples: number;
  correctPredictions: number;
  trainedAt: string;
  confusionMatrix: {
    positive: Record<string, number>;
    negative: Record<string, number>;
    neutral: Record<string, number>;
  };
  perClass: {
    positive: { precision: number; recall: number; f1: number };
    negative: { precision: number; recall: number; f1: number };
    neutral: { precision: number; recall: number; f1: number };
  };
}

export interface AnalysisResult {
  comments: Comment[];
  metrics: AnalysisMetrics;
}
