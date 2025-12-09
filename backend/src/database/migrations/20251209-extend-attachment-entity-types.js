'use strict';

/**
 * Migración para extender los tipos de entidad de attachments
 * Agrega soporte para: employee, warehouse, inventory_item, contractor, vehicle, project_milestone
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar nuevos valores al ENUM de entity_type
    const newEntityTypes = [
      'employee',
      'warehouse', 
      'inventory_item',
      'contractor',
      'vehicle',
      'project_milestone',
      'petty_cash',
      'bank_account'
    ];

    for (const entityType of newEntityTypes) {
      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE "enum_attachments_entity_type" ADD VALUE IF NOT EXISTS '${entityType}';
        `);
        console.log(`✅ Agregado entity_type: ${entityType}`);
      } catch (error) {
        // El valor ya existe, ignorar
        if (!error.message.includes('already exists')) {
          console.error(`Error agregando ${entityType}:`, error.message);
        }
      }
    }

    // Agregar nuevas categorías al ENUM de category
    const newCategories = [
      'PROFILE',      // Foto de perfil
      'ID_DOCUMENT',  // Documento de identidad
      'CERTIFICATE',  // Certificado
      'WARRANTY',     // Garantía
      'MANUAL'        // Manual
    ];

    for (const category of newCategories) {
      try {
        await queryInterface.sequelize.query(`
          ALTER TYPE "enum_attachments_category" ADD VALUE IF NOT EXISTS '${category}';
        `);
        console.log(`✅ Agregada categoría: ${category}`);
      } catch (error) {
        // El valor ya existe, ignorar
        if (!error.message.includes('already exists')) {
          console.error(`Error agregando ${category}:`, error.message);
        }
      }
    }

    console.log('✅ Migración de entity types completada');
  },

  async down(queryInterface, Sequelize) {
    // No se pueden eliminar valores de un ENUM en PostgreSQL sin recrear la tabla
    // Esta migración es irreversible
    console.log('⚠️ Esta migración no se puede revertir automáticamente');
  }
};
