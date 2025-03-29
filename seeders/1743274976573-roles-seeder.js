module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('roles', [
  {
    "id": 1,
    "name": "مدیر سیستم",
    "description": "این نقش مهمترین نقش سیستم می باشد.داداشت محمد حسن هستش.",
    "creatorId": 1,
    "updaterId": 29,
    "updatedAt": "2025-03-24T15:15:08.000Z",
    "createdAt": "2025-03-23T19:30:45.000Z"
  },
  {
    "id": 2,
    "name": "رییس اداره امور بانکی",
    "description": "دسترسی های رییس اداره رو داره ....",
    "creatorId": 1,
    "updaterId": 29,
    "updatedAt": "2025-03-24T14:54:48.000Z",
    "createdAt": "2025-03-23T19:34:39.000Z"
  },
  {
    "id": 4,
    "name": "کارشناس امور بانکی",
    "description": "",
    "creatorId": 29,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-24T15:22:38.000Z"
  },
  {
    "id": 5,
    "name": "کارشناس اداره حسابداری",
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-27T20:13:40.000Z"
  },
  {
    "id": 6,
    "name": "معاون اداره کل خزانه یوسفی",
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-27T20:14:24.000Z"
  },
  {
    "id": 7,
    "name": "رییس اداره حسابداری",
    "description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-27T20:14:36.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('roles', null, {});
      }
    };