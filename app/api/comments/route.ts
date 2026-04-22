import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import { readComments, addComments } from '@/lib/utils/storage';
import { analyzeTexts } from '@/lib/ml/sentiment-analyzer';

/**
 * GET /api/comments - Obtiene todos los comentarios
 */
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

/**
 * POST /api/comments - Carga comentarios desde CSV o JSON
 * Body esperado:
 * - csv: string (contenido del archivo CSV)
 * - comments: string[] (array de textos)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let commentsToAdd = [];

    // Procesar CSV
    if (body.csv) {
      const results = parse(body.csv, {
        header: true,
        skipEmptyLines: true,
      });

      // Buscar columnas comunes: 'comment', 'text', 'content', 'message'
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
      commentsToAdd = analyzeTexts(texts);
    }

    // Procesar array de comentarios
    if (body.comments && Array.isArray(body.comments)) {
      const texts = body.comments.filter(Boolean);
      commentsToAdd = analyzeTexts(texts);
    }

    if (commentsToAdd.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay comentarios para procesar' },
        { status: 400 }
      );
    }

    // Guardar
    const allComments = addComments(commentsToAdd);

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

/**
 * DELETE /api/comments - Limpia todos los comentarios
 */
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
