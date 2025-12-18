'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columna field_id
    await queryInterface.addColumn('purchase_orders', 'field_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'fields',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Agregar columna well_id
    await queryInterface.addColumn('purchase_orders', 'well_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'wells',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Agregar índices
    await queryInterface.addIndex('purchase_orders', ['field_id']);
    await queryInterface.addIndex('purchase_orders', ['well_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('purchase_orders', 'well_id');
    await queryInterface.removeColumn('purchase_orders', 'field_id');
  },
};
