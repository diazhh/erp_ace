const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const logger = require('../../../shared/utils/logger');

/**
 * Servicio base para generación de PDFs
 * Proporciona utilidades comunes para todos los reportes
 */
class PDFService {
  constructor() {
    // Configuración por defecto
    this.defaultOptions = {
      size: 'LETTER',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      info: {
        Author: 'ERP ACE',
        Creator: 'ERP ACE - Sistema de Gestión',
      },
    };

    // Colores corporativos
    this.colors = {
      primary: '#1a365d',      // Azul oscuro
      secondary: '#2d3748',    // Gris oscuro
      accent: '#3182ce',       // Azul
      success: '#38a169',      // Verde
      warning: '#d69e2e',      // Amarillo
      danger: '#e53e3e',       // Rojo
      light: '#f7fafc',        // Gris claro
      border: '#e2e8f0',       // Borde
      text: '#2d3748',         // Texto principal
      textLight: '#718096',    // Texto secundario
    };

    // Fuentes (usando las integradas de pdfkit)
    this.fonts = {
      regular: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique',
    };
  }

  /**
   * Crear nuevo documento PDF
   */
  createDocument(options = {}) {
    const docOptions = {
      ...this.defaultOptions,
      ...options,
      info: {
        ...this.defaultOptions.info,
        ...options.info,
      },
    };

    return new PDFDocument(docOptions);
  }

  /**
   * Agregar encabezado estándar al documento
   */
  addHeader(doc, { title, subtitle, companyName = 'ERP ACE', showDate = true, showLogo = false }) {
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;
    let currentY = doc.page.margins.top;

    // Fondo del encabezado
    doc.rect(startX - 10, currentY - 10, pageWidth + 20, 70)
       .fill(this.colors.primary);

    // Nombre de la empresa
    doc.font(this.fonts.bold)
       .fontSize(18)
       .fillColor('#ffffff')
       .text(companyName, startX, currentY, { width: pageWidth });

    currentY += 25;

    // Título del reporte
    doc.font(this.fonts.bold)
       .fontSize(14)
       .fillColor('#ffffff')
       .text(title, startX, currentY, { width: pageWidth });

    currentY += 20;

    // Subtítulo si existe
    if (subtitle) {
      doc.font(this.fonts.regular)
         .fontSize(10)
         .fillColor('#ffffff')
         .text(subtitle, startX, currentY, { width: pageWidth });
      currentY += 15;
    }

    // Fecha de generación
    if (showDate) {
      const dateText = `Generado: ${new Date().toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short',
      })}`;
      
      doc.font(this.fonts.regular)
         .fontSize(8)
         .fillColor(this.colors.textLight)
         .text(dateText, startX, currentY + 25, { 
           width: pageWidth, 
           align: 'right' 
         });
    }

    // Resetear color
    doc.fillColor(this.colors.text);

    // Retornar posición Y después del encabezado
    return currentY + 50;
  }

  /**
   * Agregar pie de página
   */
  addFooter(doc, { pageNumber, totalPages, showPageNumber = true }) {
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const footerY = doc.page.height - doc.page.margins.bottom + 20;

    // Línea separadora
    doc.strokeColor(this.colors.border)
       .lineWidth(0.5)
       .moveTo(doc.page.margins.left, footerY - 10)
       .lineTo(doc.page.margins.left + pageWidth, footerY - 10)
       .stroke();

    // Texto del pie
    doc.font(this.fonts.regular)
       .fontSize(8)
       .fillColor(this.colors.textLight);

    // Información de la empresa
    doc.text('ERP ACE - Sistema de Gestión Empresarial', 
             doc.page.margins.left, footerY, 
             { width: pageWidth / 2 });

    // Número de página
    if (showPageNumber && pageNumber) {
      const pageText = totalPages 
        ? `Página ${pageNumber} de ${totalPages}` 
        : `Página ${pageNumber}`;
      
      doc.text(pageText, 
               doc.page.margins.left + pageWidth / 2, footerY, 
               { width: pageWidth / 2, align: 'right' });
    }
  }

  /**
   * Agregar título de sección
   */
  addSectionTitle(doc, title, y) {
    const startX = doc.page.margins.left;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Fondo de la sección
    doc.rect(startX, y, pageWidth, 25)
       .fill(this.colors.light);

    // Borde izquierdo de acento
    doc.rect(startX, y, 4, 25)
       .fill(this.colors.accent);

    // Texto del título
    doc.font(this.fonts.bold)
       .fontSize(12)
       .fillColor(this.colors.primary)
       .text(title, startX + 15, y + 7, { width: pageWidth - 20 });

    return y + 35;
  }

  /**
   * Crear tabla simple
   */
  createTable(doc, { headers, rows, startY, columnWidths, options = {} }) {
    const startX = doc.page.margins.left;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const rowHeight = options.rowHeight || 25;
    const headerHeight = options.headerHeight || 30;
    const fontSize = options.fontSize || 9;
    const headerFontSize = options.headerFontSize || 10;
    const padding = options.padding || 8;

    let currentY = startY;

    // Calcular anchos de columna si no se proporcionan
    if (!columnWidths) {
      const colWidth = pageWidth / headers.length;
      columnWidths = headers.map(() => colWidth);
    }

    // Encabezado de la tabla
    doc.rect(startX, currentY, pageWidth, headerHeight)
       .fill(this.colors.primary);

    let currentX = startX;
    headers.forEach((header, i) => {
      doc.font(this.fonts.bold)
         .fontSize(headerFontSize)
         .fillColor('#ffffff')
         .text(header, currentX + padding, currentY + 10, {
           width: columnWidths[i] - padding * 2,
           align: options.headerAlign || 'left',
         });
      currentX += columnWidths[i];
    });

    currentY += headerHeight;

    // Filas de datos
    rows.forEach((row, rowIndex) => {
      // Verificar si necesitamos nueva página
      if (currentY + rowHeight > doc.page.height - doc.page.margins.bottom - 30) {
        doc.addPage();
        currentY = doc.page.margins.top;
        
        // Re-dibujar encabezado en nueva página
        doc.rect(startX, currentY, pageWidth, headerHeight)
           .fill(this.colors.primary);

        currentX = startX;
        headers.forEach((header, i) => {
          doc.font(this.fonts.bold)
             .fontSize(headerFontSize)
             .fillColor('#ffffff')
             .text(header, currentX + padding, currentY + 10, {
               width: columnWidths[i] - padding * 2,
               align: options.headerAlign || 'left',
             });
          currentX += columnWidths[i];
        });
        currentY += headerHeight;
      }

      // Fondo alternado
      if (rowIndex % 2 === 0) {
        doc.rect(startX, currentY, pageWidth, rowHeight)
           .fill(this.colors.light);
      }

      // Borde inferior
      doc.strokeColor(this.colors.border)
         .lineWidth(0.5)
         .moveTo(startX, currentY + rowHeight)
         .lineTo(startX + pageWidth, currentY + rowHeight)
         .stroke();

      // Datos de la fila
      currentX = startX;
      row.forEach((cell, i) => {
        const cellValue = cell !== null && cell !== undefined ? String(cell) : '';
        const align = options.columnAligns?.[i] || 'left';
        
        doc.font(this.fonts.regular)
           .fontSize(fontSize)
           .fillColor(this.colors.text)
           .text(cellValue, currentX + padding, currentY + 8, {
             width: columnWidths[i] - padding * 2,
             align: align,
             lineBreak: false,
           });
        currentX += columnWidths[i];
      });

      currentY += rowHeight;
    });

    // Borde exterior de la tabla
    doc.strokeColor(this.colors.border)
       .lineWidth(1)
       .rect(startX, startY, pageWidth, currentY - startY)
       .stroke();

    return currentY + 10;
  }

  /**
   * Agregar información en formato clave-valor
   */
  addKeyValuePairs(doc, pairs, startY, options = {}) {
    const startX = doc.page.margins.left;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const labelWidth = options.labelWidth || 150;
    const lineHeight = options.lineHeight || 20;
    const columns = options.columns || 1;
    const columnWidth = pageWidth / columns;

    let currentY = startY;
    let currentColumn = 0;

    pairs.forEach((pair, index) => {
      const colX = startX + (currentColumn * columnWidth);
      
      // Label
      doc.font(this.fonts.bold)
         .fontSize(9)
         .fillColor(this.colors.textLight)
         .text(pair.label + ':', colX, currentY, {
           width: labelWidth,
         });

      // Value
      doc.font(this.fonts.regular)
         .fontSize(10)
         .fillColor(this.colors.text)
         .text(pair.value || '-', colX + labelWidth, currentY, {
           width: columnWidth - labelWidth - 10,
         });

      currentColumn++;
      if (currentColumn >= columns) {
        currentColumn = 0;
        currentY += lineHeight;
      }
    });

    // Ajustar Y si la última fila no estaba completa
    if (currentColumn !== 0) {
      currentY += lineHeight;
    }

    return currentY + 10;
  }

  /**
   * Agregar resumen con totales
   */
  addSummaryBox(doc, items, startY, options = {}) {
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const boxWidth = options.width || 250;
    const startX = options.alignRight !== false 
      ? doc.page.margins.left + pageWidth - boxWidth 
      : doc.page.margins.left;
    const lineHeight = 22;
    const padding = 10;

    let currentY = startY;

    // Fondo del box
    const boxHeight = (items.length * lineHeight) + (padding * 2);
    doc.rect(startX, currentY, boxWidth, boxHeight)
       .fill(this.colors.light);

    // Borde
    doc.strokeColor(this.colors.border)
       .lineWidth(1)
       .rect(startX, currentY, boxWidth, boxHeight)
       .stroke();

    currentY += padding;

    items.forEach((item, index) => {
      const isTotal = item.isTotal || index === items.length - 1;
      
      // Línea separadora antes del total
      if (isTotal && index > 0) {
        doc.strokeColor(this.colors.border)
           .lineWidth(1)
           .moveTo(startX + padding, currentY - 2)
           .lineTo(startX + boxWidth - padding, currentY - 2)
           .stroke();
      }

      // Label
      doc.font(isTotal ? this.fonts.bold : this.fonts.regular)
         .fontSize(isTotal ? 11 : 10)
         .fillColor(isTotal ? this.colors.primary : this.colors.text)
         .text(item.label, startX + padding, currentY, {
           width: boxWidth - (padding * 2) - 100,
         });

      // Value
      doc.font(isTotal ? this.fonts.bold : this.fonts.regular)
         .fontSize(isTotal ? 11 : 10)
         .fillColor(isTotal ? this.colors.primary : this.colors.text)
         .text(item.value, startX + boxWidth - 100 - padding, currentY, {
           width: 100,
           align: 'right',
         });

      currentY += lineHeight;
    });

    return startY + boxHeight + 15;
  }

  /**
   * Agregar badge/etiqueta de estado
   */
  addStatusBadge(doc, status, x, y, options = {}) {
    const statusColors = {
      active: this.colors.success,
      completed: this.colors.success,
      pending: this.colors.warning,
      cancelled: this.colors.danger,
      draft: this.colors.textLight,
      approved: this.colors.success,
      rejected: this.colors.danger,
      in_progress: this.colors.accent,
    };

    const color = statusColors[status.toLowerCase()] || this.colors.textLight;
    const text = options.text || status;
    const width = options.width || 70;
    const height = 16;

    // Fondo del badge
    doc.roundedRect(x, y, width, height, 3)
       .fill(color);

    // Texto
    doc.font(this.fonts.bold)
       .fontSize(8)
       .fillColor('#ffffff')
       .text(text.toUpperCase(), x, y + 4, {
         width: width,
         align: 'center',
       });

    return y + height + 5;
  }

  /**
   * Formatear moneda
   */
  formatCurrency(amount, currency = 'USD') {
    if (amount === null || amount === undefined) return '-';
    
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    
    return formatter.format(amount);
  }

  /**
   * Formatear fecha
   */
  formatDate(date, options = {}) {
    if (!date) return '-';
    
    const dateObj = new Date(date);
    const defaultOptions = {
      dateStyle: 'medium',
      ...options,
    };
    
    return dateObj.toLocaleDateString('es-ES', defaultOptions);
  }

  /**
   * Formatear fecha y hora
   */
  formatDateTime(date) {
    if (!date) return '-';
    
    const dateObj = new Date(date);
    return dateObj.toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  /**
   * Generar PDF y retornar como buffer
   */
  async generateBuffer(doc) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      doc.end();
    });
  }

  /**
   * Generar PDF y guardar en archivo
   */
  async saveToFile(doc, filePath) {
    return new Promise((resolve, reject) => {
      const dir = path.dirname(filePath);
      
      // Crear directorio si no existe
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const writeStream = fs.createWriteStream(filePath);
      
      doc.pipe(writeStream);
      
      writeStream.on('finish', () => {
        logger.info(`PDF guardado: ${filePath}`);
        resolve(filePath);
      });
      
      writeStream.on('error', (error) => {
        logger.error(`Error guardando PDF: ${error.message}`);
        reject(error);
      });
      
      doc.end();
    });
  }
}

module.exports = new PDFService();
