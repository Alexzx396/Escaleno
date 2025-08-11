const Tesseract = require("tesseract.js");

const DEFAULT_OCR_OPTIONS = {
  logger: (m) => m.status && console.log(m.status),
  tessedit_pageseg_mode: 6,
  tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ0123456789-./:() ",
  preserve_interword_spaces: "1",
};

async function recognizeBufferText(buffer, lang = "spa+eng", options = {}) {
  const opts = { ...DEFAULT_OCR_OPTIONS, ...options };
  const { data } = await Tesseract.recognize(buffer, lang, opts);
  return data.text || "";
}

function previewText(text, maxLength = 900) {
  return (text || "").slice(0, maxLength);
}

module.exports = {
  recognizeBufferText,
  previewText,
  ocrBuffer: recognizeBufferText,
  preview: previewText,
  DEFAULT_OCR_OPTIONS,
};
