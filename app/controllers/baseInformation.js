const baseInfoModel = require('@models/baseInformation')

exports.index = async(req,res,next) => {
  try {
    console.log('in baseInformation Controller ...')
    const result = await baseInfoModel.index()
    // res.send(result)
    res.render('./baseInformation/index',{layout:'main',result})
  } catch (error) {
    next(error)
  }
}