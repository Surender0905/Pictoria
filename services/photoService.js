const Photo = require("../models/photo");
const Tag = require("../models/tag");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const SearchHistory = require("../models/searchHistory");

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
        const photosIds = await Tag.findAll({
            where: { name: tag },
        });

        //get all tags from photosIds
        const allTags = photosIds.map((tag) => tag.name);
        //get ids from photosIds
        const ids = photosIds.map((photo) => photo.photoId);

        // Find photos by ids
        const photos = await Photo.findAll({
            where: { id: ids },
        });

        console.log(photos, "photos");

        // Log search history if userId is provided
        if (userId) {
            await SearchHistory.create({
                userId,
                query: tag,
                timestamp: new Date(),
            });
        }

        // Format the response
        return photos.map((photo) => ({
            id: photo.id,
            imageUrl: photo.imageUrl,
            description: photo.description || "",
            altDescription: photo.altDescription || "",
            dateSaved: photo.dateSaved,
            tags: allTags,
        }));
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
