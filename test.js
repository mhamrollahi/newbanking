require('dotenv').config
const Sequelize = require('sequelize')


const sequelize = new Sequelize(
  'newbanking',
  'root',
  904957,
  {
    host: 'localhost',
    dialect: "mysql",
    port: 3306,
    logging: true,
  });

async function getConnection(){
  try{
    console.log('test 1');
    
    await sequelize.authenticate()
    console.log('Sequelize is init ...')
  }catch(err){
    console.log('connection failed !!!  ',err)
    return err
  }
}
getConnection()

const User = sequelize.define('user',{
  username:{type:Sequelize.DataTypes.STRING(30),}
})

const Address = sequelize.define('address',{
  street:{type:Sequelize.DataTypes.STRING(30)},
  city:{type:Sequelize.DataTypes.STRING(30)},
  })

User.hasMany(Address)
Address.belongsTo(User)

try{
  sequelize.sync({alter:true}).then(async()=>{

    console.log('All models were synchronized successfully')
    
    const newUser = await User.create({
      username:'test1'
    })
    
    const useAdrs = await Address.create({
      street: 'Address 1 ',
      city:'tehran',
      UserId:newUser.id,
    })

    console.log(useAdrs)

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