module.exports = (tableName,actionName)=>{
  return (req,res,next)=>{
    if(!req.session || !req.session.permissions) {
      return res.status(403).send('Access Denied')
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