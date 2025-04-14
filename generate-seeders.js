const fs = require('fs');
const path = require('path');
const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

const sourceDB = new Sequelize('NewBanking', 'root', '904957', {
  host: 'localhost',
  dialect: 'mysql'
});

// const tablesToSync = ['users','people','permissions','roles','rolepermissions','userroles'];
const tablesToSync = async () => {
  const [tables] = await sourceDB.query('SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();')
  return tables.map((t) => ({ name: t.TABLE_NAME}));
}

async function generateSeeders() {
  for (const table of tablesToSync) {
  
    const seedersDir = path.join(__dirname, 'seeders');
    if (!fs.existsSync(seedersDir)) {
      fs.mkdirSync(seedersDir, { recursive: true });
    }
    console.log(`در حال دریافت داده های جدول ${table} هستم ...`);

    const records = await sourceDB.query(`SELECT * FROM ${table}`, { type: QueryTypes.SELECT });

    if (records === 0) {
      console.log(`هیچ رکوردی برای جدول ${table} یافت نشد`);
      continue;
    }

    // تولید فایل Seeder
    const seederContent = `module.exports = {
      async up (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('${table}', ${JSON.stringify(records, null, 2)});
      },
      async down (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('${table}', null, {});
      }
    };`;

    const filename = path.join(__dirname, 'seeders', `${Date.now()}-${table}-seeder.js`);

    console.log('seederContent  = ', seederContent);
    console.log('fileName = ', filename);

    fs.writeFileSync(filename, seederContent);
    console.log(`فایل Seeder برای جدول ${table} ایجاد شد`);
  }

  await sourceDB.close();
  console.log('همه فایل‌های سیدر ساخته شد. ....');
}

generateSeeders().catch((err) => console.error('خطا در تولید فایل های سیدر', err));
