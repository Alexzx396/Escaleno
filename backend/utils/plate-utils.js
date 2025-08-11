const OLD = /^[A-Z]{2}\d{4}$/;
const NEW = /^[A-Z]{4}\d{2}$/;
const CANDIDATE = /\b(?=[A-Z0-9]{6,7}\b)(?=.*[A-Z])(?=.*\d)[A-Z0-9]+\b/g;

function isValidChileanPlate(plate = "") {
  const t = String(plate).toUpperCase();
  return OLD.test(t) || NEW.test(t);
}

function extractPlates(text = "") {
  const t = String(text).toUpperCase();
  const candidates = t.match(CANDIDATE) || [];
  const valid = candidates.filter(isValidChileanPlate);
  return [...new Set(valid)];
}

module.exports = {
  extractPlates,
  isValidChileanPlate,
  extraerPatentes: extractPlates,
  validarPatenteChilena: isValidChileanPlate,
};
