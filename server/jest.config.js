module.exports = {
  // Test environment
  testEnvironment: 'node',

  // File extensions to consider
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Transform TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Test file patterns - include jest-cucumber step files
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
    '**/*.steps.(ts|tsx|js)', // Add support for jest-cucumber step files
  ],

  // Module path mapping (if needed)
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Directories to search for modules
  roots: ['<rootDir>/src', '<rootDir>/tests'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/server.ts', // Exclude main server file
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Setup files (if needed)
  setupFilesAfterEnv: [],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Preset for TypeScript
  preset: 'ts-jest',

  // Global setup/teardown (if needed)
  // globalSetup: '<rootDir>/tests/setup.ts',
  // globalTeardown: '<rootDir>/tests/teardown.ts',
};