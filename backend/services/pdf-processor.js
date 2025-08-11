const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pdfParse = require("pdf-parse");
const pdfPoppler = require("pdf-poppler");
const { ensureDir, removeFile, removeDir } = require("../utils/fs-utils");
const { recognizeBufferText } = require("../utils/ocr");

const DPI = parseInt(process.env.PDF_DPI || "450", 10);
const MAX_PAGES = parseInt(process.env.PDF_MAX_PAGES || "1", 10);

async function processPdf(pdfPath, tempRoot) {
  const parsed = await pdfParse(fs.readFileSync(pdfPath));
  if (parsed.text && parsed.text.trim().length > 100) return parsed.text;

  const outDir = path.join(tempRoot, `pdfpp_${Date.now()}`);
  ensureDir(outDir);

  await pdfPoppler.convert(pdfPath, {
    format: "jpg",
    jpegFile: true,
    out_dir: outDir,
    out_prefix: "page",
    page: null,
    dpi: DPI,
    scalePageToDPI: true,
  });

  const files = fs
    .readdirSync(outDir)
    .filter((f) => /\.(jpe?g|png|tif?f)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const texts = [];
  for (const f of files.slice(0, MAX_PAGES)) {
    const imgPath = path.join(outDir, f);
    try {
      const meta = await sharp(imgPath).metadata();
      const width = Math.round(1.4 * (meta.width || 0));
      const buf = await sharp(imgPath)
        .rotate()
        .resize({ width, withoutEnlargement: false })
        .grayscale()
        .normalize()
        .median(1)
        .sharpen()
        .threshold(168)
        .toBuffer();
      texts.push(await recognizeBufferText(buf));
    } finally {
      removeFile(imgPath);
    }
  }

  removeDir(outDir);
  return texts.join("\n\n");
}

module.exports = { processPdf };
