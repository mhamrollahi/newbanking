const { UserModel } = require('@models/');
const hashService = require('@services/hashService');

exports.login = async (username, plainPassword) => {
  const user = await UserModel.findOne({
    where: { username: username }
  });

  if (!user) {
    return false;
  }

  const { password } = user;

  const result = hashService.comparePassword(plainPassword, password) ? user : false;
  return result;
};
