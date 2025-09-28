module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('userroles', [
  {
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "description": "مدیر سیستم دسترسی به همه چیز دارد",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('userroles', null, {});
      }
    };