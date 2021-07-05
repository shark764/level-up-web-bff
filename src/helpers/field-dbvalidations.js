const User = require('./../modules/users/model');

//email validation
const emailvalidation = async (email = '') => {
  // verify email  exist
  const existeEmail = await User.findOne({ email });

  if (existeEmail) {
    throw new Error(`this email: ${email} is registered`);
  }
};

//this function is used to get user by id
const userById = async (id) => {
  // verify id  exist
  const getuser = await User.findById(id);
  if (!getuser) {
    throw new Error(`404, user ${id} cannot not be found `);
  }
};

module.exports = {
  emailvalidation,
  userById,
};
