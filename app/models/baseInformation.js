const { executeQuery } = require("@configs/dbconfig");

exports.index = async () => {
  // const _id = 3
  const query = `SELECT * FROM VW_CodeTableList`;
  const result = await executeQuery(query);
  return result.recordset;
};