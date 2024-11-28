"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("searchHistories", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            query: { type: Sequelize.STRING, allowNull: false },
            userId: {
                type: Sequelize.INTEGER,
                references: { model: "users", key: "id" },
                onDelete: "CASCADE",
            },
            timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("searchHistories");
    },
};
