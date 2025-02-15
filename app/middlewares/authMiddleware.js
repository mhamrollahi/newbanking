module.exports = (req,res,next)=>{
  console.log('authentication ...?? ',req.session.hasOwnProperty('user'))

  if(!req.session.hasOwnProperty('user')){
    return res.redirect('/auth/login')
  }
  next()
}