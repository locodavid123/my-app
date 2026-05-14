import { NextResponse } from 'next/server';
import { readComments } from '@/lib/utils/storage';
import { calculateMetrics, getModelAccuracy } from '@/lib/ml/sentiment-analyzer';

export async function GET() {
  try {
    const comments = await readComments();
    const accuracy = await getModelAccuracy();
    const accuracyPercent = accuracy > 0 ? Math.round(accuracy * 100) : 0;

    if (comments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalComments: 0,
          positive: 0,
          negative: 0,
          neutral: 0,
          positivePercentage: 0,
          negativePercentage: 0,
          neutralPercentage: 0,
          averageScore: 0,
          processingTime: 0,
          accuracy: accuracyPercent,
        },
      });
    }

    const metrics = calculateMetrics(comments);
    metrics.accuracy = accuracyPercent;

    return NextResponse.json({
      success: true,
      data: {
        ...metrics,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Error fetching metrics' },
      { status: 500 }
    );
  }
}
