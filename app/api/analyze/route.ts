import { NextRequest, NextResponse } from 'next/server';
import { classifySentiment, normalizeText } from '@/lib/ml/sentiment-analyzer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Se requiere un texto válido' },
        { status: 400 }
      );
    }

    const normalizedText = normalizeText(body.text);
    const result = await classifySentiment(normalizedText);

    return NextResponse.json({
      success: true,
      data: {
        text: body.text,
        normalizedText,
        sentiment: result.sentiment,
        score: result.score,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in POST /api/analyze:', error);
    return NextResponse.json(
      { success: false, error: 'Error analyzing text' },
      { status: 500 }
    );
  }
}
