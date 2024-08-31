const sql = require("mssql");

console.log('My Port : ',process.env.MSSQL_PORT)
console.log('My Database  : ',process.env.MSSQL_DATABASE)
console.log('My Server  : ',process.env.MSSQL_SERVER)

const sqlConfig = {
  server: process.env.MSSQL_SERVER,
  database: process.env.MSSQL_DATABASE,
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  port : process.env.MSSQL_PORT,
  options:{
    trustedConnection : true,
    enableArithAbort : true,
    trustServerCertificate : true,
  },
}

async function executeQuery(query,values=[],paramNames=[],isStoredProcedure = false,outputParamName = null) {
  try{
    const pool = await sql.connect(sqlConfig)
    const request = pool.request()

    if(values && paramNames){
      for(let i = 0 ; i < values.length ; i++){
        request.input(paramNames[i] , values[i])
      }
    }
    
    //Handle output parameters
    if(outputParamName){
      request.output(outputParamName,sql.Int)
    }

    values.forEach((val,index) => {
      if(typeof val === 'undefined'){
        console.error(`Undefined value found for ${paramNames[index]}`)
      }
    });

    let result;
    if(isStoredProcedure){
      result = await request.execute(query)
    }else{
      result = await request.batch(query)
    }

    if(outputParamName){
      result = {...result,[outputParamName]:request.parameters[outputParamName].value}
    }

    return result

  }catch(err){
    console.log(err)
    throw error
  }
}

module.exports = {
  connect : () => sql.connect(sqlConfig),
  sql,
  executeQuery, 
 
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



