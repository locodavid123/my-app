import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usar stemmer en español
const classifier = new natural.BayesClassifier(natural.PorterStemmerEs);

// Ejemplos positivos
classifier.addDocument('Excelente producto, me encanta', 'positive');
classifier.addDocument('Muy buena calidad, lo recomiendo', 'positive');
classifier.addDocument('Es asombroso y funciona perfecto', 'positive');
classifier.addDocument('Estoy muy feliz con esta compra', 'positive');
classifier.addDocument('Maravilloso, superó mis expectativas', 'positive');
classifier.addDocument('Qué buen trabajo, me gusta mucho', 'positive');
classifier.addDocument('Excelente servicio, muy rápido', 'positive');
classifier.addDocument('bueno', 'positive');
classifier.addDocument('buena', 'positive');
classifier.addDocument('genial', 'positive');
classifier.addDocument('fantástico', 'positive');
classifier.addDocument('increíble', 'positive');
classifier.addDocument('hermoso', 'positive');
classifier.addDocument('me fascina', 'positive');
classifier.addDocument('perfecto', 'positive');
classifier.addDocument('satisfecho', 'positive');

// Ejemplos negativos
classifier.addDocument('Terrible calidad, se rompió rápido', 'negative');
classifier.addDocument('No me gusta, es un mal producto', 'negative');
classifier.addDocument('Pésimo servicio, muy decepcionado', 'negative');
classifier.addDocument('No lo recomiendo para nada', 'negative');
classifier.addDocument('Una pérdida de dinero, es basura', 'negative');
classifier.addDocument('Horrible, me arrepiento de comprarlo', 'negative');
classifier.addDocument('Llegó roto y defectuoso', 'negative');
classifier.addDocument('malo', 'negative');
classifier.addDocument('mala', 'negative');
classifier.addDocument('mal', 'negative');
classifier.addDocument('pésimo', 'negative');
classifier.addDocument('terrible', 'negative');
classifier.addDocument('odio', 'negative');
classifier.addDocument('venganza', 'negative');
classifier.addDocument('triste', 'negative');
classifier.addDocument('decepción', 'negative');
classifier.addDocument('asqueroso', 'negative');
classifier.addDocument('la comida esta mala', 'negative');
classifier.addDocument('peor', 'negative');

// Ejemplos neutrales
classifier.addDocument('Es aceptable, cumple su función', 'neutral');
classifier.addDocument('No está mal, pero podría ser mejor', 'neutral');
classifier.addDocument('Producto promedio, nada especial', 'neutral');
classifier.addDocument('Llegó bien, es lo que esperaba', 'neutral');
classifier.addDocument('Ok, funciona de manera normal', 'neutral');
classifier.addDocument('Normal, ni fu ni fa', 'neutral');
classifier.addDocument('Lo uso a diario', 'neutral');
classifier.addDocument('regular', 'neutral');
classifier.addDocument('promedio', 'neutral');
classifier.addDocument('está ok', 'neutral');
classifier.addDocument('aceptable', 'neutral');
classifier.addDocument('ni bien ni mal', 'neutral');

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
        console.log('✅ Modelo entrenado con éxito.');
        console.log('✅ Archivo guardado en:', outputPath);
    }
});
