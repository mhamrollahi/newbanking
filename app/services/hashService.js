const bcrypt = require("bcrypt");

exports.hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword,10);
};

exports.comparePassword = (plainPassword, hashPassword) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
