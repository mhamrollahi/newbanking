const sql = require("mssql");

console.log('My Server Port : ',process.env.MSSQL_PORT)

const sqlConfig = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options:{
    trustedConnection : true,
    enableArithAbort : true,
    trustServerCertificate : true,
  },
  port : process.env.MSSQL_PORT,
}

module.exports = {
  connect : () => sql.connect(sqlConfig),
  sql,
}

// async function mydbConnect() {
//   try {
//     await sql.connect(sqlConfig);
//     const _id = 1
//     const result = await sql.query("SELECT * FROM codingdata WHERE codeTableListId = ? ",[_id]);
//     console.log(result)
    
//   } catch (error) {
//     console.log(error);
//   }
// };

// module.exports  = mydbConnect()



