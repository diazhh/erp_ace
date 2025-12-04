# ⚡ GUÍA RÁPIDA DE IMPLEMENTACIÓN
## Sistema ERP - Pasos Accionables para Comenzar

Esta guía proporciona pasos concretos y accionables para iniciar el desarrollo del ERP después de la aprobación.

---

## 🎬 FASE PREPARATORIA (Antes de Sprint 0)

### 📋 Checklist de Pre-Desarrollo

#### ✅ 1. Aprobaciones y Formalizaciones (Semana -2)
```
[ ] Documento de planificación revisado por stakeholders
[ ] Presupuesto aprobado por gerencia
[ ] Cronograma validado y aceptado
[ ] Contrato de desarrollo firmado (si aplica)
[ ] Acta de inicio de proyecto creada
```

#### ✅ 2. Conformación del Equipo (Semana -2)
```
[ ] Contratar/Asignar 2 Full-Stack Developers
    - Verificar experiencia en: Node.js, React, PostgreSQL
    - Entrevistas técnicas completadas
    - Onboarding programado

[ ] Contratar UX/UI Designer (consultoría)
    - Briefing de proyecto entregado
    - Wireframes de módulos principales solicitados
    - Paleta de colores y guía de estilo acordada

[ ] Identificar QA Engineer (se incorpora en Sprint 2)
[ ] Identificar DevOps Engineer (consultoría en Sprint 0 y 13)
```

#### ✅ 3. Infraestructura Inicial (Semana -1)
```
[ ] Adquirir dominio:
    - Opción 1: www.nombre-empresa-erp.com.ve
    - Opción 2: erp.nombre-empresa.com
    - Registrar y configurar DNS

[ ] Contratar VPS de Desarrollo:
    - Proveedor sugerido: DigitalOcean, Linode, Vultr
    - Specs mínimas: 4GB RAM, 2 vCPUs, 80GB SSD
    - Sistema Operativo: Ubuntu 22.04 LTS
    - Acceso SSH configurado

[ ] Contratar VPS de Staging (opcional pero recomendado):
    - Specs: 2GB RAM, 1 vCPU, 50GB SSD
    - Mismo SO que producción

[ ] Configurar cuenta de almacenamiento cloud:
    - Backblaze B2 / AWS S3
    - Buckets creados: erp-dev, erp-prod
```

#### ✅ 4. Herramientas de Desarrollo (Semana -1)
```
[ ] Crear repositorio Git:
    - GitHub / GitLab / Bitbucket
    - Visibilidad: Privado
    - Acceso: Agregar a todos los desarrolladores

[ ] Setup de herramientas colaborativas:
    - Trello / Jira / ClickUp (gestión de proyecto)
    - Slack / Discord / Microsoft Teams (comunicación)
    - Figma / Adobe XD (diseño)

[ ] Adquirir licencias/suscripciones necesarias:
    - Editor de código: VS Code (gratuito)
    - PostgreSQL: Gratuito
    - Herramientas de testing: Gratuitas (Jest, Cypress)
    - Sentry (monitoreo de errores): Plan gratuito inicialmente
```

#### ✅ 5. Recopilación de Información (Semana -1)
```
[ ] Datos de Empleados:
    - Exportar lista actual de empleados
    - Campos mínimos: nombre, cédula, cargo, salario, fecha ingreso

[ ] Datos de Clientes y Proveedores:
    - Lista de clientes principales
    - Lista de proveedores frecuentes
    - Campos: razón social, RIF, contacto

[ ] Estructura Operativa:
    - Lista de almacenes con ubicaciones
    - Lista de vehículos con placas
    - Proyectos activos con información básica

[ ] Roles y Permisos:
    - Identificar usuarios que usarán el sistema
    - Asignar roles iniciales (Gerente, Contador, RRHH, etc.)
```

---

## 🚀 SPRINT 0: SETUP Y FUNDAMENTOS (Semanas 1-2)

### Objetivo: Tener arquitectura base funcional con autenticación

### 📅 DÍA 1-2: Configuración del Entorno

#### Backend Setup
```bash
# En servidor de desarrollo o local
mkdir erp-petroleum-services
cd erp-petroleum-services
mkdir backend frontend

# Backend
cd backend
npm init -y
npm install express pg sequelize sequelize-cli
npm install jsonwebtoken bcrypt passport passport-jwt
npm install cors helmet morgan winston dotenv
npm install --save-dev nodemon jest supertest eslint prettier

# Crear estructura de carpetas
mkdir -p src/{config,modules,shared,database,jobs}
mkdir -p src/modules/{auth,users}
mkdir -p src/shared/{middleware,utils,constants,errors}

# Crear archivo .env
touch .env
```

**Contenido de .env:**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_db
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
JWT_SECRET=generar_string_aleatorio_largo_y_seguro
JWT_EXPIRE=8h
```

#### Frontend Setup
```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios react-hook-form yup
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install dayjs recharts react-toastify

# Crear estructura de carpetas
mkdir -p src/{components,pages,store,services,hooks,utils,constants,styles,routes}
```

#### Base de Datos Setup
```bash
# Instalar PostgreSQL 16 (en servidor de desarrollo)
sudo apt update
sudo apt install postgresql-16

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE erp_db;
CREATE USER erp_user WITH ENCRYPTED PASSWORD 'password_seguro';
GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_user;
\q

# Inicializar Sequelize
cd backend
npx sequelize-cli init
# Editar config/config.json con credenciales
```

---

### 📅 DÍA 3-4: Arquitectura Base del Backend

#### Tareas:
1. **Crear app.js con Express inicial:**
```javascript
// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;
```

2. **Configurar Winston para logging:**
```javascript
// backend/src/shared/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

3. **Crear middleware de errores global:**
```javascript
// backend/src/shared/middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { error: err, path: req.path });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

---

### 📅 DÍA 5-7: Sistema de Autenticación (JWT)

#### Migraciones de Base de Datos:
```bash
npx sequelize-cli migration:generate --name create-users
npx sequelize-cli migration:generate --name create-roles
npx sequelize-cli migration:generate --name create-permissions
npx sequelize-cli migration:generate --name create-user-roles
npx sequelize-cli migration:generate --name create-role-permissions
```

#### Modelos Sequelize:
```javascript
// backend/src/modules/auth/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  });

  // Hook para hashear password antes de crear
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Método para comparar passwords
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};
```

#### Controller y Rutas de Autenticación:
```javascript
// backend/src/modules/auth/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ where: { username, isActive: true } });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      // Validar password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      // Generar JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      // req.user viene del middleware de autenticación
      return res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
```

#### Middleware de Autenticación:
```javascript
// backend/src/shared/middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../../modules/auth/models/User');

const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No autenticado' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Usuario inválido' });
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
  }
};

module.exports = authenticate;
```

---

### 📅 DÍA 8-10: Sistema RBAC (Roles y Permisos)

#### Seeders para Roles y Permisos Predefinidos:
```javascript
// backend/src/database/seeders/001-roles.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'Super Administrador', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Gerente General', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Gerente Administrativo', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Contador', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Jefe de RRHH', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Empleado', isSystemRole: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
```

#### Middleware de Autorización:
```javascript
// backend/src/shared/middleware/authorize.js
const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user; // Ya viene del middleware authenticate

      // Obtener permisos del usuario (a través de sus roles)
      const userPermissions = await getUserPermissions(user.id);

      // Verificar si tiene los permisos requeridos
      const hasPermission = requiredPermissions.every(perm =>
        userPermissions.includes(perm) || userPermissions.includes('*:*')
      );

      if (!hasPermission) {
        return res.status(403).json({ success: false, error: 'No autorizado' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

async function getUserPermissions(userId) {
  // Query que obtiene permisos del usuario a través de roles
  // Implementación simplificada:
  const roles = await User.findByPk(userId, {
    include: [{
      model: Role,
      include: [{ model: Permission }]
    }]
  });

  const permissions = roles.Roles.flatMap(role =>
    role.Permissions.map(perm => perm.code)
  );

  return [...new Set(permissions)]; // Eliminar duplicados
}

module.exports = authorize;
```

---

### 📅 DÍA 11-12: Frontend - React Base

#### Setup de React Router:
```javascript
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
```

#### Redux Store (Auth Slice):
```javascript
// frontend/src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(username, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Error de autenticación';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
```

#### Página de Login:
```javascript
// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(credentials));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Usuario"
          fullWidth
          margin="normal"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Iniciando...' : 'Ingresar'}
        </Button>
      </form>
    </Box>
  );
}

export default Login;
```

---

### 📅 DÍA 13-14: Auditoría y Cierre de Sprint 0

#### Sistema de Audit Logs:
```javascript
// backend/src/modules/audit/models/AuditLog.js
module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
    },
    oldValues: {
      type: DataTypes.JSONB,
    },
    newValues: {
      type: DataTypes.JSONB,
    },
    ipAddress: {
      type: DataTypes.STRING,
    },
    userAgent: {
      type: DataTypes.STRING,
    },
  });

  return AuditLog;
};

// Helper function
async function logAudit(userId, action, entityType, entityId, oldValues, newValues, req) {
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });
}
```

#### Testing Básico:
```javascript
// backend/src/modules/auth/tests/auth.test.js
const request = require('supertest');
const app = require('../../../app');

describe('POST /auth/login', () => {
  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'invalid', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('should return token for valid credentials', async () => {
    // Crear usuario de prueba primero
    // ...

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

#### Demo del Sprint:
```
Preparar para demo con stakeholders:
[ ] Sistema corriendo en servidor de desarrollo
[ ] Página de login funcional
[ ] Demostrar autenticación exitosa y fallida
[ ] Mostrar JWT en DevTools
[ ] Mostrar dashboard básico (vacío está OK)
[ ] Explicar arquitectura implementada
[ ] Revisar código en repositorio
```

---

## ✅ CHECKLIST DE FINALIZACIÓN SPRINT 0

Al finalizar las 2 semanas, debes tener:

### Backend:
- [x] Express app corriendo en puerto 5000
- [x] Conexión a PostgreSQL funcionando
- [x] Migraciones de usuarios, roles, permisos ejecutadas
- [x] Endpoint POST /auth/login funcional
- [x] Endpoint GET /auth/me funcional
- [x] Middleware de autenticación (JWT)
- [x] Middleware de autorización (RBAC)
- [x] Middleware de manejo de errores
- [x] Sistema de logging con Winston
- [x] Tests unitarios de autenticación (al menos 5)
- [x] Seeders de roles y permisos base

### Frontend:
- [x] React app corriendo en puerto 3000
- [x] React Router configurado
- [x] Redux Store con authSlice
- [x] Página de Login funcional y estilizada
- [x] Dashboard básico (puede estar vacío)
- [x] Axios configurado con interceptors
- [x] PrivateRoute component para proteger rutas

### Documentación:
- [x] README con instrucciones de setup
- [x] Variables de entorno documentadas (.env.example)
- [x] Estructura de carpetas documentada

### Infraestructura:
- [x] Repositorio Git con código
- [x] Servidor de desarrollo configurado (o local funcionando)
- [x] PostgreSQL instalado y accesible

---

## 📅 SIGUIENTES SPRINTS (Vista Rápida)

### Sprint 1-2: Módulo de Empleados y Nómina (4 semanas)
**Tareas principales:**
- Modelo y CRUD de Empleados
- Sistema de carga de documentos
- Alertas de vencimiento
- Cálculo de nómina con deducciones
- Gestión de préstamos

**Entregable:** Módulo de RRHH completo

---

### Sprint 3-5: Finanzas, Caja Chica, Proyectos (6 semanas)
**Tareas principales:**
- Cuentas bancarias y transacciones multi-moneda
- Sistema completo de caja chica
- Gestión de proyectos con trazabilidad
- Cuentas por cobrar y pagar

**Entregable:** Core financiero operativo

---

### Sprint 6-8: Procura, Inventario, Flota (6 semanas)
**Tareas principales:**
- Solicitudes y órdenes de compra
- Inventario multi-almacén
- Control de flota de vehículos

**Entregable:** Módulos operacionales completos

---

## 🎯 TIPS PARA EL ÉXITO

### Durante el Desarrollo:
1. ✅ **Commits frecuentes:** Al menos 3-5 commits diarios con mensajes descriptivos
2. ✅ **Code Reviews:** Todos los PRs deben ser revisados por otro developer
3. ✅ **Tests primero:** Escribir tests antes o junto con el código
4. ✅ **Documentar mientras desarrollas:** No dejar documentación para el final
5. ✅ **Daily Stand-ups:** 15 minutos diarios para sincronización

### Comunicación con Stakeholders:
1. ✅ **Demo al final de cada sprint** (2 semanas)
2. ✅ **Reporte de progreso semanal** (email o mensaje)
3. ✅ **Validación temprana:** Mostrar mockups antes de implementar
4. ✅ **Gestión de expectativas:** Comunicar bloqueadores inmediatamente

### Manejo de Deuda Técnica:
1. ✅ Reservar 10-15% del tiempo de cada sprint para refactoring
2. ✅ Documentar TODOs y deuda técnica en issues de Git
3. ✅ Priorizar seguridad y performance sobre features "nice-to-have"

---

## 📞 CONTACTO Y SOPORTE

**¿Dudas durante la implementación?**
- Consulta los documentos técnicos completos
- Revisa casos de uso y diagramas ER
- Contacta al arquitecto del proyecto

**¿Encontraste un bloqueador?**
1. Documenta el problema claramente
2. Intenta soluciones alternativas
3. Escala a líder técnico si persiste > 4 horas

---

**🚀 ¡Éxito en el desarrollo del ERP!**
**Que comience Sprint 0...**
