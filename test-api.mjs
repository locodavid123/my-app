/**
 * Script de Prueba de API
 * Ejecutar con: node test-api.mjs
 * 
 * Nota: Asegúrate de que el servidor esté corriendo en http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000';

// Datos de prueba
const testComments = [
  "I absolutely love this product! It's amazing!",
  "Terrible quality, very disappointed",
  "It's okay, nothing special",
  "Best purchase ever, highly recommend!",
  "Waste of money, don't buy it",
  "Average product, does the job",
  "Excellent service and fast delivery",
  "Horrible experience, never again",
  "Pretty good for the price",
  "I hate this so much",
  "Perfect! Exactly what I needed",
  "Disappointing and overpriced",
  "Fantastic support team!",
  "Complete disaster",
  "Decent, would buy again",
];

// Funciones de prueba
async function testAnalyzeEndpoint() {
  console.log('\n📌 Prueba 1: POST /api/analyze (Análisis Individual)');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: "I love this amazing product!" }),
    });
    
    const data = await response.json();
    console.log('✅ Éxito:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testUploadComments() {
  console.log('\n📌 Prueba 2: POST /api/comments (Cargar Comentarios)');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: testComments }),
    });
    
    const data = await response.json();
    console.log('✅ Éxito:');
    console.log(`   - Nuevos comentarios: ${data.newComments}`);
    console.log(`   - Total de comentarios: ${data.totalComments}`);
    console.log(`   - Mensaje: ${data.message}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testGetComments() {
  console.log('\n📌 Prueba 3: GET /api/comments (Obtener Comentarios)');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/api/comments`);
    const data = await response.json();
    
    console.log('✅ Éxito:');
    console.log(`   - Total de comentarios: ${data.count}`);
    
    if (data.data.length > 0) {
      console.log(`   - Primeros 3 comentarios:`);
      data.data.slice(0, 3).forEach((comment, i) => {
        console.log(`     ${i + 1}. "${comment.text.substring(0, 40)}..." → ${comment.sentiment}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testGetMetrics() {
  console.log('\n📌 Prueba 4: GET /api/metrics (Obtener Métricas)');
  console.log('─'.repeat(50));
  
  try {
    const response = await fetch(`${BASE_URL}/api/metrics`);
    const data = await response.json();
    
    const metrics = data.data;
    console.log('✅ Éxito:');
    console.log(`   📊 Total procesados: ${metrics.totalComments}`);
    console.log(`   😊 Positivos: ${metrics.positive} (${metrics.positivePercentage.toFixed(1)}%)`);
    console.log(`   😞 Negativos: ${metrics.negative} (${metrics.negativePercentage.toFixed(1)}%)`);
    console.log(`   😐 Neutrales: ${metrics.neutral} (${metrics.neutralPercentage.toFixed(1)}%)`);
    console.log(`   📈 Promedio Score: ${metrics.averageScore.toFixed(3)}`);
    console.log(`   ✅ Accuracy: ${metrics.accuracy}%`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testUploadCSV() {
  console.log('\n📌 Prueba 5: POST /api/comments con CSV');
  console.log('─'.repeat(50));
  
  try {
    const csvData = `comment
"This is absolutely fantastic!"
"I hate this product"
"It's neither good nor bad"`;

    const response = await fetch(`${BASE_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv: csvData }),
    });
    
    const data = await response.json();
    console.log('✅ Éxito:');
    console.log(`   - Nuevos comentarios: ${data.newComments}`);
    console.log(`   - Total: ${data.totalComments}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚀 INICIANDO PRUEBAS DE API');
  console.log('═'.repeat(50));
  console.log(`🔗 URL Base: ${BASE_URL}`);
  console.log(`⏱️  Hora: ${new Date().toLocaleString()}`);
  console.log('═'.repeat(50));
  
  // Pequeño delay entre pruebas
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  await testAnalyzeEndpoint();
  await delay(500);
  
  await testUploadComments();
  await delay(500);
  
  await testGetComments();
  await delay(500);
  
  await testGetMetrics();
  await delay(500);
  
  await testUploadCSV();
  await delay(500);
  
  await testGetMetrics();
  
  console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS');
  console.log('═'.repeat(50));
}

// Ejecutar
runAllTests().catch(console.error);
