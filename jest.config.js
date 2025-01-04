/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript
  testEnvironment: "node", // Set the test environment to Node.js
  testMatch: ["**/tests/**/*.test.ts"], // Match all test files
  moduleFileExtensions: ["ts", "js"], // Allow TypeScript and JavaScript files
  verbose: true, // Show detailed test results
  collectCoverage: true, // Enable test coverage
  coverageDirectory: "coverage", // Directory for coverage reports
  coverageReporters: ["text", "lcov"], // Generate coverage in text and lcov formats
};
