const { models } = require('@models/');
const { UserViewModel } = models
const hashService = require('@services/hashService');

exports.login = async (username, plainPassword) => {
  const user = await UserViewModel.findOne({
    where: { username: username }
  });

  if (!user) {
    return false;
  }

  const { password } = user;

  const result = hashService.comparePassword(plainPassword, password) ? user : false;
  return result;
};
