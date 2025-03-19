'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_users AS
      SELECT 
        u.id,
        u.username,
        u.isActive,
        CONCAT(p.firstName, ' ', p.lastName) as fullName,
        u.createdAt,
        u.updatedAt
      FROM Users u
      INNER JOIN People p ON u.PersonId = p.id
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP VIEW IF EXISTS vw_users');
  }
};
