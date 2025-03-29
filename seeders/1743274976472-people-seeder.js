module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('people', [
  {
    "id": 1,
    "firstName": "محمد حسن",
    "lastName": "امراللهی",
    "nationalCode": "0059935261",
    "mobile": "09126795991",
    "Description": "این کاربر ادمین می باشد.",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": "2025-03-16T20:47:38.000Z",
    "createdAt": "2025-03-14T18:32:15.000Z"
  },
  {
    "id": 3,
    "firstName": "سواتی",
    "lastName": "امراللهی",
    "nationalCode": "0059935262",
    "mobile": "09126795991",
    "Description": "",
    "creatorId": 1,
    "updaterId": null,
    "updatedAt": null,
    "createdAt": "2025-03-14T18:36:01.000Z"
  },
  {
    "id": 5,
    "firstName": "عالیا",
    "lastName": "امراللهی",
    "nationalCode": "0059935265",
    "mobile": "09126795991",
    "Description": "دممم خیلی گرم.",
    "creatorId": 1,
    "updaterId": 1,
    "updatedAt": "2025-03-18T20:26:44.000Z",
    "createdAt": "2025-03-16T21:12:07.000Z"
  },
  {
    "id": 6,
    "firstName": "حسین",
    "lastName": "ناظری",
    "nationalCode": "3621330399",
    "mobile": "09127987433",
    "Description": "Desctiption",
    "creatorId": 2,
    "updaterId": 29,
    "updatedAt": "2025-03-24T15:01:45.000Z",
    "createdAt": "2025-03-17T19:43:19.000Z"
  },
  {
    "id": 7,
    "firstName": "احمد",
    "lastName": "نقی زاده",
    "nationalCode": "0059935266",
    "mobile": "09126795991",
    "Description": "sss",
    "creatorId": 1,
    "updaterId": 1,
    "updatedAt": "2025-03-22T16:10:05.000Z",
    "createdAt": "2025-03-18T20:32:44.000Z"
  }
]);
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('people', null, {});
      }
    };