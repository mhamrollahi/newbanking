module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('permissions', [
  {
    "id": 1,
    "name": "CodingData_read",
    "entity_type": "codingdata",
    "actionId": 212001,
    "description": "دسترسی فقط خواندنی برای جدول CodingData",
    "creatorId": 1,
    "updaterId": 1,
    "updatedAt": "2025-03-24T21:13:04.000Z",
    "createdAt": "2025-03-24T21:04:08.000Z"
  },
  {
    "id": 3,
    "name": "CodingData_edit",
    "entity_type": "codingdata",
    "actionId": 212002,
    "description": "دسترسی اصلاح به جدول codingdata",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T10:33:32.000Z"
  },
  {
    "id": 4,
    "name": "CodeTableList_read",
    "entity_type": "codetablelists",
    "actionId": 212001,
    "description": "دسترسی فقط خواندی جدول CodeTableList",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T10:35:15.000Z"
  },
  {
    "id": 5,
    "name": "Person_delete",
    "entity_type": "people",
    "actionId": 212004,
    "description": "دسترسی حذف از جدول People",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T10:36:08.000Z"
  },
  {
    "id": 7,
    "name": "People_Edit",
    "entity_type": "people",
    "actionId": 212002,
    "description": "دسترسی اصلاح جدول پرسنل",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T19:01:16.000Z"
  },
  {
    "id": 8,
    "name": "User_READ",
    "entity_type": "users",
    "actionId": 212001,
    "description": "دسترسی حذف جدول Users",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T19:03:41.000Z"
  },
  {
    "id": 9,
    "name": "codingdata_delete",
    "entity_type": "codingdata",
    "actionId": 212004,
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T19:23:46.000Z"
  },
  {
    "id": 12,
    "name": "codingdata_create",
    "entity_type": "codingdata",
    "actionId": 212003,
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-25T19:26:12.000Z"
  },
  {
    "id": 15,
    "name": "view_menu_dashboard",
    "entity_type": "vw_users",
    "actionId": 212006,
    "description": "دسترسی به مشاهده منوی داشبورد.",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T15:22:29.000Z"
  },
  {
    "id": 16,
    "name": "people_read",
    "entity_type": "people",
    "actionId": 212001,
    "description": "دسترسی خواندن جدول People",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:04:20.000Z"
  },
  {
    "id": 17,
    "name": "permission_read",
    "entity_type": "permissions",
    "actionId": 212001,
    "description": "دسترسی خواندن جدول Permission",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:04:56.000Z"
  },
  {
    "id": 18,
    "name": "role_read",
    "entity_type": "roles",
    "actionId": 212001,
    "description": "دسترسی خواندن جدول Role",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:05:36.000Z"
  },
  {
    "id": 19,
    "name": "rolepermission_read",
    "entity_type": "rolepermissions",
    "actionId": 212001,
    "description": "دسترسی خواندن RolePermission",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:06:17.000Z"
  },
  {
    "id": 20,
    "name": "userrole_read",
    "entity_type": "userroles",
    "actionId": 212001,
    "description": "دسترسی خواندن جدول UserRole",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:07:08.000Z"
  },
  {
    "id": 21,
    "name": "user_report",
    "entity_type": "users",
    "actionId": 212005,
    "description": "دسترسی به گزارشات جدول User",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-28T20:28:12.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('permissions', null, {});
      }
    };