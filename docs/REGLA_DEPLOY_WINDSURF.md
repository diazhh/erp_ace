---
trigger: always
---

# Instrucciones de Deploy para Windsurf AI

## Cuándo Aplicar Esta Regla

Si el usuario pide cualquiera de las siguientes acciones:
- "deploy"
- "desplegar"
- "subir a producción"
- "actualizar producción"
- "publicar cambios"
- "hacer deploy"

## Qué Debes Hacer

Debes ejecutar los siguientes comandos en orden, uno por uno, esperando que cada uno termine antes de continuar:

### Paso 1: Verificar si hay cambios sin commitear en el proyecto local
```bash
git status --porcelain
```

Si hay archivos modificados o nuevos, ejecutar:
```bash
git add .
git commit -m "Deploy automático - $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main
```

Si no hay cambios, continuar al siguiente paso.

### Paso 2: Actualizar el código en el servidor de producción
```bash
ssh 144 "cd /var/proyectos/erp_ace && git pull origin main"
```

### Paso 3: Instalar dependencias del backend
```bash
ssh 144 "cd /var/proyectos/erp_ace/backend && npm install --production"
```

### Paso 4: Instalar dependencias y compilar el frontend
```bash
ssh 144 "cd /var/proyectos/erp_ace/frontend && npm install && npm run build"
```

### Paso 5: Reiniciar los servicios en PM2
```bash
ssh 144 "pm2 restart erp-backend erp-frontend"
```

### Paso 6: Verificar que los servicios estén corriendo
```bash
ssh 144 "pm2 list | grep erp"
```

## Información del Servidor

- **SSH Alias**: 144 (ya está configurado en ~/.ssh/config)
- **IP Real**: 144.126.150.120
- **Usuario**: root
- **Ruta del proyecto**: /var/proyectos/erp_ace
- **Nombre PM2 Backend**: erp-backend (puerto 5003)
- **Nombre PM2 Frontend**: erp-frontend (puerto 5004)

## Al Finalizar

Informar al usuario:
1. Si el deploy fue exitoso o si hubo errores
2. Mostrar el estado de los servicios PM2
3. Recordar las URLs de producción:
   - Backend: http://144.126.150.120:5003
   - Frontend: http://144.126.150.120:5004

## Comandos Adicionales (si el usuario los necesita)

Ver logs del backend:
```bash
ssh 144 "pm2 logs erp-backend --lines 50"
```

Ver logs del frontend:
```bash
ssh 144 "pm2 logs erp-frontend --lines 50"
```

Reiniciar solo el backend:
```bash
ssh 144 "pm2 restart erp-backend"
```

Reiniciar solo el frontend:
```bash
ssh 144 "pm2 restart erp-frontend"
```
