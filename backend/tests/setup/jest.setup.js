// Setup global para Jest

// Aumentar timeout para operaciones de base de datos
jest.setTimeout(10000);

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

// Solo conectar a BD si la prueba lo requiere
// Las pruebas que necesiten BD deben importar manualmente el helper setupTestDatabase
