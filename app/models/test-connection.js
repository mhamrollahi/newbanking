// test-connection.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('newbanking', 'root', '904957', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected!');
  } catch (e) {
    console.error('❌ Connection error:', e.message);
  } finally {
    process.exit(0);
  }
})();
