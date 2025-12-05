'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add quote_request_id column to quotes table if it doesn't exist
    const tableInfo = await queryInterface.describeTable('quotes');
    
    if (!tableInfo.quote_request_id) {
      await queryInterface.addColumn('quotes', 'quote_request_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'quote_requests',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      
      // Add index
      await queryInterface.addIndex('quotes', ['quote_request_id'], {
        name: 'quotes_quote_request_id_idx',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('quotes');
    
    if (tableInfo.quote_request_id) {
      await queryInterface.removeIndex('quotes', 'quotes_quote_request_id_idx');
      await queryInterface.removeColumn('quotes', 'quote_request_id');
    }
  },
};
