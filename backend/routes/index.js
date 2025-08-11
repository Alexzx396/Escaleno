// backend/routes/index.js
const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const {
  procesarArchivo: handleUpload,
} = require("../controllers/upload-controller");

const router = Router();

const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");
const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_MB || "15", 10);

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
});

router.post("/verificar", upload.single("archivo"), handleUpload);

module.exports = router;
