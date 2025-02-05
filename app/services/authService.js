const { UserModel } = require('@models/');
const hashService = require('@services/hashService');

exports.login = async (userName, plainPassword) => {
  const user = await UserModel.findOne({
    where: { userName: userName }
  });

  if (!user) {
    return false;
  }

  const { password } = user;

  const result = hashService.comparePassword(plainPassword, password) ? user : false; 
  return  result;
};
