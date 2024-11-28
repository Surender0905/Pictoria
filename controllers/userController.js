const User = require("../models/user");
const { doesUserExist } = require("../services/userService");
const { validateRequestBody } = require("../utils/validations");

const createNewUser = async (req, res) => {
    try {
        // Validate request body
        const validation = validateRequestBody(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Check if user already exists
        const userExists = await doesUserExist(req.body.email);
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
        });

        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createNewUser,
    getAllUsers,
};
