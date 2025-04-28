module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('permissions', [
  {
    "id": 1,
    "name": "admin_access",
    "entity_type": "system_access",
    "actionId": 90001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "codetablelists_read",
    "entity_type": "codetablelists",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 3,
    "name": "people_read",
    "entity_type": "people",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 4,
    "name": "users_read",
    "entity_type": "users",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 5,
    "name": "permissions_read",
    "entity_type": "permissions",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 6,
    "name": "roles_read",
    "entity_type": "roles",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 7,
    "name": "userroles_read",
    "entity_type": "userroles",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 8,
    "name": "rolepermissions_read",
    "entity_type": "rolepermissions",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  },
  {
    "id": 9,
    "name": "bankbranches_read",
    "entity_type": "bankbranches",
    "actionId": 80001,
    "description": null,
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-04-16T09:29:19.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('permissions', null, {});
      }
    };