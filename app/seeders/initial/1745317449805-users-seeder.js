module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [
  {
    "id": 1,
    "username": "0059935261",
    "password": "$2b$10$FJ0nkFYHea1kVHJhsWCIYesUStzzD/0yQnV2LFyVnriS80mOqidAK",
    "PersonId": 9,
    "isActive": 1,
    "Description": "123456",
    "creatorId": null,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-02-22T10:28:29.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
      }
    };