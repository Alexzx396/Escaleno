/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  maxWorkers: 1,
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    "**/*.js",
    "!index.js",
    "!controllers/**",
    "!routes/**",
    "!services/**",
    "!utils/fs-utils.js",
    "!utils/ocr.js",
    "!**/__tests__/**",
    "!**/uploads/**",
    "!**/temp/**",
    "!**/coverage/**",
  ],
  coverageThreshold: {
    global: { lines: 80, statements: 80, functions: 80, branches: 65 },
  },
};
