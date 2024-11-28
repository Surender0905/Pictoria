const { validateUserId } = require("../utils/validations");
const { getUserSearchHistory } = require("../services/searchHistoryService");
const User = require("../models/user");

const getSearchHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate userId
        const validation = await validateUserId(userId, User);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Get search history
        const searchHistory = await getUserSearchHistory(userId);

        if (searchHistory.length === 0) {
            return res.status(404).json({
                message: "No search history found for this user",
            });
        }

        return res.status(200).json({ searchHistory });
    } catch (error) {
        console.error("Error retrieving search history:", error);
        return res.status(500).json({
            message: "Failed to retrieve search history",
        });
    }
};

module.exports = {
    getSearchHistory,
};
