# 📊 Guía de Dataset - Análisis de Sentimiento

## 1. Formato del Dataset

### 1.1 Archivo CSV

El formato recomendado es CSV con una columna de comentarios:

```csv
comment
"Este es un excelente producto"
"Terrible, no lo recomiendo"
"Es aceptable nada más"
```

### 1.2 Columnas Reconocidas

La aplicación busca automáticamente cualquiera de estas columnas:
- `comment`
- `text`
- `content`
- `message`
- `comentario`

Ejemplo con múltiples columnas (solo se procesa la columna de texto):

```csv
id,date,user,text,rating
1,2024-01-01,user1,"Great product!",5
2,2024-01-02,user2,"Not good",1
3,2024-01-03,user3,"Average",3
```

---

## 2. Fuentes de Datos Recomendadas

### 2.1 Redes Sociales
- Twitter/X
- Facebook Comments
- Instagram Comments
- LinkedIn

### 2.2 Plataformas de Reseñas
- Amazon Reviews
- Google Reviews
- Yelp
- Trustpilot

### 2.3 Feedback Directo
- Encuestas de clientes
- Correos de contacto
- Formularios web
- Chat de atención al cliente

### 2.4 Datos Públicos
- Kaggle Datasets
- UCI Machine Learning Repository
- GitHub Datasets

---

## 3. Preparación del Dataset

### 3.1 Limpieza de Datos

1. **Eliminar duplicados**
   ```python
   # Python
   df = df.drop_duplicates(subset=['comment'])
   ```

2. **Remover valores nulos**
   ```python
   df = df.dropna(subset=['comment'])
   ```

3. **Eliminar comentarios vacíos**
   ```python
   df = df[df['comment'].str.strip() != '']
   ```

4. **Normalizar espacios**
   ```python
   df['comment'] = df['comment'].str.strip()
   ```

### 3.2 Ejemplo de Limpieza Completa

```python
import pandas as pd

# Cargar
df = pd.read_csv('raw_comments.csv')

# Limpiar
df = df.dropna(subset=['comment'])
df = df[df['comment'].str.strip() != '']
df = df.drop_duplicates(subset=['comment'])

# Limpiar espacios
df['comment'] = df['comment'].str.strip()

# Guardar
df.to_csv('clean_comments.csv', index=False)
```

---

## 4. Tamaños Recomendados

| Tamaño | Comentarios | Tiempo Proceso | Uso |
|--------|------------|-----------------|-----|
| **Pequeño** | 10-100 | < 1 seg | Pruebas |
| **Medio** | 100-1K | 1-5 seg | Demostración |
| **Grande** | 1K-10K | 5-30 seg | Análisis |
| **Muy Grande** | 10K+ | > 30 seg | Requiere optimización |

---

## 5. Ejemplos de Datasets

### 5.1 Dataset de Ejemplo #1: Reviews de Productos

```csv
comment
"Calidad asombrosa y envío rápido!"
"Empaque deficiente, llegó dañado"
"Buena relación calidad-precio"
"Excelente servicio al cliente"
"Pérdida de dinero, se rompió en 2 días"
"Producto decente, rendimiento promedio"
```

**Resultados esperados:**
- Positivos: 3 (50%)
- Negativos: 2 (33%)
- Neutrales: 1 (17%)

### 5.2 Dataset de Ejemplo #2: Social Media

```csv
text
"Acabo de comer la mejor pizza! 🍕😍"
"Esta película es pura basura 💔"
"Hoy estuvo bien supongo"
"Amo mi nuevo trabajo, muy emocionado!"
"Clima terrible hoy"
"Solo un jueves común y corriente"
```

**Resultados esperados:**
- Positivos: 2 (33%)
- Negativos: 2 (33%)
- Neutrales: 2 (33%)

---

## 6. Cómo Usar Tu Dataset

### 6.1 Opción 1: Carga Manual

1. Abrir `http://localhost:3000`
2. Preparar archivo CSV con estructura correcta
3. Hacer clic en "📤 Cargar CSV"
4. Seleccionar archivo
5. Ver análisis automático

### 6.2 Opción 2: Ingreso Individual

1. Hacer clic en "✏️ Agregar Manual"
2. Escribir cada comentario
3. Ver resultado inmediato

### 6.3 Opción 3: API Programática

```javascript
const comments = [
  "Excelente producto",
  "No es bueno",
  "Promedio"
];

const response = await fetch('http://localhost:3000/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ comments })
});

const result = await response.json();
console.log(result);
```

---

## 7. Consideraciones Importantes

### 7.1 Idioma
⚠️ El modelo funciona exclusivamente con **texto en Español**, ya que fue entrenado con un corpus en español utilizando `natural.PorterStemmerEs`.

Para otros idiomas:
- Inglés: No detectará correctamente las raíces de las palabras.
- Otros: Resultados impredecibles o neutrales.

### 7.2 Longitud de Texto
- **Óptimo**: 10-50 palabras
- **Mínimo**: 2-3 palabras
- **Máximo**: Sin límite técnico

### 7.3 Caracteres Especiales
- Emojis: Se ignoran (se pueden mejorar)
- Puntuación: Se procesa correctamente
- Números: Se procesan como palabras

### 7.4 Sarcasmo
⚠️ **No se detecta correctamente**

Ejemplo:
- Texto: "Yeah, amazing service... waited 3 hours"
- Resultado: Positivo (incorrecto)
- Esperado: Negativo

---

## 8. Validación de Resultados

### 8.1 Cómo Saber si los Resultados son Buenos

1. **Comparar manualmente**: Verificar 10-20 comentarios
2. **Calcular accuracy**: Comparar con etiquetas conocidas
3. **Revisar outliers**: Comentarios clasificados incorrectamente

### 8.2 Fórmula de Accuracy

```
Accuracy = (Correctos / Total) × 100

Ejemplo:
- Total comentarios: 100
- Correctos: 91
- Accuracy = (91/100) × 100 = 91%
```

---

## 9. Archivos de Ejemplo Incluidos

### ✅ Archivo: `data/sample-comments.csv`

Contiene 15 comentarios variados (positivos, negativos, neutrales) para pruebas.

**Uso:**
```bash
# Copiar a tu carpeta de descargas
# Luego cargar desde la interfaz web
```

---

## 10. Exportar Resultados

Los resultados se almacenan en:

- `/data/comments.json` - Comentarios con análisis
- `/data/analysis.json` - Métricas agregadas

**Formato de Comentario:**
```json
{
  "id": "comment-1713700245000-0",
  "text": "¡Esto es increíble!",
  "sentiment": "positive",
  "score": 0.85,
  "confidence": 0.85,
  "timestamp": "2024-04-21T15:30:45.000Z"
}
```

**Formato de Métricas:**
```json
{
  "totalComments": 100,
  "positive": 42,
  "negative": 31,
  "neutral": 27,
  "positivePercentage": 42.0,
  "negativePercentage": 31.0,
  "neutralPercentage": 27.0,
  "averageScore": 0.12,
  "processingTime": 14.5,
  "accuracy": 91
}
```

---

## 11. Troubleshooting

### ❌ "No se encontró columna de texto"

**Solución**: Asegúrate que la columna se llama:
- comment, text, content, message o comentario

### ❌ Resultados siempre neutrales

**Solución**: 
- Verificar que el texto contenga palabras en español y que estén en el dataset de entrenamiento.
- Revisa si hay errores ortográficos severos que el stemmer no pueda resolver.

### ❌ Archivo no se carga

**Solución**:
- Verificar que sea formato CSV (no Excel)
- Codificación UTF-8
- No más de 10MB

---

## 12. Recursos Adicionales

### Datasets Públicos

- 🔗 **Kaggle**: https://www.kaggle.com/datasets?search=sentiment
- 🔗 **UCI ML**: https://archive.ics.uci.edu/
- 🔗 **Hugging Face**: https://huggingface.co/datasets

### Herramientas de Preparación

- **Python**: pandas, numpy
- **Excel/Sheets**: Filtros y limpieza manual
- **OpenRefine**: Para limpieza avanzada

---

**Documento versión**: 1.0  
**Última actualización**: Abril 21, 2024
