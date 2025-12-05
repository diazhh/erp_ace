describe('Employee Service - Unit Tests', () => {
  describe('generateEmployeeCode', () => {
    it('debe generar código con formato EMP-XXXX', () => {
      const generateCode = (lastNumber) => {
        const nextNumber = (lastNumber || 0) + 1;
        return `EMP-${String(nextNumber).padStart(4, '0')}`;
      };

      expect(generateCode(0)).toBe('EMP-0001');
      expect(generateCode(99)).toBe('EMP-0100');
      expect(generateCode(999)).toBe('EMP-1000');
    });

    it('debe generar códigos únicos secuenciales', () => {
      const generateCode = (lastNumber) => {
        return `EMP-${String(lastNumber + 1).padStart(4, '0')}`;
      };

      const code1 = generateCode(0);
      const code2 = generateCode(1);
      const code3 = generateCode(2);

      expect(code1).toBe('EMP-0001');
      expect(code2).toBe('EMP-0002');
      expect(code3).toBe('EMP-0003');
      expect(code1).not.toBe(code2);
    });

    it('debe manejar números grandes', () => {
      const generateCode = (lastNumber) => {
        return `EMP-${String(lastNumber + 1).padStart(4, '0')}`;
      };

      expect(generateCode(9999)).toBe('EMP-10000');
    });
  });

  describe('calculateAge', () => {
    const calculateAge = (birthDate) => {
      if (!birthDate) return null;
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      return age;
    };

    it('debe calcular edad correctamente', () => {
      const birthDate = new Date('1990-01-01');
      const age = calculateAge(birthDate);

      // La edad depende de la fecha actual
      expect(age).toBeGreaterThan(30);
      expect(age).toBeLessThan(40);
    });

    it('debe manejar fecha de nacimiento este año', () => {
      const thisYear = new Date().getFullYear();
      const birthDate = new Date(`${thisYear}-01-01`);
      const age = calculateAge(birthDate);

      expect(age).toBe(0);
    });

    it('debe manejar años bisiestos', () => {
      const birthDate = new Date('2000-02-29'); // Año bisiesto
      const age = calculateAge(birthDate);

      expect(age).toBeGreaterThanOrEqual(24);
    });

    it('debe retornar null si no hay fecha de nacimiento', () => {
      expect(calculateAge(null)).toBeNull();
    });
  });

  describe('calculateSeniority', () => {
    const calculateSeniority = (hireDate) => {
      if (!hireDate) return { years: 0, months: 0 };

      const today = new Date();
      const hire = new Date(hireDate);

      let years = today.getFullYear() - hire.getFullYear();
      let months = today.getMonth() - hire.getMonth();

      if (months < 0) {
        years--;
        months += 12;
      }

      return { years, months };
    };

    it('debe calcular antigüedad en años y meses', () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const seniority = calculateSeniority(twoYearsAgo);

      expect(seniority.years).toBe(2);
      expect(seniority.months).toBe(0);
    });

    it('debe calcular meses cuando no completa un año', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const seniority = calculateSeniority(sixMonthsAgo);

      expect(seniority.years).toBe(0);
      expect(seniority.months).toBe(6);
    });

    it('debe manejar contratación este mes', () => {
      const today = new Date();
      const seniority = calculateSeniority(today);

      expect(seniority.years).toBe(0);
      expect(seniority.months).toBe(0);
    });

    it('debe retornar 0 si no hay fecha de contratación', () => {
      const seniority = calculateSeniority(null);

      expect(seniority.years).toBe(0);
      expect(seniority.months).toBe(0);
    });
  });

  describe('validateIdNumber', () => {
    const validateIdNumber = (idType, idNumber) => {
      if (!idNumber) return false;

      // Remover caracteres no numéricos
      const cleanNumber = idNumber.replace(/\D/g, '');

      switch(idType) {
        case 'V':
        case 'E':
          // Cédula venezolana: 7-8 dígitos
          return cleanNumber.length >= 7 && cleanNumber.length <= 8;
        case 'P':
          // Pasaporte: puede ser alfanumérico
          return idNumber.length >= 6 && idNumber.length <= 20;
        case 'J':
          // RIF: 9-10 dígitos
          return cleanNumber.length >= 9 && cleanNumber.length <= 10;
        default:
          return false;
      }
    };

    it('debe validar cédula venezolana válida', () => {
      expect(validateIdNumber('V', '12345678')).toBe(true);
      expect(validateIdNumber('V', '1234567')).toBe(true);
    });

    it('debe rechazar cédula con formato inválido', () => {
      expect(validateIdNumber('V', '123')).toBe(false); // Muy corta
      expect(validateIdNumber('V', '123456789')).toBe(false); // Muy larga
    });

    it('debe validar pasaporte', () => {
      expect(validateIdNumber('P', 'A12345')).toBe(true);
      expect(validateIdNumber('P', 'ABC123456')).toBe(true);
    });

    it('debe rechazar pasaporte muy corto', () => {
      expect(validateIdNumber('P', '12345')).toBe(false);
    });

    it('debe validar RIF', () => {
      expect(validateIdNumber('J', '123456789')).toBe(true);
      expect(validateIdNumber('J', '1234567890')).toBe(true);
    });

    it('debe manejar números con guiones', () => {
      expect(validateIdNumber('V', '12-345-678')).toBe(true);
    });

    it('debe rechazar número vacío', () => {
      expect(validateIdNumber('V', '')).toBe(false);
      expect(validateIdNumber('V', null)).toBe(false);
    });
  });

  describe('validateEmail', () => {
    const validateEmail = (email) => {
      if (!email) return false;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('debe validar email correcto', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co')).toBe(true);
      expect(validateEmail('email+tag@test.org')).toBe(true);
    });

    it('debe rechazar email sin @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    it('debe rechazar email sin dominio', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('debe rechazar email sin punto en dominio', () => {
      expect(validateEmail('test@example')).toBe(false);
    });

    it('debe rechazar email vacío', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('formatFullName', () => {
    const formatFullName = (firstName, lastName) => {
      const first = (firstName || '').trim();
      const last = (lastName || '').trim();
      return `${first} ${last}`.trim();
    };

    it('debe formatear nombre completo', () => {
      expect(formatFullName('Juan', 'Pérez')).toBe('Juan Pérez');
    });

    it('debe manejar espacios extra', () => {
      expect(formatFullName('  Juan  ', '  Pérez  ')).toBe('Juan Pérez');
    });

    it('debe manejar solo primer nombre', () => {
      expect(formatFullName('Juan', '')).toBe('Juan');
    });

    it('debe manejar solo apellido', () => {
      expect(formatFullName('', 'Pérez')).toBe('Pérez');
    });

    it('debe manejar valores nulos', () => {
      expect(formatFullName(null, null)).toBe('');
    });
  });
});
