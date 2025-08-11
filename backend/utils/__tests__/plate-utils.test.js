const { isValidChileanPlate, extractPlates } = require("../plate-utils");

describe("plate-utils", () => {
  test("valida formatos chilenos", () => {
    expect(isValidChileanPlate("AA1234")).toBe(true);
    expect(isValidChileanPlate("ABCD12")).toBe(true);
    expect(isValidChileanPlate("A12345")).toBe(false);
    expect(isValidChileanPlate("ABCDE1")).toBe(false);
  });

  test("extrae únicas y válidas", () => {
    const txt = "Patente: ECHS74 y otra AB1234; ruido AAA999 AA1234 ECHS74";
    const plates = extractPlates(txt);
    expect(plates).toEqual(["ECHS74", "AB1234", "AA1234"]);
  });
});
