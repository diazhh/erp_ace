# 📱 Notificaciones (WhatsApp/Email)

## ¿Qué es este módulo?

El módulo de **Notificaciones** permite enviar alertas y mensajes automáticos a través de WhatsApp y correo electrónico. El sistema notifica a los usuarios sobre eventos importantes como aprobaciones pendientes, vencimientos, alertas de seguridad y más.

Piense en este módulo como su "sistema de comunicación automática": mantiene informados a todos los usuarios sobre lo que necesitan saber, cuando lo necesitan saber.

## ¿Para quién es útil?

- **Todos los usuarios**: Reciben notificaciones relevantes
- **Administradores**: Configuran qué notificaciones se envían
- **Gerencia**: Recibe alertas de eventos críticos

## ¿Qué puedo hacer aquí?

### Canales de Notificación
- **WhatsApp**: Mensajes instantáneos vía WhatsApp Business
- **Email**: Correos electrónicos automáticos
- **Sistema**: Notificaciones dentro del ERP

### Tipos de Notificaciones
- **Aprobaciones**: Solicitudes pendientes de aprobar
- **Vencimientos**: Documentos, permisos, contratos por vencer
- **Alertas**: Incidentes, paradas de trabajo, emergencias
- **Recordatorios**: Tareas pendientes, reuniones

### Configuración
- **Preferencias**: Qué notificaciones recibir
- **Canales**: Por dónde recibirlas
- **Horarios**: Cuándo recibirlas

## Conceptos Importantes

### Canales Disponibles

| Canal | Descripción | Uso Típico |
|-------|-------------|------------|
| **WhatsApp** | Mensajes instantáneos | Alertas urgentes |
| **Email** | Correo electrónico | Resúmenes, documentos |
| **Sistema** | Notificaciones en el ERP | Todo tipo |

### Tipos de Notificación

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Aprobación** | Algo requiere su aprobación | AFE pendiente |
| **Vencimiento** | Algo está por vencer | Permiso expira en 30 días |
| **Alerta** | Evento importante | Incidente reportado |
| **Información** | Actualización general | Documento actualizado |
| **Tarea** | Acción requerida | Completar inspección |

### Prioridades

| Prioridad | Descripción | Canales |
|-----------|-------------|---------|
| **Crítica** | Requiere acción inmediata | WhatsApp + Email + Sistema |
| **Alta** | Importante, pronto | Email + Sistema |
| **Normal** | Información regular | Sistema |
| **Baja** | Informativo | Sistema (opcional) |

### Integración WhatsApp

El sistema usa WhatsApp Business API (Baileys) para:
- Enviar mensajes de texto
- Enviar documentos adjuntos
- Recibir confirmaciones de lectura

### Integración Email

El sistema usa Nodemailer para:
- Enviar correos con formato HTML
- Adjuntar documentos
- Enviar a múltiples destinatarios

## Notificaciones Automáticas

El sistema envía notificaciones automáticas para:

| Evento | Notificación |
|--------|--------------|
| **AFE creado** | Al aprobador |
| **Documento por vencer** | Al responsable |
| **Incidente reportado** | A HSE |
| **Permiso de trabajo aprobado** | Al solicitante |
| **Pago recibido** | A finanzas |
| **Producción registrada** | A operaciones |

## Relación con Otros Módulos

El módulo de Notificaciones se conecta con:

- **Todos los módulos**: Cada módulo puede generar notificaciones.

- **Usuarios**: Las preferencias se configuran por usuario.

- **Configuración**: Los administradores definen las reglas.
