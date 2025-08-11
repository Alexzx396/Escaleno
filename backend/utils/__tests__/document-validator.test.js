const { validateOcrText } = require("../document-validator");

describe("document-validator", () => {
  test("marca válido cuando hay señales suficientes", () => {
    const text = `
      VEHÍCULO: ECHS74
      FECHA: 10 DE NOVIEMBRE DE 2025
      RESULTADO: APROBADO
      REVISION TECNICA PLANTA CENTRO
      FIRMA ELECTRONICA
    `;
    const res = validateOcrText(text);
    expect(res.esValido).toBe(true);
    expect(res.detalles.contienePatente).toBe(true);
    expect(res.detalles.contieneFecha).toBe(true);
    expect(res.detalles.contieneResultado).toBe(true);
    expect(res.detalles.contieneCentro).toBe(true);
    expect(res.detalles.contieneFirma).toBe(true);
    expect(res.detalles.puntuacion).toBeGreaterThanOrEqual(4);
  });

  test("penaliza artefactos y marca inválido", () => {
    const text = "AA1234 ###### *** ???";
    const res = validateOcrText(text);
    expect(res.detalles.contieneSimbolosExtranos).toBe(true);
    expect(res.esValido).toBe(false);
  });
});
