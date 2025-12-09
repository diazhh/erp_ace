# Protocolo de Desarrollo y Deploy - ERP ACE

## Resumen del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FLUJO DE TRABAJO                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │   INICIO     │    │  DESARROLLO  │    │    DEPLOY    │                  │
│  │   SESIÓN     │───▶│    LOCAL     │───▶│  PRODUCCIÓN  │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│         │                   │                   │                          │
│         ▼                   ▼                   ▼                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │ db-sync.sh   │    │  Migraciones │    │deploy-safe.sh│                  │
│  │ (Prod→Local) │    │   Locales    │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Inicio de Sesión de Desarrollo

### Sincronizar BD de Producción a Local

Antes de empezar a trabajar, sincroniza la BD local con producción:

```bash
cd /home/diazhh/dev/erp
./scripts/db-sync.sh
```

**Esto hace:**
1. Crea backup de la BD de producción
2. Descarga el backup
3. Restaura en el contenedor Docker local
4. Limpia backups antiguos (mantiene últimos 5)

### Verificar que todo funciona

```bash
# Backend
cd backend && npm run dev

# Frontend (otra terminal)
cd frontend && npm run dev
```

---

## 2. Durante el Desarrollo

### Crear Migraciones

Cuando necesites cambiar la estructura de la BD:

```bash
cd backend

# Crear migración vacía
npx sequelize-cli migration:generate --name nombre-descriptivo

# Editar el archivo en src/database/migrations/
```

### Ejecutar Migraciones Locales

```bash
cd backend
npx sequelize-cli db:migrate
```

### Ver Estado de Migraciones

```bash
npx sequelize-cli db:migrate:status
```

### Rollback de Migración (local)

```bash
npx sequelize-cli db:migrate:undo        # Última migración
npx sequelize-cli db:migrate:undo:all    # Todas
```

---

## 3. Deploy a Producción

### Opción A: Deploy Completo (Recomendado)

```bash
./scripts/deploy-safe.sh
```

**Este script hace automáticamente:**
1. ✅ Verifica conexión SSH
2. ✅ Verifica que estés en rama `main`
3. ✅ Crea backup de BD de producción
4. ✅ Commit y push de cambios locales
5. ✅ Pull en el servidor
6. ✅ Ejecuta migraciones pendientes
7. ✅ Instala dependencias (backend y frontend)
8. ✅ Compila frontend
9. ✅ Reinicia servicios PM2
10. ✅ Verifica salud del sistema

### Opción B: Deploy Rápido (Sin backup)

```bash
./scripts/deploy-safe.sh --skip-backup
```

⚠️ **Solo usar si no hay cambios de BD**

### Opción C: Deploy Sin Confirmación

```bash
./scripts/deploy-safe.sh --force
```

---

## 4. Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `db-sync.sh` | Sincroniza BD de producción a local |
| `db-backup-prod.sh` | Crea backup de BD en producción |
| `db-migrate-prod.sh` | Ejecuta migraciones en producción |
| `db-rollback-prod.sh` | Restaura un backup en producción |
| `deploy-safe.sh` | Deploy completo y seguro |

---

## 5. Comandos Útiles

### Ver logs en producción

```bash
# Backend
ssh 144 "pm2 logs erp-backend --lines 50"

# Frontend
ssh 144 "pm2 logs erp-frontend --lines 50"

# Tiempo real
ssh 144 "pm2 logs erp-backend"
```

### Estado de servicios

```bash
ssh 144 "pm2 list"
ssh 144 "pm2 show erp-backend"
```

### Verificar commit en producción

```bash
ssh 144 "cd /var/proyectos/erp_ace && git log -1 --oneline"
```

### Forzar sincronización del servidor

```bash
ssh 144 "cd /var/proyectos/erp_ace && git fetch origin && git reset --hard origin/main"
```

---

## 6. Rollback de Emergencia

### Si algo sale mal después del deploy:

```bash
./scripts/db-rollback-prod.sh
```

Este script:
1. Lista todos los backups disponibles
2. Te permite seleccionar cuál restaurar
3. Crea un backup de seguridad antes de restaurar
4. Detiene el backend
5. Restaura el backup seleccionado
6. Reinicia el backend

---

## 7. Estructura de Backups

### En Producción
```
/var/backups/erp/
├── erp_backup_20251209_143000.sql
├── erp_backup_20251209_120000.sql
└── ... (últimos 10)
```

### En Local
```
/home/diazhh/dev/erp/backups/
├── prod_backup_20251209_143000.sql
├── prod_backup_20251209_120000.sql
└── ... (últimos 5)
```

---

## 8. Configuración de Entornos

### Local (Docker)
| Parámetro | Valor |
|-----------|-------|
| Host | localhost |
| Puerto | 5433 |
| Base de datos | erp_db |
| Usuario | erp_user |
| Password | erp_password_dev_2024 |
| Contenedor | erp_postgres |

### Producción (Acceso Directo)
| Parámetro | Valor |
|-----------|-------|
| Host | 144.126.150.120 |
| Puerto BD | 15433 |
| Usuario | erp_user |
| Password | erp_password_2024 |
| SSH Alias | 144 |
| Ruta código | /var/proyectos/erp_ace |
| Backend PM2 | erp-backend (puerto 5003) |
| Frontend PM2 | erp-frontend (puerto 5004) |
| Dominio | https://erp.atilax.io |

---

## 9. Checklist Pre-Deploy

- [ ] ¿Probaste los cambios localmente?
- [ ] ¿Las migraciones funcionan en local?
- [ ] ¿El frontend compila sin errores?
- [ ] ¿Estás en la rama `main`?
- [ ] ¿Hay cambios sin commitear?

---

## 10. Troubleshooting

### El servidor no tiene los últimos cambios
```bash
ssh 144 "cd /var/proyectos/erp_ace && git fetch origin && git reset --hard origin/main"
```

### La migración falla en producción
1. Revisa los logs: `ssh 144 "pm2 logs erp-backend --lines 100"`
2. Si es necesario, haz rollback: `./scripts/db-rollback-prod.sh`

### El backend no inicia
```bash
ssh 144 "pm2 logs erp-backend --lines 100"
ssh 144 "pm2 restart erp-backend"
```

### Verificar que el build se generó
```bash
ssh 144 "ls -la /var/proyectos/erp_ace/frontend/dist/assets/"
```
