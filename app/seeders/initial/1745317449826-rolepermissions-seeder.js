module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('rolepermissions', [
  {
    "id": 4,
    "roleId": 1,
    "permissionId": 1,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-22T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('rolepermissions', null, {});
      }
    };