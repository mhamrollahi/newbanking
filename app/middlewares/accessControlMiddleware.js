module.exports = (tableName,actionName)=>{
  return (req,res,next)=>{
    if(!req.session || !req.session.permissions) {
      return res.status(403).send('Access Denied')
    }
    
    // console.log(req.session.permissions)

    if(req.session.permissions.some(item => item.roleName.toLowerCase() === 'admin')){
      return next()
    }

    const hasAccess = req.session.permissions.some(
      permission => permission.permissionEntity_type.toLowerCase() === tableName.toLowerCase() && 
      permission.actionName.toLowerCase() === actionName.toLowerCase())
    
      if(!hasAccess){
        return res.redirect('/errors/403')
    } 
    next()  
    
  }

}