const { DataTypes } = require("sequelize");
const dateService = require("@services/dateService");

exports.CodingData = (sequelize) => {
  const CodingData = sequelize.define(
    "CodingData",
    {
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          name: "ix_CodeTableListId_Title",
          args: true,
          msg: "این عنوان در این کدینگ  تکراری می‌باشد.... ",
        },
        validate: {
          notNull: {
            msg: "لطفا نام کدینگ جدول را وارد کنید.",
          },
          notEmpty: {
            msg: "لطفا نام کدینگ جدول را وارد کنید.",
          },
          len: {
            args: [2, 50],
            msg: "نام کدینگ جدول  باید کلمه‌ای بین 2 تا 50 کاراکتر باشد.",
          },
        },
      },

      description: {
        type: DataTypes.STRING(255),
      },

      sortId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // unique: {
        //   args:true,
        //   msg: 'کد نمی تواند تکراری باشد.'
        // },
        validate: {
          isNumeric: {
            msg: "کد فقط باید عدد باشد.",
          },
          min: {
            args: 1,
            msg: "مرتبه کدینگ عددی بین 1 تا 20 می باشد.",
          },
          max: {
            args: 20,
            msg: "مرتبه کدینگ عددی بین 1 تا 20 می باشد.",
          },
        },
      },

      refId: {
        type: DataTypes.STRING(4),
        allowNull: true,

        validate: {
          isNumeric: {
            msg: "کد ثانویه فقط باید عدد باشد.",
          },
          len: [1, 3],
          // len: {
          //   args: [1, 4],
          //   msg: "کد ثانویه عددی بین 1 تا 4 کاراکتر باشد.",
          // },
        },
      },

      creator: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: "لطفا نام ایجاد کننده را وارد کنید.",
          },
        },
      },

      updater: {
        type: DataTypes.STRING(50),
      },

      fa_createdAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue("createdAt");
          return dateService.toPersianDate(rawValue);
        },
      },

      fa_updatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
          const rawValue = this.getDataValue("updatedAt");
          return dateService.toPersianDate(rawValue);
        },
      },

      updatedAt: {
        type: DataTypes.DATE,
        default: null,
      },
    },
    {
      sequelize,
      indexes: [
        {
          name: "ix_CodeTableListId_Title",
          unique: true,
          fields: ["CodeTableListId", "title"],
          msg: "این عنوان در این کدینگ  تکراری می‌باشد.... ",
        },
      ],
      validate: {},
    }
  );

  return CodingData;
};
