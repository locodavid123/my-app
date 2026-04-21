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
  accuracy?: number;
}

export interface AnalysisResult {
  comments: Comment[];
  metrics: AnalysisMetrics;
}
