"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tags", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { type: Sequelize.STRING, allowNull: false },
            photoId: {
                type: Sequelize.INTEGER,
                references: { model: "photos", key: "id" },
                onDelete: "CASCADE",
            },
            createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("tags");
    },
};
