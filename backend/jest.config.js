module.exports = {
  testEnvironment: 'node',

  // Patrón de archivos de prueba
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Ignorar node_modules
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Cobertura
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/database/**',
    '!src/**/index.js',
    '!src/server.js',
    '!src/config/**'
  ],

  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Reportes de cobertura
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Setup antes de las pruebas
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],

  // Timeout para pruebas (10 segundos)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Restaurar mocks automáticamente
  restoreMocks: true
};
