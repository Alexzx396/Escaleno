const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function removeFile(p) {
  try { fs.unlinkSync(p); } catch {}
}

function removeDir(p) {
  try { fs.rmdirSync(p); } catch {}
}

module.exports = { ensureDir, removeFile, removeDir };
