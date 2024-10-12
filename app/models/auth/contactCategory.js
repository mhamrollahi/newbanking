const { DataTypes } = require("sequelize");

exports.ContactCategory = (sequelize)=>{
    const ContactCategory = sequelize.define('ContactCategory',{
        name: {
            type: DataTypes.STRING(20),
            unique: true,
        },
    },{
        sequelize,
        validate:{}
    })

    return ContactCategory
}

