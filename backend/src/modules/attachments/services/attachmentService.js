const { Op } = require('sequelize');
const uploadService = require('./uploadService');

class AttachmentService {
  constructor(models) {
    this.models = models;
  }

  /**
   * Crea un nuevo attachment
   * @param {Object} data - Datos del attachment
   * @param {Object} file - Archivo subido (de multer)
   * @param {string} userId - ID del usuario que sube
   * @returns {Promise<Object>} - Attachment creado
   */
  async create(data, file, userId) {
    const { Attachment } = this.models;

    // Generar thumbnail si es imagen
    let thumbnailUrl = null;
    if (uploadService.isImage(file.mimetype)) {
      const thumbPath = await uploadService.generateThumbnail(file.path, file.mimetype);
      thumbnailUrl = uploadService.pathToUrl(thumbPath);
    }

    // Obtener metadatos si es imagen
    const metadata = await uploadService.getImageMetadata(file.path, file.mimetype);

    // Obtener el siguiente sortOrder
    const maxOrder = await Attachment.max('sortOrder', {
      where: {
        entityType: data.entityType,
        entityId: data.entityId,
      },
    });

    const attachment = await Attachment.create({
      entityType: data.entityType,
      entityId: data.entityId,
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      fileUrl: uploadService.pathToUrl(file.path),
      thumbnailUrl,
      category: data.category || 'OTHER',
      description: data.description || null,
      metadata,
      uploadedBy: userId,
      sortOrder: (maxOrder || 0) + 1,
    });

    return this.getById(attachment.id);
  }

  /**
   * Crea múltiples attachments
   * @param {Object} data - Datos comunes
   * @param {Array} files - Archivos subidos
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Attachments creados
   */
  async createMany(data, files, userId) {
    const attachments = [];
    
    for (const file of files) {
      const attachment = await this.create(
        {
          entityType: data.entityType,
          entityId: data.entityId,
          category: data.category,
          description: data.description,
        },
        file,
        userId
      );
      attachments.push(attachment);
    }

    return attachments;
  }

  /**
   * Obtiene un attachment por ID
   * @param {string} id - ID del attachment
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const { Attachment, User } = this.models;

    const attachment = await Attachment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!attachment) return null;

    return {
      ...attachment.toJSON(),
      fileSizeFormatted: uploadService.formatFileSize(attachment.fileSize),
      isImage: uploadService.isImage(attachment.mimeType),
      isDocument: uploadService.isDocument(attachment.mimeType),
    };
  }

  /**
   * Obtiene attachments por entidad
   * @param {string} entityType - Tipo de entidad
   * @param {string} entityId - ID de la entidad
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<Array>}
   */
  async getByEntity(entityType, entityId, options = {}) {
    const { Attachment, User } = this.models;
    const { category, isActive = true } = options;

    const where = {
      entityType,
      entityId,
      isActive,
    };

    if (category) {
      where.category = category;
    }

    const attachments = await Attachment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
    });

    return attachments.map(att => ({
      ...att.toJSON(),
      fileSizeFormatted: uploadService.formatFileSize(att.fileSize),
      isImage: uploadService.isImage(att.mimeType),
      isDocument: uploadService.isDocument(att.mimeType),
    }));
  }

  /**
   * Actualiza un attachment
   * @param {string} id - ID del attachment
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object|null>}
   */
  async update(id, data) {
    const { Attachment } = this.models;

    const attachment = await Attachment.findByPk(id);
    if (!attachment) return null;

    const allowedFields = ['category', 'description', 'sortOrder'];
    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    await attachment.update(updateData);
    return this.getById(id);
  }

  /**
   * Elimina un attachment (soft delete)
   * @param {string} id - ID del attachment
   * @param {boolean} hardDelete - Si true, elimina físicamente
   * @returns {Promise<boolean>}
   */
  async delete(id, hardDelete = false) {
    const { Attachment } = this.models;

    const attachment = await Attachment.findByPk(id);
    if (!attachment) return false;

    if (hardDelete) {
      // Eliminar archivo físico
      await uploadService.deleteFile(attachment.fileUrl);
      if (attachment.thumbnailUrl) {
        await uploadService.deleteFile(attachment.thumbnailUrl);
      }
      await attachment.destroy();
    } else {
      // Soft delete
      await attachment.update({ isActive: false });
    }

    return true;
  }

  /**
   * Elimina todos los attachments de una entidad
   * @param {string} entityType - Tipo de entidad
   * @param {string} entityId - ID de la entidad
   * @param {boolean} hardDelete - Si true, elimina físicamente
   * @returns {Promise<number>} - Cantidad eliminada
   */
  async deleteByEntity(entityType, entityId, hardDelete = false) {
    const { Attachment } = this.models;

    const attachments = await Attachment.findAll({
      where: { entityType, entityId },
    });

    for (const attachment of attachments) {
      await this.delete(attachment.id, hardDelete);
    }

    return attachments.length;
  }

  /**
   * Reordena attachments
   * @param {Array} items - Array de { id, sortOrder }
   * @returns {Promise<boolean>}
   */
  async reorder(items) {
    const { Attachment } = this.models;

    for (const item of items) {
      await Attachment.update(
        { sortOrder: item.sortOrder },
        { where: { id: item.id } }
      );
    }

    return true;
  }

  /**
   * Obtiene estadísticas de attachments
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object>}
   */
  async getStats(filters = {}) {
    const { Attachment } = this.models;
    const { entityType, startDate, endDate } = filters;

    const where = { isActive: true };

    if (entityType) {
      where.entityType = entityType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = startDate;
      if (endDate) where.createdAt[Op.lte] = endDate;
    }

    const [totalCount, totalSize, byCategory, byEntityType, byMimeType] = await Promise.all([
      Attachment.count({ where }),
      Attachment.sum('fileSize', { where }),
      Attachment.findAll({
        where,
        attributes: [
          'category',
          [Attachment.sequelize.fn('COUNT', '*'), 'count'],
          [Attachment.sequelize.fn('SUM', Attachment.sequelize.col('file_size')), 'totalSize'],
        ],
        group: ['category'],
        raw: true,
      }),
      Attachment.findAll({
        where,
        attributes: [
          'entityType',
          [Attachment.sequelize.fn('COUNT', '*'), 'count'],
          [Attachment.sequelize.fn('SUM', Attachment.sequelize.col('file_size')), 'totalSize'],
        ],
        group: ['entityType'],
        raw: true,
      }),
      Attachment.findAll({
        where,
        attributes: [
          'mimeType',
          [Attachment.sequelize.fn('COUNT', '*'), 'count'],
        ],
        group: ['mimeType'],
        raw: true,
      }),
    ]);

    return {
      totalCount: totalCount || 0,
      totalSize: totalSize || 0,
      totalSizeFormatted: uploadService.formatFileSize(totalSize || 0),
      byCategory,
      byEntityType,
      byMimeType,
    };
  }

  /**
   * Limpia attachments huérfanos (sin entidad padre)
   * @param {number} daysOld - Días de antigüedad mínima
   * @returns {Promise<number>} - Cantidad eliminada
   */
  async cleanOrphans(daysOld = 30) {
    // Esta función requiere verificar cada entityType contra su tabla
    // Por ahora solo marca como inactivos los muy antiguos sin actividad
    const { Attachment } = this.models;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Attachment.update(
      { isActive: false },
      {
        where: {
          isActive: true,
          createdAt: { [Op.lt]: cutoffDate },
          // Aquí se podría agregar lógica para verificar si la entidad padre existe
        },
      }
    );

    return result[0];
  }
}

module.exports = AttachmentService;
