const { executeQuery } = require("@configs/dbconfig");

exports.index = async () => {
  // const _id = 3
  const query = `SELECT * FROM VW_CodeTableList`;
  const result = await executeQuery(query);
  return result.recordset;
};

exports.findAll = async (page = 1, perPage = 10) => {
  const offset = (page - 1) * perPage;

  const query = `SELECT * FROM VW_CodeTableList
    ORDER BY id 
    OFFSET ${offset} ROWS 
    FETCH NEXT ${perPage} ROWS ONLY`;

  const result = await executeQuery(query);
  return result.recordset;
};

exports.count = async () => {
  const query = `SELECT COUNT(id) as codeTableListCount FROM VW_CodeTableList`;
  const result = await executeQuery(query);
  console.log(result.recordset[0].codeTableListCount);
  
  return result.recordset[0].codeTableListCount

};
