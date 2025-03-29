module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [
  {
    "id": 1,
    "username": "0059935261",
    "password": "$2b$10$I1QfYktKvKkNHZfdbV5saOA.DaLQRP3neLk9/q/9aeypb7Dx6e.b6",
    "PersonId": 1,
    "isActive": 1,
    "Description": null,
    "updatedAt": "2025-03-16T21:15:42.000Z",
    "createdAt": "2025-03-13T00:00:00.000Z",
    "creatorId": null,
    "updaterId": null,
    "RoleId": null
  },
  {
    "id": 2,
    "username": "0059935262",
    "password": "$2b$10$uO7HIi2BZ8T0VLxhTFztV.oyDFAomTBzmFDDWmzow5i2kprSbK4my",
    "PersonId": 3,
    "isActive": 1,
    "Description": "",
    "updatedAt": "2025-03-17T19:40:02.000Z",
    "createdAt": "2025-03-17T19:36:21.000Z",
    "creatorId": 1,
    "updaterId": null,
    "RoleId": null
  },
  {
    "id": 29,
    "username": "3621330399",
    "password": "$2b$10$CoZnK5w0uUybWqOzalbTJeOYqOjZ/d21VAYUC0lS0KwhExBZYS6zW",
    "PersonId": 6,
    "isActive": 0,
    "Description": "",
    "updatedAt": "2025-03-18T20:16:52.000Z",
    "createdAt": "2025-03-17T21:23:16.000Z",
    "creatorId": 1,
    "updaterId": null,
    "RoleId": null
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
      }
    };