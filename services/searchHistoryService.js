const { searchHistory: SearchHistory } = require("../models");

const getUserSearchHistory = async (userId) => {
    try {
        const searchHistory = await SearchHistory.findAll({
            where: { userId },
            attributes: ["query", "timestamp"],
            order: [["timestamp", "DESC"]],
        });

        return searchHistory.map((history) => ({
            query: history.query,
            timestamp: history.timestamp,
        }));
    } catch (error) {
        console.error("Error fetching search history:", error);
        throw error;
    }
};

module.exports = {
    getUserSearchHistory,
};
