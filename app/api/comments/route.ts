import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import { readComments, addComments, saveAnalysis, clearAllData } from '@/lib/utils/storage';
import { analyzeTexts, calculateMetrics, getModelAccuracy } from '@/lib/ml/sentiment-analyzer';
import { Comment } from '@/lib/types';
import { CSV_TEXT_COLUMNS, MAX_CSV_SIZE_MB } from '@/lib/constants';

const MAX_CSV_SIZE_BYTES = MAX_CSV_SIZE_MB * 1024 * 1024;

export async function GET() {
  try {
    const comments = await readComments();
    return NextResponse.json({
      success: true,
      data: comments,
      count: comments.length,
    });
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
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
      // Validar tamaño del CSV en el servidor
      if (body.csv.length > MAX_CSV_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `El archivo CSV excede el tamaño máximo de ${MAX_CSV_SIZE_MB}MB` },
          { status: 400 }
        );
      }

      const results = parse(body.csv, {
        header: true,
        skipEmptyLines: true,
      });

      const textColumn = Object.keys(results.data[0] || {}).find((key) =>
        CSV_TEXT_COLUMNS.includes(key.toLowerCase())
      );

      if (!textColumn) {
        return NextResponse.json(
          { success: false, error: 'No se encontró columna de texto en el CSV' },
          { status: 400 }
        );
      }

      const texts = results.data.map((row: Record<string, unknown>) => row[textColumn]).filter(Boolean) as string[];
      const start = Date.now();
      commentsToAdd = await analyzeTexts(texts);
      processingTimeMs = Date.now() - start;
    }

    if (body.comments && Array.isArray(body.comments)) {
      const texts = body.comments.filter(Boolean);
      const start = Date.now();
      commentsToAdd = await analyzeTexts(texts);
      processingTimeMs = Date.now() - start;
    }

    if (commentsToAdd.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay comentarios para procesar' },
        { status: 400 }
      );
    }

    const allComments = await addComments(commentsToAdd);

    const freshMetrics = calculateMetrics(allComments);
    const accuracy = await getModelAccuracy();
    freshMetrics.processingTime = processingTimeMs;
    freshMetrics.accuracy = accuracy > 0 ? Math.round(accuracy * 100) : 0;

    await saveAnalysis({
      comments: allComments,
      metrics: freshMetrics,
    });

    return NextResponse.json({
      success: true,
      message: `Se agregaron ${commentsToAdd.length} comentarios`,
      totalComments: allComments.length,
      newComments: commentsToAdd.length,
      data: allComments,
      metrics: freshMetrics,
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
    await clearAllData();
    return NextResponse.json({
      success: true,
      message: 'Todos los datos han sido eliminados',
    });
  } catch (error) {
    console.error('Error in DELETE /api/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Error limpiando datos' },
      { status: 500 }
    );
  }
}
