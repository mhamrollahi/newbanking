const sequelize = require("sequelize");
const { Model, DataTypes } = require("sequelize");

class CodeTableList extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      code: {
        type: DataTypes.STRING(3),
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
          },
        },
        en_TableName: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
    });
  }
}
