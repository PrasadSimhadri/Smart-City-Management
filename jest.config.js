module.exports = {
    testEnvironment: "node", // Use Node.js environment
    testMatch: ["**/__tests__/**/*.test.js"], // Look for test files in __tests__ folders
    collectCoverage: true, // Enable coverage reporting
    coverageDirectory: "coverage", // Output coverage reports here
    coverageReporters: ["text", "lcov"], // Generate text and lcov reports
};