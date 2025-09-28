module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('codetablelists', [
  {
    "id": 8,
    "en_TableName": "actionpermission",
    "fa_TableName": "مجوزهایی که روی جداول امکانش هست",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 9,
    "en_TableName": "accesssystem",
    "fa_TableName": "مجوزهای کلی سیستم",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('codetablelists', null, {});
      }
    };