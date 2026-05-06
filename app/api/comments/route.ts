import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import { readComments, addComments, readLastAnalysis, saveAnalysis } from '@/lib/utils/storage';
import { analyzeTexts, calculateMetrics } from '@/lib/ml/sentiment-analyzer';
import { Comment } from '@/lib/types';

export async function GET() {
  try {
    const comments = readComments();
    return NextResponse.json({
      success: true,
      data: comments,
      count: comments.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error fetching comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let commentsToAdd: Comment[] = [];
    let processingTimeMs = 0;

    if (body.csv) {
      const results = parse(body.csv, {
        header: true,
        skipEmptyLines: true,
      });

      const textColumn = Object.keys(results.data[0] || {}).find((key) =>
        ['comment', 'text', 'content', 'message', 'comentario'].includes(
          key.toLowerCase()
        )
      );

      if (!textColumn) {
        return NextResponse.json(
          { success: false, error: 'No se encontró columna de texto en el CSV' },
          { status: 400 }
        );
      }

      const texts = results.data.map((row: any) => row[textColumn]).filter(Boolean);
      const start = performance.now();
      commentsToAdd = analyzeTexts(texts);
      processingTimeMs = performance.now() - start;
    }

    if (body.comments && Array.isArray(body.comments)) {
      const texts = body.comments.filter(Boolean);
      const start = performance.now();
      commentsToAdd = analyzeTexts(texts);
      processingTimeMs = performance.now() - start;
    }

    if (commentsToAdd.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay comentarios para procesar' },
        { status: 400 }
      );
    }

    const allComments = addComments(commentsToAdd);
    
    // Guardar analysis con métricas de tiempo
    const prevAnalysis = readLastAnalysis();
    const prevTime = prevAnalysis?.metrics?.processingTime || 0;
    const newMetrics = calculateMetrics(allComments);
    newMetrics.processingTime = prevTime + processingTimeMs;

    saveAnalysis({
      comments: allComments,
      metrics: newMetrics,
    });

    return NextResponse.json({
      success: true,
      message: `Se agregaron ${commentsToAdd.length} comentarios`,
      totalComments: allComments.length,
      newComments: commentsToAdd.length,
      data: allComments,
    });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Error procesando comentarios' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { clearAllData } = await import('@/lib/utils/storage');
    clearAllData();
    return NextResponse.json({
      success: true,
      message: 'Todos los datos han sido eliminados',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error limpiando datos' },
      { status: 500 }
    );
  }
}
