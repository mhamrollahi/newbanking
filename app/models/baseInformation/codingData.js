const {executeQuery} = require('@configs/dbconfig')

exports.findAll = async (codeTableListId , page = 1 ,perPage = 10) => { 
  const offset = (page - 1) * perPage;

  const query = `SELECT * FROM VW_CodingData 
  WHERE codeTableListId = ${codeTableListId}
  ORDER BY sortId 
  OFFSET ${offset} ROWS 
  FETCH NEXT ${perPage} ROWS ONLY`

  const result= await executeQuery(query)
  return result.recordset
  
}


exports.count = async (id) => {
  const query = `SELECT COUNT(id) as codingDataCount FROM VW_CodingData WHERE codeTableListId = ${id}`;
  const result = await executeQuery(query);
  
  return result.recordset[0].codingDataCount

};