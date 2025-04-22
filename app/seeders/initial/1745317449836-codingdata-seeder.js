module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('codingdata', [
  {
    "id": 80001,
    "codeTableListId": 8,
    "title": "READ",
    "description": null,
    "sortId": 1,
    "refId": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 90001,
    "codeTableListId": 9,
    "title": "admin_user",
    "description": "دسترسی ادمین به سیستم",
    "sortId": 1,
    "refId": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('codingdata', null, {});
      }
    };