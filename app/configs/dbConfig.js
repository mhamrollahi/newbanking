const sql = require("mssql");

const sqlConfig = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
}(async () => {
  try {
    await sql.connect(sqlConfig);
    const result = await sql.query("SELECT * FROM bg_codingdata");
    console.log(result)
    
  } catch (error) {
    console.log(error);
  }
})();



