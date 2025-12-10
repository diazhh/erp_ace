'use strict';

/**
 * Migración: Módulos CRM y Control de Calidad
 * 
 * Cambios:
 * 1. Crear tablas CRM: clients, client_contacts, opportunities, crm_quotes, crm_quote_items, crm_activities
 * 2. Crear tablas Quality: quality_plans, quality_inspections, non_conformances, corrective_actions, quality_certificates
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();

    // ========== CRM TABLES ==========

    // 1. Crear tabla clients
    if (!tables.includes('clients')) {
      await queryInterface.createTable('clients', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        client_type: {
          type: Sequelize.ENUM('COMPANY', 'INDIVIDUAL'),
          allowNull: false,
          defaultValue: 'COMPANY',
        },
        company_name: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        trade_name: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        tax_id: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        first_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        id_number: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        industry: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        contact_name: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        contact_position: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        mobile: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        website: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        state: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        country: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: 'Venezuela',
        },
        postal_code: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        category: {
          type: Sequelize.ENUM('A', 'B', 'C', 'D'),
          allowNull: true,
        },
        source: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('PROSPECT', 'ACTIVE', 'INACTIVE', 'SUSPENDED'),
          allowNull: false,
          defaultValue: 'PROSPECT',
        },
        total_revenue: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        total_projects: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        last_project_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        credit_limit: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        payment_terms: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        assigned_to_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('clients', ['code'], { unique: true });
      await queryInterface.addIndex('clients', ['company_name']);
      await queryInterface.addIndex('clients', ['tax_id']);
      await queryInterface.addIndex('clients', ['status']);
      await queryInterface.addIndex('clients', ['category']);
      await queryInterface.addIndex('clients', ['assigned_to_id']);
      console.log('✅ Tabla clients creada');
    }

    // 2. Crear tabla client_contacts
    if (!tables.includes('client_contacts')) {
      await queryInterface.createTable('client_contacts', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        client_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'clients',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        first_name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        last_name: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        position: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        department: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        phone: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        mobile: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        contact_type: {
          type: Sequelize.ENUM('PRIMARY', 'BILLING', 'TECHNICAL', 'OPERATIONS', 'OTHER'),
          allowNull: false,
          defaultValue: 'PRIMARY',
        },
        is_primary: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('client_contacts', ['client_id']);
      await queryInterface.addIndex('client_contacts', ['email']);
      await queryInterface.addIndex('client_contacts', ['is_primary']);
      console.log('✅ Tabla client_contacts creada');
    }

    // 3. Crear tabla opportunities
    if (!tables.includes('opportunities')) {
      await queryInterface.createTable('opportunities', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        client_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'clients',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        contact_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'client_contacts',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        stage: {
          type: Sequelize.ENUM('LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'),
          allowNull: false,
          defaultValue: 'LEAD',
        },
        estimated_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        probability: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        weighted_value: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        expected_close_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        actual_close_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        source: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        competitors: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        lost_reason: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        lost_to_competitor: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        project_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        assigned_to_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        priority: {
          type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
          allowNull: false,
          defaultValue: 'MEDIUM',
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('opportunities', ['code'], { unique: true });
      await queryInterface.addIndex('opportunities', ['client_id']);
      await queryInterface.addIndex('opportunities', ['stage']);
      await queryInterface.addIndex('opportunities', ['assigned_to_id']);
      await queryInterface.addIndex('opportunities', ['expected_close_date']);
      console.log('✅ Tabla opportunities creada');
    }

    // 4. Crear tabla crm_quotes
    if (!tables.includes('crm_quotes')) {
      await queryInterface.createTable('crm_quotes', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        client_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'clients',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        opportunity_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'opportunities',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        contact_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'client_contacts',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        quote_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        valid_until: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        subtotal: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        discount_percent: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 0,
        },
        discount_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0,
        },
        tax_percent: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 16,
        },
        tax_amount: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
          defaultValue: 0,
        },
        total: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        status: {
          type: Sequelize.ENUM('DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVISED'),
          allowNull: false,
          defaultValue: 'DRAFT',
        },
        version: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        parent_quote_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        terms_and_conditions: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        payment_terms: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        delivery_terms: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        rejection_reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        assigned_to_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        internal_notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        sent_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        sent_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        accepted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        rejected_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('crm_quotes', ['code'], { unique: true });
      await queryInterface.addIndex('crm_quotes', ['client_id']);
      await queryInterface.addIndex('crm_quotes', ['opportunity_id']);
      await queryInterface.addIndex('crm_quotes', ['status']);
      await queryInterface.addIndex('crm_quotes', ['quote_date']);
      console.log('✅ Tabla crm_quotes creada');
    }

    // 5. Crear tabla crm_quote_items
    if (!tables.includes('crm_quote_items')) {
      await queryInterface.createTable('crm_quote_items', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        quote_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'crm_quotes',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        line_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        item_type: {
          type: Sequelize.ENUM('SERVICE', 'PRODUCT', 'OTHER'),
          allowNull: false,
          defaultValue: 'SERVICE',
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.DECIMAL(15, 4),
          allowNull: false,
          defaultValue: 1,
        },
        unit: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        unit_price: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
        },
        discount_percent: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 0,
        },
        subtotal: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('crm_quote_items', ['quote_id']);
      await queryInterface.addIndex('crm_quote_items', ['line_number']);
      console.log('✅ Tabla crm_quote_items creada');
    }

    // 6. Crear tabla crm_activities
    if (!tables.includes('crm_activities')) {
      await queryInterface.createTable('crm_activities', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        entity_type: {
          type: Sequelize.ENUM('CLIENT', 'OPPORTUNITY', 'QUOTE'),
          allowNull: false,
        },
        entity_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        activity_type: {
          type: Sequelize.ENUM('CALL', 'EMAIL', 'MEETING', 'VISIT', 'TASK', 'NOTE', 'WHATSAPP', 'FOLLOW_UP', 'PRESENTATION', 'OTHER'),
          allowNull: false,
        },
        subject: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        activity_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        due_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        completed_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        duration_minutes: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PLANNED',
        },
        outcome: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        priority: {
          type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
          allowNull: false,
          defaultValue: 'MEDIUM',
        },
        contact_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'client_contacts',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        assigned_to_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        reminder_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        reminder_sent: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        completed_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('crm_activities', ['entity_type', 'entity_id']);
      await queryInterface.addIndex('crm_activities', ['activity_type']);
      await queryInterface.addIndex('crm_activities', ['status']);
      await queryInterface.addIndex('crm_activities', ['activity_date']);
      await queryInterface.addIndex('crm_activities', ['assigned_to_id']);
      console.log('✅ Tabla crm_activities creada');
    }

    // ========== QUALITY TABLES ==========

    // 7. Crear tabla quality_plans
    if (!tables.includes('quality_plans')) {
      await queryInterface.createTable('quality_plans', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        project_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        applicable_standards: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
        },
        effective_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        expiry_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        version: {
          type: Sequelize.STRING(20),
          allowNull: false,
          defaultValue: '1.0',
        },
        status: {
          type: Sequelize.ENUM('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'OBSOLETE'),
          allowNull: false,
          defaultValue: 'DRAFT',
        },
        quality_objectives: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        acceptance_criteria: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        quality_manager_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        approved_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        approved_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('quality_plans', ['code'], { unique: true });
      await queryInterface.addIndex('quality_plans', ['project_id']);
      await queryInterface.addIndex('quality_plans', ['status']);
      console.log('✅ Tabla quality_plans creada');
    }

    // 8. Crear tabla quality_inspections
    if (!tables.includes('quality_inspections')) {
      await queryInterface.createTable('quality_inspections', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        quality_plan_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'quality_plans',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        project_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        inspection_type: {
          type: Sequelize.ENUM('RECEIVING', 'IN_PROCESS', 'FINAL', 'DIMENSIONAL', 'VISUAL', 'FUNCTIONAL', 'DESTRUCTIVE', 'NON_DESTRUCTIVE'),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        inspected_item: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        scheduled_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        inspection_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        result: {
          type: Sequelize.ENUM('PENDING', 'PASS', 'FAIL', 'CONDITIONAL'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
        acceptance_criteria: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        findings: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        measurement_data: {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        inspector_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        client_witness: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        equipment_used: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        procedure_reference: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('quality_inspections', ['code'], { unique: true });
      await queryInterface.addIndex('quality_inspections', ['project_id']);
      await queryInterface.addIndex('quality_inspections', ['quality_plan_id']);
      await queryInterface.addIndex('quality_inspections', ['inspection_type']);
      await queryInterface.addIndex('quality_inspections', ['result']);
      await queryInterface.addIndex('quality_inspections', ['inspection_date']);
      console.log('✅ Tabla quality_inspections creada');
    }

    // 9. Crear tabla non_conformances
    if (!tables.includes('non_conformances')) {
      await queryInterface.createTable('non_conformances', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        project_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        inspection_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'quality_inspections',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        nc_type: {
          type: Sequelize.ENUM('MINOR', 'MAJOR', 'CRITICAL'),
          allowNull: false,
        },
        category: {
          type: Sequelize.ENUM('MATERIAL', 'WORKMANSHIP', 'DOCUMENTATION', 'PROCESS', 'EQUIPMENT', 'DESIGN', 'OTHER'),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        affected_item: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        location: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        requirement_reference: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        detected_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        due_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        closed_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('OPEN', 'UNDER_ANALYSIS', 'ACTION_PENDING', 'IN_PROGRESS', 'VERIFICATION', 'CLOSED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'OPEN',
        },
        root_cause_analysis: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        root_cause_method: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
        immediate_action: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        disposition: {
          type: Sequelize.ENUM('USE_AS_IS', 'REWORK', 'REPAIR', 'SCRAP', 'RETURN', 'DOWNGRADE'),
          allowNull: true,
        },
        detected_by_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        responsible_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        estimated_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        actual_cost: {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: true,
        },
        currency: {
          type: Sequelize.STRING(3),
          allowNull: false,
          defaultValue: 'USD',
        },
        verified_by_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        verification_notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('non_conformances', ['code'], { unique: true });
      await queryInterface.addIndex('non_conformances', ['project_id']);
      await queryInterface.addIndex('non_conformances', ['inspection_id']);
      await queryInterface.addIndex('non_conformances', ['nc_type']);
      await queryInterface.addIndex('non_conformances', ['status']);
      await queryInterface.addIndex('non_conformances', ['detected_date']);
      console.log('✅ Tabla non_conformances creada');
    }

    // 10. Crear tabla corrective_actions
    if (!tables.includes('corrective_actions')) {
      await queryInterface.createTable('corrective_actions', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        non_conformance_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'non_conformances',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        action_type: {
          type: Sequelize.ENUM('CORRECTIVE', 'PREVENTIVE', 'IMPROVEMENT'),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        planned_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        completed_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PLANNED',
        },
        responsible_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'employees',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        results: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        effectiveness_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        effectiveness_notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        verified_by_id: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        verified_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('corrective_actions', ['code'], { unique: true });
      await queryInterface.addIndex('corrective_actions', ['non_conformance_id']);
      await queryInterface.addIndex('corrective_actions', ['action_type']);
      await queryInterface.addIndex('corrective_actions', ['status']);
      await queryInterface.addIndex('corrective_actions', ['planned_date']);
      console.log('✅ Tabla corrective_actions creada');
    }

    // 11. Crear tabla quality_certificates
    if (!tables.includes('quality_certificates')) {
      await queryInterface.createTable('quality_certificates', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        project_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'projects',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        inspection_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'quality_inspections',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        certificate_type: {
          type: Sequelize.ENUM('MATERIAL', 'CONFORMITY', 'TEST', 'CALIBRATION', 'COMPLETION', 'WARRANTY', 'OTHER'),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        certified_item: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        issue_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        expiry_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        external_cert_number: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        issued_by: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        standards_reference: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('DRAFT', 'ISSUED', 'EXPIRED', 'REVOKED'),
          allowNull: false,
          defaultValue: 'DRAFT',
        },
        file_url: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.UUID,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      await queryInterface.addIndex('quality_certificates', ['code'], { unique: true });
      await queryInterface.addIndex('quality_certificates', ['project_id']);
      await queryInterface.addIndex('quality_certificates', ['inspection_id']);
      await queryInterface.addIndex('quality_certificates', ['certificate_type']);
      await queryInterface.addIndex('quality_certificates', ['status']);
      await queryInterface.addIndex('quality_certificates', ['issue_date']);
      console.log('✅ Tabla quality_certificates creada');
    }

    console.log('✅ Migración CRM y Quality completada');
  },

  async down(queryInterface, Sequelize) {
    // Eliminar tablas en orden inverso (por dependencias)
    await queryInterface.dropTable('quality_certificates');
    await queryInterface.dropTable('corrective_actions');
    await queryInterface.dropTable('non_conformances');
    await queryInterface.dropTable('quality_inspections');
    await queryInterface.dropTable('quality_plans');
    await queryInterface.dropTable('crm_activities');
    await queryInterface.dropTable('crm_quote_items');
    await queryInterface.dropTable('crm_quotes');
    await queryInterface.dropTable('opportunities');
    await queryInterface.dropTable('client_contacts');
    await queryInterface.dropTable('clients');

    // Eliminar ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_clients_client_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_clients_category" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_clients_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_client_contacts_contact_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_opportunities_stage" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_opportunities_priority" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_quotes_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_quote_items_item_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_activities_entity_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_activities_activity_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_activities_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_crm_activities_priority" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quality_plans_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quality_inspections_inspection_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quality_inspections_result" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_non_conformances_nc_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_non_conformances_category" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_non_conformances_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_non_conformances_disposition" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_corrective_actions_action_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_corrective_actions_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quality_certificates_certificate_type" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quality_certificates_status" CASCADE;');

    console.log('✅ Rollback de migración CRM y Quality completado');
  }
};
