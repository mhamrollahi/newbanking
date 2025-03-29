module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('userroles', [
  {
    "id": 2,
    "userId": 2,
    "roleId": 2,
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-26T18:41:53.000Z"
  },
  {
    "id": 3,
    "userId": 29,
    "roleId": 2,
    "description": "ناظری دو تا نقش دارد.",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": "2025-03-26T20:53:08.000Z",
    "createdAt": "2025-03-26T20:53:08.000Z"
  },
  {
    "id": 4,
    "userId": 29,
    "roleId": 4,
    "description": "ناظری دو تا نقش دارد.",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": "2025-03-26T20:53:08.000Z",
    "createdAt": "2025-03-26T20:53:08.000Z"
  },
  {
    "id": 11,
    "userId": 1,
    "roleId": 1,
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": "2025-03-28T20:10:59.000Z",
    "createdAt": "2025-03-28T20:10:59.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('userroles', null, {});
      }
    };