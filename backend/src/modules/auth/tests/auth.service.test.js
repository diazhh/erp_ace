const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

describe('Auth Service - Unit Tests', () => {
  describe('Password Hashing', () => {
    it('debe hashear la contraseña correctamente', async () => {
      const password = 'Test123!';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('debe generar hashes diferentes para la misma contraseña', async () => {
      const password = 'Test123!';
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Password Comparison', () => {
    it('debe validar contraseña correcta', async () => {
      const password = 'Test123!';
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hash);

      expect(isMatch).toBe(true);
    });

    it('debe rechazar contraseña incorrecta', async () => {
      const password = 'Test123!';
      const wrongPassword = 'Wrong123!';
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it('debe manejar contraseñas vacías', async () => {
      const password = 'Test123!';
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare('', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    it('debe generar un JWT válido', () => {
      const payload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser'
      };

      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes
    });

    it('debe incluir userId y username en el payload', () => {
      const payload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        username: 'testuser'
      };

      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
    });

    it('debe incluir fecha de expiración', () => {
      const payload = { userId: '123', username: 'test' };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('JWT Token Validation', () => {
    it('debe validar un token válido', () => {
      const payload = { userId: '123', username: 'testuser' };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });

      const decoded = jwt.verify(token, config.jwt.secret);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(payload.userId);
    });

    it('debe rechazar un token con secret incorrecto', () => {
      const payload = { userId: '123', username: 'testuser' };
      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

      expect(() => {
        jwt.verify(token, config.jwt.secret);
      }).toThrow();
    });

    it('debe rechazar un token expirado', () => {
      const payload = { userId: '123', username: 'testuser' };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '0s' });

      // Esperar un momento para que expire
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => {
            jwt.verify(token, config.jwt.secret);
          }).toThrow('jwt expired');
          resolve();
        }, 100);
      });
    });

    it('debe rechazar un token malformado', () => {
      const malformedToken = 'esto.no.es.un.token.valido';

      expect(() => {
        jwt.verify(malformedToken, config.jwt.secret);
      }).toThrow();
    });

    it('debe rechazar token vacío', () => {
      expect(() => {
        jwt.verify('', config.jwt.secret);
      }).toThrow();
    });
  });

  describe('Password Strength Validation', () => {
    const validatePasswordStrength = (password) => {
      // Al menos 8 caracteres
      if (password.length < 8) return false;

      // Al menos una mayúscula
      if (!/[A-Z]/.test(password)) return false;

      // Al menos una minúscula
      if (!/[a-z]/.test(password)) return false;

      // Al menos un número
      if (!/\d/.test(password)) return false;

      return true;
    };

    it('debe validar contraseña fuerte', () => {
      expect(validatePasswordStrength('Test123!')).toBe(true);
      expect(validatePasswordStrength('MyP@ssw0rd')).toBe(true);
    });

    it('debe rechazar contraseña corta', () => {
      expect(validatePasswordStrength('Test1!')).toBe(false);
    });

    it('debe rechazar contraseña sin mayúscula', () => {
      expect(validatePasswordStrength('test123!')).toBe(false);
    });

    it('debe rechazar contraseña sin minúscula', () => {
      expect(validatePasswordStrength('TEST123!')).toBe(false);
    });

    it('debe rechazar contraseña sin número', () => {
      expect(validatePasswordStrength('TestPass!')).toBe(false);
    });
  });

  describe('Token Expiration Calculation', () => {
    it('debe calcular expiración correctamente para 1 hora', () => {
      const payload = { userId: '123' };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '1h' });
      const decoded = jwt.verify(token, config.jwt.secret);

      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(3600); // 1 hora = 3600 segundos
    });

    it('debe calcular expiración correctamente para 8 horas', () => {
      const payload = { userId: '123' };
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '8h' });
      const decoded = jwt.verify(token, config.jwt.secret);

      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBe(28800); // 8 horas = 28800 segundos
    });
  });
});
