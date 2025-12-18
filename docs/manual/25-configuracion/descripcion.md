# ⚙️ Módulo de Configuración - Descripción

## ¿Qué hace este módulo?

El módulo de **Configuración** permite personalizar el sistema según las necesidades de la empresa. Incluye configuraciones generales, preferencias de usuario y parámetros del sistema.

## Funcionalidades Principales

### 1. Configuración General
- **Datos de la empresa**
- **Logo** y branding
- **Moneda** por defecto
- **Zona horaria**

### 2. Preferencias de Usuario
- **Idioma** (ES, EN, PT)
- **Tema** (claro/oscuro)
- **Notificaciones**

### 3. Parámetros del Sistema
- **Formatos** de fecha y número
- **Valores** por defecto
- **Catálogos** del sistema

## Rutas del Módulo

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/settings` | Configuración | Configuración general |
| `/settings/profile` | Perfil | Perfil de usuario |
| `/settings/company` | Empresa | Datos de la empresa |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `settings:read` | Ver configuración |
| `settings:update` | Modificar configuración |
