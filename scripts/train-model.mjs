import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const classifier = new natural.BayesClassifier(natural.PorterStemmerEs);

const trainData = [
  // POSITIVOS
  { text: 'Excelente producto, me encanta', label: 'positive' },
  { text: 'Muy buena calidad, lo recomiendo', label: 'positive' },
  { text: 'Es asombroso y funciona perfecto', label: 'positive' },
  { text: 'Estoy muy feliz con esta compra', label: 'positive' },
  { text: 'Maravilloso, superó mis expectativas', label: 'positive' },
  { text: 'Qué buen trabajo, me gusta mucho', label: 'positive' },
  { text: 'Excelente servicio, muy rápido', label: 'positive' },
  { text: 'bueno buena genial fantástico increíble hermoso', label: 'positive' },
  { text: 'me fascina perfecto satisfecho', label: 'positive' },
  { text: 'absolutamente fantástico', label: 'positive' },
  { text: '¡Este producto es increíble! Me encanta muchísimo', label: 'positive' },
  { text: 'La mejor compra que he hecho', label: 'positive' },
  { text: 'Excelente atención al cliente', label: 'positive' },
  { text: 'lo recomendaría a mis amigos', label: 'positive' },
  { text: '¡Perfecto! Exactamente lo que necesitaba', label: 'positive' },
  { text: 'Me gusta mucho el diseño, es muy elegante', label: 'positive' },
  { text: 'Estoy enamorado de este artículo, lo uso a diario', label: 'positive' },
  { text: 'El envío fue súper rápido, estoy satisfecho', label: 'positive' },
  { text: 'Fantástico, superó todas mis expectativas', label: 'positive' },
  { text: 'Buena relación calidad-precio, estoy conforme', label: 'positive' },
  { text: 'Me encanta la textura y los materiales son buenos', label: 'positive' },
  { text: 'Es tal cual se describe en la página, muy bien', label: 'positive' },
  { text: 'Increíble rendimiento, funciona a la perfección', label: 'positive' },
  { text: 'Definitivamente volveré a comprar, excelente calidad', label: 'positive' },
  { text: 'El funcionamiento es muy intuitivo y rápido', label: 'positive' },
  { text: 'Estoy muy feliz con la compra, todo excelente', label: 'positive' },
  { text: 'Maravilloso, se lo recomendaré a toda mi familia', label: 'positive' },
  { text: 'Me llegó en perfectas condiciones, muy buen servicio', label: 'positive' },
  { text: 'Súper recomendado, es de las mejores compras del año', label: 'positive' },
  { text: 'El tamaño es perfecto y el material resistente', label: 'positive' },
  { text: 'Buen producto, lo uso en el trabajo y va bien', label: 'positive' },

  // NEGATIVOS
  { text: 'Terrible calidad, se rompió rápido', label: 'negative' },
  { text: 'No me gusta, es un mal producto', label: 'negative' },
  { text: 'Pésimo servicio, muy decepcionado', label: 'negative' },
  { text: 'No lo recomiendo para nada', label: 'negative' },
  { text: 'Una pérdida de dinero, es basura', label: 'negative' },
  { text: 'Horrible, me arrepiento de comprarlo', label: 'negative' },
  { text: 'Llegó roto y defectuoso', label: 'negative' },
  { text: 'malo mala mal pésimo terrible', label: 'negative' },
  { text: 'odio venganza triste decepción asqueroso peor', label: 'negative' },
  { text: 'la comida esta mala', label: 'negative' },
  { text: 'Terrible experiencia, una pérdida de dinero', label: 'negative' },
  { text: 'Muy decepcionado con la calidad', label: 'negative' },
  { text: 'Horrible, la peor decisión que pude tomar', label: 'negative' },
  { text: 'Asqueroso, odio esto', label: 'negative' },
  { text: 'Decepcionante y muy caro para lo que ofrece', label: 'negative' },
  { text: 'Pésima experiencia de principio a fin', label: 'negative' },
  { text: 'Se rompió al segundo día de uso, terrible', label: 'negative' },
  { text: 'Llegó roto y el vendedor no responde, pésimo servicio', label: 'negative' },
  { text: 'No sirve para nada, es una estafa completa', label: 'negative' },
  { text: 'Pésimo empaque, todo llegó aplastado', label: 'negative' },
  { text: 'Un completo desastre, no lo compren por favor', label: 'negative' },
  { text: 'No me gustó el color, es diferente al de la foto', label: 'negative' },
  { text: 'Malo, malo, malo. No pierdan su tiempo', label: 'negative' },
  { text: 'Basura total, se descompuso de inmediato', label: 'negative' },
  { text: 'Odio este producto, la peor marca de todas', label: 'negative' },
  { text: 'No funciona bien, se traba constantemente', label: 'negative' },
  { text: 'Un asco, huele raro y los acabados son pésimos', label: 'negative' },
  { text: 'Decepcionado, el manual es incomprensible', label: 'negative' },

  // NEUTRALES
  { text: 'Es aceptable, cumple su función', label: 'neutral' },
  { text: 'No está mal, pero podría ser mejor', label: 'neutral' },
  { text: 'Producto promedio, nada especial', label: 'neutral' },
  { text: 'Llegó bien, es lo que esperaba', label: 'neutral' },
  { text: 'Ok, funciona de manera normal', label: 'neutral' },
  { text: 'Normal, ni fu ni fa', label: 'neutral' },
  { text: 'Lo uso a diario', label: 'neutral' },
  { text: 'regular promedio aceptable', label: 'neutral' },
  { text: 'ni bien ni mal', label: 'neutral' },
  { text: 'Producto decente para el precio', label: 'neutral' },
  { text: 'Producto decente', label: 'neutral' },
  { text: 'Está bien, nada especial', label: 'neutral' },
  { text: 'Producto promedio, hace lo que dice', label: 'neutral' },
  { text: 'Cumple su función, pero podría ser mejor', label: 'neutral' },
  { text: 'Es un producto aceptable, no destaca', label: 'neutral' },
  { text: 'Más o menos, he visto mejores opciones en el mercado', label: 'neutral' },
  { text: 'Es regular, esperaba un poco más de este modelo', label: 'neutral' },
  { text: 'Todo bien por ahora, el producto es funcional', label: 'neutral' },
  { text: 'Normal, ni excelente ni terrible', label: 'neutral' },
  { text: 'No está mal, lo recomendaría a medias', label: 'neutral' },
  { text: 'Sorprendentemente bueno para ser tan económico', label: 'neutral' }, // Ambiguo, mejor como neutral
];

// Añadir todo al modelo
trainData.forEach(item => {
  classifier.addDocument(item.text, item.label);
});

console.log('Entrenando modelo de Machine Learning en Español (Naive Bayes)...');
classifier.train();

const outputDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const outputPath = path.join(outputDir, 'trained-model.json');

classifier.save(outputPath, function(err) {
    if (err) {
        console.error('Error al guardar el modelo:', err);
    } else {
        console.log('✅ Modelo entrenado con éxito. (Datos aumentados)');
        console.log('✅ Archivo guardado en:', outputPath);
    }
});
