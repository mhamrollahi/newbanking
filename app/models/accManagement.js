const { executeQuery } = require("@configs/dbconfig");

exports.block = async () => {
  const _id = 4;
  const query = `SELECT * FROM VW_CodingData WHERE codeTableListId = ${_id}`;
  const result = await executeQuery(query);
  return result.recordset;
};
