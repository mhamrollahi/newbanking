const { executeQuery } = require("@configs/dbconfig");

exports.index = async () => {
  const query = `SELECT * FROM VW_CodeTableList ORDER BY id DESC`;
  const result = await executeQuery(query);
  return result.recordset;
};

exports.findAll = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;

  const query = `SELECT * FROM VW_CodeTableList
    ORDER BY id DESC
    OFFSET ${offset} ROWS 
    FETCH NEXT ${perPage} ROWS ONLY`;

  const result = await executeQuery(query);
  return result.recordset;
};

exports.count = async () => {
  const query = `SELECT COUNT(id) as codeTableListCount FROM VW_CodeTableList`;
  const result = await executeQuery(query);
  
  return result.recordset[0].codeTableListCount

};

exports.findBy_EN_TableName = async(en_TableName)=>{
  const query = `SELECT TOP(1) id FROM CodeTableList WHERE en_TableName = '${en_TableName}'`
  
  const result = await executeQuery(query)
  return result.rowsAffected
}

exports.findBy_FA_TableName = async(fa_TableName)=>{
  const query = `SELECT TOP(1) id FROM CodeTableList WHERE fa_TableName = '${fa_TableName}'`

  const result = await executeQuery(query)
  return result.rowsAffected
} 

exports.create = async (data)=>{
  const query = `INSERT INTO CodeTableList (code,en_TableName,fa_TableName,creator) VALUES (
    ${data.code},
    '${data.en_TableName}',
    '${data.fa_TableName}',
    '${data.creator}')`
  
  const result = await executeQuery(query)
  return result.rowsAffected

}