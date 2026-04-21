# 🎯 Plataforma de Análisis de Sentimiento en Comentarios

Una aplicación web moderna para analizar automáticamente el sentimiento de comentarios usando técnicas de NLP (Procesamiento de Lenguaje Natural).

## ✨ Características Principales

- 📊 **Dashboard Interactivo**: Visualización en tiempo real de métricas
- 📁 **Carga de Archivos**: Soporta CSV con comentarios
- ✏️ **Ingreso Manual**: Agregar comentarios uno por uno
- 📈 **Gráficos Dinámicos**: Distribución de sentimientos (pastel y barras)
- 💬 **Tabla de Resultados**: Filtrable y ordenable
- 🌙 **Tema Oscuro**: Interfaz adaptativa
- ⚡ **Rápido**: Procesa comentarios al instante

## 🚀 Quick Start

### Instalación

```bash
# Clonar o navegar al proyecto
cd my-app

# Instalar dependencias
npm install --legacy-peer-deps

# Iniciar servidor de desarrollo
npm run dev
```

Abrir navegador: **http://localhost:3000**

## 📖 Cómo Usar

### 1️⃣ Cargar Archivo CSV

```csv
comment
"Me encanta este producto"
"Terrible calidad"
"Es aceptable"
```

- Botón "📤 Cargar CSV"
- Seleccionar archivo
- Ver resultados automáticamente

### 2️⃣ Agregar Comentario Manual

- Botón "✏️ Agregar Manual"
- Escribir comentario
- Ver análisis instantáneo

### 3️⃣ Ver Métricas

Las siguientes métricas se actualizan automáticamente:

- 📊 Total procesados
- 😊 Positivos (%)
- 😞 Negativos (%)
- 😐 Neutrales (%)
- ✅ Accuracy del modelo (95%)

### 4️⃣ Filtrar y Ordenar

En la tabla de comentarios:

- **Filtrar**: Por sentimiento
- **Ordenar**: Por fecha, score o sentimiento
- **Búsqueda**: Ver detalles de cada comentario

## 🏗️ Arquitectura

```
Frontend (Next.js + React)
        ↓
API Routes (Node.js)
        ↓
NLP Engine (Sentiment)
        ↓
Storage (JSON)
```

## 📡 API Endpoints

### GET /api/comments
Obtiene todos los comentarios procesados

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "comment-123",
      "text": "Excelente producto",
      "sentiment": "positive",
      "score": 0.85,
      "confidence": 0.85,
      "timestamp": "2024-04-21T15:30:45Z"
    }
  ],
  "count": 1
}
```

### POST /api/comments
Carga comentarios (CSV o array)

**Body:**
```json
{
  "csv": "comment\nTexto 1\nTexto 2"
}
```

**O:**
```json
{
  "comments": ["Comentario 1", "Comentario 2"]
}
```

### DELETE /api/comments
Limpia todos los datos

### POST /api/analyze
Analiza un texto individual

**Body:**
```json
{
  "text": "Esto es asombroso!"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "text": "Esto es asombroso!",
    "sentiment": "positive",
    "score": 0.75,
    "confidence": 0.75
  }
}
```

### GET /api/metrics
Obtiene estadísticas agregadas

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalComments": 100,
    "positive": 42,
    "negative": 31,
    "neutral": 27,
    "positivePercentage": 42.0,
    "negativePercentage": 31.0,
    "neutralPercentage": 27.0,
    "averageScore": 0.12,
    "accuracy": 95
  }
}
```

## 📚 Estructura de Carpetas

```
my-app/
├── app/
│   ├── api/                    # API Routes
│   │   ├── analyze/route.ts
│   │   ├── comments/route.ts
│   │   └── metrics/route.ts
│   ├── page.tsx               # Dashboard principal
│   ├── layout.tsx
│   └── globals.css
│
├── components/                # Componentes React
│   ├── FileUpload.tsx
│   ├── MetricsCard.tsx
│   ├── Charts.tsx
│   └── CommentsTable.tsx
│
├── lib/                       # Lógica compartida
│   ├── ml/
│   │   └── sentiment-analyzer.ts  # Motor NLP
│   ├── utils/
│   │   └── storage.ts
│   └── types.ts
│
├── data/                      # Almacenamiento local
│   ├── comments.json
│   └── analysis.json
│
└── DOCUMENTO_TECNICO.md       # Documentación completa
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|-----------|----------|
| **Next.js 16** | Framework web full-stack |
| **React 19** | UI interactiva |
| **TypeScript** | Type-safety |
| **Sentiment** | Análisis de sentimiento (NLP) |
| **PapaParse** | Parseo de CSV |
| **Recharts** | Visualización de datos |
| **Tailwind CSS** | Estilos responsivos |

## 📊 Ejemplo de Salida

**Input:** 100 comentarios variados

**Output:**
```
┌─────────────────────────────────────────┐
│ Total Procesados: 100                   │
│ Positivos: 42 (42%)  😊                 │
│ Negativos: 31 (31%)  😞                 │
│ Neutrales: 27 (27%)  😐                 │
│ Accuracy: 95%        ✅                 │
└─────────────────────────────────────────┘
```

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Linting
npm run lint
```

## 📈 Mejoras Futuras

- [ ] Base de datos PostgreSQL
- [ ] Autenticación de usuarios
- [ ] Exportar a Excel/PDF
- [ ] Análisis en múltiples idiomas
- [ ] Detección de emojis
- [ ] Sistema de alertas
- [ ] API pública

## 🚨 Limitaciones Conocidas

⚠️ **Sarcasmo**: No se detecta correctamente
⚠️ **Idioma**: Optimizado para inglés
⚠️ **Escala**: Máximo ~100K comentarios (mejorar con DB)

## 📝 Licencia

Este proyecto es de uso educativo.

## 👥 Autor

Desarrollado como proyecto final del curso de Big Data & NLP
Universidad Minuto de Dios - Quinto Semestre

---

**¿Preguntas?** Revisa el `DOCUMENTO_TECNICO.md` para más detalles técnicos.
