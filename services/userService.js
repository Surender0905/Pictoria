const { user: User } = require("../models");

const doesUserExist = async (email) => {
    const existingUser = await User.findOne({ where: { email } });
    return !!existingUser;
};

module.exports = {
    doesUserExist,
};
