const {executeQuery} = require('@configs/dbconfig')

exports.block = async () =>{
  const _id = 3
  const query = `SELECT * FROM CodeTableList WHERE id = ${_id}`
  const result = await executeQuery(query)
  return result.recordset

}