module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('roles', [
  {
    "id": 1,
    "name": "admin",
    "description": "مدیر سیستم",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('roles', null, {});
      }
    };