const { DataTypes } = require("sequelize");

exports.Contact = (sequelize) =>{
    const Contact = sequelize.define('Contact',
        {
            firstName: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            mobilePhone: {
                type: DataTypes.STRING(15),
            },
            isFavorite: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            profilePicture: {
                type: DataTypes.BLOB,
            },
        },
        {
            sequelize,
            validate:{}
        }
    )
    
    return Contact
}
