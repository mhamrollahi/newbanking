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
    logging: false
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

User.sync({alter:true}).then(() =>{
  return User.create({
    username: 'test test'
  })
}).then((data)=>{
  console.log(data.username)
})