require('dotenv').config
const Sequelize = require('sequelize')


const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: 'localhost',
    dialect: "mysql",
    port: process.env.MYSQL_PORT,
    logging: true,
  });

async function getConnection(){
  try{
    await sequelize.authenticate()
    console.log('Sequelize is init ...')
  }catch(err){
    console.log('connection failed !!!  ',err)
    return err
  }
}
getConnection()

const User = sequelize.define('user',{
  username:{
    type:Sequelize.DataTypes.STRING(30),
  }
})
const Address = sequelize.define('address',{
  street:{type:Sequelize.DataTypes.STRING(30)},
  city:{type:Sequelize.DataTypes.STRING(30)},
  })

User.hasMany(Address)
Address.belongsTo(User)

try{
  sequelize.sync({alter:true})
  console.log('All models were synchronized successfully')
  
  const newUser = await User.create({
    username:'test1'
  })
  
  const useAdrs = await Address.create({
    street: 'test 1',
    city:' tehran',
    
  })
  
}catch(error){
  console.log('Error in syncing models ... ',error)
}


// User.sync({alter:true}).then(() =>{
//   return User.create({
//     username: 'test test'
//   })
// }).then((data)=>{
//   console.log(data.username)
// })