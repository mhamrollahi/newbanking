module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('people', [
  {
    "id": 9,
    "firstName": "محمد حسن",
    "lastName": "امراللهی",
    "nationalCode": "0059935261",
    "mobile": "09126795991",
    "Description": null,
    "creatorId": null,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('people', null, {});
      }
    };