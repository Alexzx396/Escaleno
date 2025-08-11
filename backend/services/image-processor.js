const Tesseract = require("tesseract.js");

async function processImage(imagePath) {
  const { data } = await Tesseract.recognize(imagePath, "spa", {
    logger: (m) => m.status && console.log( m.status),
  });
  return data.text || "";
}

module.exports = { processImage };
