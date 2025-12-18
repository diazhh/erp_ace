# 📧 Módulo de Email - Descripción

## ¿Qué hace este módulo?

El módulo de **Email** permite enviar correos electrónicos desde el sistema usando nodemailer. Se utiliza para notificaciones, alertas y comunicaciones automatizadas.

## Funcionalidades Principales

### 1. Notificaciones por Email
- **Alertas** de vencimientos
- **Notificaciones** de aprobaciones
- **Reportes** programados

### 2. Configuración SMTP
- **Servidor** SMTP
- **Autenticación**
- **TLS/SSL**

## Configuración

La configuración se realiza desde:
**Administración → Configuración Email**

### Campos de Configuración

| Campo | Descripción |
|-------|-------------|
| **Host SMTP** | Servidor de correo |
| **Puerto** | Puerto del servidor |
| **Usuario** | Usuario de autenticación |
| **Contraseña** | Contraseña |
| **Remitente** | Email remitente |
| **TLS** | Usar conexión segura |

## Permisos Requeridos

| Permiso | Descripción |
|---------|-------------|
| `settings:email` | Configurar email |
