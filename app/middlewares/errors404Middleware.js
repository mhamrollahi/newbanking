
module.exports = (app) => {
  app.use((req,res,next)=>{
   const error = new Error('صفحه مورد نظر یافت نشد');
   error.status = 404
   next(error)
 })
};
