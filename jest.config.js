module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/e2e-tests/',
  ],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  roots: ['<rootDir>/src/'],
};






