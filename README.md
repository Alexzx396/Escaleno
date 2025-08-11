# Revisión Técnica – Validador OCR

Valida documentos de revisión técnica a partir de archivos PDF e imágenes (JPG/PNG) mediante OCR. Extrae texto y verifica la presencia de: placa patente chilena, fecha, resultado (APROBADO/RECHAZADO), centro/planta, observaciones y firma electrónica. Devuelve un veredicto y una puntuación.

## Requisitos

- Node.js 18+ y npm
- Poppler (para convertir PDF a imágenes)
- tesseract.js (se usa vía WASM; no requiere binario del sistema)

## Estructura

backend/
  controllers/
    upload-controller.js
  routes/
    index.js
  services/
    image-processor.js
    pdf-processor.js
  utils/
    document-validator.js
    fs-utils.js
    ocr.js
    plate-utils.js
  uploads/            # carpeta temporal, IDEAL BASE DE DATOS
  temp/               # salida temporal de páginas de PDF
  index.js
frontend/
```

## Variables de entorno

Backend (`backend/.env`):
```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
# Si Poppler no está en el PATH (Windows), apuntar a la carpeta "bin":
# POPPLER_PATH=C:\poppler-23.11.0\Library\bin
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

## Instalación y ejecución

Backend:
```bash
cd backend
npm install
node index.js
# o con nodemon:
# npx nodemon index.js
# Servidor: http://localhost:3001
```

Frontend (Vite):
```bash
cd frontend
npm install
npm run dev
# Aplicación: http://localhost:5173
```

## Uso

1. Abrir la aplicación del frontend en `http://localhost:5173`.
2. Subir un archivo PDF/JPG/PNG (máximo 15 MB).
3. Pulsar “Verificar Documento”.
4. Se mostrará el resultado (válido o con posibles adulteraciones), los detalles técnicos, coincidencias detectadas y una vista previa del texto OCR (primeros 900 caracteres).

Ejemplo con `curl`:
```bash
curl -X POST http://localhost:3001/api/verificar   -F "archivo=@/ruta/al/archivo.pdf"
```

## API

`POST /api/verificar`  
Body: `multipart/form-data` con el campo `archivo` (`.pdf`, `.jpg`, `.jpeg`, `.png`).  
Ejemplo de respuesta:
```json
{
  "mensaje": "✅ Documento válido",
  "detalles": {
    "contienePatente": true,
    "patentesEncontradas": ["ECHS74"],
    "contieneFecha": true,
    "contieneResultado": true,
    "contieneCentro": true,
    "contieneObservaciones": false,
    "contieneFirma": true,
    "contieneSimbolosExtranos": false,
    "puntuacion": 6
  },
  "textoExtraido": "PRIMEROS 900 CARACTERES DEL OCR..."
}
```

## Funcionamiento

PDF:
1. Se intenta extraer texto embebido con `pdf-parse`.
2. Si no hay texto, se convierte la(s) página(s) con Poppler (450 DPI), se preprocesa con `sharp` y se aplica OCR con `tesseract.js`.

Imagen:
- OCR directo con `tesseract.js` (configurable en `utils/ocr.js`).

Validación (`utils/document-validator.js`):
- Normaliza el texto (mayúsculas y sin tildes).
- Busca patentes chilenas en formatos `AA1234` o `AAAA12` (ver `utils/plate-utils.js`).
- Detecta fechas en formato “DD DE MES DE YYYY”, “DD MES YYYY”, además de `YYYY-MM-DD`, `DD/MM/YYYY`, `DD-MM-YYYY`.
- Detecta palabras clave: APROBADO/RECHAZADO, centro/planta, observaciones, firma electrónica.
- Penaliza artefactos extraños (símbolos repetidos).
- Puntuación: suma de [patente, fecha, resultado, centro, observaciones, firma]. Se considera válido con puntuación >= 4 y sin artefactos.


