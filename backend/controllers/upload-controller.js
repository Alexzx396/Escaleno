const path = require("path");
const { ensureDir, removeFile } = require("../utils/fs-utils");
const { previewText } = require("../utils/ocr");
const { processPdf } = require("../services/pdf-processor");
const { processImage } = require("../services/image-processor");
const { validateOcrText } = require("../utils/document-validator");

async function handleUpload(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const tempDir = path.join(__dirname, "..", "temp");
  ensureDir(tempDir);

  const ext = path.extname(file.originalname).toLowerCase();
  let extracted = "";

  try {
    extracted =
      ext === ".pdf"
        ? await processPdf(file.path, tempDir)
        : await processImage(file.path);

    const result = validateOcrText(extracted);

    const s = result.samples;
    console.log(" Plates:", (s.plates && s.plates.join(", ")) || "—");
    console.log(" Date:", s.date || "—");
    console.log(" Result:", s.result || "—");
    console.log(" Center:", s.center || "—");
    console.log(" Notes:", s.notes || "—");
    console.log(" Signature:", s.signature || "—");
    console.log(" Score:", result.detalles.puntuacion);

    return res.json({
      mensaje: result.esValido
        ? "✅ Documento válido"
        : "⚠️ Documento con posibles adulteraciones",
      detalles: result.detalles,
      textoExtraido: previewText(extracted, 900),
    });
  } catch (err) {
    console.error("process error:", err);
    return res.status(500).json({ error: "Error processing file" });
  } finally {
    removeFile(file.path);
  }
}

module.exports = { procesarArchivo: handleUpload };
