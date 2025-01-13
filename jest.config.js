const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "<rootDir>/__tests__/setup/test-setup.ts",
  ],
};

module.exports = createJestConfig(customJestConfig);
