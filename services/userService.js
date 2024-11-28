const User = require("../models/user");

const doesUserExist = async (email) => {
    const existingUser = await User.findOne({ where: { email } });
    return !!existingUser;
};

module.exports = {
    doesUserExist,
};
