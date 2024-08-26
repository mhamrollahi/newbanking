const sql = require('mssql')

const sqlConfig = {
  user: process.env.MSSQL_USER,
  password : process.env.MSSQL_PASSWORD,
  server : process.env.MSSQL_SERVER,
  database : process.env.MSSQL_DATABASE
}

(async ()=>{
  try{
    await sql.connect(sqlConfig)
    const result = sql.query(`SELECT * FROM vw_tr_accountinfo WHERE ID = ${33}`)
  } catch(err){
    console.log(err)
  }
})