const { photo: Photo } = require("../models");
const { tag: Tag } = require("../models");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { searchHistory: SearchHistory } = require("../models");

const savePhoto = async (photoData) => {
    const transaction = await sequelize.transaction();

    try {
        // Create the photo
        const photo = await Photo.create(
            {
                imageUrl: photoData.imageUrl,
                description: photoData.description || "",
                altDescription: photoData.altDescription || "",
                userId: photoData.userId,
            },
            { transaction },
        );

        // Create tags if they exist
        if (photoData.tags && photoData.tags.length > 0) {
            const tagPromises = photoData.tags.map((tagName) =>
                Tag.create(
                    {
                        name: tagName,
                        photoId: photo.id,
                    },
                    { transaction },
                ),
            );
            await Promise.all(tagPromises);
        }

        await transaction.commit();
        return photo;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const addTagsToPhoto = async (photoId, tags) => {
    const transaction = await sequelize.transaction();

    try {
        // Check if photo exists
        const photo = await Photo.findByPk(photoId, { transaction });
        if (!photo) {
            throw new Error("Photo not found");
        }

        // Create tags
        const tagPromises = tags.map((tagName) =>
            Tag.create(
                {
                    name: tagName,
                    photoId: photoId,
                },
                { transaction },
            ),
        );

        await Promise.all(tagPromises);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const searchPhotosByTag = async (tag, sortOrder = "ASC", userId = null) => {
    try {
        // Find photos form tags table
        const photos = await Photo.findAll({
            include: [
                {
                    model: Tag,
                    where: { name: tag }, // Ensure photos are associated with the provided tag
                    required: true, // Only include photos that have the specified tag
                },
            ],
            order: [["dateSaved", sortOrder]], // Sort by dateSaved in the specified order
        });

        // Log search history if userId is provided
        if (userId) {
            await SearchHistory.create({
                userId,
                query: tag,
                timestamp: new Date(),
            });
        }

        // Format the response

        const formattedPhotos = await Promise.all(
            photos.map(async (photo) => {
                // Fetch all associated tags for the photo
                const allTags = await Tag.findAll({
                    where: { photoId: photo.id },
                });

                return {
                    imageUrl: photo.imageUrl,
                    description: photo.description,
                    dateSaved: photo.dateSaved.toISOString(),
                    tags: allTags.map((tag) => tag.name), // Map all associated tags to an array of names
                };
            }),
        );

        return formattedPhotos;
    } catch (error) {
        console.error("Error searching photos:", error);
        throw error;
    }
};

module.exports = {
    savePhoto,
    addTagsToPhoto,
    searchPhotosByTag,
};
