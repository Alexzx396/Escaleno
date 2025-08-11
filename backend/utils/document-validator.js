const { extractPlates } = require("./plate-utils");

const MONTHS =
  "(ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE)";

const PATTERNS = {
  date: [
    new RegExp(`\\b\\d{2}\\s+DE\\s+${MONTHS}\\s+DE\\s+\\d{4}\\b`),
    new RegExp(`\\b\\d{2}\\s+${MONTHS}\\s+\\d{4}\\b`),
    /\b\d{4}-\d{2}-\d{2}\b/,
    /\b\d{2}\/\d{2}\/\d{4}\b/,
    /\b\d{2}-\d{2}-\d{4}\b/,
  ],
  result: /\b(APROBADO|RECHAZADO)\b/,
  center:
    /\b(PLANTA|CENTRO|REVISION(ES)?\s+TECNICA(S)?|REVISIONES\s+TECNICAS?)\b/,
  notes: /\bOBSERVACION(ES)?\b/,
  signature: /\bFIRMA\s+ELECTR?ONICA\b/,
  artifacts: /[§�#\?\*]{2,}/,
};

const normalize = (s = "") =>
  String(s)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const anyMatch = (t, arr) => arr.some((rx) => rx.test(t));
const firstMatchFromList = (t, arr) => {
  for (const rx of arr) {
    const m = t.match(rx);
    if (m) return m[0];
  }
  return null;
};
const firstMatch = (t, rx) => (t.match(rx) || [null])[0];

function validateOcrText(originalText = "") {
  const text = normalize(originalText);

  const plates = extractPlates(text);
  const flags = {
    plate: plates.length > 0,
    date: anyMatch(text, PATTERNS.date),
    result: PATTERNS.result.test(text),
    center: PATTERNS.center.test(text),
    notes: PATTERNS.notes.test(text),
    signature: PATTERNS.signature.test(text),
    artifacts: PATTERNS.artifacts.test(text),
  };

  const samples = {
    date: firstMatchFromList(text, PATTERNS.date),
    result: firstMatch(text, PATTERNS.result),
    center: firstMatch(text, PATTERNS.center),
    notes: firstMatch(text, PATTERNS.notes),
    signature: firstMatch(text, PATTERNS.signature),
    plates, 
  };

  const scoreKeys = ["plate", "date", "result", "center", "notes", "signature"];
  const score = scoreKeys.reduce((n, k) => n + (flags[k] ? 1 : 0), 0);
  const isValid = score >= 4 && !flags.artifacts;

  return {
    esValido: isValid,
    detalles: {
      contienePatente: flags.plate,
      patentesEncontradas: plates,
      contieneFecha: flags.date,
      contieneResultado: flags.result,
      contieneCentro: flags.center,
      contieneObservaciones: flags.notes,
      contieneFirma: flags.signature,
      contieneSimbolosExtranos: flags.artifacts,
      puntuacion: score,
    },
    samples, 
  };
}

module.exports = { validateOcrText };
