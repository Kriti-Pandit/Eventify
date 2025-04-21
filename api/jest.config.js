module.exports = {
    testEnvironment: 'node',
    testMatch: [
      '**/__tests__/**/*.test.js',
      '**/?(*.)+(spec|test).js'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    verbose: true
  };