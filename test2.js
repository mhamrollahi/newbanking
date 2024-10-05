require("dotenv").config()
const { Sequelize, Model, DataTypes } = require('sequelize');
const jm = require('jalali-moment')
const bcrypt = require('bcrypt')


function toPersianDate(date,format='YYYY/MM/DD') {
  return jm(date).locale('fa').format(format)
}


// const sequelize = new Sequelize({
//   dialect: process.env.APP_DIALECT,
//   // server: process.env.MSSQL_SERVER,
//   database: process.env.MYSQL_DATABASE,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   port : process.env.MYSQL_PORT,
//   // dialectOptions:{
//   //   options: {
//   //     encrypt: true,
//   //   }
//   // }
// })

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    // host:process.env.MYSQL_HOST,
    dialect: process.env.APP_DIALECT,
    port:3306,
    logging:false,
    dialectOptions:{
      options: {
        encrypt: true,
      }
    }
  });


// try{
//   sequelize.authenticate().then(()=>{
//     console.log(sequelize.config)
//     console.log('connected !!')
//     return sequelize

//   })

// }catch(err){
//   console.log('connectin failed ... ',err)
//   return err
// }




class Public extends Model {}
Public.init(
  {
    username: {
      type:DataTypes.STRING(50),
      unique:{
        args:true,
        msg:'نام نمی تواند تکراری باشد.!!! '
      },
      get(){
        // const rawValue = this.getDataValue('username')
        // return rawValue.toUpperCase()
        const rawValue = this.getDataValue('username')
        return rawValue.toUpperCase()
      }
    },
    password:{
      type:DataTypes.STRING(),
      set(value){
        const salt = bcrypt.genSaltSync(1)
        const hashPassword = bcrypt.hashSync(value,salt)
        this.setDataValue('password',hashPassword)
      }
    },
    
    birthday: {
      type:DataTypes.DATE,
    },
    fa_birthday:{
      type:DataTypes.VIRTUAL,
      get(){
        const rawValue = this.getDataValue('birthday')
        return toPersianDate(rawValue)
      }
    }
  },
  { sequelize },
);

(async () => {
  try{
    console.log(sequelize.config)
    await sequelize.sync({ alter: true });
    console.log('sync ...')
  }catch(err){
    console.log('error ... ',err)
  }

  try {
    // const jane = await Public.create({
    //   username: '1asDD1',
    //   birthday: new Date(1970, 6, 20),
    //   password: 'test'
    // });
    // console.log(jane.toJSON());

    const row = await Public.findOne()
    console.log(row.username,row.birthday,row.fa_birthday,row.password)

  } catch (error) {
    console.log(error.message)
  }
})();